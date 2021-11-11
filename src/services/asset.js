import axios from "axios";
import { API_ENDPOINT } from ".";

export const uploadImage = async (body) => {
    try {
        const response = await axios.post(`${API_ENDPOINT}/api/asset/image`, body);
        return response;
    } catch (error) {
        console.log(error);
        return error;
    }
}

export const getCountryDialCode = async() => {
    try{
        const response = await axios.get(`${API_ENDPOINT}/api/v1/data/countries`);
        return response;
    }catch(error){

    }
}