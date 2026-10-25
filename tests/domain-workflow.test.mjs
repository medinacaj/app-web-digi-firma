import test from "node:test";
import assert from "node:assert/strict";
import { createPreparedRequest, addPreparedParticipant, configurePreparedRequest, cancelPreparedRequest, transitionToSigned, WorkflowError } from "../src/domain/request-workflow.mjs";
import { AccessDenied } from "../src/domain/authorization.mjs";

const actor={id:"user_a",tenantId:"org_a",role:"member",sessionVerified:true};
const document={id:"doc_1",tenantId:"org_a",createdBy:"user_a",countryCode:"VE",legalJurisdiction:"VE",status:"draft"};

test("flujo de preparación crea solamente borrador sintético e inmutable",()=>{
  const draft=createPreparedRequest({actor,document,id:()=>"req_1"});
  assert.equal(draft.status,"draft");
  assert.equal(draft.demoOnly,true);
  assert.equal(draft.countryCode,"VE");
  assert.throws(()=>draft.participants.push("demo_x"));
  const withRecipient=addPreparedParticipant({actor,request:draft,reference:"demo_signer1"});
  assert.equal(draft.participants.length,0);
  assert.equal(withRecipient.participants.length,1);
  const configured=configurePreparedRequest({actor,request:withRecipient});
  assert.equal(configured.status,"configured");
  const cancelled=cancelPreparedRequest({actor,request:configured});
  assert.equal(cancelled.status,"cancelled");
  assert.throws(()=>cancelPreparedRequest({actor,request:cancelled}),WorkflowError);
});
test("bloqueos: origen extranjero, recursos de otro miembro/tenant, estado impropio",()=>{
  assert.throws(()=>createPreparedRequest({actor,document:{...document,countryCode:"CO"}}),AccessDenied);
  assert.throws(()=>createPreparedRequest({actor,document:{...document,tenantId:"org_b"}}),AccessDenied);
  assert.throws(()=>createPreparedRequest({actor,document:{...document,createdBy:"user_b"}}),WorkflowError);
  assert.throws(()=>createPreparedRequest({actor,document:{...document,status:"archived"}}),WorkflowError);
});
test("participantes limitados a referencias ficticias; nunca acepta datos personales",()=>{
  let draft=createPreparedRequest({actor,document});
  assert.throws(()=>configurePreparedRequest({actor,request:draft}),WorkflowError);
  assert.throws(()=>addPreparedParticipant({actor,request:draft,reference:"V-1234567"}),WorkflowError);
  assert.throws(()=>addPreparedParticipant({actor,request:draft,reference:"usuario@gmail.com"}),WorkflowError);
  for(let i=0;i<8;i++) draft=addPreparedParticipant({actor,request:draft,reference:"demo_person"+i});
  assert.throws(()=>addPreparedParticipant({actor,request:draft,reference:"demo_extra"}),WorkflowError);
  assert.throws(()=>addPreparedParticipant({actor,request:draft,reference:"demo_person0"}),WorkflowError);
});
test("ninguna transición puede declararse como firma real",()=>{
  assert.throws(()=>transitionToSigned(),(e)=>e.code==="SIGNATURE_ENGINE_NOT_IMPLEMENTED");
});
