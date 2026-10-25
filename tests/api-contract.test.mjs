import test from "node:test";
import assert from "node:assert/strict";
import { createApiContract } from "../server/api-contract.mjs";

const ORG_A="10000000-0000-4000-8000-000000000001";
const ORG_B="10000000-0000-4000-8000-000000000002";
const DOC_A="30000000-0000-4000-8000-000000000001";
const DOC_B="30000000-0000-4000-8000-000000000002";
const actor={id:"user_1",tenantId:ORG_A,role:"member",sessionVerified:true};
const document={id:DOC_A,tenantId:ORG_A,createdBy:"user_1",status:"draft",countryCode:"VE",legalJurisdiction:"VE"};
const foreign={...document,id:DOC_B,tenantId:ORG_B};
const path=(org=ORG_A,kind="documents")=>`/api/v1/organizations/${org}/${kind}`;

function handler(custom={}) {
  const saved=[];
  const handle=createApiContract({
    verifyBearer:async(token)=>{
      if(token!=="synthetic-token")throw Error("invalid");
      return custom.actor || actor;
    },
    repository:{
      listDocuments:async()=>custom.documents || [document,foreign],
      getDocument:async({documentId})=>(custom.documents || [document,foreign]).find(d=>d.id===documentId),
      savePreparedRequest:async(draft)=>{saved.push(draft)}
    }
  });
  return {handle,saved};
}
const call=(handle,opts={})=>handle({method:"GET",path:path(),authorization:"Bearer synthetic-token",...opts});

test("no inicia sin verificador/repo confiables",()=>{
  assert.throws(()=>createApiContract(),/obligatorias/);
  assert.throws(()=>createApiContract({verifyBearer:()=>({})}),/obligatorias/);
});
test("capacidades no reclaman firma ni certificación",async()=>{
  const {handle}=handler();
  const result=await handle({method:"GET",path:"/api/v1/capabilities"});
  assert.equal(result.body.countryCode,"VE");
  assert.equal(result.body.producesSignatures,false);
  assert.equal(result.body.certifiedBySUSCERTE,false);
  assert.equal(result.body.authenticationConfigured,false);
  assert.equal(result.headers["cache-control"],"no-store");
});
test("no confía en actor, rol ni tenant enviados por usuario",async()=>{
  const {handle}=handler();
  assert.equal((await call(handle,{authorization:""})).status,401);
  assert.equal((await call(handle,{authorization:"Bearer incorrecto"})).status,401);
  assert.equal((await call(handle,{path:path(ORG_B),body:{role:"owner"}})).status,404);
  assert.equal((await call(handle,{body:{tenantId:ORG_B,role:"owner"}})).status,200);
});
test("listado filtra recursos ajenos incluso si repo regresó resultados incorrectos",async()=>{
  const {handle}=handler();
  const result=await call(handle);
  assert.equal(result.status,200);
  assert.deepEqual(result.body.documents.map(d=>d.id),[DOC_A]);
  assert.ok(!JSON.stringify(result.body).includes("user_1"));
});
test("preparación estrictamente sintética; firmas permanecen bloqueadas",async()=>{
  const {handle,saved}=handler();
  const success=await call(handle,{method:"POST",path:path(ORG_A,"prepared-requests"),body:{countryCode:"VE",documentId:DOC_A}});
  assert.equal(success.status,201);
  assert.equal(success.body.demoOnly,true);
  assert.equal(saved.length,1);
  assert.equal(saved[0].status,"draft");
  for(const invalid of [
    {countryCode:"CL",documentId:DOC_A},
    {countryCode:"VE",documentId:DOC_A,role:"owner"},
    {countryCode:"VE",documentId:"../../../wrong"}
  ]) {
    assert.equal((await call(handle,{method:"POST",path:path(ORG_A,"prepared-requests"),body:invalid})).status,422);
  }
  assert.equal((await call(handle,{method:"POST",path:path(ORG_A,"prepared-requests"),body:{countryCode:"VE",documentId:DOC_B}})).status,404);
  assert.equal((await call(handle,{method:"POST",path:"/api/v1/signatures"})).status,501);
});
test("un error interno no expone datos de infraestructura",async()=>{
  const {handle}=handler({documents:"invalid"});
  const response=await call(handle);
  assert.equal(response.status,500);
  assert.deepEqual(response.body,{code:"INTERNAL_ERROR"});
});
