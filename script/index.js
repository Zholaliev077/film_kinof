const API = "https://kinopoiskapiunofficial.tech/api/";
const API_KEY = "f8d73767-61cd-48e9-9df0-fd379d919b66";

const GET_ALL_FILMS = API + "v2.2/films";
const GET_DETAILED_FILM_ID = API + "v2.2/films/";
const SEARCH_BY_KEYWORD = API + "v2.1/films/search-by-keyword";
const GET_PREMIERES = API + "v2.2/films/premieres";

const headers = {
  "X-API-KEY": API_KEY,
  "Content-Type": "application/json",
};

// Вывод всех фильмов
const fetchAllFilms = async () => {
  try {
    const req = await fetch(GET_ALL_FILMS, { headers });
    const res = await req.json();
    renderFilms(res.items);
  } catch (error) {
    console.error("Ошибка при загрузке фильмов:", error);
  }
};

// Получение детальной информации о фильме
const fetchFilmDetails = async (id) => {
  try {
    const req = await fetch(GET_DETAILED_FILM_ID + id, { headers });
    const res = await req.json();
    renderFilmDetails(res);
  } catch (error) {
    console.error("Ошибка при загрузке подробной информации о фильме:", error);
  }
};

// Поиск по ключевым словам
const fetchSearch = async (keyword) => {
  try {
    const response = await fetch(
      `${SEARCH_BY_KEYWORD}?keyword=${encodeURIComponent(keyword)}`,
      {
        headers,
      }
    );
    const data = await response.json();
    if (!data.films || data.films.length === 0) {
      document.getElementById("output").innerHTML = "<p>Фильмы не найдены.</p>";
      return;
    }
    renderFilms(data.films);
  } catch (error) {
    console.error("Ошибка при поиске:", error);
  }
};

// Получение списка кинопремьер
const fetchPremieres = async (year, month) => {
  try {
    const response = await fetch(
      `${GET_PREMIERES}?year=${year}&month=${month}`,
      {
        headers,
      }
    );
    const data = await response.json();
    renderFilms(data.items);
  } catch (error) {
    console.error("Ошибка при загрузке премьер:", error);
  }
};

// Рендер списка фильмов
const renderFilms = (films) => {
  const output = document.getElementById("output");
  output.innerHTML = ""; // Очистка перед новым рендерингом

  films.forEach((film) => {
    const card = document.createElement("div");
    card.classList.add("card");

    const img = document.createElement("img");
    img.src = film.posterUrlPreview || "default.jpg";
    img.alt = "Постер";

    const title = document.createElement("h1");
    title.textContent = film.nameOriginal || film.nameRu || film.year;

    card.append(img, title);

    card.addEventListener("click", () => fetchFilmDetails(film.kinopoiskId));
    output.append(card);
  });
};

// Рендер деталей фильма
const renderFilmDetails = (film) => {
  const details = document.getElementById("filmDetails");
  details.innerHTML = `
    <h2>${film.nameRu || film.nameOriginal}</h2>
    <p><strong>Жанр:</strong> ${film.genres.map((g) => g.genre).join(", ")}</p>
    <p><strong>Рейтинг:</strong> ${film.rating || "Нет рейтинга"}</p>
    <p><strong>Описание:</strong>   ${film.description || "Нет описания"}</p>
    <img src="${film.posterUrl}" alt="Постер">
  `;
};

// Обработчик формы поиска
document.getElementById("searchForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const keyword = document.getElementById("searchInput").value.trim();
  if (keyword) fetchSearch(keyword);
});

// Обработчик формы премьер
document.getElementById("premiereForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const year =
    document.getElementById("yearInput").value || new Date().getFullYear();
  const month = document.getElementById("monthSelect").value;
  fetchPremieres(year, month);
});

// Начальная загрузка фильмов
fetchAllFilms();
