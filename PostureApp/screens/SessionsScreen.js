import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useTheme } from '../theme';
import { getSessions } from '../storage';

export default function SessionsScreen() {
  const { colors } = useTheme();
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    getSessions().then(setSessions);
  }, []);

  const renderItem = ({ item }) => {
    const date = new Date(item.start);
    const duration = Math.floor(item.duration / 60);
    return (
      <View style={[styles.item, { backgroundColor: colors.card }]}>
        <Text style={{ color: colors.text }}>{date.toLocaleString()}</Text>
        <Text style={{ color: colors.text }}>{duration} min</Text>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={sessions}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        contentContainerStyle={{ padding: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  item: { padding: 16, borderRadius: 8 },
});
