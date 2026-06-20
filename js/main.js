(function () {
  // --- Auth check: no redirect, just show/hide content ---
  const isLoggedIn = !!localStorage.getItem('user');

  if (!isLoggedIn) {
    document.getElementById('auth-gate').hidden = false;
    document.getElementById('app-main').hidden = true;
    // Hide header user/logout too
    document.getElementById('nav-user').hidden = true;
    document.getElementById('logout-btn').hidden = true;
    return;
  }

  // --- Logged-in state ---
  document.getElementById('nav-user').textContent = localStorage.getItem('user');

  // Active nav link
  document.querySelectorAll('.nav__links a').forEach(link => {
    if (link.getAttribute('href') === location.pathname.split('/').pop()) {
      link.classList.add('active');
    }
  });

  // Logout — user gesture, window.location IS allowed here
  document.getElementById('logout-btn').addEventListener('click', () => {
    localStorage.removeItem('user');
    document.cookie = 'authorized=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/';
    window.location.href = 'login.html';
  });

  // --- State ---
  let savedItems = getSaved();

  function showLoading() {
    document.getElementById('error-msg').hidden = true;
    document.getElementById('loading-msg').hidden = false;
    document.getElementById('results-grid').innerHTML = '';
  }

  function showError(message) {
    document.getElementById('loading-msg').hidden = true;
    const errorMsg = document.getElementById('error-msg');
    errorMsg.textContent = message;
    errorMsg.hidden = false;
  }

  function renderResults(items) {
    const grid = document.getElementById('results-grid');
    grid.innerHTML = '';

    if (items.length === 0) {
      showError('ამ ფილტრით თამაში ვერ მოიძებნა.');
      return;
    }

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

      const saveBtn = document.createElement('button');
      saveBtn.className = 'game-card__save';

      const isSaved = savedItems.some(saved => saved.id === item.id);
      if (isSaved) {
        saveBtn.textContent = 'შენახულია ✓';
        saveBtn.classList.add('is-saved');
      } else {
        saveBtn.textContent = 'შენახვა';
      }

      saveBtn.addEventListener('click', () => {
        const alreadySaved = savedItems.some(saved => saved.id === item.id);
        if (alreadySaved) {
          savedItems = savedItems.filter(saved => saved.id !== item.id);
          setSaved(savedItems);
          saveBtn.textContent = 'შენახვა';
          saveBtn.classList.remove('is-saved');
        } else {
          const itemToSave = {
            id: item.id,
            title: item.title,
            thumbnail: item.thumbnail,
            genre: item.genre,
            platform: item.platform,
            short_description: item.short_description,
            played: false
          };
          savedItems.push(itemToSave);
          setSaved(savedItems);
          saveBtn.textContent = 'შენახულია ✓';
          saveBtn.classList.add('is-saved');
        }
      });

      const detailsBtn = document.createElement('button');
      detailsBtn.className = 'game-card__details';
      detailsBtn.textContent = 'დეტალები';
      detailsBtn.addEventListener('click', () => openModal(item.id));

      body.appendChild(title);
      body.appendChild(tag);
      body.appendChild(saveBtn);
      body.appendChild(detailsBtn);

      card.appendChild(img);
      card.appendChild(body);
      grid.appendChild(card);
    });
  }

  // საძიებო ფუნქცია — გამოიყენება ფორმის submit-ზეც და auto-load-ზეც
  async function loadGames() {
    const nameVal = document.getElementById('search-name').value.trim();
    const genreVal = document.getElementById('search-genre').value;
    const platformVal = document.querySelector('input[name="platform"]:checked').value;

    const params = [];
    if (platformVal !== 'all') params.push(`platform=${platformVal}`);
    if (genreVal !== '') params.push(`category=${genreVal}`);

    const endpoint = `games${params.length > 0 ? '?' + params.join('&') : ''}`;

    showLoading();

    try {
      const data = await fetchData(endpoint);
      document.getElementById('loading-msg').hidden = true;
      let filtered = data;
      if (nameVal) {
        filtered = data.filter(item =>
          item.title.toLowerCase().includes(nameVal.toLowerCase())
        );
      }
      renderResults(filtered);
    } catch (err) {
      showError('თამაშების ჩატვირთვა ვერ მოხერხდა. სცადეთ თავიდან.');
    }
  }

  // Search form submit
  document.getElementById('search-form').addEventListener('submit', (e) => {
    e.preventDefault();
    loadGames();
  });

  // ავტომატური ჩატვირთვა გვერდის გახსნისას
  loadGames();

  async function openModal(gameId) {
    const modal = document.getElementById('details-modal');
    const loading = document.getElementById('modal-loading');
    const errorEl = document.getElementById('modal-error');
    const body = document.getElementById('modal-body');

    modal.hidden = false;
    loading.hidden = false;
    errorEl.hidden = true;
    body.innerHTML = '';

    try {
      const data = await fetchData(`game?id=${gameId}`);
      loading.hidden = true;

      const title = document.createElement('h2');
      title.textContent = data.title;
      body.appendChild(title);

      const meta = document.createElement('p');
      meta.innerHTML = `<strong>ჟანრი:</strong> ${data.genre} | <strong>პლატფორმა:</strong> ${data.platform} | <strong>გამოშვების თარიღი:</strong> ${data.release_date}`;
      body.appendChild(meta);

      const desc = document.createElement('p');
      desc.textContent = data.description;
      body.appendChild(desc);

      const reqTitle = document.createElement('h3');
      reqTitle.textContent = 'სისტემური მოთხოვნები';
      body.appendChild(reqTitle);

      const reqs = data.minimum_system_requirements;
      const reqsText = document.createElement('p');
      if (reqs && (reqs.os || reqs.processor || reqs.memory || reqs.graphics || reqs.storage)) {
        reqsText.innerHTML = `
          <strong>ოპ. სისტემა:</strong> ${reqs.os || 'არ არის მითითებული'}<br>
          <strong>პროცესორი:</strong> ${reqs.processor || 'არ არის მითითებული'}<br>
          <strong>ოპ. მეხსიერება:</strong> ${reqs.memory || 'არ არის მითითებული'}<br>
          <strong>ვიდეობარათი:</strong> ${reqs.graphics || 'არ არის მითითებული'}<br>
          <strong>დისკის სივრცე:</strong> ${reqs.storage || 'არ არის მითითებული'}
        `;
      } else {
        reqsText.textContent = 'მინიმალური სისტემური მოთხოვნები არ არის ხელმისაწვდომი.';
      }
      body.appendChild(reqsText);

      if (data.screenshots && data.screenshots.length > 0) {
        const galleryTitle = document.createElement('h3');
        galleryTitle.textContent = 'გალერეა';
        body.appendChild(galleryTitle);

        data.screenshots.forEach((shot, index) => {
          const screenshotImg = document.createElement('img');
          screenshotImg.src = shot.image;
          screenshotImg.alt = `${data.title} screenshot ${index + 1}`;
          body.appendChild(screenshotImg);
        });
      }

    } catch (err) {
      loading.hidden = true;
      errorEl.textContent = 'დეტალების ჩატვირთვა ვერ მოხერხდა.';
      errorEl.hidden = false;
    }
  }

  function closeModal() {
    document.getElementById('details-modal').hidden = true;
  }

  document.getElementById('modal-close').addEventListener('click', closeModal);
  document.getElementById('details-modal').addEventListener('click', (e) => {
    if (e.target === document.getElementById('details-modal')) closeModal();
  });

})();
