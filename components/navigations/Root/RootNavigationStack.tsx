import { NativeStackNavigationOptions, createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { FC, useEffect, useRef } from 'react';
import { RootNavigationStackParams } from "./RootNavigationStackParams";
import RootBottomTab from "../RootBottomTab/RootBottomTab"
import { LoginScreen } from "./screens/LoginScreen";
import { RegisterScreen } from "./screens/RegisterScreen";
import { useAuth } from "../../../app/context/AuthContext";
import { NavigationContainer, NavigationContainerRef, useNavigation } from "@react-navigation/native";
import { ShelterDetailScreen } from "./screens/ShelterDetailScreen";
import { DonateScreen } from "./screens/DonateScreen";
import { HewanAdopsiScreen } from "./screens/HewanAdopsiScreen";
import { PetDetailScreen } from "./screens/PetDetailScreen";
import { AdoptionFormScreen } from "./screens/AdoptionFormScreen";
import { RescueFormScreen } from "./screens/RescueFormScreen";
import { SurrenderFormScreen } from "./screens/SurrenderFormScreen";
import { EmailScreen } from "./screens/EmailScreen";
import { EmitterSubscription, Linking } from "react-native";

const Stack = createNativeStackNavigator<RootNavigationStackParams>();

const RootNavigationStack: React.FC = () => {
    const { authState } = useAuth();
    const navigation = useRef<NavigationContainerRef<RootNavigationStackParams>>(null);

    useEffect(() => {
        const handleDeepLink = async () => {
          const initialUrl = await Linking.getInitialURL();
          if (initialUrl && initialUrl.includes('email/verification')) {
            const token = initialUrl.split('/').pop();
            navigation.current?.navigate('EmailScreen', {token : token || ''});
          }
        };

        handleDeepLink();
    }, []);

    return (
        <NavigationContainer ref={navigation}>
            <Stack.Navigator>
                {authState?.authenticated ? (
                    <Stack.Group>
                        <Stack.Screen name="HomeScreen" component={RootBottomTab} options={noHeader} />
                        <Stack.Screen name="ShelterDetailScreen" component={ShelterDetailScreen} options={noHeader} />
                        <Stack.Screen name="DonateScreen" component={DonateScreen} options={noHeader} />
                        <Stack.Screen name="HewanAdopsiScreen" component={HewanAdopsiScreen} options={noHeader} />
                        <Stack.Screen name="PetDetailScreen" component={PetDetailScreen} options={noHeader} />
                        <Stack.Screen name="AdoptionFormScreen" component={AdoptionFormScreen} options={noHeader} />
                        <Stack.Screen name="RescueFormScreen" component={RescueFormScreen} options={noHeader} />
                        <Stack.Screen name="SurrenderFormScreen" component={SurrenderFormScreen} options={noHeader} />
                    </Stack.Group>
                ) : (
                    <Stack.Group>
                        <Stack.Screen name="LoginScreen" component={LoginScreen} options={noHeader} />
                        <Stack.Screen name="RegisterScreen" component={RegisterScreen} options={noHeader} />
                        <Stack.Screen name="EmailScreen" component={EmailScreen} options={noHeader} />
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