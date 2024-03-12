import { NativeStackNavigationOptions, createNativeStackNavigator } from "@react-navigation/native-stack";
import React from 'react';
import { RootNavigationStackParams } from "./RootNavigationStackParams";
import RootBottomTab from "../RootBottomTab/RootBottomTab"
import { LoginScreen } from "./screens/LoginScreen";
import { RegisterScreen } from "./screens/RegisterScreen";
const Stack = createNativeStackNavigator<RootNavigationStackParams>();

const RootNavigationStack : React.FC = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="LoginScreen" component={LoginScreen} options={noHeader}/>
            <Stack.Screen name="RegisterScreen" component={RegisterScreen} options={noHeader}/>
            <Stack.Screen name="TabMenu" component={RootBottomTab} options={noHeader}/>
        </Stack.Navigator>
    )
}
const noHeader: NativeStackNavigationOptions = {
    headerShown: false,
};

export default RootNavigationStack;