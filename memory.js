(function(){
  const total=CFG.memory.length;
  const cards=[...CFG.memory,...CFG.memory].sort(()=>Math.random()-.5);
  const isImg=v=>/^(https?:|data:|photos\/)/.test(v);
  const face=v=>isImg(v)?`<img src="${v}" alt="" style="width:100%;height:100%;object-fit:cover;border-radius:14px">`:(v.startsWith("icon:")?ico(v.slice(5)):v);
  const NOTES=[523.25,587.33,659.25,783.99,880,1046.5];
  const B=$("board");
  B.innerHTML=cards.map((v,i)=>`<button class="card" style="--i:${i}" data-v="${i}" aria-label="Card ${i+1}">
    <span class="b">${ico("heartO")}</span><span class="f">${face(v)}</span></button>`).join("");
  let first=null,lock=false,moves=0,found=0,win="";

  /* progress dots instead of a text counter */
  function stat(){
    $("mstat").innerHTML=`<span class="dots">${Array.from({length:total},(_,k)=>`<i class="dot${k<found?" on":""}"></i>`).join("")}</span><small>${moves} moves</small>${win}`;
  }
  stat();

  /* a ripple ring where a pair is found */
  function ring(el){
    const r=el.getBoundingClientRect(),i=document.createElement("i");
    i.className="ring";i.style.left=r.left+r.width/2+"px";i.style.top=r.top+r.height/2+"px";
    document.body.appendChild(i);setTimeout(()=>i.remove(),900);
  }

  /* cards tilt toward your mouse and catch the light */
  B.addEventListener("pointermove",e=>{
    const c=e.target.closest(".card");if(!c||e.pointerType==="touch")return;
    const r=c.getBoundingClientRect(),px=(e.clientX-r.left)/r.width,py=(e.clientY-r.top)/r.height;
    c.style.setProperty("--ry",((px-.5)*18)+"deg");c.style.setProperty("--rx",((.5-py)*18)+"deg");
    c.style.setProperty("--mx",px*100+"%");c.style.setProperty("--my",py*100+"%");
  });
  B.addEventListener("pointerout",e=>{
    const c=e.target.closest(".card");
    if(c){c.style.setProperty("--rx","0deg");c.style.setProperty("--ry","0deg")}
  });

  B.addEventListener("click",e=>{
    const c=e.target.closest(".card"); if(!c||lock||c.classList.contains("up"))return;
    c.classList.add("up");chime(392,.15,.03);buzz(8);
    if(!first){first=c;return}
    const a=first;first=null;moves++;
    if(cards[c.dataset.v]===cards[a.dataset.v]){
      c.classList.add("done");a.classList.add("done");found++;
      ring(c);ring(a);
      {const rc=c.getBoundingClientRect();emojiAt(rc.left+rc.width/2,rc.top+rc.height/2,["spark","heart"],6)}
      chime(NOTES[(found-1)%NOTES.length],.55,.07);buzz(25);
      if(found===total){
        win=`<span class="hand win">Every memory with you is a keeper ${ico("heart")}</span>`;
        setTimeout(()=>B.classList.add("wave"),500);
        done("memory");
      }
      stat();
    }else{
      lock=true;
      setTimeout(()=>{a.classList.add("no");c.classList.add("no");chime(220,.25,.04)},350);
      setTimeout(()=>{a.classList.remove("up","no");c.classList.remove("up","no");lock=false;stat()},900);
      stat();
    }
  });
})();