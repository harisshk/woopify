import React from 'react';
import {
    View,
    Image,
    Text,
    TouchableOpacity
} from 'react-native';
import { createBottomTabNavigator, BottomTabBar } from "@react-navigation/bottom-tabs"
import HomeScreen from '../screens/HomeScreen';
import { theme } from '../utils/theme';
import ProfileScreen from '../screens/ProfileScreen';
import OrdersScreen from '../screens/OrdersScreen';
import normalize from 'react-native-normalize';
const Tab = createBottomTabNavigator();

const TabBarCustomButton = (props) => {
    const { accessibilityState, children, name, onPress } = props;
    return (
        <TouchableOpacity
            style={{
                flex: 1,
                height: 60,
                backgroundColor: theme.colors.white,
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center"
            }}
            activeOpacity={1}
            onPress={onPress}
        >
            <View

                style={{
                    width: "25%"
                }}>
                    {children}
            </View>
            {accessibilityState.selected && 
                <Text
                    style={{ 
                        color: theme.colors.primary, 
                        marginTop: normalize(4),
                        fontWeight: theme.fontWeight.medium,
                        lineHeight: theme.lineHeight.heading,
                        marginLeft : normalize(2)
                    }}
                >
                    {name}
                </Text>
            }
        </TouchableOpacity>
    )
}

const CustomTabBar = (props) => {
    return (
        <BottomTabBar
            {...props.props}
        />
    );
};

const BottomTab = () => {
    return (
        <Tab.Navigator
            screenOptions={{
                showLabel: false,
                style: {
                    position: 'absolute',
                    left: 0,
                    bottom: 0,
                    right: 0,
                    borderTopWidth: 0,
                    backgroundColor :'red',
                    // backgroundColor: "#e0d6ff",
                    elevation: 2
                }
            }}
            tabBar={(props) => (
                <CustomTabBar
                    props={props}
                />
            )}
            initialRouteName="HomeScreen"
        >
            
            
            <Tab.Screen
                name="OrdersScreen"

                component={OrdersScreen}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <Image
                            source={{ uri: "https://user-images.githubusercontent.com/54505967/132632954-f40b3b4d-b2b6-4f2e-8d7c-9f6296a221a9.png" }}
                            resizeMode="contain"
                            style={{
                                width: normalize(30),
                                height: normalize(30),
                                tintColor: focused ? theme.colors.primary : theme.colors.secondary
                            }}
                        />
                    ),
                    tabBarButton: (props) => (
                        <TabBarCustomButton
                            {...props}
                            name={'Order'}
                        />
                    ),
                    headerShown: false,
                    tabBarShowLabel: false,
                }}
            />
            <Tab.Screen
                name="HomeScreen"
                component={HomeScreen}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <Image
                            source={{ uri: "https://user-images.githubusercontent.com/54505967/132632570-d8dce1c6-9507-45e7-b978-a71c5a4d3795.png" }}
                            resizeMode="contain"
                            style={{
                                width: 25,
                                height: 25,
                                tintColor: focused ? theme.colors.primary : theme.colors.secondary
                            }}
                        />
                    ),
                    tabBarButton: (props) => (
                        <TabBarCustomButton
                            {...props}
                            name={'Home'}
                        />
                    ),
                    headerShown: false,
                    tabBarShowLabel: false,
                }}
            />
            
            <Tab.Screen
                name="ProfileScreen"

                component={ProfileScreen}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <Image
                            source={{ uri: "https://user-images.githubusercontent.com/54505967/132633937-4bdc4d6a-57c7-4e10-9f30-1300d76e289e.png" }}
                            resizeMode="contain"
                            style={{
                                width: 25,
                                height: 25,
                                tintColor: focused ? theme.colors.primary : theme.colors.secondary
                            }}
                        />
                    ),
                    tabBarButton: (props) => (
                        <TabBarCustomButton
                            {...props}
                            name={'Profile'}
                        />
                    ),
                    headerShown: false,
                    tabBarShowLabel: false,
                }}
            />
        </Tab.Navigator>
    )
}

export default BottomTab;