import axios from "axios"

export const requestHandler = async(config) => {
    try{
        return await axios(config);
    }catch(error){
        console.log(error?.response?.message);
        return error.response;
    }
}