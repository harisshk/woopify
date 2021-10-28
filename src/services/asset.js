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