(function(){
  const A=$("catchArea"),T=CFG.catchGoal||12;let n=0,run=false,tm;
  function spawn(){
    if(!run)return;
    const h=document.createElement("button");h.className="fh";h.innerHTML=ico("heart");h.setAttribute("aria-label","Catch the heart");
    h.style.left=Math.random()*85+"%";h.style.animationDuration=(2.4+Math.random()*1.6)+"s";
    h.onclick=()=>{
      if(!run)return;n++;h.remove();$("cstat").textContent=`Caught: ${n} / ${T}`;
      if(n>=T){run=false;clearInterval(tm);A.innerHTML="";$("cstat").innerHTML='All caught! <span class="hand" style="font-size:1.5rem">You have my whole heart '+ico("heart")+'</span>';done("catch")}
    };
    h.onanimationend=()=>h.remove();
    A.appendChild(h);
  }
  $("cStart").onclick=()=>{n=0;run=true;A.innerHTML="";$("cstat").textContent=`Caught: 0 / ${T}`;$("cStart").hidden=true;tm=setInterval(spawn,600);spawn()};
})();