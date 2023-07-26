import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { Text } from 'react-native';
import { useSelector } from 'react-redux';
import ActiveCall from './ActiveCall';
import TabNavigator from './TabNavigator';
import { type StackParamList } from './types';
import SignIn from './SignIn';
import { type State } from '../store/app';
import CallInvite from './CallInvite';
import Busy from '../components/Busy';

const Stack = createNativeStackNavigator<StackParamList>();

const StackNavigator = () => {
  const user = useSelector((state: State) => state.user);
  if (user === null) {
    return <Text>Application not bootstrapped.</Text>;
  }

  if (user?.status === 'pending') {
    return <Busy />;
  }

  const isLoggedIn = user?.status === 'fulfilled' && user.accessToken;
  if (!isLoggedIn) {
    return <SignIn />;
  }

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="App"
        options={{ headerShown: false }}
        component={TabNavigator}
      />
      <Stack.Screen name="Call" component={ActiveCall} />
      <Stack.Screen name="Incoming Call" component={CallInvite} />
    </Stack.Navigator>
  );
};

export default StackNavigator;
