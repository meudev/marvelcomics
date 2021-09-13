import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Characters from '../screens/Characters';
import CharacterBio from '../screens/CharacterBio';

const { Navigator, Screen } = createStackNavigator();

export default function Routes() {
    return (
        <NavigationContainer>

            <Navigator screenOptions={{ headerShown: false }}>
                <Screen name="Characters" component={Characters} />
                <Screen name="CharacterBio" component={CharacterBio} />
            </Navigator>
        </NavigationContainer>
    )
};  