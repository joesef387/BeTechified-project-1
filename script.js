const root = document.documentElement;
const themeToggle = document.getElementById('theme-toggle');
const menuToggle = document.getElementById('menu-toggle');
const navMenu = document.getElementById('nav-menu');

function applyTheme(theme) {
  const darkMode = theme === 'dark';
  root.setAttribute('data-theme', darkMode ? 'dark' : 'light');

  if (themeToggle) {
    themeToggle.textContent = darkMode ? 'Light mode' : 'Dark mode';
    themeToggle.setAttribute('aria-label', darkMode ? 'Switch to light mode' : 'Switch to dark mode');
  }
}

const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
  applyTheme(savedTheme);
} else {
  applyTheme('light');
}

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const nextTheme = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    localStorage.setItem('theme', nextTheme);
    applyTheme(nextTheme);
  });
}

if (menuToggle && navMenu) {
  menuToggle.addEventListener('click', () => {
    const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
    const nextExpanded = !expanded;
    menuToggle.setAttribute('aria-expanded', String(nextExpanded));
    navMenu.classList.toggle('open', nextExpanded);
  });

  navMenu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 768) {
        menuToggle.setAttribute('aria-expanded', 'false');
        navMenu.classList.remove('open');
      }
    });
  });
}

const revealElements = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealElements.forEach((element) => revealObserver.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add('visible'));
}

const projectCards = document.querySelectorAll('.project-card');
const filterButtons = document.querySelectorAll('.filter-btn');
const searchInput = document.getElementById('project-search');
const noResults = document.getElementById('no-results');

let activeFilter = 'all';

function updateProjects() {
  const query = searchInput ? searchInput.value.trim().toLowerCase() : '';

  let visibleCount = 0;

  projectCards.forEach((card) => {
    const matchesFilter = activeFilter === 'all' || card.dataset.category === activeFilter;
    const text = card.textContent.toLowerCase();
    const matchesSearch = !query || text.includes(query);

    const shouldShow = matchesFilter && matchesSearch;
    card.classList.toggle('hidden', !shouldShow);

    if (shouldShow) {
      visibleCount += 1;
    }
  });

  if (noResults) {
    noResults.hidden = visibleCount !== 0;
  }
}

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    activeFilter = button.dataset.filter;
    filterButtons.forEach((item) => item.classList.toggle('active', item === button));
    updateProjects();
  });
});

if (searchInput) {
  searchInput.addEventListener('input', updateProjects);
}

updateProjects();

const form = document.getElementById('contact-form');
const successMessage = document.getElementById('form-success');

function setFieldState(field, isValid, message) {
  const wrapper = field.closest('.form-group');
  if (!wrapper) return;

  wrapper.classList.toggle('invalid', !isValid);
  wrapper.classList.toggle('valid', isValid);

  const errorEl = wrapper.querySelector('.error-message');
  if (errorEl) {
    errorEl.textContent = message;
  }
}

if (form) {
  const fields = {
    name: form.querySelector('#name'),
    email: form.querySelector('#email'),
    message: form.querySelector('#message')
  };

  Object.entries(fields).forEach(([key, field]) => {
    if (!field) return;

    field.addEventListener('blur', () => {
      if (key === 'name') {
        const valid = field.value.trim().length >= 2;
        setFieldState(field, valid, valid ? '' : 'Please enter your name.');
      }

      if (key === 'email') {
        const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value.trim());
        setFieldState(field, valid, valid ? '' : 'Please enter a valid email.');
      }

      if (key === 'message') {
        const valid = field.value.trim().length >= 10;
        setFieldState(field, valid, valid ? '' : 'Please enter a message with at least 10 characters.');
      }
    });
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    let formIsValid = true;

    if (!fields.name || fields.name.value.trim().length < 2) {
      setFieldState(fields.name, false, 'Please enter your name.');
      formIsValid = false;
    } else {
      setFieldState(fields.name, true, '');
    }

    if (!fields.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email.value.trim())) {
      setFieldState(fields.email, false, 'Please enter a valid email.');
      formIsValid = false;
    } else {
      setFieldState(fields.email, true, '');
    }

    if (!fields.message || fields.message.value.trim().length < 10) {
      setFieldState(fields.message, false, 'Please enter a message with at least 10 characters.');
      formIsValid = false;
    } else {
      setFieldState(fields.message, true, '');
    }

    if (formIsValid && successMessage) {
      successMessage.hidden = false;
      form.reset();
      Object.values(fields).forEach((field) => {
        if (!field) return;
        field.closest('.form-group')?.classList.remove('valid', 'invalid');
      });
    }
  });
}
