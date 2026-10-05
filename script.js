// ==========================================
// DATA (replace image/url values with S3 URLs later)
// ==========================================
const missions = [
 {name:"Chandrayaan-3",country:"India",year:2023,date:"14 JUL 2023",destination:"Moon",type:"Lunar Exploration",status:"Successful",tag:["lunar","india"],image:"",grad:"#1e293b,#6366f1",
  description:"ISRO's lunar mission comprising the Vikram lander and Pragyan rover, designed to demonstrate a safe soft landing near the Moon's south pole.",
  achievements:["First soft landing near the lunar south pole","Made India the 4th nation to soft-land on the Moon","In-situ measurements of lunar surface temperature"]},
 {name:"Mangalyaan",country:"India",year:2013,date:"05 NOV 2013",destination:"Mars",type:"Mars Exploration",status:"Completed",tag:["mars","india"],image:"",grad:"#7f1d1d,#ea580c",
  description:"India's Mars Orbiter Mission, a technology demonstrator that studied the Martian surface, atmosphere and morphology.",
  achievements:["First Asian mission to reach Mars orbit","Succeeded on India's first attempt","Cost-efficient interplanetary mission"]},
 {name:"James Webb Space Telescope",country:"International",year:2021,date:"25 DEC 2021",destination:"Deep Space",type:"Space Observatory",status:"Active",tag:["telescope"],image:"",grad:"#312e81,#a855f7",
  description:"A large infrared space observatory studying early galaxies, exoplanet atmospheres and star formation from the Sun-Earth L2 point.",
  achievements:["Observing some of the earliest galaxies","Detailed exoplanet atmosphere spectra","Largest and most powerful space telescope launched"]},
 {name:"Mars Perseverance Rover",country:"USA",year:2020,date:"30 JUL 2020",destination:"Mars",type:"Mars Exploration",status:"Active",tag:["mars","usa"],image:"",grad:"#7c2d12,#f59e0b",
  description:"NASA's rover exploring Jezero Crater, searching for signs of ancient microbial life and caching rock samples.",
  achievements:["Collecting samples for possible return to Earth","Produced oxygen from Martian CO2 (MOXIE)","Deployed the Ingenuity helicopter"]}
];
const files=[
 {icon:"📄",name:"Chandrayaan-3 Mission Report",type:"REPORT",url:"#"},
 {icon:"🖼️",name:"Lunar Surface Image",type:"IMAGE",url:"#"},
 {icon:"📊",name:"Mission Telemetry Dataset",type:"DATASET",url:"#"},
 {icon:"📄",name:"JWST Observation Report",type:"REPORT",url:"#"},
 {icon:"📊",name:"Mars Exploration Dataset",type:"DATASET",url:"#"}];
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];

// ==========================================
// TOAST NOTIFICATIONS
// ==========================================
function toast(msg){const t=document.createElement("div");t.className="toast";t.textContent=msg;$("#toasts").append(t);
 setTimeout(()=>{t.classList.add("out");setTimeout(()=>t.remove(),400)},3000)}

// ==========================================
// LOADING SCREEN
// ==========================================
let p=0;const lt=setInterval(()=>{p=Math.min(100,p+Math.random()*12);$("#pct").textContent=Math.floor(p)+"%";$("#lbar").style.width=p+"%";
 if(p>=100){clearInterval(lt);setTimeout(()=>$("#loader").classList.add("done"),400)}},180);

// ==========================================
// MISSION RENDERING + SEARCH + FILTERS
// ==========================================
const FILTERS=["ALL","LUNAR","MARS","TELESCOPE","INDIA","USA","ACTIVE","COMPLETED"];
let activeF="ALL";
function matchF(m){const f=activeF.toLowerCase();if(f==="all")return true;
 if(f==="active")return m.status==="Active";if(f==="completed")return ["Completed","Successful"].includes(m.status);return m.tag.includes(f)}
function renderMissions(){
 const q=$("#search").value.trim().toLowerCase();
 const list=missions.map((m,i)=>({m,i})).filter(({m})=>matchF(m)&&(!q||[m.name,m.country,m.year,m.destination,m.type,m.status].join(" ").toLowerCase().includes(q)));
 $("#grid").innerHTML=list.map(({m,i},n)=>`
  <article class="card glass" style="animation-delay:${n*.08}s">
   <div class="img" style="background:linear-gradient(135deg,${m.grad})"><i style="background-image:url('${m.image}'),linear-gradient(135deg,${m.grad})"></i></div>
   <span class="st"><i class="dot"></i>${m.status.toUpperCase()}</span>
   <div class="body"><h4>${m.name}</h4>
    <div class="meta"><span>${m.country}</span><span>${m.year}</span><span>${m.destination}</span><span>${m.type}</span></div>
    <p>${m.description}</p>
    <button class="btn pri" data-view="${i}">VIEW MISSION</button><button class="btn" data-data="${i}">VIEW DATA</button></div>
  </article>`).join("");
 $("#empty").hidden=list.length>0;
}
$("#filters").innerHTML=FILTERS.map(f=>`<button class="fbtn ${f==="ALL"?"on":""}">${f}</button>`).join("");
$("#filters").addEventListener("click",e=>{const b=e.target.closest(".fbtn");if(!b)return;
 $$(".fbtn",$("#filters")).forEach(x=>x.classList.remove("on"));b.classList.add("on");activeF=b.textContent;renderMissions()});
$("#search").addEventListener("input",renderMissions);
renderMissions();

// ==========================================
// MODAL
// ==========================================
const modal=$("#modal");
function openModal(html){$("#mbody").innerHTML=html;modal.hidden=false;requestAnimationFrame(()=>modal.classList.add("open"));$("#mclose").focus()}
function closeModal(){modal.classList.remove("open");setTimeout(()=>modal.hidden=true,300)}
$("#mclose").onclick=closeModal;modal.addEventListener("click",e=>{if(e.target===modal)closeModal()});
document.addEventListener("keydown",e=>{if(e.key==="Escape"&&!modal.hidden)closeModal()});
function missionModal(i){const m=missions[i];
 openModal(`<div class="mimg" style="background-image:url('${m.image}'),linear-gradient(135deg,${m.grad})"></div><div class="mc"><h3>${m.name.toUpperCase()}</h3><p>${m.description}</p>
 <div class="facts"><div><span>LAUNCH</span>${m.date}</div><div><span>DESTINATION</span>${m.destination.toUpperCase()}</div><div><span>STATUS</span>${m.status.toUpperCase()}</div><div><span>COUNTRY</span>${m.country}</div><div><span>TYPE</span>${m.type}</div></div>
 <span class="facts"><span>KEY ACHIEVEMENTS</span></span><ul>${m.achievements.map(a=>`<li>${a}</li>`).join("")}</ul>
 <p style="margin-top:14px"><span class="note">TIMELINE: Launched ${m.year} → Status: ${m.status}</span></p></div>`)}
function previewModal(title,icon,type){
 openModal(`<div class="mc"><h3>${title}</h3><div class="prev">${icon}</div><p class="note">Placeholder preview (${type}). Later this will load the file from an Amazon S3 URL.</p></div>`);toast("Mission data loaded successfully.")}
$("#grid").addEventListener("click",e=>{const v=e.target.closest("[data-view]"),d=e.target.closest("[data-data]");
 if(v)missionModal(v.dataset.view);
 if(d){const m=missions[d.dataset.data];previewModal(m.name+" — Data","📊","dataset")}});

// ==========================================
// DATA VAULT
// ==========================================
let ft="ALL";
function renderFiles(){const q=$("#fsearch").value.toLowerCase();
 $("#files").innerHTML=files.map((f,i)=>({f,i})).filter(({f})=>(ft==="ALL"||f.type===ft)&&f.name.toLowerCase().includes(q)).map(({f,i})=>
 `<div class="glass file"><span class="badge">${f.type}</span><div class="ic">${f.icon}</div><h5>${f.name}</h5>
  <button class="btn" data-fv="${i}">VIEW</button><button class="btn pri" data-fd="${i}">DOWNLOAD</button></div>`).join("")||`<p class="note">No files match.</p>`}
$("#ffilters").innerHTML=["ALL","REPORT","IMAGE","DATASET"].map(f=>`<button class="fbtn ${f==="ALL"?"on":""}">${f}</button>`).join("");
$("#ffilters").addEventListener("click",e=>{const b=e.target.closest(".fbtn");if(!b)return;$$(".fbtn",$("#ffilters")).forEach(x=>x.classList.remove("on"));b.classList.add("on");ft=b.textContent;renderFiles()});
$("#fsearch").addEventListener("input",renderFiles);
$("#files").addEventListener("click",e=>{const v=e.target.closest("[data-fv]"),d=e.target.closest("[data-fd]");
 if(v){const f=files[v.dataset.fv];previewModal(f.name,f.icon,f.type)}
 if(d){const f=files[d.dataset.fd];toast("Download initialized.");
  const a=document.createElement("a");a.href="data:text/plain,"+encodeURIComponent("Placeholder for "+f.name+". Replace with an S3 URL.");a.download=f.name.replace(/\s+/g,"_")+".txt";a.click()}});
$("#add").onclick=()=>{toast("Cloud upload integration will be connected to Amazon S3.");
 openModal(`<div class="mc"><h3>CLOUD UPLOAD</h3><p>Cloud upload endpoint will be connected to Amazon S3. No files are uploaded at this stage.</p></div>`)};
renderFiles();

// ==========================================
// ARCHITECTURE TOOLTIPS
// ==========================================
$$(".node").forEach(n=>{const t=$("#atip");
 n.addEventListener("mouseenter",()=>{t.innerHTML=n.dataset.tip;t.style.opacity=1});
 n.addEventListener("mousemove",e=>{const r=$(".arch").getBoundingClientRect();t.style.left=e.clientX-r.left+16+"px";t.style.top=e.clientY-r.top+16+"px"});
 n.addEventListener("mouseleave",()=>t.style.opacity=0)});

// ==========================================
// COUNTERS + SCROLL ANIMATIONS
// ==========================================
function count(el){const n=+el.dataset.n,s=el.dataset.s||"",t0=performance.now();
 (function f(t){const k=Math.min(1,(t-t0)/1600);el.textContent=Math.floor(n*k)+(k===1?s:"");if(k<1)requestAnimationFrame(f)})(t0)}
const io=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;e.target.classList.add("in");
 $$("[data-n]",e.target).forEach(count);$$(".fill",e.target).forEach(b=>b.style.width=b.dataset.w+"%");io.unobserve(e.target)}),{threshold:.2});
$$(".reveal,.tl").forEach(el=>io.observe(el));

// ==========================================
// TIMELINE (built from mission data)
// ==========================================
$("#tl").innerHTML=[...missions].sort((a,b)=>a.year-b.year).map((m,i)=>`<div class="ti glass" style="transition-delay:${i*.35}s"><b>${m.year}</b><h4>${m.name}</h4><p>${m.type}</p></div>`).join("");

// ==========================================
// COSMIC MAP
// ==========================================
(function(){const svg=$("#msvg"),tip=$("#mtip");let h="";
 for(let i=0;i<70;i++)h+=`<circle cx="${Math.random()*800}" cy="${Math.random()*400}" r="${Math.random()*1.5+.3}" fill="#fff" opacity="${Math.random()*.7+.2}"/>`;
 h+=`<polyline points="60,60 140,110 210,70 290,130" fill="none" stroke="rgba(139,92,246,.4)"/><polyline points="600,50 670,100 740,60" fill="none" stroke="rgba(34,211,238,.35)"/>`;
 h+=`<ellipse cx="400" cy="200" rx="280" ry="120" fill="none" stroke="rgba(34,211,238,.2)" stroke-dasharray="4 6"><animate attributeName="stroke-dashoffset" from="0" to="-100" dur="8s" repeatCount="indefinite"/></ellipse>`;
 const objs=[{x:400,y:200,r:30,c:"#3b82f6",t:"EARTH<br>Home of the mission control"},
  {x:250,y:120,r:12,c:"#cbd5e1",t:"MOON<br>Distance: ~384,400 km<br>Associated Mission: Chandrayaan-3"},
  {x:620,y:270,r:18,c:"#ef4444",t:"MARS<br>Associated Missions:<br>Mangalyaan<br>Perseverance"},
  {x:690,y:110,r:9,c:"#a855f7",t:"JWST<br>Deep-space observatory at L2"}];
 objs.forEach(o=>h+=`<g class="mo" data-t="${o.t}"><circle cx="${o.x}" cy="${o.y}" r="${o.r+8}" fill="${o.c}" opacity=".15"/><circle cx="${o.x}" cy="${o.y}" r="${o.r}" fill="${o.c}"/></g>`);
 svg.innerHTML=h;svg.style.animation="float 12s ease-in-out infinite";
 $$(".mo",svg).forEach(g=>{g.addEventListener("mouseenter",()=>{tip.innerHTML=g.dataset.t;tip.style.opacity=1});
  g.addEventListener("mousemove",e=>{const r=$("#cmap").getBoundingClientRect();tip.style.left=e.clientX-r.left+14+"px";tip.style.top=e.clientY-r.top+14+"px"});
  g.addEventListener("mouseleave",()=>tip.style.opacity=0)})})();

// ==========================================
// STARFIELD (canvas, lightweight)
// ==========================================
const cv=$("#stars"),cx=cv.getContext("2d");let S=[],mx=0,my=0;
function sizeC(){cv.width=innerWidth;cv.height=innerHeight;S=Array.from({length:innerWidth<700?70:140},()=>({x:Math.random()*cv.width,y:Math.random()*cv.height,r:Math.random()*1.4+.2,v:Math.random()*.15+.03}))}
sizeC();addEventListener("resize",sizeC);
(function draw(){cx.clearRect(0,0,cv.width,cv.height);cx.fillStyle="#fff";
 S.forEach(s=>{s.y-=s.v;if(s.y<0)s.y=cv.height;cx.globalAlpha=.3+s.r/2;cx.beginPath();cx.arc(s.x+mx*s.r*8,s.y+my*s.r*8,s.r,0,6.3);cx.fill()});
 requestAnimationFrame(draw)})();

// ==========================================
// CURSOR + PARALLAX + CARD TILT
// ==========================================
const dot=$("#cur-dot"),ring=$("#cur-ring"),glow=$("#glow"),vis=$(".visual");let rx=0,ry=0,tx=0,ty=0;
addEventListener("mousemove",e=>{tx=e.clientX;ty=e.clientY;mx=e.clientX/innerWidth-.5;my=e.clientY/innerHeight-.5;
 dot.style.transform=`translate(${tx}px,${ty}px)`;glow.style.transform=`translate(${tx-260}px,${ty-260}px)`;
 vis.style.transform=`translate(${mx*30}px,${my*30}px) rotateY(${mx*12}deg) rotateX(${-my*12}deg)`;
 const c=e.target.closest(".card");if(c){const r=c.getBoundingClientRect();
  c.style.transform=`translateY(-8px) perspective(700px) rotateY(${((e.clientX-r.left)/r.width-.5)*8}deg) rotateX(${-((e.clientY-r.top)/r.height-.5)*8}deg)`}});
document.addEventListener("mouseout",e=>{const c=e.target.closest&&e.target.closest(".card");if(c&&!c.contains(e.relatedTarget))c.style.transform=""});
(function follow(){rx+=(tx-rx)*.16;ry+=(ty-ry)*.16;ring.style.transform=`translate(${rx}px,${ry}px)`;requestAnimationFrame(follow)})();
document.addEventListener("mouseover",e=>ring.classList.toggle("hov",!!e.target.closest("a,button,input,.node,.scanner,.mo")));

// ==========================================
// BUTTON RIPPLE + data-toast
// ==========================================
document.addEventListener("click",e=>{const b=e.target.closest(".btn");if(!b)return;
 const r=b.getBoundingClientRect(),s=document.createElement("span");s.className="ripple";
 s.style.cssText=`width:60px;height:60px;left:${e.clientX-r.left-30}px;top:${e.clientY-r.top-30}px`;b.append(s);setTimeout(()=>s.remove(),600);
 if(b.dataset.toast)toast(b.dataset.toast)});

// ==========================================
// NAVIGATION + SCROLL PROGRESS
// ==========================================
$("#burger").onclick=()=>$("#menu").classList.toggle("open");
$$("#menu a").forEach(a=>a.addEventListener("click",()=>$("#menu").classList.remove("open")));
const secs=["home","missions","vault","architecture","timeline","about"].map(id=>$("#"+id));
addEventListener("scroll",()=>{const h=document.documentElement;$("#prog").style.width=scrollY/(h.scrollHeight-innerHeight)*100+"%";
 let cur="home";secs.forEach(s=>{if(s.getBoundingClientRect().top<innerHeight*.4)cur=s.id});
 $$("#menu a").forEach(a=>a.classList.toggle("active",a.getAttribute("href")==="#"+cur))},{passive:true});