import axios from "axios";
import { ACCESS_PASSWORD, API_ENDPOINT, API_URL, store, THEME_ID } from ".";

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

export const uploadImgToCDN = async(attachment, key) => {
    try{
        const response = await fetch(`https://petinpic.myshopify.com/admin/api/2021-10/themes/${THEME_ID}/assets.json`, {
            method: 'PUT', 
            body: {
                asset: {
                    attachment: attachment,
                    key: key
                }
            },
            headers: {
                'Content-Type': 'application/json',
                'X-Shopify-Access-Token': ACCESS_PASSWORD
            },
        });
        return response.json();
    }catch(error){
        console.log(error);
        console.log(`Error in uploading img to cdn`);
        return error;
    }
}