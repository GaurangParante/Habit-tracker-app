import React from 'react';
import {ScrollView, StyleSheet, ViewStyle} from 'react-native';
import {useTheme} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';

type Props = {
  children: React.ReactNode;
  contentStyle?: ViewStyle;
};

const ScreenContainer = ({children, contentStyle}: Props) => {
  const theme = useTheme();

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: theme.colors.background}}>
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
  content: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 36,
    gap: 18,
  },
});

export default ScreenContainer;
