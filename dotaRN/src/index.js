import 'react-native-gesture-handler';
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Heroes from './pages/Heroes';
import Hero from './pages/Hero';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Heroes">
        <Stack.Screen name="Heroes" component={Heroes} />
        <Stack.Screen name="Hero" component={Hero} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
