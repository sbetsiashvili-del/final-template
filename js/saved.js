(function () {
  const isLoggedIn = !!localStorage.getItem('user');

  if (!isLoggedIn) {
    document.getElementById('auth-gate').hidden = false;
    document.getElementById('app-main').hidden = true;
    document.getElementById('nav-user').hidden = true;
    document.getElementById('logout-btn').hidden = true;
    return;
  }

  document.getElementById('nav-user').textContent = localStorage.getItem('user');

  // Active nav link
  document.querySelectorAll('.nav__links a').forEach(link => {
    if (link.getAttribute('href') === location.pathname.split('/').pop()) {
      link.classList.add('active');
    }
  });

  // Logout — user gesture, allowed on file://
  document.getElementById('logout-btn').addEventListener('click', () => {
    localStorage.removeItem('user');
    document.cookie = 'authorized=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/';
    window.location.href = 'login.html';
  });

  function renderSaved() {
    const items = getSaved();
    const grid = document.getElementById('saved-grid');
    const empty = document.getElementById('saved-empty');

    grid.innerHTML = '';

    if (!items.length) {
      empty.hidden = false;
      return;
    }

    empty.hidden = true;

    items.forEach(item => {
      const card = document.createElement('article');
      card.className = 'game-card';

      const img = document.createElement('img');
      img.className = 'game-card__image';
      img.src = item.thumbnail;
      img.alt = `${item.title} thumbnail`;

      const body = document.createElement('div');
      body.className = 'game-card__body';

      const title = document.createElement('h3');
      title.className = 'game-card__title';
      title.textContent = item.title;

      const tag = document.createElement('span');
      tag.className = 'game-card__tag';
      tag.textContent = item.genre;

      const statusBtn = document.createElement('button');
      statusBtn.className = 'game-card__status';
      statusBtn.type = 'button';
      if (item.played) {
        statusBtn.textContent = 'თამაშებული ✓';
        statusBtn.classList.add('is-played');
      } else {
        statusBtn.textContent = 'სათამაშოდ';
      }
      statusBtn.addEventListener('click', () => {
        const updated = getSaved().map(saved =>
          saved.id === item.id ? { ...saved, played: !saved.played } : saved
        );
        setSaved(updated);
        renderSaved();
      });

      const removeBtn = document.createElement('button');
      removeBtn.type = 'button';
      removeBtn.className = 'game-card__remove';
      removeBtn.textContent = 'წაშლა';
      removeBtn.addEventListener('click', () => {
        const updated = getSaved().filter(saved => saved.id !== item.id);
        setSaved(updated);
        renderSaved();
      });

      body.appendChild(title);
      body.appendChild(tag);
      body.appendChild(statusBtn);
      body.appendChild(removeBtn);

      card.appendChild(img);
      card.appendChild(body);
      grid.appendChild(card);
    });
  }

  renderSaved();

})();
