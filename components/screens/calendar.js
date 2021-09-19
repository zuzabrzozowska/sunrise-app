import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const Settings = ({}) => {
	return (
		<View style={styles.container}>
			<StatusBar style="auto" />

		
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

});
