import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Text, useTheme} from 'react-native-paper';
import {palette} from '@/theme/palette';

type Props = {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
};

const SectionCard = ({title, subtitle, children}: Props) => {
  const theme = useTheme();
  const isDark = theme.dark;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.surface,
          borderColor: isDark ? theme.colors.outlineVariant : '#E6E2DB',
          shadowColor: '#000000',
          shadowOpacity: isDark ? 0.16 : 0.09,
          elevation: isDark ? 3 : 6,
        },
      ]}>
      <Text
        variant="titleMedium"
        style={[
          styles.title,
          {color: isDark ? theme.colors.onSurface : '#2E241D'},
        ]}>
        {title}
      </Text>
      {subtitle ? (
        <Text
          style={[
            styles.subtitle,
            {
              color: isDark
                ? theme.colors.onSurfaceVariant
                : palette.lightTextMuted,
            },
          ]}>
          {subtitle}
        </Text>
      ) : null}
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
    fontWeight: '800',
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
