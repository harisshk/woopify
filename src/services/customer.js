import axios from "axios";
import { ACCESS_PASSWORD, API_URL } from ".";

export const getCustomerById = async (customerId) => {
    try{
        const response = await fetch(`https://hari1407.myshopify.com/admin/api/2021-07/customers/${customerId}.json`, {
            method: 'GET', // *GET, POST, PUT, DELETE, etc.
            headers: {
              'Content-Type': 'application/json',
              'X-Shopify-Access-Token' : ACCESS_PASSWORD
            },
            });
        return response.json();
      
    }catch(error){
        console.log(error)
    }
}