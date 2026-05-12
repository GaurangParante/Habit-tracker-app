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
          shadowColor: '#000000',
        },
      ]}>
      <Text variant="titleMedium" style={styles.title}>
        {title}
      </Text>
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
    shadowOpacity: 0.16,
    shadowRadius: 24,
    elevation: 3,
  },
  title: {
    textTransform: 'uppercase',
    fontSize: 12,
    letterSpacing: 1.2,
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
