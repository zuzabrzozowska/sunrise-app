import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput } from 'react-native';
import baseStyle from '../styles/base';
import { lightPurple, mauve } from '../styles/variables';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getItemStorage } from '../../helpers';
import { Picker } from '@react-native-picker/picker';

const Settings = ({}) => {
	const [ editedInfo, setEditedInfo ] = useState(null);
	const [ repeat, setRepeat ] = useState('');
	const [ location, setLocation ] = useState('');
	const [ label, setLabel ] = useState('');
	const [ chosenTime, setChosenTime ] = useState('');

	useEffect(() => {
		getInitSettings();
	}, []);

	const getInitSettings = async () => {
		setRepeat(await getItemStorage('repeat') || 'every');
		setLocation(await getItemStorage('location') || 'Stockholm');
		setLabel(await getItemStorage('label') || 'Default');
		setChosenTime(await getItemStorage('chosenTime') || 'sunrise');
	};

	const storeData = async (key, value) => {
		try {
			// 'repeat' or 'label' or 'chosenTime' or 'location'
			await AsyncStorage.setItem(key, value);
			setEditedInfo(null);
		} catch (e) {
			console.log('[storeData] error', e);
		}
	};

	const repeatOptions = [
		{ value: 'every', label: 'Every day' },
		{ value: 'weekends', label: 'Weekends' },
		{ value: 'weekdays', label: 'Weekdays' },
		{ value: 'once', label: 'Once' }
	];

	const getLabel = (options, value) => {
		if (!options || !value) return ''
		return repeatOptions.find(o => o.value === repeat) && repeatOptions.find(o => o.value === repeat).label || ''
	}

	const searchForCity = () => {

	}

	const toggle = type => {
		setEditedInfo(editedInfo === type ? null : type)
	}

	return (
		<View style={styles.container}>
			<StatusBar style="auto" />

			<TouchableOpacity style={styles.row} onPress={() => toggle('repeat')}>
				<Text style={[ baseStyle.textSmall, { paddingLeft: 10 } ]}>Repeat</Text>
				<Text style={[ baseStyle.textSmall ]}>{getLabel(repeatOptions, repeat)} {'>'}</Text>
			</TouchableOpacity>
			{editedInfo === 'repeat' ? (
				<Picker selectedValue={repeat} onValueChange={(itemValue) => setRepeat(itemValue)}>
					{repeatOptions.map((o) => <Picker.Item key={o.value} label={o.label} value={o.value} />)}
				</Picker>
			) : null}

			<TouchableOpacity style={styles.row} onPress={() => setEditedInfo('label')}>
				<Text style={[ baseStyle.textSmall, { paddingLeft: 10 } ]}>Label</Text>
				<Text style={[ baseStyle.textSmall ]}>{label} {'>'}</Text>
			</TouchableOpacity>
			{editedInfo === 'label' ? (
				<TextInput
					value={label}
					onChangeText={text => setLabel(text)}
					placeholder="My alarm title"
					placeholderTextColor={mauve}
				/>
			) : null}

			<TouchableOpacity style={styles.row} onPress={() => setEditedInfo('chosenTime')}>
				<Text style={[ baseStyle.textSmall, { paddingLeft: 10 } ]}>Time of the alarm</Text>
				<Text style={[ baseStyle.textSmall ]}>{chosenTime} {'>'}</Text>
			</TouchableOpacity>

			<TouchableOpacity style={styles.row} onPress={() => setEditedInfo('location')}>
				<Text style={[ baseStyle.textSmall, { paddingLeft: 10 } ]}>My location</Text>
				<Text style={[ baseStyle.textSmall ]}>{location} {'>'}</Text>
			</TouchableOpacity>

			<View style={styles.row}>
				<Text style={[ baseStyle.textSmall, { paddingLeft: 10, color: lightPurple } ]}>Sound</Text>
				<Text style={[ baseStyle.textSmall, { color: lightPurple } ]}>Default </Text>
			</View>
		</View>
	);
};

export default Settings;

const styles = StyleSheet.create({
	container: {
		padding: 10,
		paddingTop: 0,
		flex: 1,
		backgroundColor: '#fff'
	},
	row: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		paddingVertical: 20,
		borderBottomWidth: 1,
		borderStyle: 'solid',
		borderBottomColor: 'lightgrey'
	}
});
