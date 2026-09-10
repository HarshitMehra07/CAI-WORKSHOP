<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
<title>The Narrator Knows</title>
<style>
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&family=JetBrains+Mono:wght@400;500;700&display=swap');

:root{
  --bg: #0a0a10;
  --panel: #14121e;
  --panel-edge: #2a2438;
  --accent: #f2b705;
  --accent-dim: #8a6e10;
  --danger: #ff4d5e;
  --player: #5ee6d0;
  --muted: #8a8697;
  --text: #ece9f5;
}

*{ box-sizing: border-box; }

html,body{
  margin:0; padding:0; width:100%; height:100%;
  background: var(--bg);
  color: var(--text);
  font-family: 'JetBrains Mono', monospace;
  overflow: hidden;
  -webkit-tap-highlight-color: transparent;
  user-select: none;
}

#app{
  position: relative;
  width: 100%;
  height: 100vh;
  min-height: 480px;
  display: flex;
  align-items: center;
  justify-content: center;
  background:
    radial-gradient(ellipse at 50% -10%, rgba(242,183,5,0.08), transparent 60%),
    var(--bg);
}

.screen{
  width: 100%;
  max-width: 920px;
  padding: 24px;
  display: none;
  flex-direction: column;
  align-items: center;
  text-align: center;
}
.screen.active{ display: flex; }

.eyebrow{
  font-size: 11px;
  letter-spacing: 3px;
  color: var(--accent-dim);
  text-transform: uppercase;
  margin-bottom: 10px;
}

h1.title{
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 700;
  font-size: clamp(28px, 5vw, 48px);
  margin: 0 0 6px 0;
  letter-spacing: -0.5px;
  color: #fff;
}
.title .glow{ color: var(--accent); text-shadow: 0 0 24px rgba(242,183,5,0.5); }

.tagline{
  font-style: italic;
  color: var(--muted);
  font-size: 14px;
  margin-bottom: 28px;
}

.eye{
  width: 64px; height: 40px;
  margin-bottom: 18px;
  position: relative;
}
.eye svg{ width:100%; height:100%; }

.btn{
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 700;
  font-size: 15px;
  background: var(--accent);
  color: #17140a;
  border: none;
  padding: 14px 34px;
  border-radius: 3px;
  cursor: pointer;
  letter-spacing: 0.5px;
  transition: transform 0.12s ease, box-shadow 0.12s ease;
  box-shadow: 0 0 0 rgba(242,183,5,0);
}
.btn:hover{ transform: translateY(-2px); box-shadow: 0 6px 18px rgba(242,183,5,0.25); }
.btn:active{ transform: translateY(0px); }
.btn.secondary{
  background: transparent;
  color: var(--text);
  border: 1px solid var(--panel-edge);
}
.btn.secondary:hover{ border-color: var(--accent-dim); }
.btn.danger{ background: var(--danger); color: #200; }

.controls-hint{
  margin-top: 22px;
  font-size: 11.5px;
  color: var(--muted);
  line-height: 1.8;
}
.controls-hint kbd{
  background: var(--panel);
  border: 1px solid var(--panel-edge);
  border-radius: 3px;
  padding: 2px 6px;
  font-family: 'JetBrains Mono', monospace;
  color: var(--text);
}

/* GAME SCREEN */
#game-screen{ padding: 0; max-width: 980px; width: 100%; }
.game-wrap{
  position: relative;
  width: 100%;
  aspect-ratio: 900 / 440;
  background: #050508;
  border: 1px solid var(--panel-edge);
  border-radius: 4px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0,0,0,0.5);
}
canvas#game{ width:100%; height:100%; display:block; image-rendering: pixelated; }

.hud-top{
  position:absolute; top:0; left:0; right:0;
  display:flex; justify-content: space-between; align-items:center;
  padding: 8px 12px;
  font-size: 10.5px;
  color: var(--muted);
  letter-spacing: 1px;
  text-transform: uppercase;
  background: linear-gradient(to bottom, rgba(0,0,0,0.55), transparent);
  pointer-events:none;
  z-index:5;
}
.hud-top .deaths{ color: var(--danger); }

.narrator-bar{
  position:absolute; left:0; right:0; bottom:0;
  min-height: 54px;
  background: linear-gradient(to top, rgba(10,9,16,0.96), rgba(10,9,16,0.75));
  border-top: 1px solid var(--panel-edge);
  display:flex; align-items:center;
  padding: 10px 14px;
  gap: 10px;
  z-index: 6;
}
.narrator-bar .tag{
  font-family:'Space Grotesk', sans-serif;
  font-weight:700;
  font-size: 10px;
  letter-spacing: 1.5px;
  color: var(--accent);
  text-transform: uppercase;
  flex-shrink: 0;
  opacity: 0.85;
}
.narrator-bar .line{
  font-size: 13px;
  color: var(--text);
  line-height: 1.4;
}
.narrator-bar .line .cursor{
  display:inline-block;
  width:7px; height:13px;
  background: var(--accent);
  margin-left:2px;
  vertical-align: -2px;
  animation: blink 0.9s steps(1) infinite;
}
@keyframes blink{ 50%{ opacity:0; } }

/* prompt overlay for yes/no choice */
.prompt-overlay{
  position:absolute; inset:0;
  background: rgba(5,4,8,0.72);
  display:none;
  align-items:center; justify-content:center;
  z-index: 20;
  flex-direction: column;
  gap: 16px;
  text-align:center;
  padding: 20px;
}
.prompt-overlay.active{ display:flex; }
.prompt-overlay .q{
  font-size: 16px;
  max-width: 460px;
}
.prompt-overlay .row{ display:flex; gap: 14px; }

/* flash / boss fx */
.flash-fx{
  position:absolute; inset:0;
  background: #fff;
  opacity:0;
  pointer-events:none;
  z-index: 15;
  mix-blend-mode: difference;
}
.fake-gameover{
  position:absolute; inset:0;
  background:#000;
  display:none;
  align-items:center;
  justify-content:center;
  z-index: 18;
  font-family:'Space Grotesk', sans-serif;
  font-size: clamp(22px,5vw,40px);
  font-weight:700;
  color: var(--danger);
  letter-spacing: 3px;
}

/* touch controls */
.touch-ctrls{
  position:absolute; bottom: 62px; left:0; right:0;
  display:flex; justify-content: space-between;
  padding: 0 14px;
  z-index: 10;
  pointer-events:none;
}
.touch-ctrls.hidden{ display:none; }
.touch-group{ display:flex; gap:10px; pointer-events:auto; }
.tbtn{
  width:52px; height:52px;
  border-radius: 50%;
  background: rgba(20,18,30,0.7);
  border: 1px solid var(--panel-edge);
  color: var(--text);
  font-size: 20px;
  display:flex; align-items:center; justify-content:center;
  backdrop-filter: blur(2px);
}
.tbtn:active{ background: rgba(242,183,5,0.25); border-color: var(--accent); }

.mini-stats{
  margin-top: 14px;
  display:flex; gap: 18px; flex-wrap:wrap; justify-content:center;
  font-size: 11px;
  color: var(--muted);
}
.mini-stats b{ color: var(--text); }

footer.note{
  margin-top: 22px;
  font-size: 10.5px;
  color: var(--panel-edge);
}
</style>
</head>
<body>
<div id="app">

  <!-- START SCREEN -->
  <div class="screen active" id="start-screen">
    <div class="eyebrow">a small platformer that pays attention</div>
    <div class="eye" id="eyeSvgHolder"></div>
    <h1 class="title">THE <span class="glow">NARRATOR</span> KNOWS</h1>
    <div class="tagline">"The game is watching&hellip; and it has opinions."</div>
    <button class="btn" id="startBtn">Begin</button>
    <div class="controls-hint">
      <kbd>&larr;</kbd> <kbd>&rarr;</kbd> or <kbd>A</kbd> <kbd>D</kbd> to move &nbsp;&middot;&nbsp; <kbd>Space</kbd> / <kbd>&uarr;</kbd> to jump<br>
      Play however you want. It's taking notes.
    </div>
  </div>

  <!-- GAME SCREEN -->
  <div class="screen" id="game-screen">
    <div class="game-wrap" id="gameWrap">
      <canvas id="game" width="900" height="440"></canvas>
      <div class="hud-top">
        <span id="hudZone">Zone: The Beginning</span>
        <span class="deaths">Deaths: <span id="hudDeaths">0</span></span>
      </div>
      <div class="touch-ctrls" id="touchCtrls">
        <div class="touch-group">
          <div class="tbtn" id="tLeft">&larr;</div>
          <div class="tbtn" id="tRight">&rarr;</div>
        </div>
        <div class="touch-group">
          <div class="tbtn" id="tJump">&uarr;</div>
        </div>
      </div>
      <div class="flash-fx" id="flashFx"></div>
      <div class="fake-gameover" id="fakeGameOver">GAME OVER</div>
      <div class="prompt-overlay" id="promptOverlay">
        <div class="q" id="promptQ">Would you like me to make it easier?</div>
        <div class="row">
          <button class="btn" id="promptYes">Yes</button>
          <button class="btn secondary" id="promptNo">No</button>
        </div>
      </div>
      <div class="narrator-bar">
        <span class="tag">Narrator</span>
        <span class="line" id="narratorLine">&nbsp;</span>
      </div>
    </div>
  </div>

  <!-- WIN SCREEN -->
  <div class="screen" id="win-screen">
    <div class="eyebrow">run complete</div>
    <h1 class="title">YOU OUTPLAYED <span class="glow">THE NARRATOR</span></h1>
    <div class="tagline" id="winLine">"You've learned every trick I have."</div>
    <div class="mini-stats" id="finalStats"></div>
    <button class="btn" id="againBtn" style="margin-top:24px;">Play Again</button>
    <footer class="note">Game Concept: "The Narrator Knows" &mdash; built in Claude</footer>
  </div>

</div>

<script>
(function(){

// ============================================================
// UTIL
// ============================================================
const $ = (id) => document.getElementById(id);
const clamp = (v,a,b)=>Math.max(a,Math.min(b,v));
const rand = (a,b)=>a+Math.random()*(b-a);
const choice = (arr)=>arr[Math.floor(Math.random()*arr.length)];

function rectsOverlap(a,b){
  return a.x < b.x+b.w && a.x+a.w > b.x && a.y < b.y+b.h && a.y+a.h > b.y;
}

// ============================================================
// SCREEN NAV
// ============================================================
function showScreen(id){
  document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
  $(id).classList.add('active');
}

// tiny eye icon (svg) for start screen, drawn once
$('eyeSvgHolder').innerHTML = `
<svg viewBox="0 0 64 40" xmlns="http://www.w3.org/2000/svg">
  <path d="M2 20 C 14 2, 50 2, 62 20 C 50 38, 14 38, 2 20 Z" fill="none" stroke="#f2b705" stroke-width="1.6" opacity="0.8"/>
  <circle cx="32" cy="20" r="8" fill="#f2b705" opacity="0.9"/>
  <circle cx="32" cy="20" r="3" fill="#0a0a10"/>
</svg>`;

// ============================================================
// NARRATOR SYSTEM
// ============================================================
const narratorEl = $('narratorLine');
let typeTimer = null;

function say(text, opts){
  opts = opts || {};
  clearInterval(typeTimer);
  narratorEl.innerHTML = '';
  let i = 0;
  const speed = opts.speed || 18;
  typeTimer = setInterval(()=>{
    if(i >= text.length){
      clearInterval(typeTimer);
      narratorEl.innerHTML = text + '<span class="cursor"></span>';
      return;
    }
    narratorEl.textContent = text.slice(0, i+1);
    i++;
  }, speed);
}

// line banks
const LINES = {
  intro: [
    "Oh good, another one.",
    "Let's see what kind of player you are."
  ],
  spikeAvoider: [
    "I've noticed you're quite afraid of spikes.",
    "Careful. Cautious. Predictable."
  ],
  rusher: [
    "Slow down. You're missing the point.",
    "Where's the fire?"
  ],
  idler: [
    "Thinking? That's new.",
    "Take your time. The floor won't."
  ],
  cornerChecker: [
    "You're the type to look for secrets.",
    "Checking every corner, are we?"
  ],
  death: [
    "Well, that happened.",
    "Bold strategy. Let's see if it works this time.",
    "That jump looked intentional... right?",
    "You really like pressing jump.",
    "I was going to help, but this is more entertaining."
  ],
  deathPrompt: "You keep dying. Would you like me to make it easier?",
  deathPromptYes: "Fantastic. Watch closely.",
  deathPromptNo: "Suit yourself. Don't say I didn't offer.",
  doorShy: [
    "That door isn't going anywhere. But it's not staying either.",
    "Rushing won't help you here."
  ],
  fakeSecret: "...there's nothing here. There was never anything here.",
  checkpoint: [
    "Fine. Keep going.",
    "You're still here. Impressive, in a small way.",
    "Don't get comfortable."
  ],
  bossIntro1: "You finally meet the narrator.",
  bossIntro2: "\"You've learned every trick I have.\"",
  bossIntro3: "Then...",
  bossStart: "Let's see how you like it from this side.",
  bossFlip: "Controls change.",
  bossGravity: "Gravity flips.",
  bossFake: "Fake game-over screens appear.",
  bossFinal: "The boss copies your own playstyle, forcing you to outsmart yourself.",
  win: "You've learned every trick I have."
};

let saidOnce = {};
function sayOnce(key, bank){
  if(saidOnce[key]) return false;
  saidOnce[key] = true;
  say(typeof bank === 'string' ? bank : choice(bank));
  return true;
}

// ============================================================
// GAME STATE / STATS
// ============================================================
const stats = {
  deaths: 0,
  jumpsOverSpikes: 0,
  spikeEncounters: 0,
  idleFlags: 0,
  cornerChecks: 0,
  rushFlags: 0,
  slowFlags: 0,
  startTime: 0,
  easierAccepted: false
};

// ============================================================
// LEVEL DEFINITION
// world coords, y=0 top, ground baseline around y=360
// ============================================================
const GROUND_Y = 360;
const WORLD_W = 3400;
const CANVAS_W = 900, CANVAS_H = 440;

// platforms: {x,y,w,h, type: 'solid'|'vanish'|'checkpoint-marker'}
// vanish platforms fade out if player idles nearby
function buildLevel(){
  const platforms = [];
  const spikes = [];
  const pits = []; // gaps in the ground (x1,x2)
  const secrets = []; // fake secret alcoves {x,y,w,h, triggered:false}
  const checkpoints = []; // {x, y}

  // ground base as segments, broken by pits
  // full ground from 0 to WORLD_W at GROUND_Y, height 80
  // we'll define pit gaps and build ground segments around them
  pits.push({x1: 560, x2: 660});
  pits.push({x1: 1180, x2: 1260});
  pits.push({x1: 2000, x2: 2120});
  pits.push({x1: 2680, x2: 2760});

  let cursor = 0;
  const sortedPits = pits.slice().sort((a,b)=>a.x1-b.x1);
  sortedPits.forEach(p=>{
    if(p.x1 > cursor){
      platforms.push({x:cursor, y:GROUND_Y, w:p.x1-cursor, h:200, type:'solid'});
    }
    cursor = p.x2;
  });
  platforms.push({x:cursor, y:GROUND_Y, w:WORLD_W-cursor, h:200, type:'solid'});

  // floating platforms
  platforms.push({x:820, y:270, w:110, h:18, type:'solid'});
  platforms.push({x:1000, y:210, w:90, h:18, type:'vanish'});
  platforms.push({x:1420, y:290, w:120, h:18, type:'solid'});
  platforms.push({x:1620, y:230, w:90, h:18, type:'vanish'});
  platforms.push({x:1800, y:290, w:90, h:18, type:'solid'});
  platforms.push({x:2260, y:280, w:110, h:18, type:'solid'});
  platforms.push({x:2440, y:220, w:90, h:18, type:'vanish'});
  platforms.push({x:2900, y:280, w:110, h:18, type:'solid'});
  platforms.push({x:3080, y:220, w:90, h:18, type:'vanish'});

  // spikes: {x,y,w,h}
  spikes.push({x:300, y:GROUND_Y-18, w:60, h:18});
  spikes.push({x:900, y:GROUND_Y-18, w:44, h:18});
  spikes.push({x:1500, y:GROUND_Y-18, w:70, h:18});
  spikes.push({x:2350, y:GROUND_Y-18, w:60, h:18});
  spikes.push({x:2560, y:GROUND_Y-18, w:44, h:18});
  spikes.push({x:3200, y:GROUND_Y-18, w:80, h:18});

  // secret alcoves — dead-end nooks tucked under/behind platforms
  secrets.push({x:1040, y:250, w:36, h:40, triggered:false, itemX:1058, itemY:260});
  secrets.push({x:2480, y:190, w:36, h:40, triggered:false, itemX:2498, itemY:200});

  // checkpoints (safe respawn spots along the way)
  checkpoints.push({x:60, y:GROUND_Y-60});
  checkpoints.push({x:760, y:GROUND_Y-60});
  checkpoints.push({x:1360, y:GROUND_Y-60});
  checkpoints.push({x:2180, y:GROUND_Y-60});
  checkpoints.push({x:2820, y:GROUND_Y-60});
  checkpoints.push({x:3260, y:GROUND_Y-60});

  return {platforms, spikes, pits, secrets, checkpoints};
}

let level = buildLevel();

// exit door — sits at end of main level, "shy" if player rushes
const door = { x: WORLD_W - 90, y: GROUND_Y-90, w: 46, h: 90, visible: true, shyTimer: 0, isShy:false };

// ============================================================
// PLAYER
// ============================================================
const player = {
  x: 40, y: GROUND_Y-40, w: 22, h: 32,
  vx:0, vy:0, onGround:false, facing:1,
  alive:true
};

let lastCheckpoint = {x:40, y:GROUND_Y-40};
let camX = 0;

// input
const keys = {left:false, right:false, jump:false};
let controlsInverted = false;
let gravityFlipped = false;
let gravityFlipTimer = 0;

window.addEventListener('keydown', e=>{
  if(['ArrowLeft','KeyA'].includes(e.code)) keys.left = true;
  if(['ArrowRight','KeyD'].includes(e.code)) keys.right = true;
  if(['Space','ArrowUp','KeyW'].includes(e.code)) { keys.jump = true; e.preventDefault(); }
});
window.addEventListener('keyup', e=>{
  if(['ArrowLeft','KeyA'].includes(e.code)) keys.left = false;
  if(['ArrowRight','KeyD'].includes(e.code)) keys.right = false;
  if(['Space','ArrowUp','KeyW'].includes(e.code)) { keys.jump = false; }
});

function bindTouch(el, onDown, onUp){
  el.addEventListener('touchstart', e=>{ e.preventDefault(); onDown(); });
  el.addEventListener('touchend', e=>{ e.preventDefault(); onUp(); });
  el.addEventListener('mousedown', e=>{ e.preventDefault(); onDown(); });
  el.addEventListener('mouseup', e=>{ e.preventDefault(); onUp(); });
  el.addEventListener('mouseleave', ()=> onUp());
}
bindTouch($('tLeft'), ()=>keys.left=true, ()=>keys.left=false);
bindTouch($('tRight'), ()=>keys.right=true, ()=>keys.right=false);
bindTouch($('tJump'), ()=>keys.jump=true, ()=>keys.jump=false);
if(!('ontouchstart' in window)){
  // still allow, but no need to hide; keep visible for tablet mouse users too
}

// ============================================================
// BEHAVIOR TRACKING
// ============================================================
let idleTimer = 0;
let lastMoveTime = performance.now();
let wasAirborneOverSpike = {}; // key by spike index to avoid double count
let segmentTimer = 0;
let segmentStartX = 0;
let lastCheckpointIndex = -1;
let recentSpeeds = [];

let vanishState = {}; // key: platform index -> {fading:bool, alpha:1, solid:true, cooldown:0}

let promptActive = false;
let easyMode = false;
let hardMode = false;

let bossPhase = false;
let bossStartTime = 0;
let bossPlatforms = [];
let bossSpikeTimer = 0;
let bossFlashTimer = 0;
let bossFakeOverTimer = 0;
let bossElapsed = 0;
let bossWinTriggered = false;

// ============================================================
// PHYSICS
// ============================================================
const GRAVITY = 0.62;
const MOVE_SPEED = 3.6;
const JUMP_VEL = -11.6;
const FRICTION = 0.78;

function resetPlayerToCheckpoint(){
  player.x = lastCheckpoint.x;
  player.y = lastCheckpoint.y;
  player.vx = 0; player.vy = 0;
}

function die(reason){
  if(!player.alive) return;
  player.alive = false;
  stats.deaths++;
  $('hudDeaths').textContent = stats.deaths;

  if(stats.deaths > 10){
    triggerLevelRestart();
    return;
  }

  setTimeout(()=>{
    player.alive = true;
    resetPlayerToCheckpoint();
  }, 260);

  if(stats.deaths === 1){
    sayOnce('firstDeath', LINES.death[0]);
  } else if(stats.deaths === 3 && !stats.easierAccepted && !promptActive){
    triggerDeathPrompt();
  } else {
    say(choice(LINES.death));
  }
}

// ============================================================
// LEVEL RESTART (triggered once deaths exceed 10)
// ============================================================
let levelNum = 1;
let restarting = false;

function buildRestartRemark(){
  if(stats.rushFlags > stats.idleFlags && stats.rushFlags > stats.cornerChecks){
    return "Ten deaths. Always rushing, never learning.";
  } else if(stats.idleFlags > stats.rushFlags && stats.idleFlags > stats.cornerChecks){
    return "Ten deaths, and you still hesitate at everything.";
  } else if(stats.cornerChecks > 0){
    return "Ten deaths. All that time checking corners, and still this.";
  } else if(stats.jumpsOverSpikes > 3){
    return "Ten deaths. You dodge spikes just fine \u2014 everything else, not so much.";
  } else {
    return "Ten deaths. Let's just start over.";
  }
}

function buildLevelStartLine(){
  const next = levelNum + 1;
  if(stats.rushFlags > stats.idleFlags && stats.rushFlags > stats.cornerChecks){
    return `Starting Level ${next}. Try not to rush this time.`;
  } else if(stats.idleFlags > stats.rushFlags && stats.idleFlags > stats.cornerChecks){
    return `Starting Level ${next}. Maybe move a little faster this time.`;
  } else if(stats.cornerChecks > 0){
    return `Starting Level ${next}. Fewer detours might help.`;
  } else if(stats.jumpsOverSpikes > 3){
    return `Starting Level ${next}. The spikes aren't your problem \u2014 the floor is.`;
  } else {
    return `Starting Level ${next}. Fresh start.`;
  }
}

function triggerLevelRestart(){
  restarting = true;
  const remark1 = buildRestartRemark();
  const remark2 = buildLevelStartLine();
  say(remark1);
  setTimeout(()=>{ say(remark2); }, 2200);
  setTimeout(()=>{
    levelNum++;
    resetGame();
    restarting = false;
  }, 4000);
}

function triggerDeathPrompt(){
  promptActive = true;
  $('promptQ').textContent = LINES.deathPrompt;
  $('promptOverlay').classList.add('active');
}

$('promptYes').addEventListener('click', ()=>{
  promptActive = false;
  $('promptOverlay').classList.remove('active');
  stats.easierAccepted = true;
  hardMode = true; // the joke: "yes" secretly makes it harder
  say(LINES.deathPromptYes);
});
$('promptNo').addEventListener('click', ()=>{
  promptActive = false;
  $('promptOverlay').classList.remove('active');
  stats.easierAccepted = true;
  say(LINES.deathPromptNo);
});

function getActivePlatforms(){
  return bossPhase ? bossPlatforms : level.platforms;
}

function updatePlayer(dt){
  if(promptActive || bossFakeOverTimer > 0) return;

  const left = controlsInverted ? keys.right : keys.left;
  const right = controlsInverted ? keys.left : keys.right;

  if(left){ player.vx -= MOVE_SPEED*0.35; player.facing = -1; }
  if(right){ player.vx += MOVE_SPEED*0.35; player.facing = 1; }
  player.vx *= FRICTION;
  player.vx = clamp(player.vx, -MOVE_SPEED, MOVE_SPEED);

  const grav = gravityFlipped ? -GRAVITY : GRAVITY;
  player.vy += grav;
  player.vy = clamp(player.vy, -16, 16);

  if(keys.jump && player.onGround){
    player.vy = gravityFlipped ? -JUMP_VEL : JUMP_VEL;
    player.onGround = false;
  }

  // horizontal move + collide
  player.x += player.vx;
  player.onGround = false;
  const plats = getActivePlatforms();

  for(let i=0;i<plats.length;i++){
    const p = plats[i];
    if(p.type==='vanish'){
      const vs = vanishState[i];
      if(vs && !vs.solid) continue;
    }
    if(rectsOverlap(player, p)){
      if(player.vx > 0) player.x = p.x - player.w;
      else if(player.vx < 0) player.x = p.x + p.w;
      player.vx = 0;
    }
  }

  // vertical move + collide
  player.y += player.vy;
  for(let i=0;i<plats.length;i++){
    const p = plats[i];
    if(p.type==='vanish'){
      const vs = vanishState[i];
      if(vs && !vs.solid) continue;
    }
    if(rectsOverlap(player, p)){
      if(!gravityFlipped){
        if(player.vy > 0){ player.y = p.y - player.h; player.vy = 0; player.onGround = true; }
        else if(player.vy < 0){ player.y = p.y + p.h; player.vy = 0; }
      } else {
        if(player.vy < 0){ player.y = p.y + p.h; player.vy = 0; player.onGround = true; }
        else if(player.vy > 0){ player.y = p.y - player.h; player.vy = 0; }
      }
    }
  }

  // world bounds
  player.x = clamp(player.x, 0, (bossPhase? 1600 : WORLD_W) - player.w);

  // fell into pit / off screen
  if(!bossPhase){
    for(const pit of level.pits){
      if(player.x+player.w > pit.x1+8 && player.x < pit.x2-8 && player.y > GROUND_Y+40){
        die('pit'); return;
      }
    }
  }
  if(player.y > CANVAS_H + 100){ die('fall'); return; }
  if(gravityFlipped && player.y < -140){ die('fall-up'); return; }

  // spikes
  if(!bossPhase){
    level.spikes.forEach((s, idx)=>{
      if(rectsOverlap(player, s)){
        die('spike');
      }
    });
  }
}

// ============================================================
// BEHAVIOR DETECTION (runs each frame, main level only)
// ============================================================
function detectBehaviors(dt){
  if(bossPhase) return;

  // idle detection
  const moving = Math.abs(player.vx) > 0.15 && player.onGround === player.onGround; // moving horizontally
  const inputActive = keys.left || keys.right || keys.jump;
  if(inputActive || Math.abs(player.vx) > 0.2){
    idleTimer = 0;
  } else {
    idleTimer += dt;
  }
  if(idleTimer > 1.7){
    stats.idleFlags++;
    triggerVanishNear();
    if(stats.idleFlags === 1){
      sayOnce('idle', LINES.idler);
    }
    idleTimer = -1.2; // cooldown before re-triggering
  }

  // spike-avoid detection: airborne while passing directly over a spike
  level.spikes.forEach((s, idx)=>{
    const overX = player.x + player.w/2 > s.x && player.x + player.w/2 < s.x+s.w;
    if(overX && !player.onGround && !wasAirborneOverSpike[idx]){
      wasAirborneOverSpike[idx] = true;
      stats.jumpsOverSpikes++;
      if(stats.jumpsOverSpikes === 3){
        sayOnce('spikeAvoider', LINES.spikeAvoider);
      }
    }
  });

  // corner-check detection: entering a secret alcove
  level.secrets.forEach(sec=>{
    if(sec.triggered) return;
    const box = {x:sec.x, y:sec.y, w:sec.w, h:sec.h};
    if(rectsOverlap(player, box)){
      sec.triggered = true;
      stats.cornerChecks++;
      say(stats.cornerChecks === 1 ? choice(LINES.cornerChecker) : LINES.fakeSecret);
      if(stats.cornerChecks > 1){
        // second time, immediately reveal it's fake
      } else {
        setTimeout(()=> say(LINES.fakeSecret), 1600);
      }
    }
  });

  // checkpoint passage + rush detection
  level.checkpoints.forEach((cp, idx)=>{
    if(idx <= lastCheckpointIndex) return;
    if(player.x >= cp.x){
      const elapsed = (performance.now() - segmentTimer)/1000;
      const dist = cp.x - segmentStartX;
      const speed = dist / Math.max(elapsed,0.1); // px/sec
      recentSpeeds.push(speed);
      lastCheckpointIndex = idx;
      lastCheckpoint = {x: cp.x - 20, y: cp.y};
      segmentStartX = cp.x;
      segmentTimer = performance.now();

      if(speed > 260){
        stats.rushFlags++;
        if(stats.rushFlags === 1) sayOnce('rush', LINES.rusher);
      } else if(idx > 0){
        say(choice(LINES.checkpoint));
      }
    }
  });

  // door shy behavior — becomes shy if average recent speed is high
  const avgSpeed = recentSpeeds.length ? recentSpeeds.reduce((a,b)=>a+b,0)/recentSpeeds.length : 0;
  const nearDoor = (door.x - player.x) < 260 && player.x < door.x + 60;
  if(nearDoor && avgSpeed > 230 && door.visible){
    door.isShy = true;
    if(!saidOnce['doorShy']) sayOnce('doorShy', LINES.doorShy);
  }
  if(door.isShy){
    const distToDoor = Math.abs((player.x+player.w/2) - (door.x+door.w/2));
    if(distToDoor < 130){
      door.shyTimer += dt;
      if(door.shyTimer > 0.15){ door.visible = false; }
    } else {
      door.shyTimer -= dt*0.5;
      if(door.shyTimer < -0.6){ door.visible = true; }
      door.shyTimer = clamp(door.shyTimer, -1, 2);
    }
  }
}

function triggerVanishNear(){
  const plats = level.platforms;
  plats.forEach((p, idx)=>{
    if(p.type !== 'vanish') return;
    const dx = Math.abs((p.x+p.w/2) - (player.x+player.w/2));
    if(dx < 420){
      if(!vanishState[idx]) vanishState[idx] = {fading:false, alpha:1, solid:true, cooldown:0};
      const vs = vanishState[idx];
      if(vs.solid && !vs.fading){ vs.fading = true; }
    }
  });
}

function updateVanish(dt){
  const plats = getActivePlatforms();
  plats.forEach((p, idx)=>{
    if(p.type !== 'vanish') return;
    if(!vanishState[idx]) vanishState[idx] = {fading:false, alpha:1, solid:true, cooldown:0};
    const vs = vanishState[idx];
    if(vs.fading){
      vs.alpha -= dt*1.1;
      if(vs.alpha <= 0){
        vs.alpha = 0; vs.solid = false; vs.fading = false; vs.cooldown = 3.5;
      }
    } else if(!vs.solid){
      vs.cooldown -= dt;
      if(vs.cooldown <= 0){
        vs.solid = true; vs.alpha = 1;
      }
    }
  });
}

// ============================================================
// DOOR / LEVEL END
// ============================================================
function checkDoor(dt){
  if(bossPhase) return;
  if(!door.visible) return;
  if(rectsOverlap(player, door)){
    startBossIntro();
  }
}

// ============================================================
// BOSS PHASE
// ============================================================
function startBossIntro(){
  bossPhase = true;
  bossStartTime = performance.now();
  bossElapsed = 0;
  bossPlatforms = [
    {x:0, y:GROUND_Y, w:1600, h:200, type:'solid'},
  ];
  player.x = 60; player.y = GROUND_Y-40; player.vx=0; player.vy=0;
  vanishState = {};

  const seq = [LINES.bossIntro1, LINES.bossIntro2, LINES.bossIntro3];
  let i = 0;
  function next(){
    if(i < seq.length){ say(seq[i]); i++; setTimeout(next, 1900); }
    else { beginBossGauntlet(); }
  }
  next();
}

function beginBossGauntlet(){
  say(LINES.bossStart);
  // configure gauntlet based on player's own habits
  setTimeout(()=>{
    if(stats.rushFlags > 0){ say(LINES.bossFlip); controlsInverted = true; }
    else if(stats.idleFlags > 0){ say(LINES.bossGravity); gravityFlipped = true; gravityFlipTimer = 6; }
    else { say(LINES.bossFake); triggerFakeGameOver(); }
  }, 1600);

  setTimeout(()=>{
    // build a short gauntlet of spikes/platforms scaled by deaths (their own habit mirrored back)
    const spikeCount = clamp(3 + stats.deaths, 3, 9);
    bossSpikes = [];
    let x = 400;
    for(let i=0;i<spikeCount;i++){
      x += rand(120,190);
      bossSpikes.push({x, y:GROUND_Y-18, w:44, h:18});
      if(stats.cornerChecks > 0 && i % 3 === 0){
        bossPlatforms.push({x:x-40, y:GROUND_Y-140, w:80, h:16, type:'vanish'});
      }
    }
    bossExitX = x + 220;
  }, 3200);
}

let bossSpikes = [];
let bossExitX = 99999;

function triggerFakeGameOver(){
  const el = $('fakeGameOver');
  el.style.display = 'flex';
  bossFakeOverTimer = 1.1;
  setTimeout(()=>{
    el.style.display = 'none';
  }, 1100);
}

function updateBoss(dt){
  if(!bossPhase) return;
  bossElapsed += dt;
  if(bossFakeOverTimer > 0) bossFakeOverTimer -= dt;
  if(gravityFlipTimer > 0){
    gravityFlipTimer -= dt;
    if(gravityFlipTimer <= 0){ gravityFlipped = false; }
  }

  // random extra fake-over flicker during gauntlet, sparse
  if(bossElapsed > 5 && Math.random() < 0.0025 && bossFakeOverTimer<=0){
    triggerFakeGameOver();
  }

  bossSpikes.forEach(s=>{
    if(rectsOverlap(player, s)) bossDie();
  });
  if(player.y > CANVAS_H+100 || player.y < -160) bossDie();

  if(!bossWinTriggered && player.x + player.w > bossExitX && bossExitX < 99999){
    bossWinTriggered = true;
    finishGame();
  }
}

function bossDie(){
  if(!player.alive) return;
  player.alive = false;
  stats.deaths++;
  $('hudDeaths').textContent = stats.deaths;

  if(stats.deaths > 10){
    triggerLevelRestart();
    return;
  }

  say(choice(LINES.death));
  setTimeout(()=>{
    player.alive = true;
    player.x = 60; player.y = GROUND_Y-40; player.vx=0; player.vy=0;
  }, 260);
}

// ============================================================
// RENDER
// ============================================================
const canvas = $('game');
const ctx = canvas.getContext('2d');

function starsField(){
  const s = [];
  for(let i=0;i<70;i++){
    s.push({x:rand(0,WORLD_W), y:rand(0,220), r:rand(0.4,1.6), a:rand(0.15,0.6)});
  }
  return s;
}
const stars = starsField();

function draw(){
  ctx.clearRect(0,0,CANVAS_W,CANVAS_H);

  // background gradient
  const grad = ctx.createLinearGradient(0,0,0,CANVAS_H);
  grad.addColorStop(0, '#0c0a16');
  grad.addColorStop(1, '#050408');
  ctx.fillStyle = grad;
  ctx.fillRect(0,0,CANVAS_W,CANVAS_H);

  camX = bossPhase ? clamp(player.x - CANVAS_W/2, 0, 1600-CANVAS_W) : clamp(player.x - CANVAS_W/2, 0, WORLD_W-CANVAS_W);
  if(1600 < CANVAS_W) camX = 0;

  ctx.save();
  ctx.translate(-camX, 0);

  // stars
  if(!bossPhase){
    ctx.fillStyle = '#f2b705';
    stars.forEach(st=>{
      if(st.x < camX-50 || st.x > camX+CANVAS_W+50) return;
      ctx.globalAlpha = st.a;
      ctx.beginPath();
      ctx.arc(st.x, st.y, st.r, 0, Math.PI*2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;
  }

  // pits (draw nothing extra, ground segments already skip them) - draw a subtle glow at pit edges
  if(!bossPhase){
    level.pits.forEach(p=>{
      const pg = ctx.createLinearGradient(p.x1,0,p.x2,0);
      pg.addColorStop(0,'rgba(255,77,94,0.0)');
      pg.addColorStop(0.5,'rgba(255,77,94,0.08)');
      pg.addColorStop(1,'rgba(255,77,94,0.0)');
      ctx.fillStyle = pg;
      ctx.fillRect(p.x1, GROUND_Y, p.x2-p.x1, 6);
    });
  }

  // platforms
  const plats = getActivePlatforms();
  plats.forEach((p, idx)=>{
    let alpha = 1;
    if(p.type==='vanish'){
      const vs = vanishState[idx];
      alpha = vs ? vs.alpha : 1;
      if(alpha <= 0) return;
    }
    ctx.globalAlpha = alpha;
    if(p.h > 100){
      // ground block
      ctx.fillStyle = '#1b1826';
      ctx.fillRect(p.x, p.y, p.w, p.h);
      ctx.fillStyle = '#2c2740';
      ctx.fillRect(p.x, p.y, p.w, 6);
    } else {
      ctx.fillStyle = p.type==='vanish' ? '#3a2f52' : '#211d30';
      ctx.fillRect(p.x, p.y, p.w, p.h);
      ctx.fillStyle = p.type==='vanish' ? '#f2b705' : '#4a4166';
      ctx.fillRect(p.x, p.y, p.w, 3);
    }
    ctx.globalAlpha = 1;
  });

  // secrets (only draw glow if not triggered)
  if(!bossPhase){
    level.secrets.forEach(sec=>{
      if(sec.triggered) return;
      ctx.save();
      ctx.globalAlpha = 0.7 + Math.sin(performance.now()/300)*0.25;
      ctx.fillStyle = '#f2b705';
      ctx.beginPath();
      ctx.arc(sec.itemX, sec.itemY, 5, 0, Math.PI*2);
      ctx.fill();
      ctx.restore();
    });
  }

  // spikes
  const spikeSet = bossPhase ? bossSpikes : level.spikes;
  ctx.fillStyle = '#ff4d5e';
  spikeSet.forEach(s=>{
    const count = Math.max(1, Math.round(s.w/16));
    const sw = s.w/count;
    for(let i=0;i<count;i++){
      ctx.beginPath();
      ctx.moveTo(s.x+i*sw, s.y+s.h);
      ctx.lineTo(s.x+i*sw+sw/2, s.y);
      ctx.lineTo(s.x+i*sw+sw, s.y+s.h);
      ctx.closePath();
      ctx.fill();
    }
  });

  // door
  if(!bossPhase){
    ctx.save();
    ctx.globalAlpha = door.visible ? 1 : 0.12;
    ctx.fillStyle = '#f2b705';
    ctx.fillRect(door.x, door.y, door.w, door.h);
    ctx.fillStyle = '#0a0a10';
    ctx.fillRect(door.x+8, door.y+14, door.w-16, door.h-14);
    ctx.restore();
  }

  // player
  ctx.save();
  ctx.translate(player.x + player.w/2, player.y + player.h/2);
  if(gravityFlipped) ctx.scale(1,-1);
  ctx.fillStyle = player.alive ? '#5ee6d0' : '#ff4d5e';
  ctx.shadowColor = '#5ee6d0';
  ctx.shadowBlur = player.alive ? 10 : 0;
  ctx.fillRect(-player.w/2, -player.h/2, player.w, player.h);
  ctx.shadowBlur = 0;
  // eyes
  ctx.fillStyle = '#0a0a10';
  const eyeX = player.facing > 0 ? 2 : -8;
  ctx.fillRect(eyeX, -6, 6, 5);
  ctx.restore();

  ctx.restore(); // end camera translate
}

// ============================================================
// MAIN LOOP
// ============================================================
let lastTime = performance.now();
let running = false;

function loop(now){
  if(!running) return;
  const dt = Math.min((now-lastTime)/1000, 0.05);
  lastTime = now;

  if(player.alive && !restarting){
    updatePlayer(dt);
    detectBehaviors(dt);
  }
  if(!restarting){
    updateVanish(dt);
    checkDoor(dt);
    updateBoss(dt);
  }

  // hud zone label
  if(bossPhase){
    $('hudZone').textContent = 'Zone: The Narrator';
  } else if(player.x > 2700){
    $('hudZone').textContent = 'Zone: Almost There';
  } else if(player.x > 1300){
    $('hudZone').textContent = 'Zone: The Middle Stretch';
  } else {
    $('hudZone').textContent = 'Zone: The Beginning';
  }

  draw();
  requestAnimationFrame(loop);
}

// ============================================================
// GAME START / END
// ============================================================
function resetGame(){
  level = buildLevel();
  door.visible = true; door.isShy = false; door.shyTimer = 0;
  player.x = 40; player.y = GROUND_Y-40; player.vx=0; player.vy=0; player.alive=true;
  lastCheckpoint = {x:40, y:GROUND_Y-40};
  stats.deaths=0; stats.jumpsOverSpikes=0; stats.idleFlags=0; stats.cornerChecks=0; stats.rushFlags=0;
  stats.easierAccepted=false;
  saidOnce = {};
  wasAirborneOverSpike = {};
  vanishState = {};
  idleTimer = 0;
  segmentTimer = performance.now();
  segmentStartX = 0;
  lastCheckpointIndex = -1;
  recentSpeeds = [];
  controlsInverted = false;
  gravityFlipped = false;
  bossPhase = false;
  bossSpikes = [];
  bossExitX = 99999;
  bossWinTriggered = false;
  $('hudDeaths').textContent = 0;
  $('fakeGameOver').style.display='none';
}

function finishGame(){
  running = false;
  say(LINES.win);
  setTimeout(()=>{
    const finalStats = $('finalStats');
    finalStats.innerHTML = `
      <span><b>${stats.deaths}</b> deaths</span>
      <span><b>${stats.jumpsOverSpikes}</b> spikes dodged</span>
      <span><b>${stats.cornerChecks}</b> secrets checked</span>
      <span><b>${stats.rushFlags}</b> times you rushed</span>
      <span><b>${stats.idleFlags}</b> times you hesitated</span>
    `;
    showScreen('win-screen');
  }, 1600);
}

$('startBtn').addEventListener('click', ()=>{
  resetGame();
  showScreen('game-screen');
  say(choice(LINES.intro));
  running = true;
  lastTime = performance.now();
  requestAnimationFrame(loop);
});

$('againBtn').addEventListener('click', ()=>{
  resetGame();
  showScreen('game-screen');
  say(choice(LINES.intro));
  running = true;
  lastTime = performance.now();
  requestAnimationFrame(loop);
});

})();
</script>
</body>
</html>