import { NativeStackNavigationOptions, createNativeStackNavigator } from "@react-navigation/native-stack";
import React from 'react';
import { RootNavigationStackParams } from "./RootNavigationStackParams";

import HomeScreen from "./screens/HomeScreen";

const stack = createNativeStackNavigator<RootNavigationStackParams>();

const RootNavigationStack : React.FC = () => {
    return (
        <stack.Navigator>
            <stack.Screen name="Home" component={HomeScreen} options={homeScreenOptions}/>
        </stack.Navigator>
    )
}

const noHeader: NativeStackNavigationOptions = {
    headerShown: false,
};

const homeScreenOptions = () => {
    const options: NativeStackNavigationOptions = {
        title: '',
        headerTitleAlign: 'center',
        headerTitleStyle: {
            color: '#000',
            fontFamily: 'InterBold',
            fontSize: 20,
        },
        headerShadowVisible: false,
    };

    return options;
};



export default RootNavigationStack;