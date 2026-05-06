import React from 'react';
import {ScrollView, StyleSheet, ViewStyle} from 'react-native';
import {useTheme} from 'react-native-paper';

type Props = {
  children: React.ReactNode;
  contentStyle?: ViewStyle;
};

const ScreenContainer = ({children, contentStyle}: Props) => {
  const theme = useTheme();

  return (
    <ScrollView
      style={{backgroundColor: theme.colors.background}}
      contentContainerStyle={[styles.content, contentStyle]}
      keyboardShouldPersistTaps="handled">
      {children}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  content: {
    padding: 18,
    paddingBottom: 28,
    gap: 18,
  },
});

export default ScreenContainer;
