import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import Search from '../Components/Search';
import FilmDetails from '../Components/FilmDetails';
import Favorites from '../Components/Favorites';
import { Image, StyleSheet } from 'react-native';
import Test from '../Components/Test';

const SearchStackNavigator = createStackNavigator();

function SearchStack() {
    return (
        <SearchStackNavigator.Navigator>
            <SearchStackNavigator.Screen name="Rechercher" component={Search} />
            <SearchStackNavigator.Screen name="Détails" component={FilmDetails} />
        </SearchStackNavigator.Navigator>
    );
}
const FavoritesStackNavigator = createStackNavigator();

function FavoritesStack() {
    return (
        <FavoritesStackNavigator.Navigator>
            <FavoritesStackNavigator.Screen name="Favoris" component={Favorites} />
            <FavoritesStackNavigator.Screen name="Détails" component={FilmDetails} />
        </FavoritesStackNavigator.Navigator>
    )
}

const MoviesTabNavigator = createBottomTabNavigator();

function MyTabs() {
    return (
        <MoviesTabNavigator.Navigator tabBarOptions={{
            activeBackgroundColor: '#DDDDDD',
            inactiveBackgroundColor: '#FFFFFF'
        }}>
            <MoviesTabNavigator.Screen name="Rechercher" component={SearchStack} options={{
                activeBackgroundColor: 'gold',
                tabBarLabel: '',
                tabBarIcon: () => (
                    <Image
                        source={require('../Images/ic_search.png')}
                        style={styles.icon}
                    />
                )
            }}
            />
            <MoviesTabNavigator.Screen name="Favoris" component={FavoritesStack} options={{
                tabBarLabel: '',
                tabBarIcon: () => (
                    <Image
                        source={require('../Images/ic_favorite.png')}
                        style={styles.icon}
                    />
                )
            }}
            />
            {/* <MoviesTabNavigator.Screen name="Test" component={Test} /> */}
        </MoviesTabNavigator.Navigator>
    );
}

const styles = StyleSheet.create({
    icon: {
        width: 30,
        height: 30,
        marginTop: 20
    }
});

export default function App() {
    return (
        <NavigationContainer>
            <MyTabs />
        </NavigationContainer>
    );
}