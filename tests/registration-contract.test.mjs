import test from 'node:test';
import assert from 'node:assert/strict';
import { createRegistrationContract } from '../server/registration-contract.mjs';

const email='usuario@example.test';
const password='Contraseña-Segura-Ejemplo-2026!';
const registration={email, password, countryCode:'VE', termsAccepted:true, termsVersion:'v1'};
function fixture(overrides={}){
  const calls={register:[],verify:[],guard:[]};
  const identityGateway={
    async registerPending(record){calls.register.push(record);return {status:'pending'};},
    async verifyEmail(record){calls.verify.push(record);return true;},
    ...overrides.gateway
  };
  const abuseGuard=async value=>{calls.guard.push(value);return true;};
  const handle=createRegistrationContract({identityGateway,abuseGuard:overrides.guard??abuseGuard,termsVersion:'v1'});
  const register=(body=registration,opts={})=>handle({method:'POST',path:'/api/v1/auth/register',body,trustedSource:'verified-ingress',...opts});
  const verify=(body={token:'an-example-opaque-verification-token-2026'},opts={})=>handle({method:'POST',path:'/api/v1/auth/verify-email',body,trustedSource:'verified-ingress',...opts});
  return {register,verify,calls,handle};
}

test('fail-closed: identity provider, terms and server-side antiabuse are mandatory',()=>{
  assert.throws(()=>createRegistrationContract(),/obligatorias/);
  assert.throws(()=>createRegistrationContract({identityGateway:{},termsVersion:'v1',abuseGuard:()=>true}),/obligatorias/);
  assert.throws(()=>createRegistrationContract({identityGateway:{registerPending(){},verifyEmail(){}},termsVersion:'invalid',abuseGuard:()=>true}),/obligatorias/);
});

test('registration validates VE and terms; does not leak users or passwords',async()=>{
  const {register,calls}=fixture();
  const res=await register({...registration,email:'  USUARIO@EXAMPLE.TEST  '});
  assert.equal(res.status,202);
  assert.deepEqual(res.body,{code:'CHECK_EMAIL'});
  assert.equal(res.headers['cache-control'],'no-store');
  assert.equal(calls.register.length,1);
  assert.equal(calls.register[0].email,email);
  assert.equal(calls.register[0].countryCode,'VE');
  assert.equal(calls.register[0].password,password);
  assert.doesNotMatch(JSON.stringify(res),/password|usuario@|Contraseña|tenant|token/i);
});

test('invalid registration never reaches identity provider or antiabuse',async()=>{
  const {register,calls}=fixture();
  const invalid=[
    {...registration,countryCode:'CL'},
    {...registration,termsAccepted:false},
    {...registration,termsVersion:'v2'},
    {...registration,password:'corta'},
    {...registration,password:email+'2026!'},
    {...registration,email:'not-email'},
    {...registration,email:'a@bad..test'},
    {...registration,role:'admin'},
    {...registration,userId:'some-account'},
    {...registration,tenantId:'other-tenant'},
    {...registration,identityNumber:'V12345678'},
    {...registration,email:'\u0000invalido@example.test'}
  ];
  for(const body of invalid){
    const res=await register(body);
    assert.equal(res.status,422,JSON.stringify(body).replace(body.password,'[SECRET]'));
    assert.deepEqual(res.body,{code:'INVALID_REGISTRATION'});
  }
  assert.equal(calls.register.length,0);
  assert.equal(calls.guard.length,0);
});

test('email existence is never enumerable through successful signup response',async()=>{
  const gateway={registerPending:async()=>({status:'existing'})};
  const a=fixture({gateway});
  const b=fixture();
  const duplicate=await a.register(),newUser=await b.register();
  assert.deepEqual(duplicate,newUser);
});

test('provider and antiabuse fail closed without exposing secrets',async()=>{
  const limited=fixture({guard:async()=>false});
  assert.equal((await limited.register()).status,429);
  assert.equal(limited.calls.register.length,0);
  const broken=fixture({gateway:{registerPending:async()=>{throw new Error('SQL DETAIL: private@example.test');}}});
  const r=await broken.register();
  assert.equal(r.status,503);
  assert.deepEqual(r.body,{code:'IDENTITY_UNAVAILABLE'});
  assert.doesNotMatch(JSON.stringify(r),/SQL|example.test/);
});

test('email verification is one-use and expiry responsibility of trusted provider',async()=>{
  const {verify,calls}=fixture();
  const result=await verify();
  assert.equal(result.status,200);
  assert.deepEqual(result.body,{code:'EMAIL_VERIFIED'});
  assert.equal(calls.verify.length,1);
  const invalid=await verify({token:'short'});
  assert.equal(invalid.status,422);
  const expired=fixture({gateway:{verifyEmail:async()=>false}});
  assert.deepEqual((await expired.verify()).body,{code:'VERIFICATION_FAILED'});
  assert.equal((await fixture().handle({method:'GET',path:'/api/v1/auth/register'})).status,404);
});
