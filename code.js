(function(){
  function check(){
    const m=$("codeMsg"),i=$("codeIn");
    if(i.value.trim()===CFG.code){m.innerHTML="That’s the one. Unlocked "+ico("heart");i.disabled=true;$("codeBtn").disabled=true;done("code")}
    else{m.textContent="Not that date. Hint: "+CFG.codeHint;i.classList.remove("shake");void i.offsetWidth;i.classList.add("shake")}
  }
  $("codeBtn").onclick=check;
  $("codeIn").onkeydown=e=>{if(e.key==="Enter")check()};
})();