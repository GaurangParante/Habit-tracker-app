import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Text, useTheme} from 'react-native-paper';

type Props = {
  title: string;
  description: string;
};

const EmptyState = ({title, description}: Props) => {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.surfaceVariant,
          borderColor: theme.colors.outlineVariant,
        },
      ]}>
      <Text variant="titleMedium">{title}</Text>
      <Text style={styles.description}>{description}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 24,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderRadius: 20,
    borderWidth: 1,
  },
  description: {
    marginTop: 6,
    textAlign: 'center',
    opacity: 0.72,
    lineHeight: 20,
  },
});

export default EmptyState;
