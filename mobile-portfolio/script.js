const lightbox = document.getElementById('lightbox');
const preview = lightbox.querySelector('img');
const caption = lightbox.querySelector('p');
document.querySelectorAll('.gallery img').forEach((img) => {
  img.addEventListener('click', () => {
    preview.src = img.src;
    preview.alt = img.alt;
    caption.textContent = img.closest('figure').querySelector('figcaption').textContent;
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
  });
});
function closeLightbox() {
  lightbox.classList.remove('open');
  lightbox.setAttribute('aria-hidden', 'true');
  preview.src = '';
}
lightbox.querySelector('.close').addEventListener('click', closeLightbox);
lightbox.addEventListener('click', (event) => { if (event.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeLightbox(); });
