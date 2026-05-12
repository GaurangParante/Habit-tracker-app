import React from 'react';
import {ScrollView, StyleSheet, View, ViewStyle} from 'react-native';
import {useTheme} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';
import {palette} from '@/theme/palette';

type Props = {
  children: React.ReactNode;
  contentStyle?: ViewStyle;
};

const ScreenContainer = ({children, contentStyle}: Props) => {
  const theme = useTheme();

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: theme.colors.background}}>
      <View style={styles.backdrop} />
      <ScrollView
        style={{backgroundColor: theme.colors.background}}
        contentContainerStyle={[styles.content, contentStyle]}
        keyboardShouldPersistTaps="handled">
        {children}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    position: 'absolute',
    top: -140,
    left: -80,
    right: -80,
    height: 260,
    borderRadius: 260,
    backgroundColor: palette.primaryTint,
    opacity: 0.45,
  },
  content: {
    padding: 18,
    paddingBottom: 36,
    gap: 18,
  },
});

export default ScreenContainer;
