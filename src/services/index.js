
import Client from 'shopify-buy';

const store = "hari1407";
export const API_URL = `https://${store}.myshopify.com/admin/api/2021-07`;

export const ACCESS_PASSWORD = 
// `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`;
`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`;

export const client = Client.buildClient({
  domain: `${store}.myshopify.com`,
  storefrontAccessToken: 
  // '9b215e63d514ca114df60156c3ce8833'
  'edde6874f71c23939f1d6b2f37ba6c46'
});


export const API_ENDPOINT = `https://shopify-connect-api.herokuapp.com`;