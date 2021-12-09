import axios from "axios";
import { ACCESS_PASSWORD, API_URL } from ".";

export const getAllCategories = async () => {
    try {
        const response = await fetch(`${API_URL}/custom_collections.json`, {
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

export const getAllProductsByCategory = async (collectionId) => {
    try {
        const response = await fetch(`${API_URL}/products.json/?collection_id=${collectionId}&status=active&published_status=published`, {
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