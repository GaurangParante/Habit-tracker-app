import {useCallback} from 'react';
import {useFocusEffect} from '@react-navigation/native';

export const useRefreshOnFocus = (refresh: () => void | Promise<void>) => {
  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh]),
  );
};
