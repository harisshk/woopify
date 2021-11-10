import axios from "axios";
import { ACCESS_PASSWORD, API_URL, store } from ".";

export const getAllProducts = async (limit) => {
    try {
        const response = await fetch(`${API_URL}/products.json?status=active&published_status=published`, {
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

export const searchProductsByQuery = async(query) => {
    try {
        const response = await fetch(`https://${store}.myshopify.com/search/suggest.json?q=${query}&resources[type]=product`, {
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

export const getProductInfo = async (productId) => {
    try {
        const response = await fetch(`${API_URL}/products/${productId}.json`, {
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

export const getProductByVariant = async (variantId) => {
    try {
        const response = await fetch(`${API_URL}/variants/${variantId}.json`, {
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
