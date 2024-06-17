import axios from "axios"
import { baseUrl } from "./BackendApiUri"
import { useAuth } from "../app/context/AuthContext";
import { readAccessToken } from "./AccessToken";

export const get = async (url: string) => {
    const token = await readAccessToken();
    const response = await axios.get(baseUrl + url, {
        headers: {
            'Authorization': `Bearer ${token}`,
        }
    });
    return response;
};

export const post = async (url: string, body: any) => {
    const token = await readAccessToken();
    const response = await axios.post(baseUrl + url, body, {
        headers: {
            'Authorization': `Bearer ${token}`,
        }
    });
    return response;
}

export const put = async (url: string, body: any) => {
    const token = await readAccessToken();
    const response = await axios.put(baseUrl + url, body, {
        headers: {
            'Authorization': `Bearer ${token}`,
        }
    });
    return response.data;
}

export const deletes = async(url: string) => {
    const token = await readAccessToken();
    const response = await axios.delete(baseUrl + url, {
        headers: {
            'Authorization': `Bearer ${token}`,
        }
    });
    return response.data;
}

export const deletesBody = async(url: string, body: any) => {
    const response = await axios.delete(baseUrl + url, body);
    return response.data;
}

export const putForm = async (url: string, body: FormData) => {
    const token = await readAccessToken();
    const response = await axios.put(baseUrl + url, body, {
        headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`,
        }
    });
    return response;
}

export const postForm = async (url: string, body: FormData) => {
    const {authState} = useAuth();
    try{
        const response = await axios.post(baseUrl + url, body, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${authState?.token}`,
            }
        });
        return response;
    } catch(e){
        console.log(e);
    }
}