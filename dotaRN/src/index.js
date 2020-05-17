import 'react-native-gesture-handler';
import * as React from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Heroes from './pages/Heroes';
import Hero from './pages/Hero';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar barStyle="light-content" backgroundColor="#f4511e" />
      <Stack.Navigator
        initialRouteName="Heroes"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#f4511e',
          },
          headerTintColor: '#fff',
          headerTitleAlign: 'center'
        }}>
        <Stack.Screen name="Heroes" component={Heroes} />
        <Stack.Screen
          name="Hero"
          component={Hero}
          options={({ route }) => ({
            title: route.params.name,
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
