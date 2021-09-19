import { StatusBar } from 'expo-status-bar';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { yellow, light, mauve, darkPurple, blueberry } from '../styles/variables';
import baseStyle from '../styles/base';
import Icon from '../UI/icon';

const Home = ({ navigation, route }) => {
	const [ loaded, setLoaded ] = useState(false);
	const [ sunrise, setSunrise ] = useState(null);
	const { location } = route.params;

	const getSunriseTime = async (location) => {
		const lat = location.coords.latitude;
		const lng = location.coords.longitude;

		try {
			// &date=2021-08-25
			const tomorrow = moment().add(1, 'd').format('YYYY-MM-DD');

			// NOTE: All times are in UTC and summer time adjustments are not included in the returned data.
			let { data } = await axios.get(
				`https://api.sunrise-sunset.org/json?lat=${lat}&lng=${lng}&date=${tomorrow}`
			);
			const sunriseUTC = data.results.sunrise;
			const hours = sunriseUTC.split(':')[0];
			const minutes = sunriseUTC.split(':')[1];

			const sunriseDate = moment.utc(tomorrow).set({ hour: hours, minute: minutes });

			let localTime = moment.utc(sunriseDate).toDate();
			localTime = moment(localTime).format('YYYY-MM-DD HH:mm');

			setSunrise(localTime);

			setLoaded(true);
			if (data.status !== 'OK') {
				console.log('error', data.status);
			}
		} catch (error) {
			setLoaded(true);
			console.log('error', error);
		}
	};

	useEffect(() => {
		if (location) getSunriseTime(location);
	}, []);

	return (
		<View style={styles.container}>
			<Text style={[ baseStyle.textSmallBold ]}>{location.address.city}</Text>
			<Text style={[ baseStyle.textSmall ]}>{moment().format('DD.MM.YYYY   HH:mm')}</Text>

			<Text style={[ baseStyle.textMedium, baseStyle.textBold, { marginTop: 30 } ]}>Sunrise tomorrow:</Text>
			<Text style={[ baseStyle.textLarge, sunrise ? {} : {opacity: 0} ]}>{sunrise ? moment(sunrise).format('HH:mm') : '0'}</Text>

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
