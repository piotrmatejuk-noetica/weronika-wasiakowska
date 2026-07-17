const needs={
  overload:{index:'01',title:'Neuroscience consultation',text:'We map symptoms, context and daily pressures. The result is a clear direction — not another label.'},
  patterns:{index:'02',title:'Initial hypnotherapy session',text:'We identify the pattern that keeps returning and what sustains it, then define a safe and specific goal for the first session.'},
  focus:{index:'03',title:'Functioning and wellbeing consultation',text:'We look at attention, recovery, daily rhythm and overload to find practical changes you can realistically introduce.'},
  food:{index:'04',title:'Neuro-nutrition mentoring',text:'We separate evidence from trends and create realistic choices that support energy, focus and a calmer relationship with food.'}
};

document.querySelectorAll('.compass-option').forEach(button=>button.addEventListener('click',()=>{
  document.querySelectorAll('.compass-option').forEach(item=>{item.classList.remove('active');item.setAttribute('aria-selected','false')});
  button.classList.add('active');button.setAttribute('aria-selected','true');
  const data=needs[button.dataset.need];
  const result=document.querySelector('#compass-result');
  result.animate([{opacity:.25,transform:'translateY(8px)'},{opacity:1,transform:'none'}],{duration:320,easing:'ease-out'});
  result.querySelector('.result-index').textContent=data.index;
  result.querySelector('h3').textContent=data.title;
  result.querySelector('div:nth-child(2)>span').textContent=data.text;
}));

const menu=document.querySelector('.menu-toggle');
const nav=document.querySelector('.main-nav');
if(menu&&nav){
  menu.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open))});
  nav.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>{nav.classList.remove('open');menu.setAttribute('aria-expanded','false')}));
}

const breathButton=document.querySelector('#breath-button');
const breathOrb=document.querySelector('.breath-orb');
const breathLabel=document.querySelector('#breath-label');
let breathTimer;
if(breathButton&&breathOrb&&breathLabel){
  breathButton.addEventListener('click',()=>{
    clearInterval(breathTimer);breathOrb.classList.remove('running');void breathOrb.offsetWidth;breathOrb.classList.add('running');
    breathButton.disabled=true;breathButton.firstChild.textContent='Exercise in progress ';
    let left=60;let phase=0;const cycle=['Inhale','Inhale','Inhale','Inhale','Exhale','Exhale','Exhale','Exhale','Exhale','Exhale'];
    breathLabel.textContent=cycle[0];
    breathTimer=setInterval(()=>{left--;phase=(phase+1)%10;breathLabel.textContent=left>0?cycle[phase]:'Complete';breathButton.firstChild.textContent=left>0?`${left} seconds left `:'Begin again ';
      if(left<=0){clearInterval(breathTimer);breathButton.disabled=false;breathOrb.classList.remove('running')}} ,1000);
  });
}

document.querySelectorAll('.faq details').forEach(item=>item.addEventListener('toggle',()=>{if(item.open)document.querySelectorAll('.faq details').forEach(other=>{if(other!==item)other.open=false})}));
const yearEl=document.querySelector('#year');
if(yearEl)yearEl.textContent=new Date().getFullYear();

const revealSelector='.feature-heading,.section-heading,.partners-heading,.service-card,.knowledge-card,.price-card,.case-card,.fit-card,.partner-card,.path-steps article,.session-step,.article-main,.article-side,.about-image,.about-copy,.about-personal,.booking-placeholder,.contact-layout>*,.lead-magnet>*,.faq details,.compass-grid,.pause>*';
const prefersReducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const revealTargets=Array.from(document.querySelectorAll(revealSelector));
const staggerCounts=new Map();
revealTargets.forEach(el=>{
  const parent=el.parentElement;
  const n=staggerCounts.get(parent)||0;
  el.dataset.revealDelay=Math.min(n,5)*80;
  staggerCounts.set(parent,n+1);
});
if(!prefersReducedMotion&&revealTargets.length){
  const revealObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{
    if(entry.isIntersecting){
      const delay=Number(entry.target.dataset.revealDelay||0);
      entry.target.animate([{opacity:0,transform:'translateY(28px)'},{opacity:1,transform:'none'}],{duration:750,delay,easing:'cubic-bezier(.16,.8,.3,1)',fill:'both'});
      revealObserver.unobserve(entry.target);
    }
  }),{threshold:.12,rootMargin:'0px 0px -60px 0px'});
  revealTargets.forEach(el=>revealObserver.observe(el));
}

const scrollProgress=document.querySelector('.scroll-progress');
if(scrollProgress){
  const updateProgress=()=>{
    const scrollTop=window.scrollY;
    const docHeight=document.documentElement.scrollHeight-window.innerHeight;
    scrollProgress.style.width=(docHeight>0?(scrollTop/docHeight)*100:0)+'%';
  };
  window.addEventListener('scroll',updateProgress,{passive:true});
  updateProgress();
}

if(!prefersReducedMotion){
  const heroNeuro=document.querySelector('.hero-neuro');
  const heroPortrait=document.querySelector('.hero-portrait');
  if(heroNeuro||heroPortrait){
    let ticking=false;
    const updateParallax=()=>{
      const y=window.scrollY;
      if(y<window.innerHeight*1.6){
        if(heroNeuro)heroNeuro.style.transform=`translateY(${y*0.12}px)`;
        if(heroPortrait)heroPortrait.style.transform=`translateY(${y*0.06}px)`;
      }
      ticking=false;
    };
    window.addEventListener('scroll',()=>{if(!ticking){requestAnimationFrame(updateParallax);ticking=true}},{passive:true});
  }
}
