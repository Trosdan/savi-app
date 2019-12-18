import { AsyncStorage } from "react-native";

export const storeData = async (key, value) => {
  try {
    value = JSON.stringify(value)
    await AsyncStorage.setItem(key, value);
    console.log(`saving ${key}:${value}`)
  } catch (error) {
    console.log(`error saving data ${key}:${value} -> ${error}`)
  }
};

export const fetchData = async key => {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value !== null) {
      console.log(`fetching ${key}:${value}`)
      return value;
    }
  } catch (error) {
    console.log(`error fetching data ${key} -> ${error}`)
  }
};
export const clear = () => AsyncStorage.clear()