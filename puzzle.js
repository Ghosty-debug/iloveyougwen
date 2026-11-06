(function(){
  const t=[0,1,2,3,4,5,6,7,8];let moves=0;
  const nb=p=>{const r=Math.floor(p/3),c=p%3,o=[];if(r>0)o.push(p-3);if(r<2)o.push(p+3);if(c>0)o.push(p-1);if(c<2)o.push(p+1);return o};
  const mv=p=>{const e=t.indexOf(8);if(nb(e).includes(p)){[t[e],t[p]]=[t[p],t[e]];return true}return false};
  const solved=()=>t.every((v,i)=>v===i);
  function render(full){
    $("pz").innerHTML=t.map((v,p)=>{
      if(v===8&&!full)return '<button class="empty" disabled aria-hidden="true"></button>';
      const st=CFG.puzzleImg?`background-image:url('${CFG.puzzleImg}');background-position:${(v%3)*50}% ${Math.floor(v/3)*50}%`:"";
      return `<button data-p="${p}" style="${st}" aria-label="Tile ${v+1}">${CFG.puzzleImg?"":(v===8?ico("heart"):v+1)}</button>`}).join("");
  }
  for(let i=0;i<200;i++){const o=nb(t.indexOf(8));mv(o[Math.floor(Math.random()*o.length)])}
  if(solved())mv(nb(8)[0]);
  render();
  $("pz").onclick=e=>{
    const b=e.target.closest("button[data-p]");if(!b||solved())return;
    if(mv(+b.dataset.p)){
      moves++;render();$("pstat").textContent="Moves: "+moves;
      if(solved()){render(true);$("pstat").innerHTML='Back together, just like us. <span class="hand" style="font-size:1.5rem">Solved in '+moves+' moves '+ico("heart")+'</span>';done("puzzle")}
    }
  };
})();