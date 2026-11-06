(function(){
  $("scrTxt").textContent=CFG.scratch;
  const c=$("scr"),x=c.getContext("2d"),W=c.width,H=c.height;
  const g=x.createLinearGradient(0,0,W,H);g.addColorStop(0,"#f28aa5");g.addColorStop(1,"#ffc9a8");x.fillStyle=g;x.fillRect(0,0,W,H);
  x.fillStyle="#8a2c4a";x.font="30px Caveat, cursive";x.textAlign="center";x.fillText("scratch me",W/2-16,H/2+10);
  x.save();x.translate(W/2+58,H/2-12);x.scale(1.1,1.1);x.fill(new Path2D(SHAPES.heart.match(/d="([^"]+)"/)[1]));x.restore();
  let down=false,ended=false,k=0;
  function sc(e){
    if(!down||ended)return;
    const r=c.getBoundingClientRect(),px=(e.clientX-r.left)*W/r.width,py=(e.clientY-r.top)*H/r.height;
    x.globalCompositeOperation="destination-out";x.beginPath();x.arc(px,py,18,0,7);x.fill();
    if(++k%6)return;
    const d=x.getImageData(0,0,W,H).data;let t=0;
    for(let i=3;i<d.length;i+=16)if(d[i]===0)t++;
    if(t/(d.length/16)>.5){ended=true;c.style.transition="opacity .6s";c.style.opacity=0;c.style.pointerEvents="none";done("scratch")}
  }
  c.onpointerdown=e=>{down=true;c.setPointerCapture(e.pointerId);sc(e)};
  c.onpointermove=sc;c.onpointerup=()=>{down=false};
})();