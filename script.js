const needs={
  overload:{index:'01',title:'Konsultacja neuropsychologiczna',text:'Porządkujemy objawy, kontekst i codzienne obciążenia. Powstaje mapa procesu — nie etykieta.'},
  patterns:{index:'02',title:'Sesja wstępna hipnoterapii',text:'Sprawdzamy, jaki wzorzec wraca i co go podtrzymuje. Ustalamy bezpieczny, konkretny cel pierwszej sesji.'},
  focus:{index:'03',title:'Konsultacja funkcjonowania',text:'Przyglądamy się uwadze, regeneracji, rytmowi dnia i przeciążeniom. Szukamy dźwigni, które są możliwe do wdrożenia.'},
  food:{index:'04',title:'Mentoring neurożywieniowy',text:'Oddzielamy fakty od trendów. Układamy realne wybory wspierające energię, koncentrację i spokojniejszą relację z jedzeniem.'}
};

document.querySelectorAll('.compass-option').forEach(button=>button.addEventListener('click',()=>{
  document.querySelectorAll('.compass-option').forEach(item=>{item.classList.remove('active');item.setAttribute('aria-selected','false')});
  button.classList.add('active');button.setAttribute('aria-selected','true');
  const data=needs[button.dataset.need];
  const result=document.querySelector('#compass-result');
  if (!result) return;
  result.animate([{opacity:.25,transform:'translateY(8px)'},{opacity:1,transform:'none'}],{duration:320,easing:'ease-out'});
  result.querySelector('.result-index').textContent=data.index;
  result.querySelector('h3').textContent=data.title;
  result.querySelector('div:nth-child(2)>span').textContent=data.text;
}));

const menu=document.querySelector('.menu-toggle');
const nav=document.querySelector('.main-nav');
if (menu && nav) {
  menu.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open))});
  nav.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>{nav.classList.remove('open');menu.setAttribute('aria-expanded','false')}));
}

const breathButton=document.querySelector('#breath-button');
const breathOrb=document.querySelector('.breath-orb');
const breathLabel=document.querySelector('#breath-label');
let breathTimer;
if (breathButton && breathOrb && breathLabel) {
  breathButton.addEventListener('click',()=>{
    clearInterval(breathTimer);breathOrb.classList.remove('running');void breathOrb.offsetWidth;breathOrb.classList.add('running');
    breathButton.disabled=true;breathButton.firstChild.textContent='Ćwiczenie trwa ';
    let left=60;let phase=0;const cycle=['Wdech','Wdech','Wdech','Wdech','Wydech','Wydech','Wydech','Wydech','Wydech','Wydech'];
    breathLabel.textContent=cycle[0];
    breathTimer=setInterval(()=>{left--;phase=(phase+1)%10;breathLabel.textContent=left>0?cycle[phase]:'Gotowe';breathButton.firstChild.textContent=left>0?`Pozostało ${left} s `:'Jeszcze raz ';
      if(left<=0){clearInterval(breathTimer);breathButton.disabled=false;breathOrb.classList.remove('running')}} ,1000);
  });
}

document.querySelectorAll('.faq details').forEach(item=>item.addEventListener('toggle',()=>{if(item.open)document.querySelectorAll('.faq details').forEach(other=>{if(other!==item)other.open=false})}));
const yearEl=document.querySelector('#year');
if (yearEl) yearEl.textContent=new Date().getFullYear();

const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.animate([{opacity:0,transform:'translateY(24px)'},{opacity:1,transform:'none'}],{duration:700,easing:'cubic-bezier(.2,.75,.3,1)',fill:'both'});observer.unobserve(entry.target)}}),{threshold:.1});
document.querySelectorAll('.service-card,.path-steps article,.price-card,.article-main,.article-side').forEach(el=>observer.observe(el));
