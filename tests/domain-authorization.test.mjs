import test from "node:test";
import assert from "node:assert/strict";
import { canAccess, requireAccess, AccessDenied, isVenezuelanScope } from "../src/domain/authorization.mjs";

const admin = {id:"user_admin",tenantId:"org_ve",role:"admin",sessionVerified:true};
const member = {id:"user_member",tenantId:"org_ve",role:"member",sessionVerified:true};
const auditor = {id:"user_auditor",tenantId:"org_ve",role:"auditor",sessionVerified:true};
const resource = {tenantId:"org_ve",countryCode:"VE",legalJurisdiction:"VE",createdBy:"user_member"};
const allowed = (actor,action,target=resource)=>canAccess({actor,resource:target,action});

test("deniega todo sin actor proveniente de sesión verificada", () => {
  assert.equal(allowed(null,"document:read"),false);
  assert.equal(allowed({...admin,sessionVerified:false},"document:read"),false);
  assert.equal(allowed({...admin,role:"root"},"document:read"),false);
  assert.equal(allowed(admin,"signature:execute"),false);
  assert.throws(()=>requireAccess({actor:admin,resource,action:"signed:perform"}),AccessDenied);
});
test("no hay accesos entre organizaciones ni jurisdicciones distintas a VE", () => {
  assert.equal(isVenezuelanScope(resource),true);
  for (const country of ["CL","CO","US","ve",null]) {
    assert.equal(allowed(admin,"document:read",{...resource,countryCode:country}),false);
    assert.equal(allowed(admin,"document:manage",{...resource,legalJurisdiction:country}),false);
  }
  assert.equal(allowed({...admin,tenantId:"org_else"},"document:read"),false);
});
test("rol auditor de solo lectura, miembros limitados a sus recursos", () => {
  assert.equal(allowed(auditor,"audit:read"),true);
  assert.equal(allowed(auditor,"document:read"),true);
  assert.equal(allowed(auditor,"document:manage"),false);
  assert.equal(allowed(auditor,"request:create"),false);
  assert.equal(allowed(member,"document:read"),true);
  assert.equal(allowed(member,"document:manage"),true);
  assert.equal(allowed({...member,id:"other_member"},"document:read"),false);
  assert.equal(allowed({...member,id:"other_member"},"request:manage"),false);
  assert.equal(allowed(admin,"document:manage"),true);
  assert.equal(allowed(admin,"tenant:manage"),true);
  assert.equal(allowed(member,"tenant:manage"),false);
});
