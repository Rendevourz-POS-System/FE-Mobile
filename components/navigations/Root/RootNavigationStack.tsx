import { NativeStackNavigationOptions, createNativeStackNavigator } from "@react-navigation/native-stack";
import React from 'react';
import { RootNavigationStackParams } from "./RootNavigationStackParams";
import RootBottomTab from "../RootBottomTab/RootBottomTab"
import { LoginScreen } from "./screens/LoginScreen";
import { RegisterScreen } from "./screens/RegisterScreen";
import { useAuth } from "../../../app/context/AuthContext";
import { NavigationContainer } from "@react-navigation/native";
import { ShelterDetailScreen } from "./screens/ShelterDetailScreen";
const Stack = createNativeStackNavigator<RootNavigationStackParams>();

const RootNavigationStack: React.FC = () => {
    const { authState } = useAuth();
    return (
        <NavigationContainer>
            <Stack.Navigator>
                {authState?.authenticated ? (
                    <Stack.Group>
                        <Stack.Screen name="HomeScreen" component={RootBottomTab} options={noHeader} />
                        <Stack.Screen name="ShelterDetailScreen" component={ShelterDetailScreen} options={noHeader} />
                    </Stack.Group>
                ) : (
                    <Stack.Group>
                        <Stack.Screen name="LoginScreen" component={LoginScreen} options={noHeader} />
                        <Stack.Screen name="RegisterScreen" component={RegisterScreen} options={noHeader} />
                    </Stack.Group>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    )
}
const noHeader: NativeStackNavigationOptions = {
    headerShown: false,
};

export default RootNavigationStack;