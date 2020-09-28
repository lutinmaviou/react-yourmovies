import React, { Component } from 'react';
import { View, StyleSheet, Text, Animated } from 'react-native';

class Test extends Component {
    constructor(props) {
        super(props);
        this.state = {
            topPosition: new Animated.Value(0)
        }
    }

    componentDidMount() {
        Animated.spring(
            this.state.topPosition,
            {
                toValue: 100,
                //duration: 3000,
                speed: 4,
                bounciness: 30,
                useNativeDriver: false // Pour ne pas avoir de warning
            }
        ).start();
    }

    render() {
        return (
            <View style={styles.main_container}>
                <Animated.View style={[styles.animation_view, { top: this.state.topPosition }]}>

                </Animated.View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    main_container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    animation_view: {
        backgroundColor: 'red',
        width: 100,
        height: 100
    }
});

export default Test;