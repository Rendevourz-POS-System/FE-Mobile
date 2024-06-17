import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { BackendApiUri, baseUrl } from "../../functions/BackendApiUri";

interface AuthProps {
    authState?: {token: string | null; authenticated: boolean | null; username: string | null; role: string | null; imageBase64: [] | null; userId: string | null};
    onRegister?: (email: string, password: string) => Promise<any>;
    onLogin?: (email: string, password: string) => Promise<any>;
    onLogout?: () => Promise<any>;
}

export const TOKEN_KEY = "token";
const AuthContext = createContext<AuthProps>({});

export const useAuth = () => {
    return useContext(AuthContext); 
}

export const AuthProvider = ({children} : any) => {
    const [authState, setAuthState] = useState<{
        token: string | null; 
        authenticated: boolean | null;
        userId: string | null;
        username: string | null;
        role: string | null;
        imageBase64: [] | null
    }>({
        token: null,
        authenticated: null,
        userId: null,
        username: null,
        role : null,
        imageBase64: null
    });

    useEffect(() => {
        const loadToken = async () => {
            const token = await SecureStore.getItemAsync(TOKEN_KEY);
            if(token){
                try{
                    const result = await axios.get(`${baseUrl+BackendApiUri.getUserData}`, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                    if(result.status === 200)
                    {
                        setAuthState({
                            token : token,
                            authenticated: true,
                            userId: result.data.Id,
                            username: result.data.Username,
                            role: result.data.Role,
                            imageBase64: result.data.ImageBase64
                        });
                    }
                }
                catch(e){
                }
            } else {
                setAuthState({
                    token: null,
                    authenticated: false,
                    userId: null,
                    username: null,
                    role: null,
                    imageBase64: null
                });
            }
        };
        loadToken();
    }, []);


    const register = async (email: string, password: string) => {
        try{
            return await axios.post(`${BackendApiUri.registerUser}`, {email, password});
        } catch(e){
            return {error: true, msg : (e as any).response.data.msg};
        }
    };

    const login = async (email: string, password: string) => {
        try{
            const result = await axios.post(`${BackendApiUri.loginUser}`, {email, password});
            // console.log(result.data.Data)
            if(result.data.Data) {
                setAuthState({
                    token: null,
                    authenticated: false,
                    userId : null,
                    username: null,
                    role: null,
                    imageBase64: null
                });
                return result;
            }
            if(result.data.Error) return result;
            setAuthState({
                token: result.data['Token'],
                authenticated: true,
                userId : result.data.User['Id'],
                username: result.data['Username'],
                role: result.data.User['Role'],
                imageBase64: result.data.User['ImageBase64']
            });

            axios.defaults.headers.common["Authorization"] = `Bearer ${result.data['Token']}`;

            await SecureStore.setItemAsync(TOKEN_KEY, result.data['Token']);
            return result;

        } catch(e){
            return {error: true, msg : (e as any).response.data.msg};
        }
    };

    const logout = async () => {
        await SecureStore.deleteItemAsync(TOKEN_KEY);

        axios.defaults.headers.common["Authorization"] = "";

        setAuthState({
            token: null,
            authenticated: false,
            userId: null,
            username: null,
            role: null,
            imageBase64: []
        });
    };

    const value = {
        onRegister: register,
        onLogin: login,
        onLogout: logout,
        authState
    };
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}