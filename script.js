/* eslint-disable no-restricted-globals */
/* eslint-disable prefer-template */
/* eslint-disable no-plusplus */
/* eslint-disable no-use-before-define */
const $ = (s, root=document) => root.querySelector(s);
const $$ = (s, root=document) => [...root.querySelectorAll(s)];
const screens = $$(".screen");
const progressBar = $("#progressBar");
let currentIndex = 0;
let popped = 0;
// eslint-disable-next-line no-unused-vars
let letterOpened = false;
const name = "Surya";
// eslint-disable-next-line no-return-assign
$$("[data-name]").forEach(el => el.textContent = name);

function goTo(id) {
  const target = document.getElementById(id);
  if (!target) return;
  screens.forEach(s => s.classList.toggle("active", s === target));
  currentIndex = screens.indexOf(target);
  progressBar.style.width = `${(currentIndex/(screens.length-1))*100}%`;
  window.scrollTo({top:0, behavior:"smooth"});
  if (id === "finalScreen") celebration();
}
function toast(message) {
  const el = $("#toast");
  el.textContent = message; el.classList.add("show");
  clearTimeout(toast.timer); toast.timer = setTimeout(()=>el.classList.remove("show"), 2200);
}
$("#unwrap").addEventListener("click", ()=>goTo("heartScreen"));
$("#heartButton").addEventListener("click", e=>{
  e.currentTarget.classList.add("clicked");
  setTimeout(()=>goTo("titleScreen"), 450);
});
$$("[data-next]").forEach(btn=>btn.addEventListener("click", ()=>goTo(btn.dataset.next)));

function blowOut() {
  if ($("#cake").classList.contains("blow-out")) return;
  $("#cake").classList.add("blow-out");
  $(".flame").style.display = "none";
  $("#cakeCaption").textContent = "Wish made. Let the magic begin ✨";
  $("#blowHint").textContent = "Your wish is on its way ♥";
  $("#blowButton").classList.add("hidden");
  $("#afterCake").classList.remove("hidden");
  confetti(55);
  toast("May your birthday wish come true!");
}
$("#blowButton").addEventListener("click", blowOut);
$("#cakeTap").addEventListener("click", blowOut);

$$(".balloon").forEach(balloon=>balloon.addEventListener("click", ()=>{
  if (balloon.classList.contains("popped")) return;
  balloon.classList.add("popped");
  $("#balloonMessage").textContent = balloon.dataset.message;
  popped++; $("#poppedCount").textContent = popped;
  if (popped === 5) {
    $("#afterBalloons").classList.remove("hidden");
    toast("All five little reminders are yours!");
    confetti(30);
  }
}));
$$(".wish-star").forEach(star=>star.addEventListener("click", ()=>{
  $$(".wish-star").forEach(s=>s.classList.remove("selected"));
  star.classList.add("selected");
  $("#wishMessage").textContent = star.dataset.wish;
  $("#afterWish").classList.remove("hidden");
  confetti(18);
}));

$("#openLetter").addEventListener("click", ()=>{
  $("#openLetter").classList.add("open");
  $("#letter").classList.remove("hidden");
  $("#afterLetter").classList.remove("hidden");
  letterOpened = true;
});
$("#closeLetter").addEventListener("click", ()=>{
  $("#letter").classList.add("hidden");
  $("#openLetter").classList.remove("open");
});
function confetti(count=40) {
  const host=$("#fireworks");
  const colors=["#f5cf79","#f28ca8","#c4a1ed","#fff0d8","#f4a66b"];
  for(let i=0;i<count;i++){
    const piece=document.createElement("i");
    piece.className="confetti";
    piece.style.left=`${Math.random()*100}%`;
    // eslint-disable-next-line prefer-template
    piece.style.top=(-10-Math.random()*40)+"px";
    piece.style.background=colors[Math.floor(Math.random()*colors.length)];
    piece.style.animationDelay=(Math.random()*.6)+"s";
    piece.style.transform=`rotate(${Math.random()*180}deg)`;
    host.appendChild(piece);
    setTimeout(()=>piece.remove(),3200);
  }
}
function celebration(){confetti(100)}
$("#replay").addEventListener("click", ()=>{
  popped=0; letterOpened=false;
  $("#poppedCount").textContent="0";
  $("#balloonMessage").textContent="Choose a balloon to reveal a little note ♡";
  $$(".balloon").forEach(b=>b.classList.remove("popped"));
  $$(".wish-star").forEach(s=>s.classList.remove("selected"));
  $("#wishMessage").textContent="Your wish is tucked inside a star.";
  $("#afterWish").classList.add("hidden");
  $("#afterBalloons").classList.add("hidden");
  $("#letter").classList.add("hidden"); $("#openLetter").classList.remove("open");
  $("#cake").classList.remove("blow-out"); $(".flame").style.display="";
  $("#cakeCaption").textContent="A cake, a candle, and a wish just for you.";
  $("#blowHint").textContent="Close your eyes, make a wish, then tap the candle ✨";
  $("#blowButton").classList.remove("hidden"); $("#afterCake").classList.add("hidden");
  goTo("intro");
});

// Gentle animated star field; scales with the device and pauses naturally in background tabs.
const canvas=$("#stars"); const ctx=canvas.getContext("2d");
let stars=[];
function resizeStars(){
  const dpr=Math.min(window.devicePixelRatio||1,2);
  // eslint-disable-next-line no-restricted-globals
  canvas.width=innerWidth*dpr; canvas.height=innerHeight*dpr;
  // eslint-disable-next-line no-restricted-globals
  canvas.style.width=innerWidth+"px"; canvas.style.height=innerHeight+"px";
  ctx.setTransform(dpr,0,0,dpr,0,0);
  stars=Array.from({length:Math.min(120,Math.floor(innerWidth/9))},()=>({
    x:Math.random()*innerWidth,y:Math.random()*innerHeight,r:Math.random()*1.4+.25,
    a:Math.random()*.6+.15,phase:Math.random()*Math.PI*2,speed:Math.random()*.018+.004
  }));
}
function drawStars(){
  ctx.clearRect(0,0,innerWidth,innerHeight);
  for(const s of stars){s.phase+=s.speed;const alpha=s.a*(.65+.35*Math.sin(s.phase));ctx.beginPath();ctx.arc(s.x,s.y,s.r,0,Math.PI*2);ctx.fillStyle=`rgba(255,239,235,${alpha})`;ctx.fill();}
  requestAnimationFrame(drawStars);
}
resizeStars();drawStars();window.addEventListener("resize",resizeStars);
