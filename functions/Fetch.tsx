import axios from "axios"
import { baseUrl } from "./BackendApiUri"
import { useAuth } from "../app/context/AuthContext";

export const get = async (url: string) => {
    const response = await axios.get(baseUrl + url);
    return response;
};

export const post = async (url: string, body: any) => {
    const response = await axios.post(baseUrl + url, body);
    return response;
}

export const put = async (url: string, body: any) => {
    const response = await axios.put(baseUrl + url, body);
    return response.data;
}

export const deletes = async(url: string) => {
    const response = await axios.delete(baseUrl + url);
    return response.data;
}

export const putForm = async (url: string, body: FormData) => {
    const response = await axios.put(baseUrl + url, body, {
        headers: {
            'Content-Type': 'multipart/form-data',
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