(()=>{
if(window.__wikiTaggerLoaded)return;window.__wikiTaggerLoaded=true;
let stopped=false,paused=false,working=false;
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const log=t=>chrome.runtime.sendMessage({type:'LOG',text:t}).catch(()=>{});
const debug=(event,data={})=>chrome.runtime.sendMessage({type:'DIAG',event,data:{...data,url:location.origin+location.pathname,working,paused,stopped}}).catch(()=>{});
const buttonState=()=>buttons().map(b=>({text:(b.textContent||'').trim().slice(0,65),disabled:!!b.disabled,ariaDisabled:b.getAttribute('aria-disabled')})).slice(0,35);
function snapshot(phase){return {phase,busy:busy(),selection:(document.body.innerText.match(/\d+\s+cartes? sélectionnées?/i)||[])[0]||null,modal:!!modal(),confirmation:!!confirmationModal(),buttons:buttonState()}}
function confirmationModal(){return [...document.querySelectorAll('.card-frame')].find(f=>visible(f)&&norm(f.textContent).includes('appliquer une etiquette')&&[...f.querySelectorAll('button')].some(b=>visible(b)&&norm(b.textContent)==='termine'))||null}
async function dismissConfirmation(){
 const frame=confirmationModal();if(!frame)return {dismissed:false,newlyTagged:null,alreadyTagged:null};
 const summary=frame.innerText;
 const newMatch=summary.match(/(\d+)\s+cartes?\s+étiquetées?/i);
 const oldMatch=summary.match(/\((\d+)\s+déjà\s+étiquetées?\)/i);
 const newlyTagged=newMatch?Number(newMatch[1]):null;
 const alreadyTagged=oldMatch?Number(oldMatch[1]):null;
 debug('confirmation_detectee',{summary:summary.slice(0,350),newlyTagged,alreadyTagged});
 // La confirmation peut apparaître avant l'actualisation asynchrone de la collection.
 // Observer les mutations et laisser au site le temps de démarrer son actualisation.
 await sleep(220);
 if(busy())debug('actualisation_confirmation_en_cours');
 await idle('actualisation avant Terminé',45000);
 await gate();
 const current=confirmationModal();
 if(!current){debug('confirmation_deja_fermee');return {dismissed:true,newlyTagged,alreadyTagged};}
 const button=[...current.querySelectorAll('button')].find(b=>visible(b)&&norm(b.textContent)==='termine');
 if(!button)throw Error('Bouton Terminé introuvable après actualisation');
 await click(button,'Terminé');
 if(!await wait(()=>!confirmationModal(),8000))throw Error('Fenêtre de confirmation non fermée');
 await idle('après fermeture de confirmation');
 debug('confirmation_fermee',{newlyTagged,alreadyTagged});
 return {dismissed:true,newlyTagged,alreadyTagged};
}

const progress=p=>chrome.runtime.sendMessage({type:'PROGRESS',progress:p}).catch(()=>{});
const norm=s=>(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();
const visible=e=>!!e&&!!(e.offsetWidth||e.offsetHeight||e.getClientRects().length);
const buttons=()=>[...document.querySelectorAll('button')].filter(visible);
const btn=(text,exact=true)=>buttons().find(b=>exact?norm(b.textContent)===norm(text):norm(b.textContent).includes(norm(text)));
async function gate(){if(stopped)throw Error('Arrêt demandé');while(paused){await sleep(250);if(stopped)throw Error('Arrêt demandé')}}
async function wait(fn,ms=12000){const end=Date.now()+ms;while(Date.now()<end){await gate();const x=fn();if(x)return x;await nextDomChange(120)}return null}
const busy=()=>[...document.querySelectorAll('.animate-spin,[class*="animate-spin"],[role="progressbar"],[aria-busy="true"]')].some(visible)||[...document.querySelectorAll('span,div')].some(e=>visible(e)&&e.children.length<3&&/^(chargement|actualisation)(?:\.{1,3}|…)?$/i.test(e.textContent.trim()));
// Mode instantané : MutationObserver, avec délai de stabilisation court et garde-fou.
// Les changements du DOM déclenchent la vérification, sans boucle de polling à 45 ms.
let domVersion=0;
const domObserver=new MutationObserver(()=>{domVersion++});
domObserver.observe(document.documentElement,{subtree:true,childList:true,attributes:true,characterData:true,attributeFilter:['class','disabled','aria-busy','style','hidden']});
function nextDomChange(timeout=250){
 return new Promise(resolve=>{
  let finished=false;
  const observer=new MutationObserver(()=>finish());
  const finish=()=>{if(finished)return;finished=true;observer.disconnect();clearTimeout(timer);resolve()};
  observer.observe(document.documentElement,{subtree:true,childList:true,attributes:true,characterData:true,attributeFilter:['class','disabled','aria-busy','style','hidden']});
  const timer=setTimeout(finish,timeout);
 });
}
async function idle(label,timeout=45000){
 const deadline=Date.now()+timeout;
 let stableSince=0,version=domVersion;
 while(Date.now()<deadline){
  await gate();
  if(busy()){stableSince=0;}
  else {
   if(!stableSince)stableSince=Date.now();
   // Deux frames de stabilité minimum, afin de laisser React mettre à jour l'interface.
   if(Date.now()-stableSince>=80)return;
  }
  await nextDomChange(Math.min(90,Math.max(1,deadline-Date.now())));
  if(version!==domVersion){version=domVersion;if(!busy())stableSince=Date.now()}
 }
 throw Error('Chargement trop long ('+label+'). Vérifie la page puis relance.');
}
async function click(b,label){await idle('avant '+label);await gate();if(!b||!visible(b)||b.disabled||b.getAttribute('aria-disabled')==='true')throw Error('Bouton indisponible : '+label);b.click();await sleep(60);await idle('après '+label)}
function setInput(el,value){const setter=Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set;setter.call(el,value);el.dispatchEvent(new Event('input',{bubbles:true}));el.dispatchEvent(new Event('change',{bubbles:true}));}
async function search(word){debug('recherche_debut',{word});await idle('recherche précédente');const inp=await wait(()=>document.querySelector('input[placeholder="Rechercher par titre ou catégorie..."]'));if(!inp)throw Error('Champ de recherche introuvable');setInput(inp,word);await sleep(110);await idle('résultats de « '+word+' »');debug('recherche_terminee',{word,loading:busy()});}
function pageSignature(){return document.body.innerText.slice(-1400)}
function pagination(){const candidates=buttons().filter(b=>!b.disabled&&/suivant|next|page suivante/i.test((b.textContent||'')+' '+(b.getAttribute('aria-label')||'')+' '+(b.title||'')));if(candidates.length)return candidates[0];const svg=buttons().filter(b=>!b.disabled&&b.querySelector('svg polyline[points="9 18 15 12 9 6"],svg.lucide-chevron-right,svg.lucide-arrow-right'));return svg.at(-1)||null}
function noResults(){return /aucune carte|aucun resultat|aucun résultat|0 carte trouvée/i.test(document.body.innerText)}
async function ensureSelect(){await idle('mode sélection');await dismissConfirmation();if(btn('Tout sélectionner (page)')||btn('Désélectionner la page')||btn('Quitter la sélection')){debug('selection_deja_active');return;}const b=btn('Sélectionner');if(!b){debug('selection_introuvable',snapshot('ensureSelect'));throw Error('Bouton Sélectionner introuvable')}await click(b,'Sélectionner');if(!await wait(()=>btn('Tout sélectionner (page)'),5000))throw Error('Mode sélection non activé')}
function modal(){const inp=[...document.querySelectorAll('input[placeholder^="Chercher ou créer une étiquette"]')].find(visible);if(!inp)return null;const frame=inp.closest('.card-frame');if(!frame||!visible(frame)||!norm(frame.textContent).includes('appliquer une etiquette'))return null;return {frame,inp}}
async function applyTag(tag){await dismissConfirmation();await idle('sélection des cartes');let all=btn('Tout sélectionner (page)');if(!all&&btn('Désélectionner la page')){debug('page_deja_selectionnee');}else if(!all||all.disabled){return 0}else{await click(all,'Tout sélectionner (page)');}debug('selection_page',snapshot('apres_tout_selectionner'));const selectionText=[...document.querySelectorAll('div,span')].filter(visible).map(e=>e.textContent.trim()).find(t=>/^\d+\s+cartes? sélectionnées?$/i.test(t));let selectedCount=selectionText?Number(selectionText.match(/^\d+/)[0]):0;const label=await wait(()=>{const b=btn('Étiqueter');return b&&!b.disabled?b:null},6000);if(!label)throw Error('Bouton Étiqueter indisponible après sélection');await click(label,'Étiqueter');const m=await wait(modal,6000);if(!m)throw Error('Fenêtre « Appliquer une étiquette » non ouverte');const modalCount=m.frame.textContent.match(/Sur\s+(\d+)\s+cartes? sélectionnées?/i);if(modalCount)selectedCount=Number(modalCount[1]);setInput(m.inp,tag);await sleep(100);await idle('recherche étiquette');const m2=modal();if(!m2)throw Error('Fenêtre d’étiquetage refermée avant validation');let item=[...m2.frame.querySelectorAll('button')].find(b=>visible(b)&&!b.disabled&&norm(b.textContent)===norm(tag));if(!item)item=[...m2.frame.querySelectorAll('button')].find(b=>visible(b)&&!b.disabled&&/créer|creer/i.test(b.textContent)&&norm(b.textContent).includes(norm(tag)));if(!item)throw Error('Étiquette « '+tag+' » introuvable dans la fenêtre');await click(item,'appliquer « '+tag+' »');debug('etiquette_cliquee',{tag,selectedCount});const confirm=await wait(confirmationModal,12000);if(!confirm){debug('confirmation_absente',snapshot('apres_application'));throw Error('Confirmation Terminé introuvable après application')}const confirmationResult=await dismissConfirmation();if(!await wait(()=>!modal()&&!confirmationModal(),8000))throw Error('La fenêtre d’étiquetage est toujours ouverte : vérifie la validation');await idle('enregistrement étiquette');debug('page_etiquetee',{tag,selectedCount,newlyTagged:confirmationResult.newlyTagged,alreadyTagged:confirmationResult.alreadyTagged});return confirmationResult.newlyTagged??selectedCount}
async function run(categories){
 if(working)return;working=true;stopped=false;paused=false;debug('traitement_demarre',{categories:categories.map(c=>({name:c.name,keywords:c.keywords}))});
 let done=0,applied=0;
 try{
  if(!location.pathname.startsWith('/collection'))throw Error('Ouvre la collection puis relance WikiTagger');
  await idle('collection');
  for(const cat of categories){
   let total=0;
   log('Étiquette '+cat.name+' en cours de traitement');
   for(const word of cat.keywords){
    await gate();await dismissConfirmation();await ensureSelect();if(btn('Désélectionner la page')){await click(btn('Désélectionner la page'),'désélectionner avant recherche');debug('page_deselectionnee_avant_recherche')}await search(word);
    if(noResults()){done++;progress({done,applied,current:cat.name});continue}
    let page=0;
    while(page<200){
     await gate();await dismissConfirmation();await idle('page de résultats');page++;debug('page_debut',{category:cat.name,word,page});await ensureSelect();
     const count=await applyTag(cat.name);
     total+=count;applied+=count;
     progress({done,applied,current:cat.name,page});
     // Un nouveau mot-clé n'est lancé qu'après la dernière page du précédent.
     const next=pagination();
     if(!next){debug('derniere_page',{category:cat.name,word,page});break;}
     const before=pageSignature();
     await click(next,'page suivante');
     await wait(()=>pageSignature()!==before||busy(),6000);
     await idle('page suivante');
     if(pageSignature()===before)throw Error('Pagination non confirmée : traitement suspendu pour éviter les doublons');
    }
    if(page>=200)throw Error('Limite de 200 pages atteinte');
    done++;progress({done,applied,current:cat.name});
   }
   log(total+' cartes trouvées et étiquetées — '+cat.name);
  }
  // Nettoyer l'interface uniquement après la réussite de toutes les catégories.
  await gate();
  await dismissConfirmation();
  await idle('fin du traitement');
  const quitter=btn('Quitter la sélection');
  if(quitter){
    debug('sortie_selection_debut',snapshot('avant_sortie_selection'));
    await click(quitter,'Quitter la sélection');
    const sortieOk=await wait(()=>!btn('Quitter la sélection')&&!!btn('Sélectionner'),8000);
    if(!sortieOk)throw Error('Impossible de confirmer la sortie du mode sélection');
    await idle('après sortie de sélection');
    debug('sortie_selection_confirmee');
  }else{
    debug('sortie_selection_inutile',snapshot('fin_traitement'));
  }
  debug('traitement_termine',{done,applied});chrome.runtime.sendMessage({type:'DONE'}).catch(()=>{});
 }catch(e){debug('erreur',{message:e.message,stack:e.stack,snapshot:snapshot('exception')});log('Erreur : '+e.message);chrome.runtime.sendMessage({type:'DONE',error:e.message}).catch(()=>{})}
 finally{working=false}
}
async function labels(){
  if(!location.pathname.startsWith('/collection'))throw Error('COLLECTION_REQUIRED');
  await idle('listing');
  let el=buttons().find(b=>norm(b.textContent).includes('toutes les etiquettes'));
  if(!el){const candidate=[...document.querySelectorAll('span')].find(e=>visible(e)&&norm(e.textContent)==='toutes les etiquettes');el=candidate?.closest('button,[role="combobox"],[role="button"]')||candidate?.parentElement?.parentElement;}
  if(!el||!visible(el))throw Error('Menu Toutes les étiquettes introuvable sur la page Collection');
  await click(el,'ouvrir liste des étiquettes');
  try {
    const found=await wait(()=>[...document.querySelectorAll('span')].some(e=>visible(e)&&e.textContent.trim().startsWith('#')),6000);
    if(!found)throw Error('Liste des étiquettes vide ou non affichée');
    const spans=[...document.querySelectorAll('span')].filter(visible).map(e=>e.textContent.trim()).filter(x=>x.startsWith('#')&&x.length>1);
    const clean=x=>x.replace(/^#\s*/,'').replace(/\s*\(\d+\)\s*$/,'').trim();
    return [...new Set(spans.map(clean).filter(Boolean))];
  } finally {
    // Toujours replier le menu, y compris si le listing échoue.
    if(visible(el) && [...document.querySelectorAll('span')].some(e=>visible(e)&&e.textContent.trim().startsWith('#'))) {
      el.click();
      debug('liste_etiquettes_repliee',{url:location.href});
    }
  }
}
chrome.runtime.onMessage.addListener((m,s,reply)=>{if(m.type==='START'){run(m.categories);reply({ok:true})}else if(m.type==='PAUSE'){paused=true;reply({ok:true})}else if(m.type==='RESUME'){paused=false;reply({ok:true})}else if(m.type==='STOP'){stopped=true;paused=false;reply({ok:true})}else if(m.type==='LABELS'){labels().then(x=>reply({labels:x,error:x?null:'Menu Toutes les étiquettes introuvable'})).catch(e=>reply({error:e.message}));return true}else if(m.type==='PING'){reply({ok:true,working})}return false});
})();
