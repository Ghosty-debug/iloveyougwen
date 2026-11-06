(function(){
  SHAPES.play='<path d="M8 5v14l11-7z"/>';
  const seal=$("seal"),env=$("env3"),card=$("vcard"),wrap=$("vwrap"),play=$("vplay"),after=$("vafter");
  seal.innerHTML=ico("heart");
  play.innerHTML=ico("play");
  $("vcap").textContent=CFG.videoCaption||"for you";

  /* build the video now (hidden) so it is loading before she taps */
  const v=document.createElement("video");
  v.src=CFG.video;
  if(CFG.videoPoster)v.poster=CFG.videoPoster;
  v.playsInline=true;v.setAttribute("playsinline","");
  v.preload="auto";
  wrap.insertBefore(v,play);

  function goFull(){
    try{
      if(v.requestFullscreen)return v.requestFullscreen().catch(()=>{});
      if(v.webkitRequestFullscreen)return v.webkitRequestFullscreen();
      if(v.webkitEnterFullscreen)v.webkitEnterFullscreen();   /* iPhone */
    }catch(e){}
  }
  function leaveFull(){
    try{
      if(document.fullscreenElement&&document.exitFullscreen)document.exitFullscreen();
      else if(document.webkitFullscreenElement&&document.webkitExitFullscreen)document.webkitExitFullscreen();
      else if(v.webkitDisplayingFullscreen&&v.webkitExitFullscreen)v.webkitExitFullscreen();
    }catch(e){}
  }

  /* background music pauses during the video and comes back after */
  let resume=false;
  const hush=()=>{if(typeof AUD!=="undefined"&&AUD&&!AUD.paused){AUD.pause();setM(false);resume=true}};
  const back=()=>{if(resume){resume=false;startMusic()}};

  /* step 2: play, straight into full screen */
  function startPlay(){
    card.classList.add("playing");
    v.controls=true;
    v.play().catch(()=>{});
    goFull();
  }
  play.onclick=startPlay;

  /* step 1: break the seal, the flap opens, the video rises out */
  let opened=false,finaleDone=false;
  seal.onclick=()=>{
    if(opened)return;opened=true;
    hush();
    env.classList.add("open");
    chime(523.25,.4,.05);buzz(15);
    if(CFG.videoOneTap)startPlay();   /* optional: full screen on the very first tap */
    setTimeout(()=>env.classList.add("behind"),320);
    setTimeout(()=>env.classList.add("gone"),950);
    setTimeout(()=>{
      env.style.display="none";
      card.classList.add("show");
      $("lsub").textContent="Tap play when you’re ready.";
    },1350);
  };

  v.onerror=()=>{
    leaveFull();
    card.classList.remove("playing");
    after.innerHTML='<p class="center">The video could not load. Check that the file name in config.js matches your video file.</p>';
    back();
  };

  v.onended=()=>{
    leaveFull();
    v.controls=false;
    card.classList.remove("playing");
    back();
    if(finaleDone)return;finaleDone=true;
    burst();
    if(CFG.finale){
      const f=document.createElement("p");
      f.className="hand";
      f.style.cssText="text-align:center;font-size:2.4rem;margin:1.8rem 0 .4rem";
      f.textContent=CFG.finale;
      after.appendChild(f);
    }
    $("lsub").textContent="Tap the video to watch it again.";
  };

  /* the card tilts a little toward the mouse (computers only) */
  if(!calm){
    card.addEventListener("pointermove",e=>{
      if(e.pointerType!=="mouse"||card.classList.contains("playing"))return;
      const r=card.getBoundingClientRect(),px=(e.clientX-r.left)/r.width,py=(e.clientY-r.top)/r.height;
      card.style.setProperty("--ry",((px-.5)*10)+"deg");
      card.style.setProperty("--rx",((.5-py)*10)+"deg");
    });
    card.addEventListener("pointerleave",()=>{card.style.setProperty("--rx","0deg");card.style.setProperty("--ry","0deg")});
  }
})();