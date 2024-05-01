import axios from "axios"
import { baseUrl } from "./BackendApiUri"

export const get = async (url: string) => {
    const response = await axios.get(baseUrl + url);
    return response;
};

export const post = async (url: string, body: any) => {
    const response = await axios.post(baseUrl + url, body);
    console.log(baseUrl + url + body)
    return response;
}