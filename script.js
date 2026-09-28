const intro = document.getElementById("intro");
const site = document.getElementById("site");

const box = document.getElementById("shards");

for(let i=0;i<46;i++){
  let s=document.createElement("i"),
      a=Math.random()*Math.PI*2,
      r=220+Math.random()*210;

  s.style.setProperty("--x",Math.cos(a)*r+"px");
  s.style.setProperty("--y",Math.sin(a)*r+"px");
  s.style.setProperty("--r",Math.random()*180-90+"deg");
  s.style.animationDelay=.25+Math.random()*1.2+"s";
  box.appendChild(s);
}

let t0=performance.now();

function p(t){
  let v=Math.min((t-t0)/4800,1);

  document.getElementById("pct").textContent =
    String(Math.round(v*100)).padStart(2,"0")+"%";

  if(v<1) requestAnimationFrame(p);
}

requestAnimationFrame(p);

setTimeout(()=>{
  intro.classList.add("hide");
  site.classList.add("ready");
},4700);

setTimeout(()=>intro.remove(),6000);

const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible')}),{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));

const cursor=document.querySelector('.cursor');
window.addEventListener('mousemove',e=>{cursor.style.left=e.clientX+'px';cursor.style.top=e.clientY+'px';});
document.querySelectorAll('a,.service,.project-visual').forEach(el=>{el.addEventListener('mouseenter',()=>cursor.classList.add('active'));el.addEventListener('mouseleave',()=>cursor.classList.remove('active'))});

document.querySelectorAll('.magnetic').forEach(el=>{el.addEventListener('mousemove',e=>{const r=el.getBoundingClientRect();const x=(e.clientX-r.left-r.width/2)*.12;const y=(e.clientY-r.top-r.height/2)*.12;el.style.transform=`translate(${x}px,${y}px)`});el.addEventListener('mouseleave',()=>el.style.transform='')});


window.addEventListener('scroll',()=>{const y=window.scrollY;document.documentElement.style.setProperty('--scroll',y);document.querySelector('.hero-orbit')?.style.setProperty('transform',`translateY(${y*.08}px) rotate(${y*.015}deg)`)});
