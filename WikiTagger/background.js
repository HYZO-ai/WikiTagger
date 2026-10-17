// Diagnostics persistants : export volontaire uniquement, aucune transmission réseau.
let diagnosticQueue=Promise.resolve();
function recordDiagnostic(m,sender){
 diagnosticQueue=diagnosticQueue.then(async()=>{
  const old=(await chrome.storage.local.get('diagnostics')).diagnostics||[];
  const row={timestamp:new Date().toISOString(),event:String(m.event||'unknown'),tabId:sender.tab?.id??null,details:m.data||{}};
  const updated=[...old,row].slice(-2500);
  await chrome.storage.local.set({diagnostics:updated});
 }).catch(e=>console.warn('Diagnostic non enregistré',e));
}
const DEFAULT={categories:[],running:false,paused:false,logs:[],progress:{}};
chrome.runtime.onInstalled.addListener(async()=>{const x=await chrome.storage.local.get('categories');if(!x.categories)await chrome.storage.local.set(DEFAULT)});
chrome.runtime.onMessage.addListener((m,s,send)=>{if(m.type==='DIAG')recordDiagnostic(m,s);if(m.type==='LOG'){chrome.storage.local.get(['logs']).then(v=>chrome.storage.local.set({logs:[{time:new Date().toLocaleTimeString('fr-FR'),text:m.text},...(v.logs||[])].slice(0,100)}));}if(m.type==='PROGRESS')chrome.storage.local.set({progress:m.progress});if(m.type==='DONE'){chrome.storage.local.set({running:false,paused:false});chrome.notifications.create({type:'basic',iconUrl:'icon.png',title:'WikiTagger',message:m.error?'Traitement interrompu : '+m.error:'Toutes les cartes sont étiquetées.'});}send({ok:true});return true;});
