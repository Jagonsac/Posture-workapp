import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Switch } from 'react-native';
import { useTheme } from '../theme';
import { useSettings } from '../SettingsContext';
import { clearSessions } from '../storage';

export default function SettingsScreen() {
  const { colors } = useTheme();
  const { settings, setSettings } = useSettings();

  const setIntervalValue = (v) => setSettings({ ...settings, interval: v });
  const toggleStretch = () => setSettings({ ...settings, stretch: !settings.stretch });
  const setTheme = (t) => setSettings({ ...settings, theme: t });

  const deleteData = async () => {
    await clearSessions();
  };

  const intervalButton = (v, label) => (
    <TouchableOpacity
      style={[styles.option, { backgroundColor: settings.interval === v ? colors.card : 'transparent' }]}
      onPress={() => setIntervalValue(v)}
    >
      <Text style={{ color: colors.text }}>{label}</Text>
    </TouchableOpacity>
  );

  const themeButton = (t, label) => (
    <TouchableOpacity
      style={[styles.option, { backgroundColor: settings.theme === t ? colors.card : 'transparent' }]}
      onPress={() => setTheme(t)}
    >
      <Text style={{ color: colors.text }}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.header, { color: colors.text }]}>Notification Interval</Text>
      <View style={styles.row}>
        {intervalButton(15, '15 min')}
        {intervalButton(30, '30 min')}
        {intervalButton(60, '1 hour')}
      </View>

      <View style={[styles.row, { marginTop: 20 }]}>
        <Text style={{ color: colors.text, marginRight: 10 }}>Include Stretching</Text>
        <Switch value={settings.stretch} onValueChange={toggleStretch} />
      </View>

      <Text style={[styles.header, { color: colors.text, marginTop: 20 }]}>Theme</Text>
      <View style={styles.row}>
        {themeButton('light', 'Light')}
        {themeButton('dark', 'Dark')}
        {themeButton('system', 'Use Device')}
      </View>

      <TouchableOpacity style={[styles.deleteButton, { backgroundColor: colors.danger }]} onPress={deleteData}>
        <Text style={{ color: '#fff' }}>Delete Data</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  header: { fontSize: 18, marginBottom: 10 },
  row: { flexDirection: 'row', alignItems: 'center' },
  option: { padding: 10, borderRadius: 8, marginRight: 10 },
  deleteButton: { marginTop: 40, padding: 12, borderRadius: 8, alignSelf: 'flex-start' },
});
