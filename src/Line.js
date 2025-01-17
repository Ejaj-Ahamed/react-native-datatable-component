import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const Line = React.memo((props) => <View style={[props.row ? styles.rowLine : styles.headerLine, { width: props.width, height: props.height||0.4 }]} />)

export default Line;

const styles = StyleSheet.create({
    headerLine: {
        height: 0.4,
        opacity: 0.4,
        backgroundColor: 'grey',
        width,
        alignSelf: 'center'
    },
    rowLine: {
        height: 1,
        backgroundColor: '#000',
        width,
        alignSelf: 'center'
    }
});
