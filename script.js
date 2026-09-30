/* ===== EDIT YOUR CONTENT HERE ===== */
const C = {
  start: '2025-10-01T00:00:00', // your anniversary
  story: [
    { text: 'I saw you on a random road and thought you looked like an angel. I still think so.', title: 'A random road' },
    { text: 'I found the courage to say hi on Instagram, and we never really stopped talking.', title: 'Hello, on Instagram' },
    { text: 'You hugged me and I never wanted to move. This is our first date, and I am the back of a head in it.', title: 'Our first date', img: 'photos/first-date.jpg' },
    { text: 'You became my wifu, and I became your Kuchu.', title: '1 October 2025' }
  ],
  gallery: [
    ['viewpoint', 'Us, above the city'], ['lake', 'By the water'], ['bike', 'Riding with you'],
    ['concert', 'Concert glow'], ['paddle', 'Holding hands, even on the lake'], ['sunny', 'That sunlight on you'],
    ['laugh', 'Your laugh'], ['call', 'Late night calls, 23:55'], ['rain', 'You in a raincoat, still cute'], ['silly', 'My favourite silly face']
  ],
  reasons: ['You are kind to everyone you meet', 'You talk to everyone like they matter', 'You care for me, always', 'You look like an angel to me', 'You make every ride feel like an adventure', 'You are my favourite person to call at midnight'],
  pairs: ['lake', 'bike', 'concert', 'paddle', 'sunny', 'treetop'].map(n => `photos/${n}.jpg`),
  // first answer in each list is the correct one. Add more questions here!
  quiz: [
    { q: 'What does Sandya call him?', o: ['Kuchu', 'Babu', 'Hero', 'Bhai'] },
    { q: 'What does Kuchu call her?', o: ['Wifu', 'Angel', 'Jaan', 'Princess'] },
    { q: 'Where did we first see each other?', o: ['On a random road', 'At college', 'At a party', 'At a cafe'] },
    { q: 'Where did we start talking?', o: ['Instagram', 'Snapchat', 'WhatsApp', 'Facebook'] },
    { q: 'When did we become us?', o: ['1 October 2025', '1 September 2025', '14 February 2025', '1 November 2025'] }
  ],
  letter: `My wifu,

A year ago I saw a girl on a random road and thought, she looks like an angel. I had no idea a simple hello on Instagram would become the best year of my life.

You are kind to everyone you meet, and somehow you still save the biggest part of your care for me.

Thank you for every ride, every late night call, every silly face and every laugh. Here is to this year, and to every year you let me stay.

I love you, always.
Your Kuchu`
};
/* ===== END OF CONTENT ===== */

const $ = s => document.querySelector(s);
const el = (t, c, h) => { const e = document.createElement(t); if (c) e.className = c; if (h !== undefined) e.innerHTML = h; return e; };
const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
const start = new Date(C.start);

/* gate */
$('#open').onclick = () => { $('#gate').classList.add('gone'); document.body.classList.remove('locked'); scrollTo(0, 0); };

/* title + live clock */
(function () {
  const ord = n => n + (['th', 'st', 'nd', 'rd'][(n % 100 > 10 && n % 100 < 14) ? 0 : (n % 10 < 4 ? n % 10 : 0)]);
  const now = new Date(); let y = now.getFullYear() - start.getFullYear();
  if (now < new Date(now.getFullYear(), start.getMonth(), start.getDate())) y--;
  if (y >= 1) $('#title').textContent = `Happy ${ord(y)} anniversary, wifu`;
  const tick = () => {
    const d = new Date() - start;
    const parts = [[Math.floor(d / 864e5), 'days'], [Math.floor(d / 36e5) % 24, 'hours'], [Math.floor(d / 6e4) % 60, 'minutes'], [Math.floor(d / 1e3) % 60, 'seconds']];
    $('#clock').innerHTML = parts.map(([v, l]) => `<div><b>${v}</b><span>${l}</span></div>`).join('');
  };
  tick(); setInterval(tick, 1000);
})();

/* story */
C.story.forEach(s => $('#timeline').append(el('div', 'step', `<h3>${s.title}</h3><p>${s.text}</p>${s.img ? `<img src="${s.img}" alt="${s.title}" loading="lazy">` : ''}`)));

/* gallery + lightbox */
C.gallery.forEach(([n, cap], i) => {
  const f = el('figure', '', `<img src="photos/${n}.jpg" alt="${cap}" loading="lazy"><figcaption>${cap}</figcaption>`);
  f.style.setProperty('--r', (i % 2 ? 1.4 : -1.4) + 'deg');
  f.onclick = () => { const lb = $('#lightbox'); lb.querySelector('img').src = `photos/${n}.jpg`; lb.querySelector('p').textContent = cap; lb.hidden = false; };
  $('#gallery').append(f);
});
$('#lightbox').onclick = () => $('#lightbox').hidden = true;
addEventListener('keydown', e => { if (e.key === 'Escape') $('#lightbox').hidden = true; });

/* reasons */
C.reasons.forEach(r => {
  const c = el('button', 'rcard', `<span class="face front">♥</span><span class="face back">${r}</span>`);
  c.onclick = () => c.classList.toggle('up');
  $('#reasonGrid').append(c);
});

/* memory game */
function memory() {
  const box = $('#memory'), info = $('#memInfo'); box.innerHTML = '';
  let first = null, lock = false, moves = 0, found = 0;
  info.textContent = 'Match the photos. Moves: 0';
  [...C.pairs, ...C.pairs].sort(() => Math.random() - .5).forEach(src => {
    const c = el('button', 'card', `<span class="face front">♥</span><span class="face back"><img src="${src}" alt=""></span>`);
    c.onclick = () => {
      if (lock || c.classList.contains('up')) return;
      c.classList.add('up');
      if (!first) { first = c; return; }
      moves++; info.textContent = `Match the photos. Moves: ${moves}`;
      if (first.querySelector('img').src === c.querySelector('img').src) {
        first = null;
        if (++found === C.pairs.length) { info.innerHTML = `You found every pair in ${moves} moves. Of course you did, you know us best. <button class="opt" id="again">Play again</button>`; $('#again').onclick = memory; burst(30); }
      } else {
        lock = true; const a = first; first = null;
        setTimeout(() => { a.classList.remove('up'); c.classList.remove('up'); lock = false; }, 800);
      }
    };
    box.append(c);
  });
}
memory();

/* quiz */
(function quiz() {
  const b = $('#quiz'); let i = 0, score = 0;
  const show = () => {
    if (i >= C.quiz.length) {
      b.innerHTML = `<p class="big">${score} out of ${C.quiz.length}</p><p class="sub">${score === C.quiz.length ? 'Perfect. You really are my wifu.' : 'Close enough. I will keep reminding you for all our years.'}</p><button class="opt" id="qr">Play again</button>`;
      $('#qr').onclick = () => { i = 0; score = 0; show(); }; if (score === C.quiz.length) burst(30); return;
    }
    const q = C.quiz[i];
    b.innerHTML = `<p class="qn">Question ${i + 1} of ${C.quiz.length}</p><p class="q">${q.q}</p>`;
    const o = el('div', 'opts');
    [...q.o].sort(() => Math.random() - .5).forEach(t => {
      const x = el('button', 'opt', t);
      x.onclick = () => {
        const ok = t === q.o[0]; if (ok) score++;
        o.querySelectorAll('button').forEach(y => { y.disabled = true; if (y.textContent === q.o[0]) y.classList.add('right'); });
        if (!ok) x.classList.add('wrong');
        setTimeout(() => { i++; show(); }, 1100);
      };
      o.append(x);
    });
    b.append(o);
  };
  show();
})();

/* letter */
$('#letterText').textContent = C.letter;

/* the question */
(function () {
  const no = $('#no'), yes = $('#yes'), box = $('#btns'); let tries = 0;
  const dodge = e => {
    e.preventDefault(); tries++;
    no.style.left = Math.random() * (box.clientWidth - no.offsetWidth) + 'px';
    no.style.top = Math.random() * (box.clientHeight - no.offsetHeight) + 'px';
    yes.style.transform = `scale(${Math.min(1 + tries * .12, 1.7)})`;
    if (tries > 5) no.textContent = 'Okay, yes';
  };
  no.addEventListener('mouseenter', dodge);
  no.addEventListener('touchstart', dodge, { passive: false });
  no.onclick = () => { if (tries > 5) yes.click(); };
  yes.onclick = () => {
    $('#answer').textContent = 'Forever it is. I love you, Sandya. Happy anniversary. Your Kuchu.';
    burst(70); box.style.display = 'none';
  };
})();

/* floating + burst hearts */
function burst(n) {
  if (still) return;
  for (let k = 0; k < n; k++) {
    const h = el('span', 'burst', '♥');
    h.style.cssText = `left:${innerWidth / 2}px;top:${innerHeight / 2}px;font-size:${14 + Math.random() * 26}px;color:${['#f2a9ba', '#e5c38b', '#e0566f'][k % 3]};--x:${(Math.random() - .5) * innerWidth}px;--y:${(Math.random() - .5) * innerHeight}px`;
    document.body.append(h); setTimeout(() => h.remove(), 1700);
  }
}
if (!still) setInterval(() => {
  if (document.hidden) return;
  const h = el('span', 'heart', '♥');
  h.style.cssText = `left:${Math.random() * 100}vw;font-size:${10 + Math.random() * 18}px;opacity:${.25 + Math.random() * .4};animation-duration:${7 + Math.random() * 7}s`;
  document.body.append(h); setTimeout(() => h.remove(), 14500);
}, 900);
