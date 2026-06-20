const BASE_URL = 'https://free-to-play-games-database.p.rapidapi.com/api';
const API_KEY = 'cedcdf1669mshd0f99ed2a77e7d6p13a0abjsn40273010dc1b';
const API_HOST = 'free-to-play-games-database.p.rapidapi.com';

async function fetchData(endpoint) {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = `${BASE_URL}${cleanEndpoint}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'x-rapidapi-key': API_KEY,
      'x-rapidapi-host': API_HOST
    }
  });

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  return await response.json();
}

function getSaved() {
  const raw = localStorage.getItem('savedItems');
  return raw ? JSON.parse(raw) : [];
}

function setSaved(items) {
  localStorage.setItem('savedItems', JSON.stringify(items));
}
