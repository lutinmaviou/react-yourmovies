const initialState = { favoritesFilm: [] };

export default toggleFavorite = (state = initialState, action) => {
    let nextState;
    switch (action.type) {
        case 'TOGGLE_FAVORITE':
            const favoriteFilmIndex = state.favoritesFilm.findIndex(item => item.id === action.value.id);
            if (favoriteFilmIndex !== -1) {
                //suppression
                nextState = {
                    ...state,
                    favoritesFilm: state.favoritesFilm.filter((item, index) => index !== favoriteFilmIndex)
                }
            }
            else {
                //ajouter
                nextState = {
                    ...state,
                    // concaténation des films de notre state actuel avec celui dans action.value, dans favoritesFilm
                    favoritesFilm: [...state.favoritesFilm, action.value]
                }
            }
            // renvoie nextState s'il ne vaut pas undefined, sinon renvoie state
            return nextState || state;
        default:
            return state;
    }
}