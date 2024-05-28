import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { BackendApiUri } from "../../functions/BackendApiUri";

interface AuthProps {
    authState?: {token: string | null; authenticated: boolean | null; username: string | null};
    onRegister?: (email: string, password: string) => Promise<any>;
    onLogin?: (email: string, password: string) => Promise<any>;
    onLogout?: () => Promise<any>;
}

const TOKEN_KEY = "token";
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
    }>({
        token: null,
        authenticated: null,
        userId: null,
        username: null
    });

    useEffect(() => {
        const loadToken = async () => {
            const token = await SecureStore.getItemAsync(TOKEN_KEY);
            if(token){
                try{
                    const result = await axios.get(`${BackendApiUri.getUserData}`, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                    if(result.status === 200)
                    {
                        setAuthState({
                            token,
                            authenticated: true,
                            userId: result.data.Id,
                            username: result.data.Username
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
                    username: null
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
            if(result.data.Data) {
                setAuthState({
                    token: null,
                    authenticated: false,
                    userId : null,
                    username: null,
                });
                return result;
            }
            if(result.data.Error) return result;
            setAuthState({
                token: result.data['Token'],
                authenticated: true,
                userId : result.data['Id'],
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
            userId: null,
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