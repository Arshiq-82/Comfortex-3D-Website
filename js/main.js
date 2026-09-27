(() => {
const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const $=(s)=>document.querySelector(s); const $$=(s)=>[...document.querySelectorAll(s)];

// Futuristic shell
const shell=document.createElement('div'); shell.className='noise'; document.body.appendChild(shell);
const cursor=document.createElement('div'); cursor.className='cursor-dot'; document.body.appendChild(cursor);
const ring=document.createElement('div'); ring.className='cursor-ring'; document.body.appendChild(ring);
const pre=document.createElement('div'); pre.className='preloader'; pre.innerHTML='<div class="preloader-inner"><img src="assets/comfortex-logo.png" alt="Comfortex"><div class="loader-line"></div><div class="loader-label">INITIALIZING EXPERIENCE</div></div>'; document.body.prepend(pre);
window.addEventListener('load',()=>setTimeout(()=>pre.classList.add('done'),500));

if(!reduce){
  window.addEventListener('pointermove',e=>{cursor.style.left=e.clientX+'px';cursor.style.top=e.clientY+'px';ring.style.left=e.clientX+'px';ring.style.top=e.clientY+'px';document.documentElement.style.setProperty('--mx',e.clientX+'px');document.documentElement.style.setProperty('--my',e.clientY+'px')});
  $$('a,button,.card,.pillar,.tile,.testimonial').forEach(el=>{el.addEventListener('mouseenter',()=>ring.classList.add('hover'));el.addEventListener('mouseleave',()=>ring.classList.remove('hover'))});
}
const header=$('header'); addEventListener('scroll',()=>header?.classList.toggle('scrolled',scrollY>30),{passive:true});

// Mobile navigation
const menu=$('.menu'); if(menu){menu.addEventListener('click',()=>{document.body.classList.toggle('menu-open'); menu.textContent=document.body.classList.contains('menu-open')?'CLOSE':'MENU'})}
$$('.navlinks a').forEach(a=>a.addEventListener('click',()=>document.body.classList.remove('menu-open')));

// Hero HUD
const hero=$('.hero'); if(hero){const hud=document.createElement('div');hud.className='hud';hud.innerHTML='<span class="tl">CTX / SYSTEM 01<br>DESIGN ENGINE</span><span class="tr">MUMBAI / INDIA<br>DESIGN • MANUFACTURE • EXECUTE</span><span class="bl">ARCHITECTURE / INTERIORS<br>CUSTOM FABRICATION</span><span class="br">01 — 06<br>SCROLL TO EXPLORE</span><span class="cross"></span>';hero.appendChild(hud)}

// Three.js cinematic hero
const canvas=$('#hero-canvas');
if(canvas&&!reduce){const script=document.createElement('script');script.type='module';script.textContent=`
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js';
const canvas=document.querySelector('#hero-canvas'); const scene=new THREE.Scene();
scene.fog=new THREE.FogExp2(0x030303,.045);
const camera=new THREE.PerspectiveCamera(42,innerWidth/innerHeight,.1,100);camera.position.set(0,.15,8.5);
const renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:true,powerPreference:'high-performance'});renderer.setPixelRatio(Math.min(devicePixelRatio,1.7));renderer.setSize(innerWidth,innerHeight);renderer.outputColorSpace=THREE.SRGBColorSpace;
const root=new THREE.Group();scene.add(root); root.rotation.x=-.08;
const gold=new THREE.MeshPhysicalMaterial({color:0xd8b45f,metalness:1,roughness:.18,clearcoat:1,clearcoatRoughness:.12,emissive:0x3b2405,emissiveIntensity:.55});
const dark=new THREE.MeshStandardMaterial({color:0x11100e,metalness:.9,roughness:.25});
// Architectural portal
const portal=new THREE.Group(); root.add(portal);
const beams=[[0,2.15,0,5.2,.045,.045],[0,-2.15,0,5.2,.045,.045],[-2.55,0,0,.045,4.3,.045],[2.55,0,0,.045,4.3,.045]];
beams.forEach(([x,y,z,w,h,d])=>{const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),gold);m.position.set(x,y,z);portal.add(m)});
for(let i=0;i<7;i++){const x=-2.1+i*.7;const m=new THREE.Mesh(new THREE.BoxGeometry(.018,4.1,.018),new THREE.MeshBasicMaterial({color:0xd8b45f,transparent:true,opacity:.22-i*.018}));m.position.x=x;portal.add(m)}
// Orbiting rings
for(let i=0;i<4;i++){const r=new THREE.Mesh(new THREE.TorusGeometry(.8+i*.34,.018,16,96),gold);r.position.set(0,0,-.5-i*.25);r.rotation.set(Math.PI/2+(i*.2),i*.35,0);portal.add(r)}
// Central abstract volume
const core=new THREE.Mesh(new THREE.IcosahedronGeometry(1.05,2),dark);core.position.z=-.55;portal.add(core);
const wire=new THREE.Mesh(new THREE.IcosahedronGeometry(1.16,2),new THREE.MeshBasicMaterial({color:0xd8b45f,wireframe:true,transparent:true,opacity:.26}));wire.position.copy(core.position);portal.add(wire);
// particles
const count=1500, pos=new Float32Array(count*3), vel=[];for(let i=0;i<count;i++){const r=4+Math.random()*8,a=Math.random()*Math.PI*2,b=(Math.random()-.5)*2;pos[i*3]=Math.cos(a)*r;pos[i*3+1]=b*r*.55;pos[i*3+2]=(Math.random()-.5)*10;vel.push(.1+Math.random()*.4)}
const pg=new THREE.BufferGeometry();pg.setAttribute('position',new THREE.BufferAttribute(pos,3));const points=new THREE.Points(pg,new THREE.PointsMaterial({color:0xd8b45f,size:.018,transparent:true,opacity:.65,sizeAttenuation:true}));scene.add(points);
scene.add(new THREE.AmbientLight(0x9c835c,.7));const key=new THREE.PointLight(0xe8c879,28,15);key.position.set(3,3,5);scene.add(key);const rim=new THREE.PointLight(0x8fffea,10,12);rim.position.set(-4,-2,2);scene.add(rim);
let mx=0,my=0,scroll=0;addEventListener('pointermove',e=>{mx=(e.clientX/innerWidth-.5);my=(e.clientY/innerHeight-.5)});addEventListener('scroll',()=>scroll=scrollY,{passive:true});
const clock=new THREE.Clock();function tick(){const t=clock.getElapsedTime();portal.rotation.y+=(mx*.28-portal.rotation.y)*.025;portal.rotation.x+=(-my*.18+Math.sin(t*.3)*.025-portal.rotation.x)*.025;portal.position.y+=(-scroll*.0008-portal.position.y)*.02;wire.rotation.x=t*.08;wire.rotation.y=t*.14;core.rotation.x=t*.12;core.rotation.y=-t*.09;points.rotation.y=t*.012;key.position.x=2.5+Math.sin(t*.8)*1.2;renderer.render(scene,camera);requestAnimationFrame(tick)}tick();
addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight)});
`;document.body.appendChild(script)}

// GSAP cinematic scroll choreography
const s1=document.createElement('script'),s2=document.createElement('script');s1.src='https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/gsap.min.js';s2.src='https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/ScrollTrigger.min.js';
s2.onload=()=>{if(!window.gsap||!window.ScrollTrigger)return;gsap.registerPlugin(ScrollTrigger);
  gsap.utils.toArray('.reveal').forEach((el,i)=>gsap.fromTo(el,{autoAlpha:0,y:70,filter:'blur(10px)'},{autoAlpha:1,y:0,filter:'blur(0px)',duration:1.15,delay:(i%3)*.04,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 84%',once:true}}));
  gsap.utils.toArray('.image-stage').forEach(sec=>{const img=sec.querySelector('img');if(img)gsap.fromTo(img,{scale:1.18,yPercent:-5},{scale:1,yPercent:8,ease:'none',scrollTrigger:{trigger:sec,start:'top bottom',end:'bottom top',scrub:1}})});
  gsap.utils.toArray('.card,.pillar,.process-item,.testimonial').forEach((el,i)=>gsap.fromTo(el,{y:40,opacity:0},{y:0,opacity:1,duration:.8,delay:(i%4)*.05,scrollTrigger:{trigger:el,start:'top 90%',once:true}}));
  gsap.utils.toArray('.page-hero h1').forEach(el=>gsap.fromTo(el,{y:80,opacity:0,filter:'blur(14px)'},{y:0,opacity:1,filter:'blur(0)',duration:1.2,ease:'power4.out',delay:.15}));
};document.head.appendChild(s1);document.head.appendChild(s2);
})();
