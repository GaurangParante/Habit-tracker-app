import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Text, useTheme} from 'react-native-paper';

type Props = {
  label: string;
  value: string;
};

const StatTile = ({label, value}: Props) => {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.tile,
        {
          backgroundColor: theme.colors.surfaceVariant,
          borderColor: theme.colors.primary,
        },
      ]}>
      <Text variant="headlineSmall">{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  tile: {
    flex: 1,
    minWidth: 96,
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
  },
  label: {
    marginTop: 6,
    opacity: 0.75,
  },
});

export default StatTile;
