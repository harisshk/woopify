
import Client from 'shopify-buy';

export const store = "petinpic";

export const AWS_URL = `petnpic`
export const API_URL = `https://${store}.myshopify.com/admin/api/2021-07`;

export const ACCESS_PASSWORD = `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`;

export const client = Client.buildClient({
  domain: `${store}.myshopify.com`,
  storefrontAccessToken: `7ebf56ccea3fccccf4edc4f8fa1cd032`
});

export const API_KEY = `1b42fe48a6f3d18bb652e1c24e124738`;

export const API_ENDPOINT = `https://shopify-connect-api.herokuapp.com`;

export const THEME_ID = `128259850488`;

export const PRODUCT_VIEW = 2;

export const PRODUCT_VIEW_HEADING_NUMBER_LINES = 3;

export const CATEGORY_VISIBLE = true;

export const CATEGORY_ROUNDED = true;

export const CUSTOMIZABLE_CART = false;

export const PREVIEW_KEY = "asset";