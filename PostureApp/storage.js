import AsyncStorage from '@react-native-async-storage/async-storage';

export async function addSession(session) {
  const data = await AsyncStorage.getItem('sessions');
  const sessions = data ? JSON.parse(data) : [];
  sessions.push(session);
  await AsyncStorage.setItem('sessions', JSON.stringify(sessions));
}

export async function getSessions() {
  const data = await AsyncStorage.getItem('sessions');
  return data ? JSON.parse(data) : [];
}

export async function clearSessions() {
  await AsyncStorage.removeItem('sessions');
}
