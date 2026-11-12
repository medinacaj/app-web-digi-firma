// Backend boundary for account onboarding. NOT an HTTP server, storage engine,
// password database, email provider or session issuer. Never bundle into Pages.
// A trusted server must supply a reviewed identityGateway and abuse protection.

const REPLY_HEADERS=Object.freeze({
  'content-type':'application/json; charset=utf-8',
  'cache-control':'no-store',
  'x-content-type-options':'nosniff'
});
const reply=(status,code)=>Object.freeze({
  status,
  headers:REPLY_HEADERS,
  body:Object.freeze({code})
});

const emailPattern=/^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9.-]{0,251}[a-z0-9])?\.[a-z]{2,63}$/;
function normalizeEmail(raw){
  if(typeof raw!=='string'||raw.length>254||!raw.trim())return null;
  const email=raw.trim().toLowerCase();
  if(email.length>254||email.includes('..')||!emailPattern.test(email)||/[\x00-\x20\x7f-\uffff]/.test(email))return null;
  return email;
}
function passwordAllowed(value,email){
  if(typeof value!=='string'||value.length<12||value.length>1024||/[\x00-\x1f\x7f]/.test(value))return false;
  // Obvious anti-password-as-email guard, no client-side password storage.
  return !value.toLowerCase().includes(email);
}
const strictBody=(body,fields)=>{
  if(!body||typeof body!=='object'||Array.isArray(body))return false;
  const actual=Object.keys(body).sort(),expected=[...fields].sort();
  return actual.length===expected.length&&actual.every((key,i)=>key===expected[i]);
};

export function createRegistrationContract({identityGateway,termsVersion,abuseGuard}={}){
  if(!identityGateway||typeof identityGateway.registerPending!=='function'||
     typeof identityGateway.verifyEmail!=='function'||typeof abuseGuard!=='function'||
     typeof termsVersion!=='string'||!/^v[0-9]{1,6}$/.test(termsVersion)){
    throw new Error('Infraestructura de identidad, antiabuso y versión de términos obligatorias');
  }
  return async function handle({method,path,body,trustedSource}={}){
    if(method!=='POST'||!['/api/v1/auth/register','/api/v1/auth/verify-email'].includes(path))
      return reply(404,'NOT_FOUND');
    const isRegistration=path==='/api/v1/auth/register';
    let validated;
    if(isRegistration){
      const keys=['email','password','termsAccepted','termsVersion','countryCode'];
      if(!strictBody(body,keys))return reply(422,'INVALID_REGISTRATION');
      const email=normalizeEmail(body.email);
      if(!email||!passwordAllowed(body.password,email)||body.termsAccepted!==true||
         body.termsVersion!==termsVersion||body.countryCode!=='VE'){
        return reply(422,'INVALID_REGISTRATION');
      }
      validated={email,password:body.password,termsVersion,countryCode:'VE'};
    }else{
      if(!strictBody(body,['token'])||typeof body.token!=='string'||
         body.token.length<24||body.token.length>2048||
         /[^A-Za-z0-9_\-.]/.test(body.token)){
        return reply(422,'INVALID_VERIFICATION');
      }
      validated={token:body.token};
    }
    try{
      // TrustedSource must be derived by the hosting server from validated
      // ingress information, never copied from JSON or X-Forwarded-For blindly.
      const allowed=await abuseGuard({action:isRegistration?'register':'verify-email',trustedSource});
      if(allowed!==true)return reply(429,'RATE_LIMITED');
      if(isRegistration){
        // Gateway MUST implement non-enumerating outcomes and send verification.
        // Never return account ids or email existence to the caller.
        await identityGateway.registerPending(validated);
        return reply(202,'CHECK_EMAIL');
      }
      const verified=await identityGateway.verifyEmail(validated);
      return verified===true?reply(200,'EMAIL_VERIFIED'):reply(400,'VERIFICATION_FAILED');
    }catch{
      // Intentionally no SQL/provider/token details in public responses.
      return reply(503,'IDENTITY_UNAVAILABLE');
    }
  };
}
