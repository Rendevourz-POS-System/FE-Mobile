import axios from "axios"
import { baseUrl } from "./BackendApiUri"

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

export const putForm = async (url: string, body: FormData) => {
    const response = await axios.put(baseUrl + url, body, {
        headers: {
            'Content-Type': 'multipart/form-data',
        }
    });
    return response;
}

export const postForm = async (url: string, body: FormData) => {
    console.log(body)
    try{
        const response = await axios.post(baseUrl + url, body, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        });
        return response;
    } catch(e){
        console.log(e);
    }
}