import React from 'react';
import { createStackNavigator } from "@react-navigation/stack";
import BottomTab from './BottomTab';

import {
    AddAddressScreen,
    SplashScreen,
    CategoriesProductScreen,
    ProductScreen,
    CheckoutScreen,
    CartScreen,
    OrderTrackingScreen,
    LoginScreen,
    OTPScreen,
    RegisterScreen,
    AddressesScreen,
    EditProfileScreen,
    SearchScreen,
    ProductListeningScreen,
    OrdersScreen,
    SettingScreen,
    NetworkIssueScreen
} from '../screens/index';


const MainNavigator = createStackNavigator();

const MainNavigation = () => {
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
                options={() => ({
                    headerShown :false
                })} 
                name="CategoriesProductScreen" 
                component={CategoriesProductScreen} 
            />

            <MainNavigator.Screen 
                options={() => ({
                    headerShown :false
                })} 
                name="SearchScreen" 
                component={SearchScreen} 
            />

            <MainNavigator.Screen 
                options={() => ({
                    headerShown :false
                })} 
                name="OrdersScreen" 
                component={OrdersScreen} 
            />

            <MainNavigator.Screen 
                options={() => ({
                    title: '',
                    headerShown: false
                })} 
                name="ProductScreen" 
                component={ProductScreen} 
            />

            <MainNavigator.Screen 
                options={() => ({
                    title: '',
                    headerShown: false
                })} 
                name="ProductListeningScreen" 
                component={ProductListeningScreen} 
            />

            <MainNavigator.Screen 
                options={() => ({
                    title: '',
                    headerBackTitle:"Back",
                    headerShown :false
                })} 
                name="CartScreen" 
                component={CartScreen} 
            />

            <MainNavigator.Screen 
                options={() => ({
                    title: '',
                    headerBackTitle:"Back",
                    headerShown :false
                })} 
                name="CheckoutScreen" 
                component={CheckoutScreen} 
            />

            <MainNavigator.Screen 
                options={() => ({
                    title: 'Order Tracking',
                    headerBackTitle:"Back",
                    headerShown :false
                })} 
                name="OrderTrackingScreen" 
                component={OrderTrackingScreen} 
            />

            <MainNavigator.Screen 
                options={() => ({
                    headerShown :false
                })} 
                name="LoginScreen" 
                component={LoginScreen} 
            />

            <MainNavigator.Screen 
                options={() => ({
                    headerShown :false
                })} 
                name="OTPScreen" 
                component={OTPScreen} 
            />

            <MainNavigator.Screen 
                options={() => ({
                    headerShown :false
                })} 
                name="RegisterScreen" 
                component={RegisterScreen} 
            />

            <MainNavigator.Screen 
                options={() => ({
                    headerShown :false
                })} 
                name="AddAddressScreen" 
                component={AddAddressScreen} 
            />

            <MainNavigator.Screen 
                options={() => ({
                    headerShown :false
                })} 
                name="AddressesScreen" 
                component={AddressesScreen} 
            />

            <MainNavigator.Screen 
                options={() => ({
                    headerShown :false
                })} 
                name="EditProfileScreen" 
                component={EditProfileScreen} 
            />
            
        </MainNavigator.Navigator>
    )
}

export default MainNavigation;
