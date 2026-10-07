/* shared behaviours — every page */

/* boot */
(function(){
  const bar=document.getElementById('bootbar'),msg=document.getElementById('bootmsg'),boot=document.getElementById('boot');
  if(!boot)return;
  const lines=['warming up the workbench…','sharpening the pencils…','waking PLUTO…','uplink established.'];
  let p=0,i=0;
  const t=setInterval(()=>{
    p+=Math.random()*22+8; if(p>100)p=100;
    bar.style.width=p+'%';
    const ni=Math.min(lines.length-1,Math.floor(p/28));
    if(ni!==i){i=ni;msg.textContent=lines[i];}
    if(p>=100){clearInterval(t);setTimeout(()=>boot.classList.add('done'),250);}
  },150);
})();

/* cockpit HUD frame — corner brackets + readout, every page */
(function(){
  const hud=document.createElement('div');
  hud.className='hudframe';
  hud.setAttribute('aria-hidden','true');
  hud.innerHTML='<i class="hc tl"></i><i class="hc tr"></i><i class="hc bl"></i><i class="hc br"></i>'
    +'<span class="hreadout">UPLINK STABLE · PBD-3.9B KM</span>';
  document.body.appendChild(hud);
})();

/* console telemetry — a few readouts from the thing PLUTO lives in */
(function(){
  const tm=document.createElement('div');
  tm.className='telemetry';
  tm.setAttribute('aria-hidden','true');
  tm.innerHTML=
    '<div class="tm tm-track"><span class="lbl">TRACK 014</span>Δ 0.0043°/s<br>LOCK ·····●···</div>'
    +'<div class="tm tm-sig"><span class="lbl">SIGNAL</span>▓▓▓▓▓▓▓░░░ 74%</div>'
    +'<div class="tm tm-range"><span class="lbl">RANGE</span><span id="tmrange">3,900,214,558 KM</span></div>';
  document.body.appendChild(tm);

  const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(!reduce){
    const rangeEl=tm.querySelector('#tmrange');
    let range=3900214558;
    setInterval(()=>{
      range+=Math.floor(Math.random()*40+8);
      rangeEl.textContent=range.toLocaleString('en-US')+' KM';
    },2200);
  }
})();

/* drifting ink specks */
(function(){
  const cv=document.getElementById('cv'); if(!cv)return;
  const ctx=cv.getContext('2d');
  const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  let W,H,dots=[],mx=0,my=0;
  function resize(){W=cv.width=innerWidth*devicePixelRatio;H=cv.height=innerHeight*devicePixelRatio;
    cv.style.width=innerWidth+'px';cv.style.height=innerHeight+'px';
    const n=Math.min(150,Math.floor(innerWidth*innerHeight/13000));
    dots=Array.from({length:n},(_,i)=>({
      x:Math.random()*W,y:Math.random()*H,
      z:Math.random()*.9+.1,tw:Math.random()*Math.PI*2,ts:.3+Math.random()*.8,
      signal:i%17===0
    }));
    for(const d of dots){
      d.r=(d.signal? Math.random()*1.1+2.2 : Math.random()*1.3+.7)*devicePixelRatio;
      d.vy=d.z*(d.signal?6:10)*devicePixelRatio/1000;
    }
  }
  addEventListener('resize',resize);resize();
  addEventListener('mousemove',e=>{mx=(e.clientX/innerWidth-.5);my=(e.clientY/innerHeight-.5);},{passive:true});
  let t0=performance.now();
  function frame(now){
    const dt=Math.min(50,now-t0);t0=now;
    ctx.clearRect(0,0,W,H);
    for(const d of dots){
      d.tw+=d.ts*dt/1000;
      if(!reduce){d.y+=d.vy*dt; if(d.y>H+d.r){d.y=-d.r;d.x=Math.random()*W;}}
      const peak=d.signal?.4:.17;
      const base=d.signal?.12:.06;
      const a=reduce? base+peak*.4 : base+peak*Math.abs(Math.sin(d.tw));
      const px=d.x-mx*20*d.z*devicePixelRatio, py=d.y-my*20*d.z*devicePixelRatio;
      ctx.beginPath();ctx.arc(px,py,d.r,0,7);ctx.fillStyle=`rgba(42,59,214,${a})`;ctx.fill();
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();

/* PLUTO paginated bubble */
(function(){
  const bub=document.getElementById('bubble'); if(!bub)return;
  const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const pages=[
    "Hi, I'm PLUTO, the onboard computer. Welcome to Sourav's workbench.",
    "He stepped away from the console, so the tools and I are holding the fort.",
    "Fair warning: the games are rigged. In your favor. Mostly.",
    "When you're done playing, scroll down. There's actual work down there. Apparently."
  ];
  const txt=document.getElementById('btxt'),dots=document.getElementById('bdots'),cnt=document.getElementById('bcnt');
  dots.innerHTML=pages.map(()=>'<i></i>').join('');
  let cur=0,typeTimer=null;
  function typeText(str){
    clearInterval(typeTimer);
    if(reduce){txt.textContent=str;return;}
    bub.classList.add('typing');
    txt.textContent='';
    let i=0;
    typeTimer=setInterval(()=>{
      i++;txt.textContent=str.slice(0,i);
      if(i>=str.length){clearInterval(typeTimer);bub.classList.remove('typing');}
    },16);
  }
  function show(i){cur=(i+pages.length)%pages.length;typeText(pages[cur]);
    [...dots.children].forEach((d,k)=>d.classList.toggle('on',k===cur));
    cnt.textContent=(cur+1)+' / '+pages.length;}
  bub.addEventListener('click',()=>show(cur+1));
  bub.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();show(cur+1);}});
  show(0);
})();

/* fixed PLUTO widget — appears once you scroll into content (like MINICOM on inner pages) */
(function(){
  const w=document.getElementById('plutow'); if(!w)return;
  const t=document.getElementById('plutowtxt');
  const tips=[
    "psst, try the whack-a-mole. it's harder than it looks.",
    "PLUTO fun fact: I am not a planet. I am a load-bearing personality.",
    "that pale blue dot in the corner? worth a click.",
    "the blog has a Feynman diagram. he'd have hated the accuracy. love the spirit."
  ];
  let i=0;
  const trig=new IntersectionObserver(es=>{if(es.some(e=>e.isIntersecting)){w.classList.add('on');trig.disconnect();}},{threshold:.2});
  const anchor=document.getElementById('projects')||document.getElementById('about')||document.getElementById('blog');
  if(anchor)trig.observe(anchor);
  const hide=new IntersectionObserver(es=>{if(es.some(e=>e.isIntersecting)){w.classList.remove('on');hide.disconnect();}},{threshold:.1});
  hide.observe(document.getElementById('contact'));
  w.addEventListener('click',e=>{if(e.target.closest('.x'))return;i=(i+1)%tips.length;t.textContent=tips[i];});
  w.querySelector('.x').addEventListener('click',e=>{e.stopPropagation();w.classList.remove('on');});
})();

/* reveal on scroll */
(function(){
  const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}}),{threshold:.15});
  document.querySelectorAll('.rv').forEach(el=>io.observe(el));
})();

/* pale blue dot modal */
(function(){
  const m=document.getElementById('modal'); if(!m)return;
  const b=document.getElementById('pbd');
  if(b)b.addEventListener('click',()=>m.classList.add('open'));
  document.getElementById('mclose').addEventListener('click',()=>m.classList.remove('open'));
  m.addEventListener('click',e=>{if(e.target===m)m.classList.remove('open');});
  addEventListener('keydown',e=>{if(e.key==='Escape')m.classList.remove('open');});
})();

/* copy email */
(function(){
  const b=document.getElementById('copymail'); if(!b)return;
  b.addEventListener('click',async()=>{
    try{await navigator.clipboard.writeText('sourav1319singh@gmail.com');b.textContent='COPIED ✓';}
    catch{b.textContent='SELECT + COPY';}
    setTimeout(()=>b.textContent='COPY ⧉',1600);
  });
})();

/* easter egg */
console.log('%cQ_rsqrt(x): the year was 1999, the constant was 0x5f3759df,','font-family:monospace;color:#2a3bd6');
console.log('%c— hello from the console. you found the Carmack star. ⭐','font-family:monospace;color:#2a3bd6');
