import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from 'react';
import { RootNavigationStackParams } from "./RootNavigationStackParams";
import HomeScreen from "./screens/components/HomeScreen";

const stack = createNativeStackNavigator<RootNavigationStackParams>();

const RootNavigationStack : React.FC = () => {
    return (
        <stack.Navigator>
            <stack.Screen name="Home" component={HomeScreen} />
        </stack.Navigator>
    )
}

export default RootNavigationStack;