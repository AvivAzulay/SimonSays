import AsyncStorage from '@react-native-async-storage/async-storage';

export const storeData = async (key: string, value: any[] | string) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (error) {
    console.log(error, 'error writing to async storage');
  }
};

export const getData = async (key: string) => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (error) {
    console.log(error, 'error reading from async storage');
  }
};
