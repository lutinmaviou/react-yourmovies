import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default class FilmDetails extends Component {
    render() {
        const idFilm = this.props.route.params.idFilm;
        return (
            <View style={styles.main_container}>
                <Text>Détails du film avec l'id n° : {idFilm}</Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    main_container: {
        flex: 1
    }
});