import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const Settings = ({}) => {
	return (
		<View style={styles.container}>
			<StatusBar style="auto" />

			<View style={styles.row}>
				<Text>Repeat</Text>
				<Text>Everyday {'>'}</Text>
			</View>

			<View style={styles.row}>
				<Text>Label</Text>
				<Text>My name {'>'}</Text>
			</View>

			<View style={styles.row}>
				<Text>Sound</Text>
				<Text>My sound {'>'}</Text>
			</View>

			<View style={styles.row}>
				<Text>Time of alarm</Text>
				<Text>15 min after {'>'}</Text>
			</View>

			<View style={styles.row}>
				<Text>My location</Text>
				<Text>Stockholm {'>'}</Text>
			</View>
		</View>
	);
};

export default Settings;

const styles = StyleSheet.create({
	container: {
		padding: 10,
        paddingTop: 10,
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
