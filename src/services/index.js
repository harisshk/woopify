
import Client from 'shopify-buy';

const store = "petinpic";
export const API_URL = `https://${store}.myshopify.com/admin/api/2021-07`;

// `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`;
export const ACCESS_PASSWORD = 
// `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`;
`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`;


  // '9b215e63d514ca114df60156c3ce8833'
export const client = Client.buildClient({
  domain: `${store}.myshopify.com`,
  storefrontAccessToken: 
  // 'edde6874f71c23939f1d6b2f37ba6c46'
  `7ebf56ccea3fccccf4edc4f8fa1cd032`
});


export const API_ENDPOINT = `https://fd56-106-51-88-144.ngrok.io`;