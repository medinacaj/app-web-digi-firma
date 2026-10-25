-- PROPUESTA inicial, NO desplegada ni validada contra PostgreSQL. Requiere revisión de migración,
-- conexiones restringidas, pruebas de RLS, cifrado de objetos y autenticación por proveedor.
-- PostgreSQL 14+; usar credenciales de migración separadas de la conexión API.
BEGIN;
CREATE SCHEMA IF NOT EXISTS digi;

CREATE TABLE digi.organizations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  legal_name text NOT NULL CHECK (length(trim(legal_name)) BETWEEN 2 AND 180),
  country_code char(2) NOT NULL DEFAULT 'VE' CHECK (country_code = 'VE'),
  legal_jurisdiction char(2) NOT NULL DEFAULT 'VE' CHECK (legal_jurisdiction = 'VE'),
  created_at timestamptz NOT NULL DEFAULT now()
);

-- user_id provendrá exclusivamente de un proveedor de autenticación validado.
CREATE TABLE digi.memberships (
  organization_id uuid NOT NULL REFERENCES digi.organizations(id) ON DELETE RESTRICT,
  user_id uuid NOT NULL,
  role text NOT NULL CHECK (role IN ('owner','admin','member','auditor')),
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (organization_id, user_id)
);

CREATE TABLE digi.documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES digi.organizations(id) ON DELETE RESTRICT,
  created_by uuid NOT NULL,
  country_code char(2) NOT NULL DEFAULT 'VE' CHECK (country_code = 'VE'),
  legal_jurisdiction char(2) NOT NULL DEFAULT 'VE' CHECK (legal_jurisdiction = 'VE'),
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','archived','cancelled')),
  title text NOT NULL CHECK (length(trim(title)) BETWEEN 1 AND 180),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (organization_id, id),
  FOREIGN KEY (organization_id, created_by)
    REFERENCES digi.memberships (organization_id, user_id) ON DELETE RESTRICT
);

-- No almacenar contenido PDF, material secreto o datos de signatarios en esta tabla.
CREATE TABLE digi.document_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL,
  document_id uuid NOT NULL,
  version_number integer NOT NULL CHECK (version_number >= 1),
  content_sha256 char(64) NOT NULL CHECK (content_sha256 ~ '^[0-9a-f]{64}$'),
  storage_reference text NOT NULL CHECK (length(storage_reference) BETWEEN 8 AND 512),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (organization_id, document_id, version_number),
  FOREIGN KEY (organization_id, document_id)
    REFERENCES digi.documents (organization_id, id) ON DELETE RESTRICT
);

CREATE TABLE digi.signature_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL,
  document_id uuid NOT NULL,
  created_by uuid NOT NULL,
  country_code char(2) NOT NULL DEFAULT 'VE' CHECK (country_code = 'VE'),
  legal_jurisdiction char(2) NOT NULL DEFAULT 'VE' CHECK (legal_jurisdiction = 'VE'),
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','configured','cancelled')),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (organization_id,id),
  FOREIGN KEY (organization_id,document_id)
    REFERENCES digi.documents (organization_id,id) ON DELETE RESTRICT,
  FOREIGN KEY (organization_id,created_by)
    REFERENCES digi.memberships (organization_id,user_id) ON DELETE RESTRICT
);

-- Firmantes reales y operaciones "signed" se añaden solo tras aprobar identidad, custodia y PSC.
CREATE TABLE digi.request_participants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL,
  request_id uuid NOT NULL,
  participant_reference text NOT NULL CHECK (length(participant_reference) BETWEEN 3 AND 128),
  position integer NOT NULL CHECK (position >= 1 AND position <= 100),
  UNIQUE (organization_id,request_id,position),
  FOREIGN KEY (organization_id,request_id)
    REFERENCES digi.signature_requests (organization_id,id) ON DELETE RESTRICT
);

CREATE TABLE digi.audit_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES digi.organizations(id) ON DELETE RESTRICT,
  actor_id uuid,
  action text NOT NULL CHECK (length(action) BETWEEN 3 AND 80),
  object_reference text NOT NULL CHECK (length(object_reference) BETWEEN 3 AND 128),
  recorded_at timestamptz NOT NULL DEFAULT now(),
  details jsonb NOT NULL DEFAULT '{}'::jsonb
);
-- Esta tabla NO es una bitácora inmutable certificada. Faltan controles WORM/retención/firma.
CREATE INDEX idx_doc_org_author ON digi.documents (organization_id,created_by);
CREATE INDEX idx_req_org_author ON digi.signature_requests (organization_id,created_by);
CREATE INDEX idx_audit_org_time ON digi.audit_events (organization_id,recorded_at DESC);

-- Solo valores de sesión VERIFICADOS por el backend en transacción, jamás tomados del navegador.
CREATE FUNCTION digi.actor_id() RETURNS uuid LANGUAGE sql STABLE AS $$
  SELECT nullif(current_setting('digi.actor_id',true),'')::uuid
$$;
CREATE FUNCTION digi.organization_id() RETURNS uuid LANGUAGE sql STABLE AS $$
  SELECT nullif(current_setting('digi.organization_id',true),'')::uuid
$$;
CREATE FUNCTION digi.actor_privileged(p_org uuid) RETURNS boolean LANGUAGE sql STABLE AS $$
  SELECT EXISTS (
    SELECT 1 FROM digi.memberships m
     WHERE m.organization_id = p_org AND m.user_id = digi.actor_id()
       AND m.role IN ('owner','admin')
  )
$$;

ALTER TABLE digi.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE digi.organizations FORCE ROW LEVEL SECURITY;
ALTER TABLE digi.memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE digi.memberships FORCE ROW LEVEL SECURITY;
ALTER TABLE digi.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE digi.documents FORCE ROW LEVEL SECURITY;
ALTER TABLE digi.document_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE digi.document_versions FORCE ROW LEVEL SECURITY;
ALTER TABLE digi.signature_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE digi.signature_requests FORCE ROW LEVEL SECURITY;
ALTER TABLE digi.request_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE digi.request_participants FORCE ROW LEVEL SECURITY;
ALTER TABLE digi.audit_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE digi.audit_events FORCE ROW LEVEL SECURITY;

-- Membresías visibles únicamente por el usuario autenticado. Alta/edición solo servicio confiable.
CREATE POLICY membership_self_read ON digi.memberships FOR SELECT
  USING (organization_id = digi.organization_id() AND user_id = digi.actor_id());

CREATE POLICY org_members_read ON digi.organizations FOR SELECT
  USING (id = digi.organization_id() AND EXISTS (
    SELECT 1 FROM digi.memberships m
     WHERE m.organization_id = id AND m.user_id = digi.actor_id()
  ));

CREATE POLICY document_read ON digi.documents FOR SELECT
  USING (organization_id = digi.organization_id()
    AND (created_by = digi.actor_id() OR digi.actor_privileged(organization_id)
      OR EXISTS (SELECT 1 FROM digi.memberships m WHERE m.organization_id = digi.organization_id()
                 AND m.user_id = digi.actor_id() AND m.role = 'auditor')));
CREATE POLICY document_create ON digi.documents FOR INSERT
  WITH CHECK (organization_id = digi.organization_id() AND created_by = digi.actor_id()
    AND country_code='VE' AND legal_jurisdiction='VE'
    AND EXISTS (SELECT 1 FROM digi.memberships m
      WHERE m.organization_id = digi.organization_id() AND m.user_id = digi.actor_id()
        AND m.role IN ('owner','admin','member')));
CREATE POLICY document_update ON digi.documents FOR UPDATE
  USING (organization_id = digi.organization_id()
    AND (created_by = digi.actor_id() OR digi.actor_privileged(organization_id)))
  WITH CHECK (organization_id = digi.organization_id() AND country_code='VE'
    AND legal_jurisdiction='VE' AND
    (created_by = digi.actor_id() OR digi.actor_privileged(organization_id)));

CREATE POLICY request_read ON digi.signature_requests FOR SELECT
  USING (organization_id = digi.organization_id()
    AND (created_by = digi.actor_id() OR digi.actor_privileged(organization_id)
      OR EXISTS (SELECT 1 FROM digi.memberships m WHERE m.organization_id = digi.organization_id()
                  AND m.user_id=digi.actor_id() AND m.role='auditor')));
CREATE POLICY request_create ON digi.signature_requests FOR INSERT
  WITH CHECK (organization_id = digi.organization_id() AND created_by = digi.actor_id()
    AND country_code='VE' AND legal_jurisdiction='VE'
    AND EXISTS (SELECT 1 FROM digi.documents d
      WHERE d.organization_id = digi.organization_id() AND d.id = document_id
        AND (d.created_by = digi.actor_id() OR digi.actor_privileged(d.organization_id))));
CREATE POLICY request_update ON digi.signature_requests FOR UPDATE
  USING (organization_id = digi.organization_id()
    AND (created_by = digi.actor_id() OR digi.actor_privileged(organization_id)))
  WITH CHECK (organization_id = digi.organization_id()
    AND country_code='VE' AND legal_jurisdiction='VE'
    AND (created_by = digi.actor_id() OR digi.actor_privileged(organization_id)));

CREATE POLICY versions_read ON digi.document_versions FOR SELECT
  USING (organization_id = digi.organization_id() AND EXISTS (
    SELECT 1 FROM digi.documents d WHERE d.id = document_id
     AND d.organization_id = digi.document_versions.organization_id));
CREATE POLICY participants_read ON digi.request_participants FOR SELECT
  USING (organization_id = digi.organization_id() AND EXISTS (
    SELECT 1 FROM digi.signature_requests r WHERE r.id=request_id
      AND r.organization_id = digi.request_participants.organization_id));
CREATE POLICY audit_read ON digi.audit_events FOR SELECT
  USING (organization_id = digi.organization_id()
    AND (digi.actor_privileged(organization_id) OR EXISTS (
      SELECT 1 FROM digi.memberships m
       WHERE m.organization_id = digi.organization_id() AND m.user_id=digi.actor_id()
         AND m.role='auditor'
    )));
-- Intencionadamente NO otorgar direct writes a versiones, participantes y auditoría:
-- se activarán mediante un servicio transaccional confiable después de revisión de seguridad.
-- Este script no otorga permisos de conexión a la aplicación.
COMMIT;
