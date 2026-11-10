const {chromium}=require(process.env.PLAYWRIGHT_MODULE || 'playwright-core');
const assert=require('node:assert/strict');
const crypto=require('node:crypto');
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH || '/usr/bin/chromium',headless:true,args:['--no-sandbox','--disable-dev-shm-usage'],timeout:15000});
 try {
 const context=await browser.newContext();const page=await context.newPage();
 const errors=[],api=[]; page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>{if(r.url().includes('/api/'))api.push(r.url())});
 const base=process.env.DIGIFIRMA_TEST_URL||'http://127.0.0.1:8790/app-web-digi-firma/';
 await page.goto(base);await page.getByRole('link',{name:'Probar el panel',exact:false}).first().click();
 await page.locator('#demo-feedback').filter({hasText:'Simulación activa'}).waitFor({state:'attached'});
 await page.locator('.primary-action[data-view=solicitudes]').click();
 await page.locator('#demo-create').click();await page.waitForFunction(()=>document.querySelector('#demo-count').textContent==='1');
 assert.match(await page.locator('#demo-drafts').innerText(),/Acuerdo simulado/);
 await page.getByRole('button',{name:'Cancelar borrador',exact:true}).click();await page.waitForFunction(()=>document.querySelector('#demo-drafts').textContent.includes('cancelled'));
 await page.locator('[data-view=auditoria]').click();assert.equal(await page.locator('#demo-events li').count(),2);assert.match(await page.locator('#demo-integrity').innerText(),/consistente/);
 await page.locator('[data-view=documentos]').click();
 const pdf=Buffer.from('%PDF-1.7\n% synthetic only\n%%EOF');const hash=crypto.createHash('sha256').update(pdf).digest('hex');
 await page.locator('#pdf-local').setInputFiles({name:'synthetic.pdf',mimeType:'application/pdf',buffer:pdf});await page.locator('#pdf-hash').click();await page.waitForFunction(h=>document.querySelector('#hash-result').textContent===h,hash);
 await page.locator('#hash-expected').fill(hash);await page.locator('#hash-compare').click();assert.match(await page.locator('#hash-compare-status').innerText(),/Huellas iguales/);
 await page.locator('#pdf-local').setInputFiles({name:'invalid.pdf',mimeType:'application/pdf',buffer:Buffer.from('not a pdf')});await page.locator('#pdf-hash').click();await page.waitForFunction(()=>document.querySelector('#hash-result').textContent==='No disponible');
 await page.locator('[data-view=configuracion]').click();await page.locator('#identity-value').fill('V-1234567');await page.locator('#identity-check').click();assert.equal(await page.locator('#identity-value').inputValue(),'');assert.match(await page.locator('#identity-status').innerText(),/Ningún identificador se envió ni guardó/);
 await page.reload();await page.locator('#demo-feedback').filter({hasText:'Simulación activa'}).waitFor({state:'attached'});assert.equal(await page.locator('#demo-count').textContent(),'0');assert.equal(await page.locator('#demo-events li').count(),1);
 await page.setViewportSize({width:390,height:844});await page.locator('#menu-toggle').click();assert.equal(await page.locator('#menu-toggle').getAttribute('aria-expanded'),'true');await page.locator('.navigation [data-view=solicitudes]').click();assert.equal(await page.locator('#menu-toggle').getAttribute('aria-expanded'),'false');
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth),true);
 if(process.env.DIGIFIRMA_SCREENSHOT) await page.screenshot({path:process.env.DIGIFIRMA_SCREENSHOT,fullPage:true});
 assert.deepEqual(api,[]);assert.deepEqual(errors,[]);
 console.log('OK: navegación, crear/cancelar, eventos, PDF/comparación/rechazo, formato, recarga y móvil. Sin solicitudes API ni errores JavaScript.');
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
