
const $ = (s, c=document) => c.querySelector(s);
const $$ = (s, c=document) => [...c.querySelectorAll(s)];

window.addEventListener('pointermove', e => {
  document.documentElement.style.setProperty('--mx', `${e.clientX}px`);
  document.documentElement.style.setProperty('--my', `${e.clientY}px`);
});

const toggle = $('.menu-toggle');
const nav = $('.site-nav');
if(toggle && nav){
  toggle.addEventListener('click',()=>{
    const open = nav.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(open));
  });
}

const io = new IntersectionObserver(entries=>{
  entries.forEach(entry=>{ if(entry.isIntersecting) entry.target.classList.add('is-visible'); });
},{threshold:.12});
$$('.section-reveal').forEach(el=>io.observe(el));

$$('[data-carousel]').forEach(carousel=>{
  const track = $('.carousel-track', carousel);
  $('.next', carousel)?.addEventListener('click',()=>track.scrollBy({left:track.clientWidth*.8, behavior:'smooth'}));
  $('.prev', carousel)?.addEventListener('click',()=>track.scrollBy({left:-track.clientWidth*.8, behavior:'smooth'}));
});

$$('[data-tilt]').forEach(card=>{
  card.addEventListener('pointermove', e=>{
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - .5;
    const y = (e.clientY - r.top) / r.height - .5;
    card.style.transform = `perspective(900px) rotateY(${x*7}deg) rotateX(${-y*7}deg) translateY(-6px)`;
  });
  card.addEventListener('pointerleave',()=> card.style.transform = '');
});

const lightbox = $('.lightbox');
const lbImg = $('.lightbox img');
const lbText = $('.lightbox p');
$$('.js-lightbox, .archive-card img, .secret-file img').forEach(img=>{
  img.addEventListener('click',()=>{
    if(!lightbox) return;
    lbImg.src = img.src;
    lbImg.alt = img.alt || 'Imagen ampliada';
    lbText.textContent = img.alt || '';
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden','false');
  });
});
function closeLightbox(){
  if(!lightbox) return;
  lightbox.classList.remove('is-open');
  lightbox.setAttribute('aria-hidden','true');
  lbImg.src='';
}
$('.lightbox-close')?.addEventListener('click',closeLightbox);
lightbox?.addEventListener('click',e=>{if(e.target===lightbox) closeLightbox();});
window.addEventListener('keydown',e=>{if(e.key==='Escape') closeLightbox();});

let currentAudio = null;
$$('.sound-orb').forEach(btn=>{
  btn.addEventListener('click',()=>{
    const src = btn.dataset.audio;
    if(!src) return;
    if(currentAudio){ currentAudio.pause(); currentAudio=null; $$('.sound-orb').forEach(b=>b.classList.remove('is-playing')); }
    else { currentAudio = new Audio(src); currentAudio.loop = true; currentAudio.volume = .35; currentAudio.play().then(()=>btn.classList.add('is-playing')).catch(()=>{}); }
  });
});

const unlock = $('.unlock-form');
if(unlock){
  unlock.addEventListener('submit',e=>{
    e.preventDefault();
    const value = new FormData(unlock).get('code').toLowerCase().replace(/\s+/g,'');
    const ok = ['undercovercuffs','undercover','cuffs'].includes(value);
    $('.unlock-result').textContent = ok ? 'Acceso concedido. Los archivos ya están abiertos.' : 'Clave incorrecta. El expediente sigue cerrado.';
    $('[data-secret-grid]')?.classList.toggle('is-locked', !ok);
  });
}

const banned = ['puta','mierda','gilipollas','idiota','imbecil','imbécil'];
function cleanText(text){
  let result = text.trim();
  banned.forEach(w=>{ result = result.replace(new RegExp(w,'gi'),'***'); });
  return result;
}
const commentForm = $('.comment-form');
const commentList = $('.comment-list');
const key='undercover-comments-v2';
function renderComments(){
  if(!commentList) return;
  const items = JSON.parse(localStorage.getItem(key) || '[]');
  commentList.innerHTML = items.map(c=>`<article class="comment-item"><strong>${c.name}</strong><p>${c.message}</p></article>`).join('') || '<article class="comment-item"><strong>Sistema</strong><p>Aún no hay comentarios. Sé la primera persona en dejar una teoría.</p></article>';
}
if(commentForm){
  renderComments();
  commentForm.addEventListener('submit',e=>{
    e.preventDefault();
    const fd = new FormData(commentForm);
    const name = cleanText(fd.get('name') || 'Agente anónimo') || 'Agente anónimo';
    const message = cleanText(fd.get('message') || '');
    if(!message) return;
    const items = JSON.parse(localStorage.getItem(key) || '[]');
    items.unshift({name,message});
    localStorage.setItem(key, JSON.stringify(items.slice(0,20)));
    commentForm.reset();
    renderComments();
  });
}
