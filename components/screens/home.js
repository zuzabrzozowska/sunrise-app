import { StatusBar } from 'expo-status-bar';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { yellow, light, mauve, darkPurple, blueberry } from '../styles/variables';
import baseStyle from '../styles/base';
import Icon from '../UI/icon';
import * as Notifications from 'expo-notifications';
import { getLocalTime, getItemStorage } from '../../helpers';

const Home = ({ navigation, route }) => {
	const [ sunrise, setSunrise ] = useState(null);
	const [ now, setNow ] = useState(moment().format('DD.MM.YYYY   HH:mm'));
	const { location } = route.params;

	useEffect(() => {
        const minute = 60000
		const interval = setInterval(() => {
			alarmNotification();
			setNow(moment().format('DD.MM.YYYY   HH:mm'));
		}, minute);
		return () => clearInterval(interval);
	}, []);

	const testTime = moment().set({ hour: 19, minute: 12, second: 0 });

	const alarmNotification = async () => {
        const chosenTime = await getItemStorage('chosenTime')
        
		const timeToWakeUp = moment().format('DD-MM-YYYY HH:mm') === moment(sunrise).format('DD-MM-YYYY HH:mm');
        
		if (timeToWakeUp) {
			await Notifications.scheduleNotificationAsync({
				content: {
					title: chosenTitle || 'Time to get up',
					body: 'The sun rises in ' + location.address.city + '.',
					sound: 'alarm1.wav' // only Bare Workflow
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
			<Text style={[ baseStyle.textSmallBold ]}>{location.address.city}</Text>
			<Text style={[ baseStyle.textSmall ]}>{now}</Text>

			<Text style={[ baseStyle.textMedium, baseStyle.textBold, { marginTop: 30 } ]}>Sunrise {moment(sunrise).format('YY-MM-DD') === moment().format('YY-MM-DD') ? 'today' : 'tomorrow'}:</Text>
			<Text style={[ baseStyle.textLarge, sunrise ? {} : { opacity: 0 } ]}>
				{sunrise ? moment(sunrise).format('HH:mm') : '0'}
			</Text>

			<TouchableOpacity
				style={[ styles.sideButton, { backgroundColor: yellow, bottom: 150 } ]}
				onPress={() => navigation.navigate('Settings')}
			>
				<Icon size={30} name="sliders-h" color={darkPurple} />
			</TouchableOpacity>

			<TouchableOpacity
				style={[ styles.sideButton, { backgroundColor: blueberry, bottom: 50 } ]}
				onPress={() => navigation.navigate('Calendar')}
			>
				<Icon size={30} name="calendar-alt" color={darkPurple} />
			</TouchableOpacity>

			<Text
				style={[ baseStyle.textMini, { color: mauve, fontSize: 11, position: 'absolute', bottom: 0, left: 3 } ]}
			>
				API: sunrise-sunset.org
			</Text>

			<StatusBar style="auto" />
		</View>
	);
};

export default Home;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: light,
		alignItems: 'center',
		justifyContent: 'center'
	},
	sideButton: { position: 'absolute', right: 0, padding: 20, borderTopLeftRadius: 10, borderBottomLeftRadius: 10 }
});
