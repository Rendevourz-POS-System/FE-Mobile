import axios from "axios";
import { get } from "./Fetch";
import { BackendApiUri } from "./BackendApiUri";

export async function getProvince() {
    try {
        const response = await axios.get("https://emsifa.github.io/api-wilayah-indonesia/api/provinces.json");
        if(response.status === 200) return response;
    } catch (error) {
        console.error('Error fetching provinces:', error);
    }
}

export async function getKabupaten(provinceId : string) {
    try {
        const response = await axios.get(`https://emsifa.github.io/api-wilayah-indonesia/api/regencies/${provinceId}.json`);
        if(response.status === 200) return response;
    } catch (error) {
        console.error('Error fetching cities:', error);
    }
}

export async function getCity(kabupatenId : string) {
    try {
        const response = await axios.get(`https://emsifa.github.io/api-wilayah-indonesia/api/districts/${kabupatenId}.json`);
        if(response.status === 200) return response;
    } catch (error) {
        console.error('Error fetching cities:', error);
    }
}

export async function myProvince() {
    try {
        const response = await get(BackendApiUri.getLocation);
        if(response.status === 200) return response;
    } catch(error) {
        console.error('Error fetching cities:', error);
    }
}