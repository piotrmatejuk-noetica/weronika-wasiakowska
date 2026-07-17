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
menu.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open))});
nav.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>{nav.classList.remove('open');menu.setAttribute('aria-expanded','false')}));

const breathButton=document.querySelector('#breath-button');
const breathOrb=document.querySelector('.breath-orb');
const breathLabel=document.querySelector('#breath-label');
let breathTimer;
breathButton.addEventListener('click',()=>{
  clearInterval(breathTimer);breathOrb.classList.remove('running');void breathOrb.offsetWidth;breathOrb.classList.add('running');
  breathButton.disabled=true;breathButton.firstChild.textContent='Exercise in progress ';
  let left=60;let phase=0;const cycle=['Inhale','Inhale','Inhale','Inhale','Exhale','Exhale','Exhale','Exhale','Exhale','Exhale'];
  breathLabel.textContent=cycle[0];
  breathTimer=setInterval(()=>{left--;phase=(phase+1)%10;breathLabel.textContent=left>0?cycle[phase]:'Complete';breathButton.firstChild.textContent=left>0?`${left} seconds left `:'Begin again ';
    if(left<=0){clearInterval(breathTimer);breathButton.disabled=false;breathOrb.classList.remove('running')}} ,1000);
});

document.querySelectorAll('.faq details').forEach(item=>item.addEventListener('toggle',()=>{if(item.open)document.querySelectorAll('.faq details').forEach(other=>{if(other!==item)other.open=false})}));
document.querySelector('#year').textContent=new Date().getFullYear();

const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.animate([{opacity:0,transform:'translateY(24px)'},{opacity:1,transform:'none'}],{duration:700,easing:'cubic-bezier(.2,.75,.3,1)',fill:'both'});observer.unobserve(entry.target)}}),{threshold:.1});
document.querySelectorAll('.service-card,.path-steps article,.price-card,.article-main,.article-side').forEach(el=>observer.observe(el));
