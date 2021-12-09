import axios from "axios";
import { ACCESS_PASSWORD, API_URL } from ".";

export const createCheckout = async (body) => {
    try {
        const response = await fetch(`${API_URL}/checkouts.json`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Shopify-Access-Token': ACCESS_PASSWORD
            },
            body: JSON.stringify(body)
        });
        return response.json();

    } catch (error) {
        console.log(error)
    }
}

export const updateCheckout = async (token, body) => {
    try {
        const response = await fetch(`${API_URL}/checkouts/${token}.json`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-Shopify-Access-Token': ACCESS_PASSWORD
            },
            body: JSON.stringify(body)
        });
        return response.json();

    } catch (error) {
        console.log(error)
    }
}

export const retrieveCartItems = async (token) => {
    try {
        const response = await fetch(`${API_URL}/checkouts/${token}.json`, {
            method: 'GET',
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
