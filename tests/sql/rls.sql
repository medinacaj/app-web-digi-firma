-- Ejecutar solamente en base de datos temporal con credenciales de CI.
-- Verificación de aislamiento mínimo y denegación por defecto de políticas propuestas.
\set ON_ERROR_STOP on

INSERT INTO digi.organizations (id, legal_name) VALUES
 ('10000000-0000-4000-8000-000000000001','Organización ficticia A'),
 ('10000000-0000-4000-8000-000000000002','Organización ficticia B');
INSERT INTO digi.memberships (organization_id,user_id,role) VALUES
 ('10000000-0000-4000-8000-000000000001','20000000-0000-4000-8000-000000000001','owner'),
 ('10000000-0000-4000-8000-000000000001','20000000-0000-4000-8000-000000000002','member'),
 ('10000000-0000-4000-8000-000000000001','20000000-0000-4000-8000-000000000003','auditor'),
 ('10000000-0000-4000-8000-000000000002','20000000-0000-4000-8000-000000000004','owner');
INSERT INTO digi.documents (id,organization_id,created_by,title) VALUES
 ('30000000-0000-4000-8000-000000000001','10000000-0000-4000-8000-000000000001','20000000-0000-4000-8000-000000000001','Documento sintético del propietario'),
 ('30000000-0000-4000-8000-000000000002','10000000-0000-4000-8000-000000000001','20000000-0000-4000-8000-000000000002','Documento sintético del miembro'),
 ('30000000-0000-4000-8000-000000000003','10000000-0000-4000-8000-000000000002','20000000-0000-4000-8000-000000000004','Documento sintético de otra organización');

CREATE ROLE df_ci_runtime NOLOGIN;
GRANT USAGE ON SCHEMA digi TO df_ci_runtime;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA digi TO df_ci_runtime;
GRANT SELECT ON digi.organizations,digi.memberships,digi.documents,
  digi.signature_requests,digi.document_versions,digi.request_participants,digi.audit_events TO df_ci_runtime;
GRANT INSERT,UPDATE ON digi.documents,digi.signature_requests TO df_ci_runtime;

-- El superusuario SET ROLE a cuenta sin BYPASSRLS; RLS FORCE activo.
SET ROLE df_ci_runtime;
BEGIN;
SELECT set_config('digi.actor_id','20000000-0000-4000-8000-000000000002',true);
SELECT set_config('digi.organization_id','10000000-0000-4000-8000-000000000001',true);
DO $$
BEGIN
  IF (SELECT count(*) FROM digi.documents) <> 1 THEN
    RAISE EXCEPTION 'Un miembro solo debe leer su propio documento';
  END IF;
  IF (SELECT count(*) FROM digi.memberships) <> 1 THEN
    RAISE EXCEPTION 'Un miembro no debe ver otras membresías';
  END IF;
  IF (SELECT count(*) FROM digi.audit_events) <> 0 THEN
    RAISE EXCEPTION 'Un miembro no puede consultar bitácoras';
  END IF;
END $$;
COMMIT;

BEGIN;
SELECT set_config('digi.actor_id','20000000-0000-4000-8000-000000000002',true);
SELECT set_config('digi.organization_id','10000000-0000-4000-8000-000000000002',true);
DO $$
BEGIN
  IF (SELECT count(*) FROM digi.documents) <> 0 THEN
    RAISE EXCEPTION 'Sin membresía no se deben leer documentos de otra organización';
  END IF;
  IF (SELECT count(*) FROM digi.organizations) <> 0 THEN
    RAISE EXCEPTION 'Sin membresía no se debe leer otra organización';
  END IF;
END $$;
COMMIT;

BEGIN;
SELECT set_config('digi.actor_id','20000000-0000-4000-8000-000000000001',true);
SELECT set_config('digi.organization_id','10000000-0000-4000-8000-000000000001',true);
DO $$
DECLARE denied boolean := false;
BEGIN
  IF (SELECT count(*) FROM digi.documents) <> 2 THEN
    RAISE EXCEPTION 'El administrador debe ver los documentos de su organización';
  END IF;
  BEGIN
    INSERT INTO digi.documents (organization_id,created_by,title,country_code)
      VALUES ('10000000-0000-4000-8000-000000000001','20000000-0000-4000-8000-000000000001','Fuera de jurisdicción','CL');
  EXCEPTION WHEN OTHERS THEN denied := true;
  END;
  IF NOT denied THEN RAISE EXCEPTION 'La base aceptó documentos CL'; END IF;
END $$;
COMMIT;

-- Contexto no configurado: ningún registro debería ser visible.
BEGIN;
DO $$
BEGIN
  IF (SELECT count(*) FROM digi.organizations) <> 0 THEN
    RAISE EXCEPTION 'Sin contexto de sesión debe denegar la organización';
  END IF;
  IF (SELECT count(*) FROM digi.documents) <> 0 THEN
    RAISE EXCEPTION 'Sin contexto de sesión debe denegar documentos';
  END IF;
END $$;
COMMIT;
RESET ROLE;

-- Ningún estado signed y ningún país distinto a VE.
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.check_constraints
    WHERE constraint_schema='digi' AND check_clause ILIKE '%signed%') THEN
      RAISE EXCEPTION 'Se encontró un estado signed inesperado';
  END IF;
END $$;
