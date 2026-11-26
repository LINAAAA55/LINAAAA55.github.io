// Gallery lightbox
const lightbox = document.getElementById('lightbox');
const preview = lightbox.querySelector('img');
const caption = lightbox.querySelector('p');
document.querySelectorAll('.gallery img').forEach((img) => {
  img.addEventListener('click', () => {
    preview.src = img.src; preview.alt = img.alt;
    caption.textContent = img.closest('figure').querySelector('figcaption').textContent;
    lightbox.classList.add('open'); lightbox.setAttribute('aria-hidden', 'false');
  });
});
function closeLightbox(){lightbox.classList.remove('open');lightbox.setAttribute('aria-hidden','true');preview.src='';}
lightbox.querySelector('.close').addEventListener('click',closeLightbox);
lightbox.addEventListener('click',e=>{if(e.target===lightbox)closeLightbox();});

// Intro sequence
const boot=document.getElementById('bootScreen');
function dismissIntro(){boot.classList.add('dismissed');document.body.classList.remove('intro-lock');sessionStorage.setItem('linaIntroSeen','1');}
if(sessionStorage.getItem('linaIntroSeen')==='1') boot.classList.add('dismissed');
document.getElementById('enterPortfolio').addEventListener('click',dismissIntro);
document.getElementById('skipIntro').addEventListener('click',dismissIntro);

// Scroll progress + active navigation + subtle reveal
const progress=document.getElementById('scrollProgress');
const navLinks=[...document.querySelectorAll('#mainNav a')];
const sections=[...document.querySelectorAll('main section[id]')];
function updateScroll(){const max=document.documentElement.scrollHeight-innerHeight;progress.style.width=(max>0?scrollY/max*100:0)+'%';}
window.addEventListener('scroll',updateScroll,{passive:true});updateScroll();
const sectionObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){navLinks.forEach(a=>a.classList.toggle('active',a.getAttribute('href')==='#'+entry.target.id));}}),{rootMargin:'-30% 0px -60% 0px'});
sections.forEach(s=>sectionObserver.observe(s));
const revealObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');revealObserver.unobserve(entry.target);}}),{threshold:.08});
document.querySelectorAll('.project,.section-head,.skills-section .wrap,.about,.contact,.sae-section,.sae-intro').forEach(el=>{el.classList.add('reveal');revealObserver.observe(el);});

// Mobile navigation
const mobileMenu=document.getElementById('mobileMenu'),mainNav=document.getElementById('mainNav');
mobileMenu.addEventListener('click',()=>{const open=mainNav.classList.toggle('mobile-open');mobileMenu.setAttribute('aria-expanded',String(open));mobileMenu.textContent=open?'×':'☰';});
mainNav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{mainNav.classList.remove('mobile-open');mobileMenu.setAttribute('aria-expanded','false');mobileMenu.textContent='☰';}));

// Command palette: press / or Ctrl/Cmd + K
const palette=document.getElementById('commandPalette'),paletteInput=document.getElementById('paletteInput');
function openPalette(){palette.classList.add('open');palette.setAttribute('aria-hidden','false');paletteInput.value='';filterPalette('');setTimeout(()=>paletteInput.focus(),30);}
function closePalette(){palette.classList.remove('open');palette.setAttribute('aria-hidden','true');}
function filterPalette(value){const q=value.toLowerCase();palette.querySelectorAll('.palette-results button,.palette-results a').forEach(el=>el.hidden=!el.textContent.toLowerCase().includes(q));}
paletteInput.addEventListener('input',()=>filterPalette(paletteInput.value));
palette.querySelectorAll('[data-target]').forEach(btn=>btn.addEventListener('click',()=>{document.getElementById(btn.dataset.target).scrollIntoView({behavior:'smooth'});closePalette();}));
palette.addEventListener('click',e=>{if(e.target===palette)closePalette();});

// Interactive terminal shell
const terminal=document.getElementById('terminalOverlay'),terminalOutput=document.getElementById('terminalOutput'),terminalInput=document.getElementById('terminalInput'),terminalTyped=document.getElementById('terminalTyped');
function openTerminal(){terminal.classList.add('open');terminal.setAttribute('aria-hidden','false');setTimeout(()=>terminalInput.focus(),40);}
function closeTerminal(){terminal.classList.remove('open');terminal.setAttribute('aria-hidden','true');}
document.getElementById('openTerminal').addEventListener('click',openTerminal);
document.getElementById('closeTerminal').addEventListener('click',closeTerminal);
function runCommand(raw){const cmd=raw.trim().toLowerCase();terminalTyped.textContent=cmd||'help';if(!cmd)return;
 if(cmd==='clear'){terminalOutput.innerHTML='<p>Terminal cleared. Type <b>help</b> to see available commands.</p>';return;}
 const targets={projects:'projects',sae:'sae',skills:'skills',about:'about',contact:'contact'};
 if(cmd==='help'){terminalOutput.innerHTML='<p>Available commands:</p>'+Object.keys(targets).map(k=>`<button data-command="${k}">${k}</button>`).join('')+'<button data-command="clear">clear</button><p class="terminal-hint">Commands navigate this portfolio. No system commands are executed.</p>';return;}
 if(targets[cmd]){closeTerminal();const target=cmd==='contact'?document.querySelector('.contact'):document.getElementById(targets[cmd]);target.scrollIntoView({behavior:'smooth'});showToast('Navigating to '+cmd.toUpperCase());return;}
 terminalOutput.insertAdjacentHTML('beforeend',`<p class="terminal-muted">command not found: ${escapeHtml(cmd)} · try <b>help</b></p>`);
}
function escapeHtml(s){return s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
terminalOutput.addEventListener('click',e=>{if(e.target.matches('[data-command]'))runCommand(e.target.dataset.command);});
document.getElementById('terminalForm').addEventListener('submit',e=>{e.preventDefault();runCommand(terminalInput.value);terminalInput.value='';});
terminal.addEventListener('click',e=>{if(e.target===terminal)closeTerminal();});

// Small feedback toast
let toastTimer;function showToast(message){const toast=document.getElementById('toast');toast.textContent=message;toast.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove('show'),1800);}

// Keyboard shortcuts
window.addEventListener('keydown',e=>{
 if(e.key==='Escape'){closeLightbox();closePalette();closeTerminal();dismissIntro();}
 if((e.key==='/'&&!['INPUT','TEXTAREA'].includes(document.activeElement.tagName))||((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k')){e.preventDefault();openPalette();}
 if(palette.classList.contains('open')&&e.key==='Enter'){const first=[...palette.querySelectorAll('.palette-results button:not([hidden])')][0];if(first)first.click();}
});
