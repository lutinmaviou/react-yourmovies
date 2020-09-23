import { API_TOKEN } from './TMDBToken';

const BASE_URL = 'https://api.themoviedb.org/3/';

export function getFilmsFromApiWithSearchedText(text, page) {
    const url = `${BASE_URL}search/movie?api_key=${API_TOKEN.token}&language=fr&query=${text}&page=${page}`;

    return fetch(url)
        .then((response) => response.json())
        .catch((error) => console.log(error));
}

export function getImageFromApi(name) {
    return `https://image.tmdb.org//t/p/w300/${name}`;
}

export function getFilmDetailsFromApi(id) {
    const url = `${BASE_URL}movie/${id}?api_key=${API_TOKEN.token}&language=fr`;

    return fetch(url)
        .then((response) => response.json())
        .catch((error) => console.log(error));
}