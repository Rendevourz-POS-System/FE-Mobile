import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";

interface AuthProps {
    authState?: {token: string | null; authenticated: boolean | null; username: string | null};
    onRegister?: (email: string, password: string) => Promise<any>;
    onLogin?: (email: string, password: string) => Promise<any>;
    onLogout?: () => Promise<any>;
}

const TOKEN_KEY = "token";
export const API_URL = "https://a18e-2404-8000-1001-b133-d5d9-48be-30bb-baf4.ngrok-free.app";
const AuthContext = createContext<AuthProps>({});

export const useAuth = () => {
    return useContext(AuthContext); 
}

export const AuthProvider = ({children} : any) => {
    const [authState, setAuthState] = useState<{
        token: string | null; 
        authenticated: boolean | null;
        username: string | null;
    }>({
        token: null,
        authenticated: null,
        username: null
    });

    useEffect(() => {
        const loadToken = async () => {
            const token = await SecureStore.getItemAsync(TOKEN_KEY);
            const test = token?.toString()
            if(token){
                // axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
                try{
                    const result = await axios.get(`${API_URL}/user/data`, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                    if(result.status === 200)
                    {
                        setAuthState({
                            token,
                            authenticated: true,
                            username: result.data.Username
                        });
                    }
                }
                catch(e){
                    console.log(e)
                }
            } else {
                setAuthState({
                    token: null,
                    authenticated: false,
                    username: null
                });
            }
        };
        loadToken();
    }, []);


    const register = async (email: string, password: string) => {
        try{
            return await axios.post(`${API_URL}/user/register`, {email, password});
        } catch(e){
            return {error: true, msg : (e as any).response.data.msg};
        }
    };

    const login = async (email: string, password: string) => {
        try{
            const result = await axios.post(`${API_URL}/user/login`, {email, password});

            setAuthState({
                token: result.data['Token'],
                authenticated: true,
                username: result.data['Username']
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
            username: null
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