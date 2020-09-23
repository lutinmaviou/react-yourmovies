import React, { Component } from 'react';
import { StyleSheet, Button, TextInput, View, FlatList, ActivityIndicator } from 'react-native';
import FilmItem from './FilmItem';
import { getFilmsFromApiWithSearchedText } from '../API/TMDBApi';

class Search extends Component {
    constructor(props) {
        super(props);
        this.searchedText = '';
        this.page = 0;
        this.totalPages = 0;
        this.state = {
            films: [],
            isLoading: false
        }
    }

    _loadFilms() {
        this.setState({ isLoading: true });
        if (this.searchedText.length > 0) {
            getFilmsFromApiWithSearchedText(this.searchedText, this.page + 1)
                .then(data => {
                    this.page = data.page;
                    this.totalPages = data.total_pages;
                    this.setState({
                        films: [...this.state.films, ...data.results],
                        isLoading: false
                    });
                });
        }
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

    _searchedTextInputChanged(text) {
        this.searchedText = text;
    }

    _searchFilms() {
        this.page = 0;
        this.totalPages = 0;
        this.setState({
            films: []
        }, () => {
            this._loadFilms();
        });

    }

    _displayDetailsForFilm = idFilm => {
        this.props.navigation.navigate('Détails', { idFilm });
    }

    render() {
        return (
            <View style={styles.main_container}>
                <TextInput
                    style={styles.textinput}
                    placeholder="Titre du film"
                    onSubmitEditing={() => this._searchFilms()}
                    onChangeText={(text) => this._searchedTextInputChanged(text)} />
                <Button title="Rechercher" onPress={() => { this._searchFilms() }} />
                <FlatList
                    data={this.state.films}
                    keyExtractor={(item) => item.id.toString()}
                    onEndReachedThreshold={1}
                    onEndReached={() => {
                        if (this.page < this.totalPages) {
                            this._loadFilms()
                        }
                    }}
                    renderItem={({ item }) => <FilmItem film={item} displayDetailsForFilm={this._displayDetailsForFilm} />}
                />
                {this._displayLoading()}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    main_container: {
        flex: 1
    },
    textinput: {
        marginLeft: 5,
        marginRight: 5,
        height: 50,
        borderColor: 'black',
        borderWidth: 1,
        paddingLeft: 5
    },
    loading_container: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center'
    }
});

export default Search;