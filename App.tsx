import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {GameScreen} from './src/screens/GameScreen';
import {Provider} from 'react-redux';
import {store} from './src/store/store';
import {LeadboardScreen} from './src/screens/LeadboardScreen';
import {HomeScreen} from './src/screens/HomeScreen';

const Stack = createStackNavigator();

export const App = () => {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Game" component={GameScreen} />
          <Stack.Screen name="Leadboard" component={LeadboardScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
};
