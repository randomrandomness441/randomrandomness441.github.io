/* home page behaviours — everything here is progressive; the page reads fine without it */
(function(){
  const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const root=document.documentElement;

  /* theme: stored choice, else system preference */
  const toggle=document.getElementById('themepick');
  function setTheme(t){
    root.dataset.theme=t;
    const m=document.querySelector('meta[name="theme-color"]');
    if(m)m.content=t==='dark'?'#1a1b26':'#f7f5ee';
    if(toggle){toggle.setAttribute('aria-pressed',String(t==='dark'));toggle.textContent=t==='dark'?'☀':'☾';}
  }
  if(toggle)toggle.addEventListener('click',()=>{
    const t=root.dataset.theme==='dark'?'light':'dark';
    setTheme(t);
    try{localStorage.setItem('theme',t);}catch(e){}
  });
  setTheme(root.dataset.theme||'light');

  /* reveal on scroll */
  const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}}),{threshold:.12});
  document.querySelectorAll('.reveal,.name').forEach(el=>io.observe(el));

  /* top bar border + back-to-top */
  const bar=document.querySelector('.bar'),totop=document.querySelector('.totop');
  function onScroll(){
    const y=scrollY;
    if(bar)bar.dataset.stuck=y>8?'1':'0';
    if(totop)totop.classList.toggle('on',y>innerHeight*.8);
  }
  addEventListener('scroll',onScroll,{passive:true});onScroll();

  /* experience index follows the card in view */
  const items=[...document.querySelectorAll('[data-xp-item]')];
  if(items.length){
    const byId=new Map(items.map(a=>[a.getAttribute('href').slice(1),a]));
    const xio=new IntersectionObserver(es=>es.forEach(e=>{
      if(!e.isIntersecting)return;
      items.forEach(i=>i.classList.remove('on'));
      const a=byId.get(e.target.id);if(a)a.classList.add('on');
    }),{rootMargin:'-40% 0px -50% 0px'});
    byId.forEach((_,id)=>{const el=document.getElementById(id);if(el)xio.observe(el);});
  }

  /* roles collapse on phones (CSS only applies it when scripting is enabled) */
  document.querySelectorAll('.job').forEach(job=>{
    const btn=job.querySelector('.job__toggle');
    if(!btn)return;
    btn.addEventListener('click',()=>{
      const open=job.dataset.open!=='1';
      job.dataset.open=open?'1':'0';
      btn.setAttribute('aria-expanded',String(open));
    });
  });

  /* drawer */
  const burger=document.getElementById('burger'),scrim=document.getElementById('scrim');
  function drawer(open){
    if(open)root.setAttribute('data-drawer','');else root.removeAttribute('data-drawer');
    if(burger)burger.setAttribute('aria-expanded',String(open));
  }
  if(burger)burger.addEventListener('click',()=>drawer(!root.hasAttribute('data-drawer')));
  if(scrim)scrim.addEventListener('click',()=>drawer(false));
  document.querySelectorAll('.drawer a').forEach(a=>a.addEventListener('click',()=>drawer(false)));
  addEventListener('keydown',e=>{if(e.key==='Escape')drawer(false);});

  /* stat count-up */
  if(!reduce){
    document.querySelectorAll('[data-count]').forEach(el=>{
      const end=parseFloat(el.dataset.count);let started=false;
      const cio=new IntersectionObserver(es=>{
        if(!es[0].isIntersecting||started)return;started=true;cio.disconnect();
        const t0=performance.now();
        (function tick(now){
          const p=Math.min(1,(now-t0)/1100),e=1-Math.pow(1-p,3);
          el.textContent=Math.round(end*e);
          if(p<1)requestAnimationFrame(tick);
        })(t0);
      });
      cio.observe(el);
    });
  }

  /* cursor dot + hero light — fine pointers only */
  if(matchMedia('(hover:hover) and (pointer:fine)').matches){
    const dot=document.getElementById('cursor'),hero=document.querySelector('.hero'),light=document.querySelector('.hero__light');
    let x=0,y=0,tx=0,ty=0,seen=false;
    addEventListener('mousemove',e=>{
      tx=e.clientX;ty=e.clientY;
      if(!seen){seen=true;x=tx;y=ty;if(dot)dot.classList.add('on');}
      if(hero&&light){
        const r=hero.getBoundingClientRect(),inside=e.clientY>=r.top&&e.clientY<=r.bottom;
        light.classList.toggle('on',inside);
        if(inside){light.style.setProperty('--sx',(e.clientX-r.left)+'px');light.style.setProperty('--sy',(e.clientY-r.top)+'px');}
      }
    },{passive:true});
    document.addEventListener('mouseleave',()=>dot&&dot.classList.remove('on'));
    document.addEventListener('mouseenter',()=>seen&&dot&&dot.classList.add('on'));
    if(dot)(function loop(){
      x+=(tx-x)*(reduce?1:.3);y+=(ty-y)*(reduce?1:.3);
      dot.style.transform='translate('+x+'px,'+y+'px)';
      requestAnimationFrame(loop);
    })();
    document.querySelectorAll('a,button,summary').forEach(el=>{
      el.addEventListener('mouseenter',()=>dot&&dot.classList.add('big'));
      el.addEventListener('mouseleave',()=>dot&&dot.classList.remove('big'));
    });
  }
})();
