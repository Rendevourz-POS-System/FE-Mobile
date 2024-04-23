import axios from "axios"
import { baseUrl } from "./BackendApiUri"

export const get = async (url: string) => {
    const response = await axios.get(baseUrl + url);
    return response;
};

