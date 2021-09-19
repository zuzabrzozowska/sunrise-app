import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './components/screens/home';
import Settings from './components/screens/settings';
import Calendar from './components/screens/calendar';
const Stack = createNativeStackNavigator();
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import * as Font from 'expo-font';
//import { getData } from './utils/async-storage';
import { Text, View, TouchableOpacity, Platform, ActivityIndicator } from 'react-native';
import { yellow, light } from './components/styles/variables'

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const App = () => {
	const [ location, setLocation ] = useState(null);
	const [ errorMsg, setErrorMsg ] = useState(null);
  const [fontLoaded, setFontLoaded] = useState(false);

  useEffect(() => {
    let isCancelled = false;
    if (!fontLoaded && !isCancelled) {
      getFonts();
    }
    return () => {
      isCancelled = true;
    };
  }, []);

	useEffect(() => {
		(async () => {
			let { status } = await Location.requestForegroundPermissionsAsync();
			if (status !== 'granted') {
				setErrorMsg('Permission to access location was denied');
				return;
			}
			let location = await Location.getCurrentPositionAsync({});
      const locationArray = await Location.reverseGeocodeAsync(
        location.coords
      );
      location = {
        ...location,
        address: locationArray[0],
      }
			setLocation(location);
		})();
	}, []);

	if (errorMsg) {
		console.log(errorMsg);
	}

  const getFonts = async () => {
    await Font.loadAsync({
      Poppins: require('./assets/fonts/Poppins-Regular.ttf'),
      PoppinsBold: require('./assets/fonts/Poppins-SemiBold.ttf'),
      PoppinsItalic: require('./assets/fonts/Poppins-Italic.ttf'),
    });
    setFontLoaded(true);
  };

	if (!location || !fontLoaded) {
		return (
			<View style={{ flex: 1, backgroundColor: light, justifyContent: 'center' }}>
				<ActivityIndicator color={yellow} size="large" />
			</View>
		);
	}


	return (
		<NavigationContainer>
			<Stack.Navigator>
        <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} initialParams={{ location }} />

        <Stack.Screen name="Calendar" component={Calendar} initialParams={{ location }} />
        <Stack.Screen name="Settings" component={Settings} initialParams={{ location }} />
      </Stack.Navigator>
		</NavigationContainer>
	);
};

export default App;
