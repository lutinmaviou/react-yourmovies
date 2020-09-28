import moment from 'moment';
import numeral from 'numeral';
import React, { Component } from 'react';
import { StyleSheet, View, Text, ActivityIndicator, Image, TouchableOpacity, Share, Platform } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { getFilmDetailsFromApi, getImageFromApi } from '../API/TMDBApi';
import { connect } from 'react-redux';
import EnlargeShrink from '../Animations/EnlargeShrink';

class FilmDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            film: undefined,
            isLoading: false
        }
    }

    static navigationOptions = ({ navigation }) => {
        const { params } = navigation.state;
        // On accède à la fonction shareFilm et au film via les paramètres qu'on a ajouté
        // à la navigation
        if (params.film !== undefined && Platform.OS === 'ios') {
            return {
                // On a besoin d'afficher une image, il faut donc passer par une Touchable une
                // fois de plus
                headerRight:
                    <TouchableOpacity
                        style={styles.share_touchable_headerRightButton}
                        onPress={() => params.shareFilm()}
                    >
                        <Image
                            style={styles.share_image}
                            source={require('../Images/ic_share.ios.png')}
                        />
                    </TouchableOpacity>
            }
        }

    }

    _updateNavigationParams() {
        this.props.navigation.setParams({
            shareFilm: this._shareFilm,
            film: this.state.film
        });
    }

    componentDidMount() {
        const favoriteFilmIndex = this.props.favoritesFilm.findIndex(item => item.id === this.props.route.params.idFilm);
        if (favoriteFilmIndex !== -1) {
            // Film déjà dans nos favoris, on a déjà son détail
            // Pas besoin d'appeler l'API ici, on ajoute le détail stocké dans notre state global au state de notre component
            this.setState({
                film: this.props.favoritesFilm[favoriteFilmIndex]
            },
                () => { this._updateNavigationParams() });
            return
        }
        // Le film n'est pas dans nos favoris, on n'a pas son détail
        // On appelle l'API pour récupérer son détail
        this.setState({ isLoading: true });
        getFilmDetailsFromApi(this.props.route.params.idFilm)
            .then(data => {
                this.setState({
                    film: data,
                    isLoading: false
                },
                    () => { this._updateNavigationParams() });
            });
    }

    _displayLoading() {
        if (this.state.isLoading) {
            return (
                <View style={styles.loading_container}>
                    <ActivityIndicator size="large" />
                </View>
            );
        }
    }

    _toggleFavorite() {
        const action = { type: 'TOGGLE_FAVORITE', value: this.state.film };
        this.props.dispatch(action);
    }

    _displayFavoriteImage() {
        let sourceImage = require('../Images/empty-heart.png');
        // Par défaut, si le film n'est pas en favoris, on veut qu'au clic sur le bouton,
        // celui-ci s'agrandisse => shouldEnlarge à true
        let shouldEnlarge = false;
        if (this.props.favoritesFilm.findIndex(item => item.id === this.state.film.id) !== -1) {
            //Film dans favoris
            sourceImage = require('../Images/plein-heart.png');
            // Si le film est dans les favoris, on veut qu'au clic sur le bouton,
            // celui-ci se rétrécisse => shouldEnlarge à false
            shouldEnlarge = true;
        }
        return (
            <EnlargeShrink shouldEnlarge={shouldEnlarge}>
                <Image
                    source={sourceImage}
                    style={styles.favorite_image}
                />
            </EnlargeShrink>
        );
    }

    _displayFilm() {
        const { film } = this.state;
        if (film !== undefined) {
            return (
                <ScrollView style={styles.scrollview_container}>
                    <Image
                        style={styles.image}
                        source={{ uri: getImageFromApi(film.backdrop_path) }}
                    >
                    </Image>
                    <Text style={styles.title_text}>{film.title}</Text>
                    <TouchableOpacity
                        style={styles.favorite_container}
                        onPress={() => this._toggleFavorite()}
                    >
                        {this._displayFavoriteImage()}
                    </TouchableOpacity>
                    <Text style={styles.description_text}>{film.overview}</Text>
                    <Text style={styles.default_text}>Sorti le {moment(new Date(film.release_date)).format('DD/MM/YYYY')}</Text>
                    <Text style={styles.default_text}>Note : {film.vote_average} / 10</Text>
                    <Text style={styles.default_text}>Nombre de votes : {film.vote_count}</Text>
                    <Text style={styles.default_text}>Budget : {numeral(film.budget).format('0,0[.]00 $')}</Text>
                    <Text style={styles.default_text}>Genre(s) : {film.genres.map(genre => {
                        return genre.name;
                    }).join(" | ")}
                    </Text>
                    <Text style={styles.default_text}>Companie(s) : {film.production_companies.map(company => {
                        return company.name;
                    }).join(" | ")}
                    </Text>
                </ScrollView>
            )
        }
    }

    _shareFilm = () => {
        const { film } = this.state;
        Share.share({ title: film.title, message: film.overview });
    }

    _displayFloatingActionButton() {
        const { film } = this.state;
        if (film !== undefined && Platform.OS === 'android') {
            return (
                <TouchableOpacity
                    style={styles.share_touchable_floatingActionButton}
                    onPress={() => this._shareFilm()}
                >
                    <Image
                        style={styles.share_image}
                        source={require('../Images/ic_share.android.png')}
                    />
                </TouchableOpacity>
            )
        }
    }

    render() {
        //const idFilm = this.props.route.params.idFilm;
        return (
            <View style={styles.main_container}>
                {this._displayFilm()}
                {this._displayLoading()}
                {this._displayFloatingActionButton()}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    main_container: {
        flex: 1
    },
    loading_container: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 100,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center'
    },
    scrollview_container: {
        flex: 1
    },
    image: {
        height: 169,
        margin: 5
    },
    title_text: {
        fontWeight: 'bold',
        fontSize: 35,
        flex: 1,
        flexWrap: 'wrap',
        marginLeft: 5,
        marginRight: 5,
        marginTop: 10,
        marginBottom: 10,
        color: '#000000',
        textAlign: 'center'
    },
    description_text: {
        fontStyle: 'italic',
        color: '#666666',
        margin: 5,
        marginBottom: 15
    },
    default_text: {
        marginLeft: 5,
        marginRight: 5,
        marginTop: 5,
    },
    favorite_container: {
        alignItems: 'center'
    },
    favorite_image: {
        flex: 1,
        width: null,
        height: null
    },
    share_touchable_floatingActionButton: {
        position: 'absolute',
        width: 60,
        height: 60,
        right: 30,
        bottom: 30,
        borderRadius: 30,
        backgroundColor: '#e91e63',
        justifyContent: 'center',
        alignItems: 'center'
    },
    share_image: {
        width: 30,
        height: 30
    },
    share_touchable_headerRightButton: {
        marginRight: 8
    }
});

//connexion du state global aux props du component FilmDetails
const mapStateToProps = state => {
    return {
        favoritesFilm: state.favoritesFilm
    }
}
export default connect(mapStateToProps)(FilmDetails);