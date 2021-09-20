import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Image, Switch } from 'react-native';
import baseStyle from '../styles/base';
import { lightPurple, mauve, screenWidth, screenHeight, pink, yellow, blueberry, light } from '../styles/variables';
import { getItemStorage, storeItemStorage, getObjectDataStorage, storeObjectDataStorage, viewStorage } from '../../helpers';
import { Picker } from '@react-native-picker/picker';
import BG from '../../assets/bg.png';

const Settings = ({ navigation }) => {
	const [ editedInfo, setEditedInfo ] = useState(null);
	const [ repeat, setRepeat ] = useState('');
	const [ label, setLabel ] = useState('');
	const [ chosenTime, setChosenTime ] = useState('');
	const [ chosenSound, setChosenSound ] = useState('alert1.wav');
	const [ isEnabled, setIsEnabled ] = useState(true)

	useEffect(() => {
		getInitSettings();
	}, []);

	const getInitSettings = async () => {
		viewStorage()

		setRepeat((await getItemStorage('repeat')) || 'every');
		setLabel((await getItemStorage('label')) || 'Sunrise alert');
		setChosenTime((await getItemStorage('chosenTime')) || 'sunrise');
	};

	const repeatOptions = [
		{ value: 'every', label: 'Every day' },
		{ value: 'weekends', label: 'Weekends' },
		{ value: 'weekdays', label: 'Weekdays' },
		{ value: 'once', label: 'Once' }
	];

	const timeOptions = [
		{ value: 'sunrise', label: 'At sunrise' },
		{ value: 'sunrise-15', label: '15 min before' },
		{ value: 'sunrise+15', label: '15 min after' },
		{ value: 'sunrise+30', label: '30 min after' }
	];

	const soundOptions = [
		{ value: 'alert1.wav', label: 'Alert1' },
		{ value: 'alert2.wav', label: 'Alert2' },
		{ value: 'alert3.wav', label: 'Alert3' },
	];

	const getRepeatLabel = (options, value) => {
		if (!options || !value) return '';
		return (
			(repeatOptions.find((o) => o.value === repeat) && repeatOptions.find((o) => o.value === repeat).label) || ''
		);
	};

	const getTimeLabel = (options, value) => {
		if (!options || !value) return '';
		return (
			(timeOptions.find((o) => o.value === chosenTime) &&
				timeOptions.find((o) => o.value === chosenTime).label) ||
			''
		);
	};

	useEffect(
		() => {
			storeItemStorage('repeat', repeat);
			storeItemStorage('chosenTime', chosenTime);
			setEditedInfo(null);
		},
		[ repeat, chosenTime]
	);

	const saveLabel = () => {
		storeItemStorage('label', label);
		setEditedInfo(null);
	}

	const toggle = (type) => {
		setEditedInfo(editedInfo === type ? null : type);
	};

	const saveSettings = () => {
		navigation.pop();
	};

	return (
		<View style={styles.container}>
			<StatusBar style="auto" />

			<Text
				style={[
					baseStyle.textLarge,
					baseStyle.textBold,
					{ color: light, zIndex: 9, marginTop: screenHeight / 15 }
				]}
			>
				Settings
			</Text>

			<Image source={BG} style={styles.background} />

			<View style={[ baseStyle.card, { width: screenWidth * 0.9, minHeight: 330, marginTop: 20 } ]}>
				
				{!Boolean(editedInfo && editedInfo !== 'repeat') ? (
					<TouchableOpacity style={styles.row} onPress={() => toggle('repeat')}>
					<Text style={[ baseStyle.textSmall, { paddingLeft: 10 } ]}>Repeat</Text>
					<Text style={[ baseStyle.textSmall ]}>
						{getRepeatLabel(repeatOptions, repeat)} {'>'}
					</Text>
				</TouchableOpacity>
				) : null}
				{editedInfo === 'repeat' ? (
					<Picker selectedValue={repeat} onValueChange={(itemValue) => setRepeat(itemValue)}>
						{repeatOptions.map((o) => <Picker.Item key={o.value} label={o.label} value={o.value} />)}
					</Picker>
				) : null}

				{!Boolean(editedInfo && editedInfo !== 'label') ? (
					<TouchableOpacity style={styles.row} onPress={() => toggle('label')}>
						<Text style={[ baseStyle.textSmall, { paddingLeft: 10 } ]}>Label</Text>
						<Text style={[ baseStyle.textSmall ]}>
							{label} {'>'}
						</Text>
					</TouchableOpacity>
				) : null}
				{editedInfo === 'label' ? (
					<>
					<TextInput
						value={label}
						style={{...baseStyle.textMedium, borderBottomWidth: 2, paddingBottom: 7, marginTop: 30, borderColor: lightPurple, textAlign: 'center' }}
						onChangeText={(text) => setLabel(text)}
						onSubmitEditing={saveLabel}
						placeholder="My alarm title"
						placeholderTextColor={lightPurple}
					/>
					<Text style={[baseStyle.textMini, { textAlign: 'center', color: lightPurple, fontFamily: 'PoppinsItalic' }]}>Label</Text>
					</>
				) : null}

				{!Boolean(editedInfo && editedInfo !== 'chosenTime') ? (
					<TouchableOpacity style={styles.row} onPress={() => toggle('chosenTime')}>
						<Text style={[ baseStyle.textSmall, { paddingLeft: 10 } ]}>Time of the alarm</Text>
						<Text style={[ baseStyle.textSmall ]}>
							{getTimeLabel(timeOptions, chosenTime)} {'>'}
						</Text>
					</TouchableOpacity>
				) : null}
				{editedInfo === 'chosenTime' ? (
					<Picker selectedValue={chosenTime} onValueChange={(itemValue) => setChosenTime(itemValue)}>
						{timeOptions.map((o) => <Picker.Item key={o.value} label={o.label} value={o.value} />)}
					</Picker>
				) : null}

				{!Boolean(editedInfo) ? (
					<View style={styles.row}>
						<Text style={[ baseStyle.textSmall, { paddingLeft: 10, color: lightPurple } ]}>Sound</Text>
						<Text style={[ baseStyle.textSmall, { color: lightPurple } ]}>Default </Text>
					</View>
				) : null}
			</View>
			<View style={[baseStyle.card, { width: screenWidth * 0.9, padding: 20 }]}>
				<View style={[styles.row, { paddingVertical: 0 }]}>
					<Text style={[ baseStyle.textSmallBold, { paddingLeft: 10 } ]}>Active</Text>
					<Switch
						trackColor={{ false: "#767577", true: 'lightgrey' }}
						thumbColor={isEnabled ? blueberry : light}
						ios_backgroundColor={light}
						onValueChange={() => setIsEnabled(!isEnabled)}
						value={isEnabled}
					/>
				</View>
			</View>

			<TouchableOpacity onPress={saveSettings} style={[ baseStyle.button, { marginTop: 20 } ]}>
				<Text style={[ baseStyle.textSmall, { textAlign: 'center' } ]}>Save settings</Text>
			</TouchableOpacity>
		</View>
	);
};

export default Settings;

const styles = StyleSheet.create({
	container: {
		padding: 10,
		paddingTop: 0,
		flex: 1,
		alignItems: 'center',
		backgroundColor: light
	},
	row: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		paddingVertical: 20
	},
	background: {
		position: 'absolute',
		top: 0,
		height: screenHeight / 2.1,
		width: screenWidth+30,
		resizeMode: 'cover',
		borderBottomLeftRadius: 40,
		borderBottomRightRadius: 40,
	}
});
