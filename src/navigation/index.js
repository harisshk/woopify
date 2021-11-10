import React from 'react';
import { createStackNavigator } from "@react-navigation/stack";
import BottomTab from './BottomTab';
import SplashScreen from '../screens/SplashScreen';
import CategoriesProductScreen from '../screens/CategoriesProductScreen';
import ProductScreen from '../screens/ProductScreen';
import CartScreen from '../screens/CartScreen';
import CheckoutScreen from '../screens/CheckoutScreen';
import OrderTrackingScreen from '../screens/OrderTrackingScreen';
import LoginScreen from '../screens/LoginScreen';
import OTPScreen from '../screens/OTPScreen';
import RegisterScreen from '../screens/RegisterScreen';
import AddAddressScreen from '../screens/AddAddressScreen';
import AddressesScreen from '../screens/AddressesScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import SearchScreen from '../screens/SearchScreen';
import ProductListeningScreen from '../screens/ProductListeningScreen';
import OrdersScreen from '../screens/OrdersScreen';
import SettingScreen from '../screens/SettingScreen';
import NetworkIssueScreen from '../screens/NetworkIssueScreen';

const MainNavigator = createStackNavigator();

const HomeNavigator = () => {
    return (
        <MainNavigator.Navigator
            initialRouteName={"SplashScreen"}
        >
            <MainNavigator.Screen 
                options={{ headerShown: false }} 
                name="SplashScreen" 
                component={SplashScreen} 
            />
            <MainNavigator.Screen 
                options={{ headerShown: false }} 
                name="BottomTab" 
                component={BottomTab} 
            />
            <MainNavigator.Screen 
                options={{ headerShown: false }} 
                name="SettingScreen" 
                component={SettingScreen} 
            />
            <MainNavigator.Screen 
                options={{ 
                    headerShown: false, 
                    gestureEnabled: false, 
                }} 
                name="NetworkIssueScreen"   
                component={NetworkIssueScreen} 
            />
            <MainNavigator.Screen 
                options={({ route }) => ({
                    headerShown :false
                })} 
                name="CategoriesProductScreen" 
                component={CategoriesProductScreen} 
            />
            <MainNavigator.Screen 
                options={({ route }) => ({
                    headerShown :false
                })} 
                name="SearchScreen" 
                component={SearchScreen} 
            />
            <MainNavigator.Screen 
                options={({ route }) => ({
                    headerShown :false
                })} 
                name="OrdersScreen" 
                component={OrdersScreen} 
            />
            <MainNavigator.Screen 
                options={({ route }) => ({
                    title: '',
                    headerShown: false
                })} 
                name="ProductScreen" 
                component={ProductScreen} 
            />
            <MainNavigator.Screen 
                options={({ route }) => ({
                    title: '',
                    headerShown: false
                })} 
                name="ProductListeningScreen" 
                component={ProductListeningScreen} 
            />
            <MainNavigator.Screen 
                options={({ route }) => ({
                    title: '',
                    headerBackTitle:"Back",
                    headerShown :false
                })} 
                name="CartScreen" 
                component={CartScreen} 
            />
            <MainNavigator.Screen 
                options={({ route }) => ({
                    title: '',
                    headerBackTitle:"Back",
                    headerShown :false
                })} 
                name="CheckoutScreen" 
                component={CheckoutScreen} 
            />
            <MainNavigator.Screen 
                options={({ route }) => ({
                    title: 'Order Tracking',
                    headerBackTitle:"Back",
                    headerShown :false
                })} 
                name="OrderTrackingScreen" 
                component={OrderTrackingScreen} 
            />
            <MainNavigator.Screen 
                options={({ route }) => ({
                    headerShown :false
                })} 
                name="LoginScreen" 
                component={LoginScreen} 
            />
            <MainNavigator.Screen 
                options={({ route }) => ({
                    headerShown :false
                })} 
                name="OTPScreen" 
                component={OTPScreen} 
            />
            <MainNavigator.Screen 
                options={({ route }) => ({
                    headerShown :false
                })} 
                name="RegisterScreen" 
                component={RegisterScreen} 
            />
            <MainNavigator.Screen 
                options={({ route }) => ({
                    headerShown :false
                })} 
                name="AddAddressScreen" 
                component={AddAddressScreen} 
            />
            <MainNavigator.Screen 
                options={({ route }) => ({
                    headerShown :false
                })} 
                name="AddressesScreen" 
                component={AddressesScreen} 
            />
            <MainNavigator.Screen 
                options={({ route }) => ({
                    headerShown :false
                })} 
                name="EditProfileScreen" 
                component={EditProfileScreen} 
            />
            
        </MainNavigator.Navigator>
    )
}

export default HomeNavigator;
