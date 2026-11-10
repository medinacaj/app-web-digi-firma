import test from 'node:test';
import assert from 'node:assert/strict';
import { createBrowserDemoStore } from '../src/browser-demo.mjs';
const input = { countryCode:'VE', templateId:'acuerdo-demo' };
test('borradores sintéticos aislados, cancelación e integridad de eventos', async () => {
  const store=createBrowserDemoStore();
  assert.equal((await store.state()).drafts.length,0);
  const first=await store.create(input);
  assert.equal(first.simulated,true);
  assert.equal(first.countryCode,'VE');
  assert.equal(first.drafts[0].status,'draft');
  assert.equal(first.events[0].action,'draft-created');
  const id=first.drafts[0].id;
  first.drafts[0].status='signed'; first.events[0].hash='broken';
  const cancelled=await store.cancel({countryCode:'VE',id});
  assert.equal(cancelled.drafts[0].status,'cancelled');
  assert.equal(cancelled.events.length,2);
  assert.equal(cancelled.events[1].previous,cancelled.events[0].hash);
  assert.equal(cancelled.auditIntegrityValid,true);
  await assert.rejects(store.cancel({countryCode:'VE',id}));
  assert.equal((await createBrowserDemoStore().state()).drafts.length,0);
});
test('deniega país, plantillas desconocidas, campos personales e ids inexistentes',async()=>{
  const store=createBrowserDemoStore();
  for(const value of [{...input,countryCode:'CL'},{...input,templateId:'__proto__'},{...input,title:'datos'},null]) await assert.rejects(store.create(value));
  await assert.rejects(store.cancel({countryCode:'VE',id:'missing'}));
  assert.equal((await store.state()).events.length,0);
});
test('serializa mutaciones concurrentes y limita a 30 borradores por página', async()=>{
  const store=createBrowserDemoStore();
  await Promise.all(Array.from({length:30},()=>store.create(input)));
  await assert.rejects(store.create(input));
  const s=await store.state();
  assert.equal(s.drafts.length,30);
  assert.equal(new Set(s.drafts.map(d=>d.id)).size,30);
  assert.equal(s.auditIntegrityValid,true);
  assert.deepEqual(s.events.map(e=>e.sequence),Array.from({length:30},(_,i)=>i+1));
});
