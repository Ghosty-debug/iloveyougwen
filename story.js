$("tl").innerHTML = CFG.story.map(e=>`<article><time>${e.date}</time><h3>${e.title}</h3><p>${e.text}</p>
  <div class="ph">${e.img?`<img src="${e.img}" alt="${e.title}">`:"your photo here"}</div></article>`).join("");

done("story");