import {useMemo} from 'react';
import {useColorScheme} from 'react-native';
import {useGlobalContext} from '../contexts/GlobalContext';

const useIsDarkTheme = (): [boolean, boolean] => {
  const {userColorScheme} = useGlobalContext();
  const systemColorScheme = useColorScheme();

  const isDark = useMemo(
    () =>
      userColorScheme === 'dark' ||
      (!userColorScheme && systemColorScheme === 'dark'),
    [systemColorScheme, userColorScheme],
  );

  return [isDark, !userColorScheme]; // [isDarkTheme, isUserPreferenceSet]
};

export default useIsDarkTheme;
