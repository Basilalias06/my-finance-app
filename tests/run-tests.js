const fs = require('fs');
const vm = require('vm');
const assert = require('assert');

const sandbox = {
  window: {},
  document: { documentElement: { classList: { add(){}, toggle(){} }, setAttribute(){}, style: { setProperty(){} } }, head:{appendChild(){}}, body:{appendChild(){}}, addEventListener(){}, getElementById(){ return null; }, querySelectorAll(){ return []; } },
  localStorage: { _m:new Map(), getItem(k){ return this._m.has(k) ? this._m.get(k) : null; }, setItem(k,v){ this._m.set(k,String(v)); }, removeItem(k){ this._m.delete(k); } },
  navigator: {},
  location: { pathname: 'MainMenu.html', replace(){} },
  sessionStorage: { _m:new Map(), getItem(k){return this._m.get(k)||null;}, setItem(k,v){this._m.set(k,String(v));}, removeItem(k){this._m.delete(k);} },
  matchMedia(){ return { matches:true, addEventListener(){} }; },
  setTimeout, clearTimeout, Date, JSON, Math, Number, Array, Object, String, RegExp, Error, console,
  btoa: str => Buffer.from(str, 'utf8').toString('base64'),
  unescape,
  encodeURIComponent,
  decodeURIComponent,
};
sandbox.window = sandbox;
vm.createContext(sandbox);
for (const file of ['fintrack-validation.js','fintrack-data.js','fintrack-auth.js']) {
  vm.runInContext(fs.readFileSync(file, 'utf8'), sandbox, { filename: file });
}
const FT = vm.runInContext('FT', sandbox);
const FTAuth = vm.runInContext('FTAuth', sandbox);
const FTValidate = vm.runInContext('FTValidate', sandbox);
const FTInsights = vm.runInContext('FTInsights', sandbox);

assert.equal(FTValidate.transaction({n:'Coffee',ty:'expense',a:120,cat:'Food',acc:'Cash',d:'2026-03-20'}).valid, true);
assert.equal(FTValidate.transaction({n:'',ty:'expense',a:-1,cat:'',acc:'',d:'x'}).valid, false);
assert.equal(FT.importJSON(JSON.stringify({schemaVersion:2,transactions:[]})), true);
assert.throws(() => FT.addTX({n:'',ty:'expense',a:-5,cat:'',acc:'',d:'bad'}));
const user = FTAuth.signUp({name:'Test User', email:'test@example.com', password:'secret123'});
assert.equal(user.email, 'test@example.com');
assert.equal(FTAuth.isAuthenticated(), true);
assert.equal(Array.isArray(FTInsights.generate()), true);
console.log('All FinTrack tests passed.');
