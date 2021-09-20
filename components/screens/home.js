import { StatusBar } from 'expo-status-bar';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import axios from 'axios';
import {
	yellow,
	light,
	mauve,
	darkPurple,
	blueberry,
	lightPurple,
	screenHeight,
	screenWidth
} from '../styles/variables';
import baseStyle from '../styles/base';
import Icon from '../UI/icon';
import * as Notifications from 'expo-notifications';
import { getLocalTime, getItemStorage, storeObjectDataStorage } from '../../helpers';
import BG from '../../assets/bg.png';

const Home = ({ navigation, route }) => {
	const [ sunrise, setSunrise ] = useState(null);
	const { location } = route.params;

	useEffect(() => {
		const minute = 60000;
		const interval = setInterval(() => {
			alarmNotification();
		}, minute);
		return () => clearInterval(interval);
	}, []);

	const testTime = moment().set({ hour: 22, minute: 55, second: 0 });

	const alarmNotification = async () => {
		const chosenTime = await getItemStorage('chosenTime');
        const chosenSound = await getItemStorage('chosenSound');
		const label = await getItemStorage('label');

        console.log('chosenTime', chosenTime)

		const timeToWakeUp = moment().format('DD-MM-YYYY HH:mm') === moment(sunrise).format('DD-MM-YYYY HH:mm');

		if (timeToWakeUp) {
			await Notifications.scheduleNotificationAsync({
				content: {
					title: label || 'Sunrise alert',
					body: 'The sun rises in ' + location.address.city + '.',
                    sound: chosenSound || 'alert1.wav'
				},
				trigger: null
			});
		}
	};

	const getSunriseTime = async (location) => {
		const lat = location.coords.latitude;
		const lng = location.coords.longitude;

		try {
			let { data: dataToday } = await axios.get(`https://api.sunrise-sunset.org/json?lat=${lat}&lng=${lng}`);

			const sunriseToday = getLocalTime(dataToday.results.sunrise, moment());

			// if is after sunrise today, then get tomorrow
			if (moment().isAfter(sunriseToday)) {
				const tomorrow = moment().add(1, 'd').format('YYYY-MM-DD');
				let { data: dataTomorrow } = await axios.get(
					`https://api.sunrise-sunset.org/json?lat=${lat}&lng=${lng}&date=${tomorrow}`
				);

				const sunriseTomorrow = getLocalTime(dataTomorrow.results.sunrise, tomorrow);
				setSunrise(sunriseTomorrow);
			} else {
				setSunrise(sunriseToday);
			}
		} catch (error) {
			console.log('error', error);
		}
	};

	useEffect(() => {
		if (location) getSunriseTime(location);
	}, []);

	return (
		<View style={styles.container}>
			<Image source={BG} style={styles.background} />

			<View style={{ borderRadius: 100, padding: 10, backgroundColor: light, marginTop: 150 }}>
				<Image
					source={{ uri: 'https://freepngimg.com/thumb/sun/23533-7-sun-transparent-image-thumb.png' }}
					style={styles.sun}
				/>
			</View>

			<Text style={[ baseStyle.textSmallBold ]}>{location.address.city}</Text>

			<Text style={[ baseStyle.textLarge, { marginTop: 10 } ]}>
				Sunrise {moment(sunrise).format('YY-MM-DD') === moment().format('YY-MM-DD') ? 'today' : 'tomorrow'}:
			</Text>
			<Text style={[ baseStyle.textLarge, baseStyle.textBold, sunrise ? {} : { opacity: 0 } ]}>
				{sunrise ? moment(sunrise).format('HH:mm') : '0'}
			</Text>

			<TouchableOpacity
				onPress={() => navigation.navigate('Settings')}
				style={[ baseStyle.button, { marginTop: 20 } ]}
			>
				<Text style={[ baseStyle.textSmall, { textAlign: 'center' } ]}>Start here</Text>
			</TouchableOpacity>

			{/* <TouchableOpacity
				style={[ styles.sideButton, { backgroundColor: lightPurple, bottom: 30 } ]}
				onPress={() => navigation.navigate('Calendar')}
			>
				<Icon size={30} name="calendar-alt" color={mauve} />
			</TouchableOpacity> */}

			<Text style={[ baseStyle.textMini, styles.footer ]}>API: sunrise-sunset.org</Text>

			<StatusBar style="auto" />
		</View>
	);
};

export default Home;

const styles = StyleSheet.create({
	container: {
		backgroundColor: light,
		alignItems: 'center',
		justifyContent: 'center',
		height: screenHeight
	},
	sideButton: { position: 'absolute', right: 0, padding: 20, borderTopLeftRadius: 10, borderBottomLeftRadius: 10 },
	sun: {
		height: 80,
		width: 80,
		opacity: 0.45,
		resizeMode: 'contain'
	},
	background: {
		position: 'absolute',
		top: 0,
		height: screenHeight / 2.1,
		width: screenWidth,
		resizeMode: 'cover'
	},
	footer: { color: lightPurple, fontSize: 11, position: 'absolute', bottom: 0, left: 3 }
});
