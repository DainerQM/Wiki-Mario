/* ── Carrusel mejorado con dirección de slide y dots ── */
function iniciarCarrusel(carrusel) {
  const items = carrusel.querySelectorAll('.item__carrusel');
  let index = 0;
  let isAnimating = false;

  // Crear dots
  const dotsContainer = document.createElement('div');
  dotsContainer.className = 'carrusel-dots';
  items.forEach((_, i) => {
    const dot = document.createElement('span');
    dot.className = 'carrusel-dot' + (i === 0 ? ' active' : '');
    dotsContainer.appendChild(dot);
  });
  carrusel.insertAdjacentElement('afterend', dotsContainer);

  function updateDots(i) {
    dotsContainer.querySelectorAll('.carrusel-dot').forEach((d, idx) => {
      d.classList.toggle('active', idx === i);
    });
  }

  function showSlide(nextIndex) {
    if (isAnimating || nextIndex === index) return;
    isAnimating = true;

    const current = items[index];
    const next    = items[nextIndex];

    // "leaving" sale por la izquierda
    current.classList.add('leaving');

    // el siguiente entra desde la derecha (ya tiene translateX(20px) por CSS)
    next.classList.add('active');

    setTimeout(() => {
      current.classList.remove('active', 'leaving');
      isAnimating = false;
      index = nextIndex;
      updateDots(index);
    }, 620);
  }

  function nextSlide() {
    showSlide((index + 1) % items.length);
  }

  // Mostrar primero sin animación
  items[index].classList.add('active');
  updateDots(index);

  carrusel.intervalo = setInterval(nextSlide, 3000);

  carrusel.reset = function () {
    clearInterval(carrusel.intervalo);
    items.forEach(item => item.classList.remove('active', 'leaving'));
    index = 0;
    isAnimating = false;
    items[0].classList.add('active');
    updateDots(0);
    carrusel.intervalo = setInterval(nextSlide, 3000);
  };
}

document.querySelectorAll('.carrusel').forEach(c => iniciarCarrusel(c));

/* ── Navegación de proyectos ── */
const projects = {
  pj1: { btn: '#pj1', panel: '.pj1' },
  pj2: { btn: '#pj2', panel: '.pj2' },
  pj3: { btn: '#pj3', panel: '.pj3' },
};

const allPanels = [...document.querySelectorAll('.pj1, .pj2, .pj3, .well')];
const allBtns   = document.querySelectorAll('.link__buttons a');

function activarProyecto(panelEl, btnEl) {
  const current = allPanels.find(p => p.classList.contains('active'));

  if (current && current !== panelEl) {
    current.classList.remove('active');
    current.classList.add('leaving');

    current.addEventListener('transitionend', () => {
      current.classList.remove('leaving');
    }, { once: true });
  }

  // Espera un poco antes de mostrar la nueva — overlap suave
  setTimeout(() => {
    panelEl.classList.add('active');
  }, 80);

  allBtns.forEach(a => a.classList.remove('active-btn'));
  if (btnEl) btnEl.classList.add('active-btn');

  const carrusel = panelEl.querySelector('.carrusel');
  if (carrusel && carrusel.reset) carrusel.reset();
}

Object.values(projects).forEach(({ btn, panel }) => {
  const btnEl   = document.querySelector(btn);
  const panelEl = document.querySelector(panel);
  if (btnEl && panelEl) {
    btnEl.addEventListener('click', e => {
      e.preventDefault();
      activarProyecto(panelEl, btnEl);
    });
  }
});

// Home opcional
const prjHome = document.querySelector('#home');
const well    = document.querySelector('.well');
if (prjHome && well) {
  prjHome.addEventListener('click', e => {
    e.preventDefault();
    activarProyecto(well, prjHome);
  });
}