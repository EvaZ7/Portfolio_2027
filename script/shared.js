/* ================================================================
   SHARED JS — Eva Zaadnoordijk 2049
   ================================================================ */
'use strict';

// ---- THEME ----
(function() {
  const htmlEl = document.documentElement;
  const themeBtn = document.getElementById('themeBtn');
  const themeBtnText = document.getElementById('themeBtnText');
  const stored = localStorage.getItem('br2049-theme');
  let isDark = stored ? stored === 'dark' : true;

  function applyTheme(dark) {
    htmlEl.setAttribute('data-theme', dark ? 'dark' : 'light');
    if (themeBtnText) themeBtnText.textContent = dark ? '☀ DAY' : '🌙 NIGHT';
    if (themeBtn) {
      themeBtn.setAttribute('aria-pressed', dark ? 'false' : 'true');
      themeBtn.setAttribute('aria-label', dark ? 'Schakel naar dag-thema' : 'Schakel naar nacht-thema');
    }
  }
  applyTheme(isDark);

  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      isDark = !isDark;
      applyTheme(isDark);
      localStorage.setItem('br2049-theme', isDark ? 'dark' : 'light');
    });
  }
})();

// ---- SKILLS TAPE ----
(function() {
  const track = document.getElementById('skillsTrack');
  if (!track) return;
  const skills = ['HTML','CSS / SCSS','JavaScript','Figma','Illustrator','Photoshop','Lightroom','Premiere Pro','GitHub', 'Notion','UX Design','UI Design','Web Design','Prototyping'];
  const doubled = [...skills, ...skills];
  track.innerHTML = doubled.map(s => `<span class="skills-tape__item">${s}<span class="sep" aria-hidden="true">◈</span></span>`).join('');
})();

// ---- SCROLL REVEAL ----
(function() {
  const revealEls = document.querySelectorAll('.reveal');
  if (!revealEls.length) return;
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); }
    });
  }, { threshold: 0.08 });
  revealEls.forEach(el => observer.observe(el));
})();

// ---- ACTIVE NAV ----
(function() {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__links a').forEach(a => {
    const href = a.getAttribute('href').split('/').pop();
    if (href === path || (path === '' && href === 'index.html')) {
      a.setAttribute('aria-current', 'page');
    }
  });
})();

// ---- BACKGROUND CANVAS ----
(function() {
  const canvas = document.getElementById('bgCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, t = 0;

  // Rain
  const RAIN_COUNT = 220;
  const drops = [];
  function initDrops() {
    drops.length = 0;
    for (let i = 0; i < RAIN_COUNT; i++) drops.push({
      x: Math.random() * W, y: Math.random() * H,
      len: Math.random() * 18 + 6, speed: Math.random() * 8 + 6,
      opacity: Math.random() * 0.35 + 0.05, width: Math.random() * 0.8 + 0.2
    });
  }

  // Cars
  const CAR_COUNT = 8;
  const cars = [];
  function Car() {
    this.reset = function(immediate) {
      const side = Math.random() < 0.5 ? 'left' : 'right';
      this.side = side;
      this.y = Math.random() * H * 0.7 + H * 0.05;
      this.z = Math.random() * 0.6 + 0.2;
      this.speed = (Math.random() * 2.5 + 1.2) * (side === 'left' ? 1 : -1) * this.z;
      this.x = immediate ? Math.random() * W : (side === 'left' ? -200 : W + 200);
      this.length = (Math.random() * 40 + 30) * this.z;
      this.height = (Math.random() * 7 + 5) * this.z;
      const colors = ['#FF6B35','#00D4FF','#FFB800','#FF2D78','#E8D5C0','#AAAAFF'];
      this.color = colors[Math.floor(Math.random() * colors.length)];
      this.trailLen = Math.random() * 80 + 40;
      this.blinkPhase = Math.random() * Math.PI * 2;
      this.blinkSpeed = Math.random() * 0.08 + 0.03;
      this.altSpeed = (Math.random() - 0.5) * 0.03;
    };
    this.reset(true);
  }
  function initCars() { cars.length = 0; for (let i = 0; i < CAR_COUNT; i++) { const c = new Car(); cars.push(c); } }

  // Stars
  const stars = [];
  function initStars() {
    stars.length = 0;
    for (let i = 0; i < 120; i++) stars.push({
      x: Math.random() * W, y: Math.random() * H * 0.55,
      r: Math.random() * 0.9 + 0.1, opacity: Math.random() * 0.5 + 0.1,
      twinkleSpeed: Math.random() * 0.02 + 0.005, twinklePhase: Math.random() * Math.PI * 2
    });
  }

  // City glow
  const glowPoints = [];
  function initGlow() {
    glowPoints.length = 0;
    for (let i = 0; i < 6; i++) glowPoints.push({
      x: (i / 6 + Math.random() * 0.1) * W, y: H * (0.55 + Math.random() * 0.2),
      r: Math.random() * 160 + 80,
      color: ['rgba(255,107,53,','rgba(0,212,255,','rgba(255,184,0,','rgba(255,45,120,'][Math.floor(Math.random() * 4)],
      opacity: Math.random() * 0.08 + 0.02,
      pulseSpeed: Math.random() * 0.008 + 0.003, pulsePhase: Math.random() * Math.PI * 2
    });
  }

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
    initDrops(); initCars(); initStars(); initGlow();
  }

  function isDarkTheme() { return document.documentElement.getAttribute('data-theme') !== 'light'; }

  function hexToRgba(hex, alpha) {
    const r = parseInt(hex.slice(1,3),16), g = parseInt(hex.slice(3,5),16), b = parseInt(hex.slice(5,7),16);
    return `rgba(${r},${g},${b},${alpha})`;
  }

  function drawBackground() {
    if (isDarkTheme()) {
      const grad = ctx.createLinearGradient(0,0,0,H);
      grad.addColorStop(0,'#020408'); grad.addColorStop(0.5,'#030810');
      grad.addColorStop(0.7,'#060C18'); grad.addColorStop(1,'#020408');
      ctx.fillStyle = grad; ctx.fillRect(0,0,W,H);
      const hGrad = ctx.createRadialGradient(W*0.5,H*0.7,0,W*0.5,H*0.7,W*0.7);
      hGrad.addColorStop(0,'rgba(255,107,53,0.04)');
      hGrad.addColorStop(0.4,'rgba(0,212,255,0.02)');
      hGrad.addColorStop(1,'rgba(0,0,0,0)');
      ctx.fillStyle = hGrad; ctx.fillRect(0,0,W,H);
    } else {
      const grad = ctx.createLinearGradient(0,0,0,H);
      grad.addColorStop(0,'#C8AB7A'); grad.addColorStop(0.5,'#D4BC94'); grad.addColorStop(1,'#B89060');
      ctx.fillStyle = grad; ctx.fillRect(0,0,W,H);
    }
  }

  function drawStars() {
    if (!isDarkTheme()) return;
    stars.forEach(s => {
      s.twinklePhase += s.twinkleSpeed;
      const o = s.opacity + Math.sin(s.twinklePhase) * 0.15;
      ctx.beginPath(); ctx.arc(s.x,s.y,s.r,0,Math.PI*2);
      ctx.fillStyle = `rgba(220,210,255,${Math.max(0,o)})`; ctx.fill();
    });
  }

  function drawCityGlow() {
    glowPoints.forEach(g => {
      g.pulsePhase += g.pulseSpeed;
      const o = g.opacity + Math.sin(g.pulsePhase) * g.opacity * 0.5;
      const grd = ctx.createRadialGradient(g.x,g.y,0,g.x,g.y,g.r);
      grd.addColorStop(0, g.color + (isDarkTheme() ? o : o*0.5) + ')');
      grd.addColorStop(1, g.color + '0)');
      ctx.fillStyle = grd; ctx.fillRect(g.x-g.r,g.y-g.r,g.r*2,g.r*2);
    });
  }

  function drawRain() {
    ctx.save();
    drops.forEach(d => {
      d.y += d.speed;
      if (d.y > H + d.len) { d.y = -d.len; d.x = Math.random() * W; }
      ctx.beginPath(); ctx.moveTo(d.x,d.y); ctx.lineTo(d.x - d.speed*0.3, d.y + d.len);
      ctx.strokeStyle = isDarkTheme() ? `rgba(160,200,255,${d.opacity})` : `rgba(180,140,80,${d.opacity*0.6})`;
      ctx.lineWidth = d.width; ctx.stroke();
    });
    ctx.restore();
  }

  function drawLanes() {
    [H*0.18,H*0.3,H*0.42,H*0.55].forEach((ly, i) => {
      ctx.save(); ctx.globalAlpha = 0.04;
      ctx.strokeStyle = i%2===0 ? '#FF6B35' : '#00D4FF';
      ctx.lineWidth = 1; ctx.setLineDash([8,40]);
      ctx.beginPath(); ctx.moveTo(0,ly); ctx.lineTo(W,ly); ctx.stroke(); ctx.restore();
    });
  }

  function drawCar(car) {
    const x = car.x;
    const y = car.y + Math.sin(t * car.altSpeed * 60 + car.blinkPhase) * 3 * car.z;
    const dir = car.side === 'left' ? 1 : -1;
    ctx.save();

    const trail = ctx.createLinearGradient(x - dir*car.trailLen, y, x, y);
    trail.addColorStop(0,   hexToRgba(car.color, 0));
    trail.addColorStop(0.6, hexToRgba(car.color, 0.06));
    trail.addColorStop(1,   hexToRgba(car.color, 0.35));
    ctx.globalAlpha = 0.4 * car.z; ctx.fillStyle = trail;
    ctx.beginPath(); ctx.rect(Math.min(x, x-dir*car.trailLen), y-car.height*0.3, car.trailLen, car.height*0.6); ctx.fill();
    ctx.globalAlpha = 1;

    ctx.fillStyle = car.color; ctx.globalAlpha = 0.85 * car.z;
    const bx = dir===1 ? x : x-car.length, bw = car.length, bh = car.height, by = y-bh/2;
    ctx.beginPath();
    ctx.moveTo(bx+(dir===1?bh*0.5:0), by+bh); ctx.lineTo(bx+(dir===1?0:bw), by+bh);
    ctx.lineTo(bx+(dir===1?0:bw), by+bh*0.3); ctx.lineTo(bx+(dir===1?bh*0.8:bw-bh*0.8), by);
    ctx.lineTo(bx+(dir===1?bw-bh*0.3:bh*0.3), by); ctx.lineTo(bx+(dir===1?bw:0), by+bh*0.3);
    ctx.lineTo(bx+(dir===1?bw:0), by+bh); ctx.closePath(); ctx.fill();

    ctx.fillStyle = 'rgba(150,220,255,0.5)'; ctx.globalAlpha = 0.6 * car.z;
    const wWidth = (bw - bh*1.6) * 0.6;
    ctx.beginPath(); ctx.rect(dir===1 ? bx+bh*0.85 : bx+bh*0.35, by+bh*0.08, wWidth, bh*0.55); ctx.fill();

    ctx.globalAlpha = 1 * car.z;
    const blinkVal = 0.7 + Math.sin(t * car.blinkSpeed * 120 + car.blinkPhase) * 0.3;
    ctx.shadowBlur = 12 * car.z; ctx.shadowColor = car.color;
    ctx.fillStyle = `rgba(255,255,255,${blinkVal*0.9})`;
    ctx.beginPath(); ctx.arc(dir===1 ? x+car.length*0.45 : x-car.length*0.45, y, car.height*0.25, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = `rgba(255,60,0,${blinkVal*0.8})`; ctx.shadowColor = '#FF4400';
    ctx.beginPath(); ctx.arc(dir===1 ? x-car.length*0.45 : x+car.length*0.45, y, car.height*0.2, 0, Math.PI*2); ctx.fill();
    ctx.shadowBlur = 0; ctx.globalAlpha = 1; ctx.restore();

    car.x += car.speed;
    if (car.side==='left' && car.x > W+car.length+100) car.reset(false);
    if (car.side==='right' && car.x < -car.length-100) car.reset(false);
  }

  function frame() {
    t += 0.016; drawBackground(); drawStars(); drawCityGlow(); drawLanes();
    cars.forEach(c => drawCar(c)); drawRain();
    requestAnimationFrame(frame);
  }

  window.addEventListener('resize', resize);
  resize(); frame();
})();

// ---- GLITCH HERO TITLE ----
(function() {
  const glitchTarget = document.querySelector('.hero__title-line2');
  if (!glitchTarget) return;
  setInterval(() => {
    if (Math.random() < 0.15) {
      glitchTarget.style.transform = `skewX(${(Math.random()-0.5)*4}deg) translateX(${(Math.random()-0.5)*4}px)`;
      glitchTarget.style.filter = `blur(${Math.random()*1.5}px)`;
      setTimeout(() => { glitchTarget.style.transform=''; glitchTarget.style.filter=''; }, 80);
    }
  }, 400);
})();

// ---- YEAR IN FOOTER ----
(function() {
  const el = document.getElementById('year');
  if (el) el.textContent = new Date().getFullYear();
})();

// ---- THUMB CANVASES ----
(function() {
  document.querySelectorAll('.thumb-canvas').forEach(canvas => {
    const c1 = canvas.dataset.color1, c2 = canvas.dataset.color2, c3 = canvas.dataset.color3;
    function hexToRgba(hex, alpha) {
      const r = parseInt(hex.slice(1,3),16), g = parseInt(hex.slice(3,5),16), b = parseInt(hex.slice(5,7),16);
      return `rgba(${r},${g},${b},${alpha})`;
    }
    let tt = 0, animating = false, cW = 0, cH = 0;
    const ctx2 = canvas.getContext('2d');
    function drawThumb() {
      if (cW===0||cH===0){requestAnimationFrame(drawThumb);return;}
      tt += 0.015; ctx2.clearRect(0,0,cW,cH);
      const grad = ctx2.createLinearGradient(0,0,cW,cH);
      grad.addColorStop(0,c1); grad.addColorStop(1,c2);
      ctx2.fillStyle = grad; ctx2.fillRect(0,0,cW,cH);
      ctx2.strokeStyle = hexToRgba(c3,0.2); ctx2.lineWidth = 0.5;
      for(let gx=0;gx<=cW;gx+=20){ctx2.beginPath();ctx2.moveTo(gx,0);ctx2.lineTo(gx,cH);ctx2.stroke();}
      for(let gy=0;gy<=cH;gy+=20){ctx2.beginPath();ctx2.moveTo(0,gy);ctx2.lineTo(cW,gy);ctx2.stroke();}
      const scanY = ((Math.sin(tt*0.8)+1)/2)*cH;
      const sg = ctx2.createLinearGradient(0,scanY-20,0,scanY+20);
      sg.addColorStop(0,hexToRgba(c3,0)); sg.addColorStop(0.5,hexToRgba(c3,0.33)); sg.addColorStop(1,hexToRgba(c3,0));
      ctx2.fillStyle=sg; ctx2.fillRect(0,scanY-20,cW,40);
      for(let pi=0;pi<5;pi++){
        const px=((Math.sin(tt*0.3+pi*1.2)+1)/2)*cW, py=((Math.cos(tt*0.2+pi*0.9)+1)/2)*cH;
        ctx2.beginPath(); ctx2.arc(px,py,1.5,0,Math.PI*2);
        ctx2.fillStyle=hexToRgba(c3,0.6); ctx2.fill();
      }
      requestAnimationFrame(drawThumb);
    }
    const ro = new ResizeObserver(entries => {
      for(const entry of entries){
        const rect = entry.contentRect;
        if(rect.width>0&&rect.height>0){
          cW=Math.round(rect.width); cH=Math.round(rect.height);
          canvas.width=cW*window.devicePixelRatio; canvas.height=cH*window.devicePixelRatio;
          canvas.style.width=cW+'px'; canvas.style.height=cH+'px';
          ctx2.setTransform(1,0,0,1,0,0); ctx2.scale(window.devicePixelRatio,window.devicePixelRatio);
          if(!animating){animating=true;drawThumb();}
        }
      }
    });
    ro.observe(canvas.parentElement||canvas);
  });
})();

// ---- CONTACT FORM ----
(function() {
  const form = document.getElementById('contactForm');
  if (!form) return;
  const submitBtn = document.getElementById('submitBtn');
  const btnText = document.getElementById('btnText');
  const spinner = document.getElementById('spinner');
  const successMsg = document.getElementById('formSuccess');
  const errorMsg = document.getElementById('formError');

  form.addEventListener('submit', async e => {
    e.preventDefault();
    successMsg.style.display = 'none'; errorMsg.style.display = 'none';
    const name = form.name.value.trim(), email = form.email.value.trim(), message = form.message.value.trim();
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!name){showErr('// FOUT: Vul je naam in.');form.name.focus();return;}
    if(!email||!emailRe.test(email)){showErr('// FOUT: Vul een geldig e-mailadres in.');form.email.focus();return;}
    if(!message){showErr('// FOUT: Schrijf een bericht.');form.message.focus();return;}
    submitBtn.classList.add('btn--loading'); spinner.style.display='block'; btnText.textContent='ESTABLASHING_CONNECTION...';
    try {
      const res = await fetch('https://formspree.io/f/xkgwbjqn', {
        method: 'POST', headers: {'Content-Type':'application/json',Accept:'application/json'},
        body: JSON.stringify({name,email,subject:form.subject?.value?.trim()||'Portfolio bericht',message,_replyto:email})
      });
      if(res.ok){successMsg.style.display='block';successMsg.focus();form.reset();}
      else{openMailto(name,email,form.subject?.value?.trim(),message);showSuccessFallback();}
    } catch{openMailto(name,email,form.subject?.value?.trim(),message);showSuccessFallback();}
    finally{submitBtn.classList.remove('btn--loading');spinner.style.display='none';btnText.textContent='SEND_TRANSMISSION';}
  });

  function showErr(msg){errorMsg.textContent=msg;errorMsg.style.display='block';errorMsg.focus();}
  function showSuccessFallback(){successMsg.style.display='block';successMsg.textContent='// E-MAIL_READY — your email client has been opened.';successMsg.focus();form.reset();}
  function openMailto(name,email,subject,message){
    const sub=encodeURIComponent(subject||'Portfolio bericht');
    const body=encodeURIComponent(`Name: ${name}\nEmail address: ${email}\n\n${message}\n`);
    window.location.href=`mailto:evazaadnoordijk@gmail.com?subject=${sub}&body=${body}`;
  }
})();
