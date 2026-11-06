(function(){
  const R=CFG.reasons,total=R.length;
  const NOTES=[523.25,587.33,659.25,783.99,880,1046.5];
  const heart=new Path2D(SHAPES.heart.match(/d="([^"]+)"/)[1]);
  let opened=0;
  $("rgrid").innerHTML=R.map((t,i)=>`<div class="rc"><div>${t}</div><canvas width="320" height="160" aria-label="Scratch card ${i+1}"></canvas></div>`).join("");

  /* progress dots */
  function stat(){
    $("rstat").innerHTML=`<span class="dots">${Array.from({length:total},(_,k)=>`<i class="dot${k<opened?" on":""}"></i>`).join("")}</span><small>${opened} of ${total}</small>`;
  }
  stat();

  function setup(card){
    const c=card.querySelector("canvas"),x=c.getContext("2d"),W=c.width,H=c.height;
    let down=false,ended=false,started=false,k=0;
    function paint(){
      const g=x.createLinearGradient(0,0,W,H);g.addColorStop(0,"#f28aa5");g.addColorStop(1,"#ffc9a8");
      x.fillStyle=g;x.fillRect(0,0,W,H);
      x.fillStyle="#8a2c4a";x.font="30px Caveat, cursive";x.textAlign="center";x.fillText("scratch me",W/2-16,H/2+10);
      x.save();x.translate(W/2+58,H/2-12);x.scale(1.1,1.1);x.fill(heart);x.restore();
    }
    paint();
    if(document.fonts&&document.fonts.ready)document.fonts.ready.then(()=>{if(!started)paint()});

    function sc(e){
      if(!down||ended)return;
      const r=c.getBoundingClientRect(),px=(e.clientX-r.left)*W/r.width,py=(e.clientY-r.top)*H/r.height;
      x.globalCompositeOperation="destination-out";x.beginPath();x.arc(px,py,20,0,7);x.fill();
      if(++k%5)return;
      const d=x.getImageData(0,0,W,H).data;let t=0;
      for(let i=3;i<d.length;i+=16)if(d[i]===0)t++;
      if(t/(d.length/16)>.45){
        ended=true;card.classList.add("open");opened++;
        emojiAt(r.left+r.width/2,r.top+r.height/2,["spark","heart"],5);
        chime(NOTES[(opened-1)%NOTES.length],.5,.06);buzz(20);
        stat();
        if(opened===total)done("why");
      }
    }
    c.onpointerdown=e=>{down=true;started=true;try{c.setPointerCapture(e.pointerId)}catch(_){}sc(e)};
    c.onpointermove=sc;
    c.onpointerup=c.onpointercancel=()=>{down=false};
  }
  document.querySelectorAll(".rc").forEach(setup);
})();