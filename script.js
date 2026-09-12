document.body.classList.add("loading");

window.addEventListener("load", () => {
  setTimeout(() => {
    document.getElementById("loader").classList.add("done");
    document.body.classList.remove("loading");
  }, 1550);
});

const canvas = document.querySelector("#webgl");
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, innerWidth / innerHeight, .1, 100);
camera.position.z = 6;

const renderer = new THREE.WebGLRenderer({canvas, antialias:true, alpha:true});
renderer.setPixelRatio(Math.min(devicePixelRatio, 1.7));
renderer.setSize(innerWidth, innerHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;

const group = new THREE.Group();
scene.add(group);

const geometry = new THREE.IcosahedronGeometry(1.35, 5);
const material = new THREE.MeshPhysicalMaterial({
  color: 0x9a9a9a,
  roughness: .22,
  metalness: .65,
  transmission: .05,
  clearcoat: 1,
  clearcoatRoughness: .18,
  wireframe: false
});
const core = new THREE.Mesh(geometry, material);
group.add(core);

const wire = new THREE.LineSegments(
  new THREE.WireframeGeometry(new THREE.IcosahedronGeometry(1.42, 2)),
  new THREE.LineBasicMaterial({color:0x777777, transparent:true, opacity:.17})
);
group.add(wire);

const particlesGeo = new THREE.BufferGeometry();
const count = 500;
const positions = new Float32Array(count * 3);
for(let i=0;i<count;i++){
  const r = 2.0 + Math.random()*2.2;
  const a = Math.random()*Math.PI*2;
  const b = Math.acos(2*Math.random()-1);
  positions[i*3] = r*Math.sin(b)*Math.cos(a);
  positions[i*3+1] = r*Math.sin(b)*Math.sin(a);
  positions[i*3+2] = r*Math.cos(b);
}
particlesGeo.setAttribute("position",new THREE.BufferAttribute(positions,3));
const particles = new THREE.Points(particlesGeo,new THREE.PointsMaterial({color:0xaaaaaa,size:.012,transparent:true,opacity:.55}));
scene.add(particles);

const ambient = new THREE.AmbientLight(0xffffff,.75);
scene.add(ambient);
const key = new THREE.PointLight(0xffffff,18,12);
key.position.set(3,2,4);
scene.add(key);
const rim = new THREE.PointLight(0x9b9b9b,12,10);
rim.position.set(-4,-2,1);
scene.add(rim);

let targetX=0,targetY=0,scrollTarget=0,scrollCurrent=0;
addEventListener("pointermove",e=>{
  targetX=(e.clientX/innerWidth-.5);
  targetY=(e.clientY/innerHeight-.5);
  document.querySelector(".cursor").style.left=e.clientX+"px";
  document.querySelector(".cursor").style.top=e.clientY+"px";
  document.querySelector(".cursor-dot").style.left=e.clientX+"px";
  document.querySelector(".cursor-dot").style.top=e.clientY+"px";
});
addEventListener("scroll",()=>scrollTarget=scrollY);
addEventListener("resize",()=>{
  camera.aspect=innerWidth/innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth,innerHeight);
});

const clock=new THREE.Clock();
function animate(){
  requestAnimationFrame(animate);
  const t=clock.getElapsedTime();
  scrollCurrent += (scrollTarget-scrollCurrent)*.04;
  group.rotation.y += .002;
  group.rotation.x = Math.sin(t*.35)*.12 + targetY*.28;
  group.rotation.z = targetX*.12;
  group.position.x += (targetX*.45-group.position.x)*.035;
  group.position.y += (-targetY*.28+Math.sin(t*.6)*.05-group.position.y)*.035;
  core.rotation.x=t*.08;
  wire.rotation.x=-t*.04;
  wire.rotation.y=t*.09;
  particles.rotation.y=t*.025;
  camera.position.z=6+Math.min(scrollCurrent/900,2.2);
  renderer.render(scene,camera);
}
animate();

document.querySelectorAll(".project-card,.button,.text-link,.availability,.nav a,footer a").forEach(el=>{
  el.addEventListener("mouseenter",()=>document.querySelector(".cursor").style.transform="translate(-50%,-50%) scale(1.5)");
  el.addEventListener("mouseleave",()=>document.querySelector(".cursor").style.transform="translate(-50%,-50%) scale(1)");
});

const observer=new IntersectionObserver(entries=>{
  entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add("visible")});
},{threshold:.12});
document.querySelectorAll(".reveal").forEach(el=>observer.observe(el));
