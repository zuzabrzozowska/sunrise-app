import moment from 'moment';

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
			return value
		}
	} catch (e) {
		console.log('error [getItemStorage]', e)
	}
};
