import { AWS_URL } from '../services';

const EMAIL_OTP = require('../assets/images/send-email.png');
const LOGO = { uri: `https://cdn.shopify.com/s/files/1/0602/9036/7736/files/1280x720-new-pnp_190x@2x.png?v=1634032473` };
const BANNER_1 = { uri: `https://${AWS_URL}.s3.amazonaws.com/banner1.jpeg` };
const BANNER_2 = { uri: `https://${AWS_URL}.s3.amazonaws.com/banner2.jpeg` };
const HELPER_1 = { uri: `https://${AWS_URL}.s3.amazonaws.com/homeScreenHelper1.jpeg` };
const DEFAULT_CATEGORY = { uri: `https://cdn.shopify.com/s/files/1/0602/9036/7736/files/human-ls-dog_1512x.jpg?v=1635328680` };
export default{
    EMAIL_OTP,
    LOGO,
    BANNER_1,
    BANNER_2,
    HELPER_1,
    DEFAULT_CATEGORY
};