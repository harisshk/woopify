import { ACCESS_PASSWORD, API_URL } from ".";

export const getAllPolicy = async () => {
    try {
        const response = await fetch(`${API_URL}/policies.json`, {
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
