const $=id=>document.getElementById(id);let categories=[],edit=-1,tabId=null,working=false,paused=false;
const norm=s=>s.trim();const key=s=>norm(s).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();const save=async()=>chrome.storage.local.set({categories});
const message=async m=>{
  if(tabId===null)throw Error('Ouvre WikiMasters dans un onglet');
  try { return await chrome.tabs.sendMessage(tabId,m); }
  catch(e) {
    // L'onglet était peut-être ouvert avant l'installation ou la mise à jour.
    if(!/Receiving end does not exist|Could not establish connection/i.test(String(e))) throw e;
    await chrome.scripting.executeScript({target:{tabId},files:['content.js']});
    return await chrome.tabs.sendMessage(tabId,m);
  }
};
const siteUrl=u=>/^https:\/\/(www\.)?wiki-masters\.com(?:\/|$)/i.test(u||'');
async function locate(){const tabs=await chrome.tabs.query({active:true,currentWindow:true});const t=tabs[0];tabId=t&&siteUrl(t.url)?t.id:null;updateSite();return t}
function updateSite(){const on=tabId!==null;$('dot').style.background=on?'#39aaff':'#f05252';$('site').textContent=on?'Site détecté':'Site non détecté'}
async function ensureCollection(){await locate();if(tabId===null){$('listinfo').textContent='Ouvre WikiMasters dans cet onglet, puis relance le listing.';return false}const t=await chrome.tabs.get(tabId);if(new URL(t.url).pathname.startsWith('/collection'))return true;$('listinfo').textContent='Ouverture de la collection…';await chrome.tabs.update(tabId,{url:'https://www.wiki-masters.com/collection'});for(let i=0;i<40;i++){await new Promise(r=>setTimeout(r,350));const x=await chrome.tabs.get(tabId);if(x.status==='complete'&&new URL(x.url).pathname.startsWith('/collection')){await new Promise(r=>setTimeout(r,600));return true}}throw Error('La collection ne s’est pas chargée.');}
function render(){const el=$('categories');el.replaceChildren();if(!categories.length)el.textContent='Aucune catégorie pour le moment.';categories.forEach((c,i)=>{const row=document.createElement('div');row.className='category';const ck=document.createElement('input');ck.type='checkbox';ck.checked=c.selected!==false;ck.onchange=()=>{c.selected=ck.checked;save()};const info=document.createElement('div');info.className='name';const b=document.createElement('b');b.textContent=c.name;const sm=document.createElement('small');sm.textContent=c.keywords.length?c.keywords.join(' , '):'Mots-clés à renseigner (✎)';info.append(b,sm);const ed=document.createElement('button');ed.textContent='✎';ed.title='Modifier';ed.onclick=()=>editor(i);const del=document.createElement('button');del.textContent='×';del.title='Supprimer';del.onclick=async()=>{if(confirm('Supprimer cette catégorie ?')){categories.splice(i,1);await save();render()}};row.append(ck,info,ed,del);el.append(row)})}
function editor(i){edit=i;$('editor').classList.remove('hidden');$('name').value=i<0?'':categories[i].name;$('keywords').value=i<0?'':categories[i].keywords.join(' , ')}
$('new').onclick=()=>editor(-1);$('cancel').onclick=()=>$('editor').classList.add('hidden');$('save').onclick=async()=>{const name=norm($('name').value);const keywords=[...new Set($('keywords').value.split(',').map(norm).filter(Boolean))];if(!name||!keywords.length)return alert('Indique un nom et au moins un mot-clé.');const c={name,keywords,selected:edit<0?true:categories[edit].selected!==false};if(categories.some((v,j)=>j!==edit&&key(v.name)===key(name)))return alert('Cette catégorie existe déjà.');if(edit<0)categories.push(c);else categories[edit]={...categories[edit],...c};await save();$('editor').classList.add('hidden');render()};
$('list').onclick=async()=>{try{
  $('listinfo').textContent='Lecture des étiquettes en cours…';
  if(!await ensureCollection())return;const r=await message({type:'LABELS'});if(r.error)throw Error(r.error);
  const labels=[...new Set((r.labels||[]).map(x=>norm(x.replace(/\s*\(\d+\)\s*$/,''))).filter(Boolean))];
  let added=0;
  for(const name of labels){
    if(!categories.some(c=>key(c.name)===key(name))){
      categories.push({name,keywords:[],selected:false});added++;
    }
  }
  await save();render();
  $('listinfo').textContent=labels.length+' étiquette(s) trouvée(s), '+added+' ajoutée(s) dans Mes catégories. Coche celles à traiter et renseigne leurs mots-clés avec ✎.';
}catch(e){$('listinfo').textContent='Erreur : '+e.message}};
$('start').onclick=async()=>{try{await locate();const selected=categories.filter(c=>c.selected!==false);if(!selected.length)throw Error('Coche au moins une catégorie');const missing=selected.filter(c=>!c.keywords?.length);if(missing.length)throw Error('Ajoute des mots-clés à : '+missing.map(c=>c.name).join(', '));const t=await chrome.tabs.get(tabId);if(!new URL(t.url).pathname.startsWith('/collection'))throw Error('Ouvre la page Collection avant de démarrer.');await message({type:'START',categories:selected});working=true;paused=false;await chrome.storage.local.set({running:true,paused:false});updateState()}catch(e){alert(e.message)}};
$('pause').onclick=async()=>{try{if(!working)return;paused=!paused;await message({type:paused?'PAUSE':'RESUME'});await chrome.storage.local.set({paused});updateState()}catch(e){alert(e.message)}};
$('stop').onclick=async()=>{try{await message({type:'STOP'});working=false;paused=false;await chrome.storage.local.set({running:false,paused:false});updateState()}catch(e){alert(e.message)}};
function updateState(){$('status').textContent=working?(paused?'En pause':'Traitement en cours'):'Prêt';$('dot').style.background=tabId===null?'#f05252':working?'#39d795':'#39aaff';$('site').textContent=tabId===null?'Site non détecté':working?'WikiTagger actif':'Site détecté';$('pause').textContent=paused?'▶ Reprendre':'⏸ Pause'}
async function refresh(){const v=await chrome.storage.local.get(['logs','progress','running','paused']);working=!!v.running;paused=!!v.paused;updateState();$('log').textContent=(v.logs||[]).filter(x=>/^Étiquette .+ en cours de traitement$|^\d+ cartes trouvées et étiquetées/.test(x.text)).slice(0,12).map(x=>x.time+' — '+x.text).join('\n')||'En attente du traitement.';const p=v.progress||{};$('progress').textContent=p.current?`${p.current} • ${p.applied||0} carte(s) étiquetée(s) • ${p.done||0} recherche(s) terminée(s)`:'Sélectionne une ou plusieurs catégories.';const total=categories.filter(c=>c.selected!==false).reduce((n,c)=>n+c.keywords.length,0);$('fill').style.width=total?Math.min(100,100*(p.done||0)/total)+'%':'0%'}
(async()=>{categories=(await chrome.storage.local.get('categories')).categories||[];render();await locate();await refresh();setInterval(async()=>{await locate();await refresh()},1000)})();

$('exportdiag').onclick=async()=>{
 const data=await chrome.storage.local.get(['diagnostics','logs','progress']);
 const payload={application:'WikiTagger',version:'1.9.0',exportedAt:new Date().toISOString(),userAgent:navigator.userAgent,diagnostics:data.diagnostics||[],activity:data.logs||[],progress:data.progress||{}};
 const blob=new Blob([JSON.stringify(payload,null,2)],{type:'application/json'});
 const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='WikiTagger_diagnostics_'+new Date().toISOString().replace(/[:.]/g,'-')+'.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
};
$('cleardiag').onclick=async()=>{if(confirm('Effacer tous les diagnostics enregistrés ?'))await chrome.storage.local.set({diagnostics:[]})};
