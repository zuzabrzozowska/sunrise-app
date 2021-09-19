
import { Dimensions } from 'react-native';

const screenHeight = Math.round(Dimensions.get('window').height);
const screenWidth = Math.round(Dimensions.get('window').width);

module.exports = {
    light: '#F9F8F6',
	blueberry: '#A16D9E',
    yellow: '#F1D4B2',
    pink: '#DFA3A0',
    darkPurple: '#32284F',
    lightPurple: '#AD8EAA',
    mauve: '#9B637B',

    screenHeight,
    screenWidth,
}
