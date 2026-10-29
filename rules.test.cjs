const vm = require('node:vm');
const fs = require('node:fs');
const assert = require('node:assert/strict');
let stored;
const app = {innerHTML:'', addEventListener(){}};
const layer = {replaceChildren(){}};
const context = vm.createContext({
 document:{querySelector:s=>s==='#app'?app:s==='#celebration'?layer:null},
 localStorage:{getItem:()=>stored,setItem:(k,v)=>{stored=v}},
 navigator:{},window:{scrollTo(){}},matchMedia:()=>({matches:true}),setTimeout,clearTimeout,
});
vm.runInContext(fs.readFileSync('app.js','utf8'),context);
const run = code=>vm.runInContext(code,context);
run("draft=['Ana','Juan'];start()");
const snapshot = ()=>run('JSON.stringify(game)');
function reject(value, message){const before=snapshot();run(`addPoints(${JSON.stringify(value)})`);assert.equal(snapshot(),before);assert.match(run('error'),message)}
for(const value of [0,1,25,49])reject(value,/mínimo es 50/);
for(const value of [51,125,749,751,775])reject(value,/múltiplo de 50/);
for(const value of [50,100,700])reject(value,/al menos 750/);
for(const value of ['',-50,'1.5','abc'])reject(value,/entero/);
run('addPoints(0,{skip:true})');
assert.equal(run('game.turn'),1);
assert.equal(run('game.players[0].score'),0);
reject(700,/al menos 750/);
run('addPoints(800)');
assert.equal(run('game.players[1].score'),800);
run('addPoints(750)');
assert.equal(run('game.players[0].score'),750);
run('addPoints(50)');
assert.equal(run('game.players[1].score'),850);
run('addPoints(50)');
assert.equal(run('game.players[0].score'),800);
reject(75,/múltiplo/);
reject(6200,/supera 7000/);
run('addPoints(6150)');
assert.equal(run('game.winner'),1);
assert.equal(run('game.players[1].score'),7000);
assert.equal(JSON.parse(stored).winner,1);
run('undo()');
assert.equal(run('game.winner'),null);
assert.equal(run('game.players[1].score'),850);
run("game={players:[{name:'Ana',score:0},{name:'Juan',score:0}],turn:0,history:[],winner:null};addPoints(750);undo()");
reject(50,/al menos 750/);
run('addPoints(750)');
assert.equal(run('loadGame().players[0].score'),750);
assert.match(app.innerHTML,/Para entrar: mínimo 750/);
console.log('OK: entrada por jugador, mínimo 50, múltiplos de 50, pasar sin entrar, turnos, exceso, victoria, deshacer entrada y guardado.');
