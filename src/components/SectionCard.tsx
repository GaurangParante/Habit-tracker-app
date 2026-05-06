import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Text, useTheme} from 'react-native-paper';

type Props = {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
};

const SectionCard = ({title, subtitle, children}: Props) => {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.outlineVariant,
          shadowColor: '#0B1620',
        },
      ]}>
      <Text variant="titleMedium">{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      <View style={styles.body}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: 24,
    padding: 18,
    shadowOffset: {width: 0, height: 12},
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 3,
  },
  subtitle: {
    marginTop: 4,
    opacity: 0.7,
    lineHeight: 20,
  },
  body: {
    marginTop: 14,
    gap: 12,
  },
});

export default SectionCard;
