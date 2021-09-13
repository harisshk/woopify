import { ACCESS_PASSWORD } from ".";

export const getAllOrders = async (customerId, status) => {
    try {
        const response = await fetch(`https://hari1407.myshopify.com/admin/orders.json?status=${status}&customer_id=${customerId}`, {
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

export const getOrdersByOrderId = async (orderId) => {
    try {
        const response = await fetch(`https://hari1407.myshopify.com/admin/api/2021-07/orders/${orderId}.json`, {
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

