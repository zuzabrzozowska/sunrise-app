import moment from 'moment';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const getLocalTime = (time, date) => {
	const hours = time.split(':')[0];
	const minutes = time.split(':')[1];

	const sunriseDate = moment.utc(date).set({ hour: hours, minute: minutes });

	let localTime = moment.utc(sunriseDate).toDate();
	localTime = moment(localTime).format('YYYY-MM-DD HH:mm');

	return localTime;
};

export const getItemStorage = async (key) => {
	try {
		const value = await AsyncStorage.getItem(key);
		if (value !== null) {
			return value;
		}
	} catch (e) {
		console.log('error [getItemStorage]', e);
	}
};

export const storeItemStorage = async (key, value) => {
	try {
		await AsyncStorage.setItem(key, value);
	} catch (e) {
		console.log('[storeItemStorage] error', e);
	}
};

export const storeObjectDataStorage = async (key, value) => {
	try {
		const jsonValue = JSON.stringify(value);
		await AsyncStorage.setItem(key, jsonValue);
	} catch (e) {
		console.log('[storeDataStorage] error', e);
	}
};

export const getObjectDataStorage = async (key) => {
    try {
      const jsonValue = await AsyncStorage.getItem(key)
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
        console.log('[getObjectDataStorage] error', e);
    }
  }

export const viewStorage = () => {
	AsyncStorage.getAllKeys((err, keys) => {
		AsyncStorage.multiGet(keys, (error, stores) => {
			stores.map((result, i, store) => {
				console.log({ [store[i][0]]: store[i][1] });
				return true;
			});
		});
	});
};
