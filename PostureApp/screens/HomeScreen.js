import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import * as Notifications from 'expo-notifications';
import { useSettings } from '../SettingsContext';
import { useTheme } from '../theme';
import { addSession } from '../storage';

export default function HomeScreen() {
  const { settings } = useSettings();
  const { colors } = useTheme();
  const [running, setRunning] = useState(false);
  const [start, setStart] = useState(null);
  const [elapsed, setElapsed] = useState(0);
  const [intervalId, setIntervalId] = useState(null);
  const [paused, setPaused] = useState(false);
  const [pauseStart, setPauseStart] = useState(null);
  const [pausedTotal, setPausedTotal] = useState(0);
  const [showStretch, setShowStretch] = useState(false);

  useEffect(() => {
    let id;
    if (running && !paused) {
      id = setInterval(() => {
        const now = Date.now();
        const diff = Math.floor((now - start - pausedTotal) / 1000);
        setElapsed(diff);
        if (settings.stretch && diff >= 7200) {
          setShowStretch(true);
        }
      }, 1000);
      setIntervalId(id);
    }
    return () => clearInterval(id);
  }, [running, paused, start, pausedTotal, settings.stretch]);

  const scheduleNotifications = async () => {
    await Notifications.cancelAllScheduledNotificationsAsync();
    await Notifications.scheduleNotificationAsync({
      content: { title: 'Posture', body: 'Keep your back straight' },
      trigger: { seconds: settings.interval * 60, repeats: true },
    });
    if (settings.stretch) {
      await Notifications.scheduleNotificationAsync({
        content: { title: 'Stretch time', body: 'Take a moment to stretch' },
        trigger: { seconds: 7200, repeats: true },
      });
    }
  };

  const startSession = async () => {
    const now = Date.now();
    setStart(now);
    setRunning(true);
    setElapsed(0);
    setPaused(false);
    setPausedTotal(0);
    setShowStretch(false);
    scheduleNotifications();
  };

  const endSession = async () => {
    if (!start) return;
    const end = Date.now();
    const duration = Math.floor((end - start - pausedTotal) / 1000);
    await addSession({ start, end, duration });
    await Notifications.cancelAllScheduledNotificationsAsync();
    setRunning(false);
    setStart(null);
    setElapsed(0);
  };

  const toggleBreak = async () => {
    if (!paused) {
      setPaused(true);
      setPauseStart(Date.now());
      await Notifications.cancelAllScheduledNotificationsAsync();
    } else {
      const now = Date.now();
      setPaused(false);
      setPausedTotal(pausedTotal + (now - pauseStart));
      scheduleNotifications();
    }
  };

  const formatTime = (sec) => {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    return [h, m, s]
      .map(v => v.toString().padStart(2, '0'))
      .join(':');
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {!running ? (
        <TouchableOpacity
          style={[styles.startButton, { backgroundColor: colors.accent }]}
          onPress={startSession}
        >
          <Text style={{ color: '#fff', fontWeight: 'bold' }}>Start Work</Text>
        </TouchableOpacity>
      ) : (
        <>
          <Text style={[styles.timer, { color: colors.text }]}>{formatTime(elapsed)}</Text>
          <View style={styles.row}>
            <TouchableOpacity
              style={[styles.endButton, { backgroundColor: colors.danger }]}
              onPress={endSession}
            >
              <Text style={{ color: '#fff' }}>End Session</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.breakButton, { backgroundColor: colors.card }]}
              onPress={toggleBreak}
            >
              <Text style={{ color: colors.text }}>{paused ? 'Resume Work' : 'Take a Break'}</Text>
            </TouchableOpacity>
          </View>
          {showStretch && (
            <TouchableOpacity style={styles.stretchButton} onPress={() => setShowStretch(false)}>
              <Text style={{ color: colors.text, marginBottom: 8 }}>Stretch Suggestions:</Text>
              <Text style={{ color: colors.text }}>1. Neck rolls - gently roll your neck.</Text>
              <Text style={{ color: colors.text }}>2. Shoulder shrugs - raise and release shoulders.</Text>
              <Text style={{ color: colors.text }}>3. Back extensions - clasp hands and reach up.</Text>
            </TouchableOpacity>
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  startButton: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 8,
  },
  timer: {
    fontSize: 48,
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  endButton: {
    padding: 12,
    borderRadius: 8,
    marginRight: 10,
  },
  breakButton: {
    padding: 12,
    borderRadius: 8,
  },
  stretchButton: {
    marginTop: 20,
    padding: 12,
    backgroundColor: 'transparent',
    alignItems: 'flex-start',
  },
});
