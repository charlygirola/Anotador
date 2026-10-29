const STORAGE='anotador-v1';
const app=document.querySelector('#app');
let game=loadGame(), screen='home', filter='Todos', draft=[], error='';
const dice='<svg class="dice" viewBox="0 0 100 100" fill="none" aria-hidden="true"><g transform="rotate(-17 36 40)" stroke="currentColor" stroke-width="4"><rect x="8" y="12" width="53" height="58" rx="9" fill="#faf7f0"/><g fill="currentColor" stroke="none"><circle cx="22" cy="27" r="4"/><circle cx="46" cy="27" r="4"/><circle cx="34" cy="41" r="4"/><circle cx="22" cy="55" r="4"/><circle cx="46" cy="55" r="4"/></g></g><g transform="rotate(13 67 63)" stroke="currentColor" stroke-width="4"><rect x="43" y="35" width="48" height="55" rx="8" fill="#faf7f0"/><g fill="currentColor" stroke="none"><circle cx="55" cy="48" r="4"/><circle cx="79" cy="48" r="4"/><circle cx="67" cy="62" r="4"/><circle cx="55" cy="77" r="4"/><circle cx="79" cy="77" r="4"/></g></g></svg>';
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function loadGame(){try{const g=JSON.parse(localStorage.getItem(STORAGE));if(!g||!Array.isArray(g.players)||g.players.length<2||!g.players.every(p=>typeof p.name==='string'&&Number.isInteger(p.score)&&p.score>=0&&p.score<=7000)||!Number.isInteger(g.turn)||g.turn<0||g.turn>=g.players.length||!Array.isArray(g.history))return null;return g}catch{return null}}
function save(){try{localStorage.setItem(STORAGE,JSON.stringify(game));return true}catch{error='No se pudo guardar la partida. Revisá que el navegador permita guardar datos.';return false}}
function header(title){return `<header class="topbar"><button class="icon-button" data-action="home" aria-label="Volver al selector">←</button><h2>${title}</h2><span style="width:35px"></span></header>`}
function render(){
 if(screen==='home'){app.innerHTML=`<h1>Anotador</h1><p class="subtitle">¿A qué jugamos?</p><nav class="filters" aria-label="Tipo de juego">${['Todos','Dados','Cartas'].map(f=>`<button class="filter ${f===filter?'active':''}" data-filter="${f}" aria-pressed="${f===filter}">${f}</button>`).join('')}</nav>${filter!=='Cartas'?`<article class="card game-main"><div class="game-line">${dice}<div><h2>7000</h2><span class="badge">Dados</span><p>Llegá a 7000 exactos</p></div></div><button class="primary" data-action="setup">Jugar</button></article><article class="card future"><div class="game-line">${dice}<div><h2>Generala</h2><span class="badge">Dados</span><p class="muted">Próximamente</p></div></div></article>`:''}${filter!=='Dados'?`<article class="card future"><div class="game-line"><span style="font-size:70px;width:92px;text-align:center" aria-hidden="true">♧</span><div><h2>Truco</h2><span class="badge">Cartas</span><p class="muted">Próximamente</p></div></div></article>`:''}${game?`<div class="card resume"><span style="font-size:28px" aria-hidden="true">▤</span><div><strong>${game.winner!==null?'Partida terminada':'Partida en curso'} · 7000</strong><p>${game.players.length} jugadores</p></div><button class="primary" data-action="continue">${game.winner!==null?'Ver':'Continuar'}</button></div>`:''}`;}
 if(screen==='setup'){app.innerHTML=`${header('Nueva partida')}<div class="hero">${dice}<h1>7000</h1><span class="badge">Dados · 7000 exactos</span></div><h2>Jugadores</h2><div class="players">${draft.map((n,i)=>`<div class="player-edit" data-row="${i}"><button type="button" class="drag-handle" aria-label="Mover jugador ${i+1}" title="Arrastrá para cambiar el orden. Con teclado: flechas arriba y abajo."><svg width="16" height="26" viewBox="0 0 16 26" aria-hidden="true" fill="currentColor"><circle cx="4" cy="5" r="2"/><circle cx="12" cy="5" r="2"/><circle cx="4" cy="13" r="2"/><circle cx="12" cy="13" r="2"/><circle cx="4" cy="21" r="2"/><circle cx="12" cy="21" r="2"/></svg></button><input data-player="${i}" aria-label="Nombre del jugador ${i+1}" placeholder="Jugador ${i+1}" maxlength="24" value="${esc(n)}"><button data-remove="${i}" aria-label="Quitar jugador ${i+1}" ${draft.length<=2?'disabled':''}>×</button></div>`).join('')}</div><button class="secondary add" data-action="add">＋ Agregar jugador</button><p class="error" role="alert">${esc(error)}</p><button class="primary start" data-action="start">Empezar partida</button>`;}
 if(screen==='game'&&game){const p=game.players[game.turn];app.innerHTML=`${header('7000')}<div class="goal"><span class="badge">Meta: 7000 exactos</span></div>${game.winner!==null?`<section class="winner" aria-live="polite"><span class="trophy">🏆</span><h1>¡Ganó ${esc(game.players[game.winner].name)}!</h1><p>7000 puntos exactos</p><p>¡Una partida para festejar!</p><button class="primary" data-action="rematch">Jugar la revancha</button><button class="link-button" data-action="celebrate">¡Otro festejo!</button></section>`:''}<div class="score-list">${game.players.map((p,i)=>`<div class="score-row ${i===game.turn&&game.winner===null?'current':''}"><span class="name">${esc(p.name)}</span>${i===game.turn&&game.winner===null?'<span class="turn-label">Su turno</span>':''}<span class="score">${p.score}</span></div>`).join('')}</div>${game.winner===null?`<form id="points-form" novalidate><label class="points-label" for="points">Puntos de ${esc(p.name)}</label><input id="points" class="points" inputmode="numeric" pattern="[0-9]*" autocomplete="off" placeholder="${p.score===0?'750':'50'}" aria-describedby="points-hint points-error"><p id="points-hint" class="hint">${p.score===0?'Para entrar: mínimo 750 en un turno.':'Mínimo 50 puntos.'} Siempre múltiplos de 50.</p><p id="points-error" class="error" role="alert">${esc(error)}</p><div class="actions"><button class="primary" type="submit">Sumar y pasar turno</button><button class="secondary" type="button" data-action="zero">Sin puntos</button></div></form>`:''}${game.history.length?'<button class="link-button" data-action="undo">Deshacer último turno</button>':''}<section class="history"><h2>Últimos turnos</h2>${game.history.length?`<div class="history-list">${game.history.slice(-8).reverse().map(h=>`<div class="history-row"><span>${esc(game.players[h.player].name)}</span><strong>+${h.points}</strong></div>`).join('')}</div>`:'<p class="muted">Los puntos de cada turno aparecerán acá.</p>'}</section>`;}
}
function setup(){draft=['',''];screen='setup';error='';render();window.scrollTo(0,0)}
function start(){const names=draft.map(n=>n.trim());if(names.some(n=>!n)){error='Completá los nombres de todos los jugadores.';render();return}if(new Set(names.map(n=>n.toLocaleLowerCase('es'))).size!==names.length){error='Usá un nombre distinto para cada jugador.';render();return}const create=()=>{game={players:names.map(name=>({name,score:0})),turn:0,history:[],winner:null};screen='game';error='';save();render()};if(game&&game.winner===null&&game.history.length)confirmAction('¿Empezar una nueva partida?','Se reemplazará la partida que está en curso.',create);else create()}
function addPoints(value,{skip=false}={}){
 if(!game||game.winner!==null)return;
 const raw=String(value).trim();
 if(!/^\d+$/.test(raw)||!Number.isSafeInteger(Number(raw))){showError('Ingresá un puntaje entero, sin signos ni decimales.');return}
 const points=Number(raw),p=game.players[game.turn];
 const passing=skip&&points===0;
 if(!passing){
  if(points<50){showError('El puntaje mínimo es 50. Si no sumaste, usá «Sin puntos».');return}
  if(points%50!==0){showError('El puntaje debe ser múltiplo de 50: 50, 100, 150…');return}
  if(p.score===0&&points<750){showError('Para entrar necesitás al menos 750 puntos en un mismo turno.');return}
 }
 if(p.score+points>7000){showError('Ese puntaje supera 7000. Revisalo: hay que llegar justo.');return}
 game.history.push({player:game.turn,points});p.score+=points;
 if(p.score===7000)game.winner=game.turn;else game.turn=(game.turn+1)%game.players.length;
 error='';save();render();if(game.winner!==null){window.scrollTo(0,0);celebrate()}
}
function showError(message){error=message;const el=document.querySelector('#points-error');if(el)el.textContent=error;document.querySelector('#points')?.focus()}
function undo(){const h=game.history.pop();if(!h)return;game.players[h.player].score-=h.points;game.turn=h.player;game.winner=null;error='';document.querySelector('#celebration').replaceChildren();save();render()}
function confirmAction(title,message,callback){const d=document.createElement('dialog');d.innerHTML=`<h2>${title}</h2><p>${message}</p><button class="primary" data-confirm>Empezar nueva partida</button><button class="secondary" data-cancel>Volver</button>`;document.body.append(d);d.querySelector('[data-confirm]').onclick=()=>{d.close();d.remove();callback()};d.querySelector('[data-cancel]').onclick=()=>{d.close();d.remove()};d.addEventListener('cancel',()=>d.remove());d.showModal()}
const celebrations=[['🎉','🎊','✨'],['🎈','🎈','⭐'],['🎲','✨','🎲'],['🏆','🥇','⭐'],['🚀','✨','🌟'],['🌈','✨','💫'],['💃','🕺','🎵'],['👏','🙌','🎉'],['🔥','⭐','✨'],['🍀','🌟','🎊'],['🪩','🎶','✨'],['🎯','🏆','🎉']];
let lastCelebration=-1,celebrationTimer;
function celebrate(){if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;let index;do{index=Math.floor(Math.random()*celebrations.length)}while(index===lastCelebration);lastCelebration=index;const layer=document.querySelector('#celebration');clearTimeout(celebrationTimer);layer.replaceChildren();for(let i=0;i<65;i++){const el=document.createElement('span');el.className='particle'+(index%3===1?' rise':index%3===2?' spiral':'');el.textContent=celebrations[index][i%3];el.style.cssText=`--x:${Math.random()*100}%;--size:${20+Math.random()*22}px;--duration:${3+Math.random()*2}s;--delay:${Math.random()*1.8}s;--drift:${Math.random()*180-90}px;--rotate:${Math.random()*720-360}deg`;layer.append(el)}celebrationTimer=setTimeout(()=>layer.replaceChildren(),7500)}
// Pointer events support both a finger on Android and a mouse, without dependencies.
let playerDrag=null;
app.addEventListener('pointerdown',e=>{
 const handle=e.target.closest('.drag-handle');
 if(!handle||e.button!==0||playerDrag)return;
 e.preventDefault();
 const row=handle.closest('.player-edit');
 playerDrag={handle,row,id:e.pointerId};
 row.classList.add('dragging');
 app.setPointerCapture(e.pointerId);
});
app.addEventListener('pointermove',e=>{
 if(!playerDrag||e.pointerId!==playerDrag.id)return;
 e.preventDefault();
 const {row}=playerDrag,list=row.parentElement;
 const before=[...list.children].find(other=>other!==row&&e.clientY<other.getBoundingClientRect().top+other.getBoundingClientRect().height/2);
 list.insertBefore(row,before||null);
 // Scrolling near the screen edges lets long lists be reordered on a phone.
 if(e.clientY<70)window.scrollBy(0,-12);
 else if(e.clientY>window.innerHeight-70)window.scrollBy(0,12);
});
function finishPlayerDrag(e){
 if(!playerDrag||e.pointerId!==playerDrag.id)return;
 const {row}=playerDrag;playerDrag=null;
 if(e.type!=='pointercancel')draft=[...row.parentElement.children].map(item=>draft[Number(item.dataset.row)]);
 render();
}
app.addEventListener('pointerup',finishPlayerDrag);
app.addEventListener('pointercancel',finishPlayerDrag);
app.addEventListener('lostpointercapture',finishPlayerDrag);
app.addEventListener('keydown',e=>{
 const handle=e.target.closest('.drag-handle');
 if(!handle||!['ArrowUp','ArrowDown'].includes(e.key))return;
 e.preventDefault();
 const from=Number(handle.closest('.player-edit').dataset.row),to=from+(e.key==='ArrowUp'?-1:1);
 if(to<0||to>=draft.length)return;
 [draft[from],draft[to]]=[draft[to],draft[from]];
 render();app.querySelector(`[data-row="${to}"] .drag-handle`).focus();
});
app.addEventListener('input',e=>{if(e.target.hasAttribute('data-player'))draft[Number(e.target.dataset.player)]=e.target.value});
app.addEventListener('submit',e=>{if(e.target.id==='points-form'){e.preventDefault();addPoints(document.querySelector('#points').value)}});
app.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;if(b.dataset.filter){filter=b.dataset.filter;render();return}if(b.hasAttribute('data-remove')){if(draft.length>2)draft.splice(Number(b.dataset.remove),1);render();return}switch(b.dataset.action){case'home':screen='home';error='';render();break;case'setup':setup();break;case'continue':screen='game';error='';render();break;case'add':draft.push('');render();app.querySelector('[data-player="'+(draft.length-1)+'"]').focus();break;case'start':start();break;case'zero':addPoints(0,{skip:true});break;case'undo':undo();break;case'rematch':draft=game.players.map(p=>p.name);start();break;case'celebrate':celebrate();break}});
render();
if('serviceWorker'in navigator)navigator.serviceWorker.register('./sw.js').catch(()=>{});
