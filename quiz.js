(function(){
  let i=0,score=0;
  function show(){
    const b=$("qbox");
    if(i>=CFG.quiz.length){const pass=score>=CFG.quizPass;
      b.innerHTML=`<h3 style="margin:0 0 .5rem;font-size:1.6rem">${score}/${CFG.quiz.length}</h3><p>${pass?(score===CFG.quiz.length?CFG.quizWin:CFG.quizOk):CFG.quizFail}</p>${pass?"":'<button id="again">Try again</button>'}`;if(pass)done("quiz");
      if(!pass)$("again").onclick=()=>{i=0;score=0;show()}; return;
    }
    const q=CFG.quiz[i];
    b.innerHTML=`<p class="sub" style="margin:0">Question ${i+1} of ${CFG.quiz.length}</p><h3 style="margin:.3rem 0;font-size:1.5rem">${q.q}</h3>
      <div class="opts">${q.a.map((a,k)=>`<button data-k="${k}">${a}</button>`).join("")}</div>`;
    b.querySelectorAll(".opts button").forEach(btn=>btn.onclick=()=>{
      const k=+btn.dataset.k; const right=k===q.c; if(right)score++;
      b.querySelectorAll(".opts button").forEach(x=>{x.disabled=true;if(+x.dataset.k===q.c)x.classList.add("ok")});
      if(!right)btn.classList.add("no");
      setTimeout(()=>{i++;show()},1100);
    });
  }
  show();
})();