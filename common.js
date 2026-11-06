const $ = id => document.getElementById(id);
const PAGES=["index","code","quiz","catch","memory","puzzle","why","story","letter"];
const OBST=["code","quiz","catch","memory","puzzle"];   /* easiest first, hardest last */
const LABEL={why:"A few of my reasons",story:"Our story so far",letter:"The final surprise"};
const ICON_OF={memory:"cards",quiz:"chat",puzzle:"puzzle",catch:"heart",code:"lock",scratch:"gift",story:"book",why:"spark",letter:"mail"};
const PAGE=document.body.dataset.page, IDX=PAGES.indexOf(PAGE);
/* game pages are kept calm and minimal */
const GAME=["memory","quiz","puzzle","catch","code","scratch"].includes(PAGE);
if(GAME)document.body.classList.add("game");

/* ===== drawn icons and shapes (no emoji) ===== */
const rnd=a=>a[Math.floor(Math.random()*a.length)];
const SHAPES={
  heart:'<path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>',
  heartO:'<path d="M12 20.4C6.2 15.3 3 12.4 3 8.7 3 6 5 4 7.5 4c1.8 0 3.4 1 4.5 2.6C13.1 5 14.7 4 16.5 4 19 4 21 6 21 8.7c0 3.7-3.2 6.6-9 11.7z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>',
  spark:'<path d="M12 1c.7 6 5 10.3 11 11-6 .7-10.3 5-11 11-.7-6-5-10.3-11-11 6-.7 10.3-5 11-11z"/>',
  diamond:'<path d="M12 2l7 10-7 10-7-10z"/>',
  flower:'<ellipse cx="12" cy="6.2" rx="3.2" ry="4.8"/><ellipse cx="12" cy="6.2" rx="3.2" ry="4.8" transform="rotate(72 12 12)"/><ellipse cx="12" cy="6.2" rx="3.2" ry="4.8" transform="rotate(144 12 12)"/><ellipse cx="12" cy="6.2" rx="3.2" ry="4.8" transform="rotate(216 12 12)"/><ellipse cx="12" cy="6.2" rx="3.2" ry="4.8" transform="rotate(288 12 12)"/><circle cx="12" cy="12" r="2.4" fill="#fff" fill-opacity=".85"/>',
  arrow:'<path d="M13 5l7 7-7 7-1.4-1.4L16.2 13H4v-2h12.2l-4.6-4.6z"/>',
  music:'<path d="M12 3v10.55A4 4 0 1 0 14 17V7h4V3h-6z"/>',
  lock:'<path d="M18 8h-1V6A5 5 0 0 0 7 6v2H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V10a2 2 0 0 0-2-2zM9 6a3 3 0 0 1 6 0v2H9V6z"/>',
  gift:'<path d="M3 8h18v4H3z"/><path d="M5 13h14v8H5z"/><path d="M11 8h2v13h-2z" fill="#fff" fill-opacity=".4"/><path d="M12 8C9 8 7 6 8 4.5S11.5 4 12 8zM12 8c3 0 5-2 4-3.5S12.5 4 12 8z"/>',
  book:'<path d="M3 4h7a2 2 0 0 1 2 2v14a2 2 0 0 0-2-2H3z"/><path d="M21 4h-7a2 2 0 0 0-2 2v14a2 2 0 0 1 2-2h7z"/>',
  puzzle:'<path d="M20.5 11H19V7a2 2 0 0 0-2-2h-4V3.5a2.5 2.5 0 0 0-5 0V5H4a2 2 0 0 0-2 2v3.8h1.5c1.5 0 2.7 1.2 2.7 2.7s-1.2 2.7-2.7 2.7H2V20a2 2 0 0 0 2 2h3.8v-1.5c0-1.5 1.2-2.7 2.7-2.7s2.7 1.2 2.7 2.7V22H17a2 2 0 0 0 2-2v-4h1.5a2.5 2.5 0 0 0 0-5z"/>',
  mail:'<path d="M2 6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v.5l-10 6.5L2 6.5z"/><path d="M2 8.9l10 6.5 10-6.5V18a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2z"/>',
  ring:'<circle cx="12" cy="15" r="6" fill="none" stroke="currentColor" stroke-width="2.4"/><path d="M12 1.5l3.6 4.2L12 9.6 8.4 5.7z"/>',
  cards:'<rect x="3" y="6" width="12" height="15" rx="2" fill-opacity=".5"/><rect x="9" y="3" width="12" height="15" rx="2"/>',
  chat:'<path d="M4 4h16a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-7l-5 4v-4H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"/>'
};
const PART=["heart","spark","diamond","flower"];
const COLS=["var(--rose)","var(--gold)","#e8869a","#d9a24a"];
const shape=(n,c)=>`<span class="sh" style="color:${c||rnd(COLS)}"><svg viewBox="0 0 24 24" aria-hidden="true">${SHAPES[n]}</svg></span>`;
const ico=n=>shape(n,"inherit");
const calm=matchMedia("(prefers-reduced-motion:reduce)").matches;

/* progress is saved in the browser so pages can't be skipped */
const store={
  ok:(()=>{try{localStorage.setItem("dg_t","1");return true}catch(e){return false}})(),
  get(){try{return +localStorage.getItem("dg_progress")||0}catch(e){return 0}},
  set(n){try{localStorage.setItem("dg_progress",n)}catch(e){}}
};
if(store.ok&&IDX>0&&store.get()<IDX)location.replace("index.html");

if($("her"))$("her").textContent=CFG.herName;
$("foot").textContent="Made with love by "+CFG.myName+" ";
$("foot").insertAdjacentHTML("beforeend",ico("heart"));
$("mus").innerHTML=ico("music");
document.title="One year of us · "+CFG.fullName;
if(IDX>0){
  $("prog").innerHTML='<i style="width:'+((IDX-1)/(PAGES.length-1)*100)+'%"></i>';
  setTimeout(()=>{$("prog").firstChild.style.width=(IDX/(PAGES.length-1)*100)+"%"},60);
  document.querySelector("main section").insertAdjacentHTML("afterbegin",`<p class="lbl">${ico(ICON_OF[PAGE])}<span>${LABEL[PAGE]}</span></p>`);
}

/* heart confetti: pops when an obstacle is completed */
function heartConfetti(){
  if(calm)return;
  const x=innerWidth/2,y=innerHeight*0.45;
  for(let i=0;i<36;i++){
    const e=document.createElement("i");e.className="conf";
    e.innerHTML=shape("heart",rnd(COLS));
    const side=Math.random()<.5?-1:1;
    e.style.left=x-10+"px";e.style.top=y-10+"px";
    e.style.fontSize=(1+Math.random()*1.1)+"rem";
    e.style.animationDelay=Math.random()*.15+"s";
    e.style.setProperty("--dx",side*(60+Math.random()*260)+"px");
    e.style.setProperty("--up",-(120+Math.random()*220)+"px");
    e.style.setProperty("--dy",(60+Math.random()*240)+"px");
    e.style.setProperty("--r",(Math.random()*540-270)+"deg");
    document.body.appendChild(e);setTimeout(()=>e.remove(),2300);
  }
}

/* called when an obstacle is finished: shows the note and a Continue button */
function done(id){
  const s=$(id),next=PAGES[IDX+1];
  if(!next||s.querySelector(".next"))return;
  if(store.get()<IDX+1)store.set(IDX+1);
  heartConfetti();
  [523.25,659.25,783.99].forEach((f,i)=>setTimeout(()=>chime(f,.5,.06),i*110));buzz(40);
  if(CFG.notes&&CFG.notes[id])s.insertAdjacentHTML("beforeend",`<div class="note">${CFG.notes[id]}</div>`);
  s.insertAdjacentHTML("beforeend",`<p class="center" style="margin-top:2rem"><a class="btn next" href="${next}.html">Continue ${ico("arrow")}</a></p>`);
}

/* music keeps playing from page to page */
const AUD=CFG.music?new Audio(CFG.music):null;
const VOL=0.15;   // soft background level: 0 = silent, 1 = full. Try 0.08 for even softer.
let fadeT=null;
function fadeIn(){
  clearInterval(fadeT);let v=0;AUD.volume=0;
  fadeT=setInterval(()=>{v=Math.min(VOL,v+.01);AUD.volume=v;if(v>=VOL)clearInterval(fadeT)},120);
}
function setM(on){$("mus").classList.toggle("on",on);try{localStorage.setItem("dg_music",on?"1":"0")}catch(e){}}
function startMusic(){
  if(!AUD)return;
  AUD.play().then(()=>{setM(true);fadeIn()}).catch(()=>{});
}
if(AUD){
  AUD.loop=true;AUD.volume=VOL;$("mus").hidden=false;
  let t=0;try{t=+localStorage.getItem("dg_mt")||0}catch(e){}
  AUD.addEventListener("loadedmetadata",()=>{if(t<AUD.duration)AUD.currentTime=t});
  $("mus").onclick=()=>{if(AUD.paused)startMusic();else{AUD.pause();setM(false)}};
  /* music is ON by default; it only stays off if she turned it off herself */
  let want=true;try{want=localStorage.getItem("dg_music")!=="0"}catch(e){}
  if(want){
    const kick=()=>{
      ["pointerdown","touchstart","keydown"].forEach(ev=>removeEventListener(ev,kick,true));
      startMusic();
    };
    AUD.play().then(()=>{setM(true);fadeIn()}).catch(()=>{
      /* the browser blocked autoplay, so start on her first tap anywhere */
      ["pointerdown","touchstart","keydown"].forEach(ev=>addEventListener(ev,kick,true));
    });
  }
  addEventListener("pagehide",()=>{try{localStorage.setItem("dg_mt",AUD.currentTime)}catch(e){}});
}

if(!calm){
  /* shapes drifting up the screen */
  setInterval(()=>{
    const h=document.createElement("i");
    h.innerHTML=shape(rnd(PART)); h.style.left=Math.random()*100+"vw";
    h.style.fontSize=(.9+Math.random()*1.2)+"rem";
    h.style.animationDuration=(8+Math.random()*6)+"s";
    $("hearts").appendChild(h); setTimeout(()=>h.remove(),15000);
  },1100);

  /* tap or click anywhere: shapes pop out (not on game pages) */
  document.addEventListener("pointerdown",e=>{
    if(e.target.closest("#react"))return;
    if(!GAME)emojiAt(e.clientX,e.clientY,PART,6);
  });

  /* sparkle trail behind the mouse (computers only, not on game pages) */
  let lastT=0;
  document.addEventListener("pointermove",e=>{
    if(e.pointerType!=="mouse"||GAME)return;
    const n=Date.now();if(n-lastT<70)return;lastT=n;
    const s=document.createElement("i");s.className="em";s.innerHTML=shape("spark","var(--gold)");
    s.style.left=e.clientX+"px";s.style.top=e.clientY+"px";s.style.fontSize=".8rem";
    s.style.setProperty("--dx",(Math.random()*20-10)+"px");s.style.setProperty("--dy","22px");s.style.setProperty("--r","0deg");
    document.body.appendChild(s);setTimeout(()=>s.remove(),900);
  });
}

/* front page decoration */
if(PAGE==="index"){
  $("hero").insertAdjacentHTML("afterbegin",'<div class="sparkles" aria-hidden="true">'+["flower","spark","heart","diamond","flower"].map(n=>"<span>"+shape(n)+"</span>").join("")+'</div>');
}

/* reaction bar: tap a shape to send a shower of it (not on game pages) */
if(IDX>0&&!GAME){
  const r=document.createElement("div");r.id="react";
  r.innerHTML=PART.map(n=>`<button aria-label="Send ${n}s" data-s="${n}">${shape(n,"var(--rose)")}</button>`).join("");
  r.onclick=ev=>{
    const b=ev.target.closest("button");if(!b||calm)return;
    const rc=b.getBoundingClientRect();
    for(let i=0;i<10;i++)setTimeout(()=>{
      const e=document.createElement("i");e.className="rise";e.innerHTML=shape(b.dataset.s);
      e.style.left=rc.left+rc.width/2-12+"px";e.style.fontSize=(1.3+Math.random())+"rem";
      e.style.setProperty("--dx",(Math.random()*140-70)+"px");
      document.body.appendChild(e);setTimeout(()=>e.remove(),2300);
    },i*70);
  };
  document.body.appendChild(r);
}

function burst(){
  for(let i=0;i<50;i++){
    const h=document.createElement("i");
    h.innerHTML=shape(PART[i%PART.length]);h.style.left=Math.random()*100+"vw";
    h.style.fontSize=(1+Math.random()*1.8)+"rem";h.style.opacity=1;
    h.style.animationDuration=(3+Math.random()*3)+"s";h.style.animationDelay=Math.random()*1.5+"s";
    $("hearts").appendChild(h);setTimeout(()=>h.remove(),9000);
  }
}

/* ===== soft sounds, vibration and a glow that follows your finger ===== */
const SFX=true;   // set to false to turn the little chimes off
let AC=null;
function chime(freq,len=.35,vol=.05){
  if(!SFX)return;
  try{
    AC=AC||new (window.AudioContext||window.webkitAudioContext)();
    const o=AC.createOscillator(),g=AC.createGain();
    o.type="sine";o.frequency.value=freq;
    g.gain.setValueAtTime(vol,AC.currentTime);
    g.gain.exponentialRampToValueAtTime(.0001,AC.currentTime+len);
    o.connect(g);g.connect(AC.destination);o.start();o.stop(AC.currentTime+len);
  }catch(e){}
}
const buzz=ms=>{try{navigator.vibrate&&navigator.vibrate(ms)}catch(e){}};

if(!calm){
  const glow=document.createElement("div");glow.id="glow";document.body.appendChild(glow);
  let tx=innerWidth/2,ty=innerHeight/3,gx=tx,gy=ty;
  const aim=e=>{tx=e.clientX;ty=e.clientY};
  addEventListener("pointermove",aim);addEventListener("pointerdown",aim);
  (function loop(){gx+=(tx-gx)*.12;gy+=(ty-gy)*.12;glow.style.transform=`translate(${gx}px,${gy}px)`;requestAnimationFrame(loop)})();
}