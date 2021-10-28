import { useIsFocused } from '@react-navigation/native';
import React, { useEffect, useState } from 'react'
import { FlatList, SafeAreaView, Text, TouchableOpacity, View, Image, RefreshControl } from 'react-native'
import normalize from 'react-native-normalize';
import SubHeading from '../components/SubHeading';
import { getAllOrders } from '../services/orders';
import { theme } from '../utils/theme';
import { Menu, Divider } from 'react-native-paper';
import { connect } from 'react-redux';
import SkeletonContent from 'react-native-skeleton-content-nonexpo';


function OrderScreen({ navigation, customer }) {
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [status, setStatus] = useState("any")
    const [statusMenu, setStatusMenu] = useState(false);
    const isFocussed = useIsFocused();
    const [refreshing, setRefreshing] = useState(false);
    const onRefresh = () => {
        setRefreshing(true);
        getOrders();
        setRefreshing(false);
    }
    useEffect(async () => {
        getOrders();
    }, [isFocussed, status]);

    const getOrders = async () => {
        setIsLoading(true);
        const data = await getAllOrders(customer?.id, status);
        setOrders(data.orders);
        setIsLoading(false);
    }

    return (
        <SafeAreaView
            style={{
                flex: 1,
                backgroundColor: theme.colors.background
            }}
        >
            <View
                style={{
                    padding: normalize(15),
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between"

                }}>
                <Text
                    style={{
                        fontWeight: theme.fontWeight.medium,
                        fontSize: theme.fontSize.title,
                    }}
                >
                    My Orders
                </Text>
                <Menu
                    visible={statusMenu}
                    onDismiss={() => {
                        setStatusMenu(false);
                    }}
                    anchor={
                        <TouchableOpacity onPress={() => {
                            setStatusMenu(true);
                        }}
                            style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}
                        >
                            <Image source={require('../assets/images/expand-arrow.png')} style={{
                                height: normalize(15),
                                width: normalize(15), marginRight: normalize(10)

                            }}
                                resizeMode="contain"
                            />
                            <Text
                                style={{
                                    color: theme.colors.primary,
                                    textTransform: "uppercase",
                                    fontSize: theme.fontSize.paragraph,
                                }}
                            >{status === "any" ? "All Orders" : status === "open" ? "Processing" : status === "closed" ? "Completed" : "Cancelled"}</Text>

                        </TouchableOpacity>
                    }>
                    <Menu.Item
                        onPress={() => {
                            setStatus("any");
                            setStatusMenu(false);
                        }}
                        title="All Orders"
                    />
                    <Divider />
                    <Menu.Item onPress={() => {
                        setStatus("open");
                        setStatusMenu(false);
                    }}
                        title="Processing" />
                    <Divider />
                    <Menu.Item onPress={() => {
                        setStatus("closed");
                        setStatusMenu(false);
                    }}
                        title="Completed" />
                    <Divider />
                    <Menu.Item onPress={() => {
                        setStatus("cancelled");
                        setStatusMenu(false);
                    }} title="Cancelled" />
                </Menu>
            </View>
            <SkeletonContent
                containerStyle={{ width: '100%' }}
                isLoading={isLoading}
                layout={[
                    {
                        width: '90%',
                        height: normalize(120),
                        marginVertical: normalize(5),
                        key: 'OrderScreen1',
                        alignSelf: "center"
                    },
                    {
                        width: '90%',
                        height: normalize(120),
                        marginVertical: normalize(5),
                        key: 'OrderScreen1',
                        alignSelf: "center"
                    },
                    {
                        width: '90%',
                        height: normalize(120),
                        marginVertical: normalize(5),
                        key: 'OrderScreen1',
                        alignSelf: "center"
                    },
                    {
                        width: '90%',
                        height: normalize(120),
                        marginVertical: normalize(5),
                        key: 'OrderScreen1',
                        alignSelf: "center"
                    },
                    {
                        width: '90%',
                        height: normalize(120),
                        marginVertical: normalize(5),
                        key: 'OrderScreen1',
                        alignSelf: "center"
                    },
                ]}
            />
            {isLoading === false && orders.length === 0 &&
                <View
                    style={{
                        alignSelf: "center",
                        height: normalize(150),
                        justifyContent: "center"
                    }}
                >
                    <Text
                        style={{
                            fontSize: theme.fontSize.medium,
                            textAlign: "center",
                            alignSelf: "center"
                        }}
                    >
                        Oops Nothing found !
                    </Text>
                </View>
            }
            <FlatList
                data={orders}
                style={{
                    padding: normalize(15),
                    flex: 1
                }}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
                renderItem={({ item }) => {
                    return (
                        item?.shipping_address && <View
                            style={{
                                // backgroundColor: "#bbbbfa",
                                backgroundColor: "#f7f2fc",
                                padding: normalize(10),
                                borderRadius: normalize(10),
                                elevation: 3,
                                marginVertical: normalize(5),
                                flexDirection: "row",
                                flex: 1,
                                borderWidth: 2,
                                borderColor: "#e8e8e8"
                            }}
                        >
                            <TouchableOpacity
                                onPress={() => {
                                    // Linking.openURL(item.order_status_url)
                                    navigation.navigate('OrderTrackingScreen', { uri: item.order_status_url, fetchFromId: false });
                                }}
                                style={{
                                    flex: .75
                                }}
                            >
                                <SubHeading
                                    style={{
                                        marginBottom: 0,
                                        marginTop: normalize(5),
                                        fontSize: theme.fontSize.medium
                                    }}
                                >
                                    Order {item.name}
                                </SubHeading>
                                <View>
                                    {item?.shipping_address &&
                                        <Text
                                            style={{
                                                fontSize: theme.fontSize.paragraph,
                                                marginTop: normalize(15)
                                            }}
                                        >
                                            <SubHeading>Delivery  </SubHeading>
                                            {item?.shipping_address?.address1}, {item?.shipping_address?.address2}, {item?.shipping_address?.city}, {item?.shipping_address?.province}, Zip Code {item?.shipping_address?.zip}.
                                        </Text>
                                    }
                                </View>


                            </TouchableOpacity>
                            <View
                                style={{
                                    flex: .21,
                                    justifyContent: "space-around"
                                }}
                            >
                                <Text
                                    style={{
                                        fontSize: theme.fontSize.paragraph,
                                        fontWeight: theme.fontWeight.bold,
                                        alignSelf: "center",
                                        marginBottom: normalize(15)
                                    }}
                                >
                                    ${item.current_total_price}
                                </Text>
                                <Image
                                    // source={{uri : "https://www.vhv.rs/dpng/d/356-3568543_check-icon-green-tick-hd-png-download.png"}}
                                    // source={{uri : "https://toppng.com/uploads/preview/red-cross-mark-download-png-red-cross-check-mark-11562934675swbmqcbecx.png"}}
                                    source={{ uri: item.fulfillment_status === "fulfilled" ? "https://user-images.githubusercontent.com/54505967/132626961-91e73bed-8e1e-4f76-a1c4-0a2f2b86d7c4.png" : item.fulfillment_status === "cancelled" ? "https://toppng.com/uploads/preview/red-cross-mark-download-png-red-cross-check-mark-11562934675swbmqcbecx.png" : "https://user-images.githubusercontent.com/54505967/132627173-60d5b342-fb1d-4e81-8bf1-e10ff32e7ebb.png" }}
                                    style={{
                                        width: item.fulfillment_status === "fulfilled" ? normalize(60) : normalize(34),
                                        height: item.fulfillment_status === "fulfilled" ? normalize(60) : normalize(34),
                                        alignSelf: "flex-end",
                                        // marginLeft: item.fulfillment_status === "fulfilled" ? -16: 0
                                    }}
                                    resizeMode="center"
                                />

                            </View>
                        </View>

                    )
                }}
                keyExtractor={item => item.id}
            />
        </SafeAreaView>
    )
}
const mapStateToProps = state => ({
    customer: state.customer
})
export default connect(mapStateToProps, null)(OrderScreen);