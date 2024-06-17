import { TOKEN_KEY } from "../app/context/AuthContext";
import * as SecureStore from "expo-secure-store";
export async function readAccessToken(): Promise<string> {
    const accessToken = await SecureStore.getItemAsync(TOKEN_KEY);
    return accessToken ?? '';
}
