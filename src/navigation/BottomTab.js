import React from 'react';
import {
    View,
    Image,
    Text,
    TouchableOpacity
} from 'react-native';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
    CartScreen,
    ProfileScreen,
    HomeScreen,
    SearchScreen
} from '../screens/index'
import normalize from 'react-native-normalize';
import { icons } from '../constant/index';
import { theme } from '../utils/theme';
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
                            marginLeft: normalize(4),
                            fontSize: theme.fontSize.medium
                        }}
                    >
                        {" "}{name}
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
                name="HomeScreen"
                component={HomeScreen}
                options={{
                    tabBarIcon: ({ focused }) => (
                        focused === true ? <Image
                            source={icons?.HOME}
                            resizeMode="contain"
                            style={{
                                width: normalize(23),
                                height: normalize(23),
                                tintColor: focused ? theme.colors.primary : theme.colors.inactiveTabIcons
                            }}
                        /> :
                            <Image
                                source={icons?.HOME_OUTLINE}
                                resizeMode="contain"
                                style={{
                                    width:normalize(22),
                                    height: normalize(22),
                                    tintColor: focused ? theme.colors.primary : theme.colors.inactiveTabIcons
                                }}
                            />
                    ),
                    tabBarButton: (props) => (
                        <TabBarCustomButton
                            {...props}
                            name={' Shop'}
                        />
                    ),
                    headerShown: false,
                    tabBarShowLabel: false,
                }}
            />
            <Tab.Screen
                name="SearchScreen"
                component={SearchScreen}
                options={{
                    tabBarIcon: ({ focused }) => (
                        focused === true ? <Image
                            source={icons?.SEARCH}
                            resizeMode="contain"
                            style={{
                                width: normalize(23),
                                height: normalize(23),
                                tintColor: focused ? theme.colors.primary : theme.colors.inactiveTabIcons
                            }}
                        /> :
                            <Image
                                source={icons?.SEARCH}
                                resizeMode="contain"
                                style={{
                                    width:normalize(22),
                                    height: normalize(22),
                                    tintColor: focused ? theme.colors.primary : theme.colors.inactiveTabIcons
                                }}
                            />
                    ),
                    tabBarButton: (props) => (
                        <TabBarCustomButton
                            {...props}
                            name={' Search'}
                        />
                    ),
                    headerShown: false,
                    tabBarShowLabel: false,
                }}
            />
            <Tab.Screen
                name="CartScreen"
                component={CartScreen}
                options={{
                    tabBarIcon: ({ focused }) => (
                        focused === true ?
                            <Image
                                source={icons?.BAG}
                                resizeMode="contain"
                                style={{
                                    width: normalize(25),
                                    height: normalize(25),
                                    tintColor: focused ? theme.colors.primary : theme.colors.inactiveTabIcons
                                }}
                            />
                            :
                            <Image
                                source={icons?.BAG_OUTLINE}
                                resizeMode="contain"
                                style={{
                                    width: normalize(22),
                                    height: normalize(22),
                                    tintColor: focused ? theme.colors.primary : theme.colors.inactiveTabIcons
                                }}
                            />
                    ),
                    tabBarButton: (props) => (
                        <TabBarCustomButton
                            {...props}
                            name={'My Cart'}
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
                                source={icons?.USER}
                                resizeMode="contain"
                                style={{
                                    width: normalize(22),
                                    height: normalize(22),
                                    tintColor: focused ? theme.colors.primary : theme.colors.inactiveTabIcons
                                }}
                            />
                            :
                            <Image
                                source={icons?.USER_OUTLINE}
                                resizeMode="contain"
                                style={{
                                    width: normalize(22),
                                    height: normalize(22),
                                    tintColor: focused ? theme.colors.primary : theme.colors.inactiveTabIcons
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