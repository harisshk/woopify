import React from 'react';
import { createStackNavigator } from "@react-navigation/stack";
import BottomTab from './BottomTab'
import SplashScreen from '../screens/SplashScreen';
import CategoriesProductScreen from '../screens/CategoriesProductScreen';
import ProductScreen from '../screens/ProductScreen';
import CartScreen from '../screens/CartScreen';
import CheckoutScreen from '../screens/CheckoutScreen';
import OrderTrackingScreen from '../screens/OrderTrackingScreen';

const MainNavigator = createStackNavigator();

const HomeNavigator = () => {
    return (
        <MainNavigator.Navigator
            initialRouteName={"BottomTab"}
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
                options={({ route }) => ({
                    title: '',
                    headerBackTitleVisible: false
                })} 
                name="CategoriesProductScreen" 
                component={CategoriesProductScreen} 
            />
            <MainNavigator.Screen 
                options={({ route }) => ({
                    title: '',
                    headerBackTitle:"Back"
                    // headerBackTitleVisible: false
                })} 
                name="ProductScreen" 
                component={ProductScreen} 
            />
            <MainNavigator.Screen 
                options={({ route }) => ({
                    title: '',
                    headerBackTitle:"Back",
                    headerShown :false
                    // headerBackTitleVisible: false
                })} 
                name="CartScreen" 
                component={CartScreen} 
            />
            <MainNavigator.Screen 
                options={({ route }) => ({
                    title: '',
                    headerBackTitle:"Back",
                    headerShown :false
                    // headerBackTitleVisible: false
                })} 
                name="CheckoutScreen" 
                component={CheckoutScreen} 
            />
            <MainNavigator.Screen 
                options={({ route }) => ({
                    title: 'Order Tracking',
                    headerBackTitle:"Back",
                    // headerShown :false
                    // headerBackTitleVisible: false
                })} 
                name="OrderTrackingScreen" 
                component={OrderTrackingScreen} 
            />
        </MainNavigator.Navigator>
    )
}

export default HomeNavigator;
