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
        <View
            style={{
                flex: 1,
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                
            }}
        >
            <TouchableOpacity
                style={{
                    flex: .8,
                    height: normalize(40),
                    alignSelf: "center",
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: normalize(12),
                    elevation: 2,
                    backgroundColor: accessibilityState.selected ? theme.colors.bottomTabActiveBg : theme.colors.bottomTabBgColor,
                }}
                activeOpacity={1}
                onPress={onPress}
            >
                <View
                    style={{
                        width: "25%"
                    }}
                >
                    {children}
                </View>
                {accessibilityState.selected &&
                    <Text
                        style={{
                            color: theme.colors.primary,
                            marginTop: normalize(4),
                            fontWeight: theme.fontWeight.medium,
                            lineHeight: theme.lineHeight.heading,
                            marginLeft: normalize(4)
                        }}
                    >
                        {name}
                    </Text>
                }
            </TouchableOpacity>
        </View>
    )
}


const BottomTab = () => {
    return (
        <Tab.Navigator
            screenOptions={{
                showLabel: false,
                tabBarStyle: {
                    backgroundColor: theme.colors.bottomTabBgColor,
                    height: normalize(75)
                },

            }}
            initialRouteName="HomeScreen"
        >
            <Tab.Screen
                name="OrdersScreen"
                component={OrdersScreen}
                options={{
                    tabBarIcon: ({ focused }) => (
                        focused === true ?
                            <Image
                                source={require('../assets/images/history.png')}
                                resizeMode="contain"
                                style={{
                                    width: normalize(25),
                                    height: normalize(25),
                                    tintColor: focused ? theme.colors.primary : theme.colors.secondary
                                }}
                            />
                            :
                            <Image
                                source={require('../assets/images/history-outline.png')}
                                resizeMode="contain"
                                style={{
                                    width: normalize(22),
                                    height: normalize(22),
                                    tintColor: focused ? theme.colors.primary : theme.colors.secondary
                                }}
                            />
                    ),
                    tabBarButton: (props) => (
                        <TabBarCustomButton
                            {...props}
                            name={'Orders'}
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
                        focused === true ? <Image
                            source={require('../assets/images/home.png')}
                            resizeMode="contain"
                            style={{
                                width: normalize(23),
                                height: normalize(23),
                                tintColor: focused ? theme.colors.primary : theme.colors.secondary
                            }}
                        /> :
                            <Image
                                source={require('../assets/images/home-outline.png')}
                                resizeMode="contain"
                                style={{
                                    width:normalize(22),
                                    height: normalize(22),
                                    tintColor: focused ? theme.colors.primary : theme.colors.secondary
                                }}
                            />
                    ),
                    tabBarButton: (props) => (
                        <TabBarCustomButton
                            {...props}
                            name={' Home'}
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
                        focused === true ?
                            <Image
                                source={require('../assets/images/user.png')}
                                resizeMode="contain"
                                style={{
                                    width: normalize(22),
                                    height: normalize(22),
                                    tintColor: focused ? theme.colors.primary : theme.colors.secondary
                                }}
                            />
                            :
                            <Image
                                source={require('../assets/images/user-outline.png')}
                                resizeMode="contain"
                                style={{
                                    width: normalize(22),
                                    height: normalize(22),
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