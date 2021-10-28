import axios from "axios";
import { ACCESS_PASSWORD, API_ENDPOINT, API_URL } from ".";

export const getCustomerById = async (customerId) => {
    try {
        const response = await fetch(`${API_URL}/customers/${customerId}.json`, {
            method: 'GET', // *GET, POST, PUT, DELETE, etc.
            headers: {
                'Content-Type': 'application/json',
                'X-Shopify-Access-Token': ACCESS_PASSWORD
            },
        });
        return response.json();

    } catch (error) {
        console.log(error)
    }
}

export const verifyEmail = async (body) => {
    try {
        const response = await axios.post(`${API_ENDPOINT}/api/customer/verify/email`, body);
        return response;
    } catch (error) {
        console.log(error);
        console.log('-------------------customer Line 25------------------------');
        return error?.response || null;
    }
}


export const sendOTPViaEmail = async (body) => {
    try {
        const response = await axios.post(`${API_ENDPOINT}/api/customer/send/email`, body);
        return response;
    } catch (error) {
        console.log(error);
        console.log('-------------------customer Line 40------------------------');
        return error?.response || null;
    }
}

export const createNewCustomer = async (body) => {
    try {
        const response = await fetch(`${API_URL}/customers.json`, {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            headers: {
                'Content-Type': 'application/json',
                'X-Shopify-Access-Token': ACCESS_PASSWORD
            },
            body: JSON.stringify(body)
        });
        return response.json();

    } catch (error) {
        console.log(error);
        return error;
    }

}

export const addNewAddress = async (customerId, body) => {
    try {
        const response = await fetch(`${API_URL}/customers/${customerId}/addresses.json`, {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            headers: {
                'Content-Type': 'application/json',
                'X-Shopify-Access-Token': ACCESS_PASSWORD
            },
            body: JSON.stringify(body)
        });
        return response.json();

    } catch (error) {
        console.log(error);
        return error;
    }
}

export const deleteAddress = async (customerId, addressId) => {
    try {
        const response = await fetch(`${API_URL}/customers/${customerId}/addresses/${addressId}.json`, {
            method: 'DELETE', // *GET, POST, PUT, DELETE, etc.
            headers: {
                'Content-Type': 'application/json',
                'X-Shopify-Access-Token': ACCESS_PASSWORD
            },
        });
        return response.json();

    } catch (error) {
        console.log(error);
        return error;
    }
}

export const updateAddress = async (customerId, addressId, body) => {
    try {
        const response = await fetch(`${API_URL}/customers/${customerId}/addresses/${addressId}.json`, {
            method: 'PUT', // *GET, POST, PUT, DELETE, etc.
            headers: {
                'Content-Type': 'application/json',
                'X-Shopify-Access-Token': ACCESS_PASSWORD
            },
            body: JSON.stringify(body)
        });
        return response.json();

    } catch (error) {
        console.log(error);
        return error;
    }
}

export const updateCustomerProfile = async (customerId, body) => {
    try {
        const response = await fetch(`${API_URL}/customers/${customerId}.json`, {
            method: 'PUT', // *GET, POST, PUT, DELETE, etc.
            headers: {
                'Content-Type': 'application/json',
                'X-Shopify-Access-Token': ACCESS_PASSWORD
            },
            body: JSON.stringify(body)
        });
        return response.json();

    } catch (error) {
        console.log(error);
        return error;
    }
}