import React from 'react';
import {StyleSheet, View} from 'react-native';
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';
import {Text, useTheme} from 'react-native-paper';
import {palette} from '@/theme/palette';

type Props = {
  label: string;
  value: string;
  icon?: string;
  accent?: string;
};

const StatTile = ({label, value, icon, accent = palette.primary}: Props) => {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.tile,
        {
          backgroundColor: theme.colors.surfaceVariant,
          borderColor: theme.colors.outlineVariant,
        },
      ]}>
      {icon ? (
        <MaterialDesignIcons
          name={icon as any}
          size={20}
          color={accent}
          style={styles.icon}
        />
      ) : null}
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
  icon: {
    marginBottom: 12,
  },
  label: {
    marginTop: 6,
    opacity: 0.75,
    textTransform: 'uppercase',
    fontSize: 12,
    letterSpacing: 0.8,
  },
});

export default StatTile;
