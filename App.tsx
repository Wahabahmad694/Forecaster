import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './components/home';


const Stack = createNativeStackNavigator();

const App = () => {

  return (
    <NavigationContainer>

      <Stack.Navigator>

        <Stack.Screen name='Home' component={Home} options={{ headerShown: false }} />

      </Stack.Navigator>

    </NavigationContainer>
  );
}


export default App;
