const LOCK=CFG.lockUntil?new Date(CFG.lockUntil).getTime():0;
const locked=()=>LOCK&&Date.now()<LOCK;
$("go").onclick=()=>{
  if(locked())return;
  if(store.get()<1)store.set(1);
  startMusic();
    setTimeout(()=>{location.href=PAGES[1]+".html"},350);
};
if(locked()){$("go").disabled=true;$("go").textContent="Opens on "+new Date(LOCK).toLocaleDateString(undefined,{month:"long",day:"numeric"})}
if(CFG.heroImg){
  const h=$("hero");
  h.style.background=`linear-gradient(rgba(42,15,28,.55),rgba(42,15,28,.8)),url('${CFG.heroImg}') center/cover`;
  h.style.setProperty("--ink","#fbe4dd");h.style.setProperty("--soft","#f0c9d0");h.style.color="#fbe4dd";
}

/* live counter */
const t0 = new Date(CFG.start).getTime();
const ANNIV = new Date(CFG.anniversary).getTime();
function tick(){
  let s = Math.max(0, Math.floor((Date.now()-t0)/1000));
  $("cD").textContent = Math.floor(s/86400);
  $("cH").textContent = Math.floor(s%86400/3600);
  $("cM").textContent = Math.floor(s%3600/60);
  $("cS").textContent = s%60;
  const d=Math.ceil((ANNIV-Date.now())/86400000);
  $("until").innerHTML=d>0?`${d} day${d>1?"s":""} until our first anniversary`:"Happy first anniversary "+ico("heart");
}
tick(); setInterval(tick,1000);