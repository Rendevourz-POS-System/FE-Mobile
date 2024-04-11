import { NativeStackNavigationOptions, createNativeStackNavigator } from "@react-navigation/native-stack";
import { PublishNavigationStackParams } from "./PublishNavigationStackParams";
import { PublishScreen } from "./screens/PublishScreen";

const Stack = createNativeStackNavigator<PublishNavigationStackParams>();

export const PublishNavigationStack: React.FC<{}> = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="PublishScreen" component={PublishScreen} options={noHeader} />
        </Stack.Navigator>
    );
}

const noHeader : NativeStackNavigationOptions = {
    headerShown: false
};