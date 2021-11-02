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
        return () => {
            setStatus("any");
        }
    }, [status]);

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
                <View>
                <TouchableOpacity
                    onPress={()=> {
                        navigation.goBack();
                    }}
                    style={{
                        paddingVertical: normalize(10),
                    }}
                >
                    <Text
                        style={{
                            color: theme.colors.unfocused,
                            fontWeight: theme.fontWeight.bold,
                            fontSize: theme.fontSize.medium
                        }}
                    >
                        Go Back
                    </Text>
                </TouchableOpacity>
                <Text
                    style={{
                        fontWeight: theme.fontWeight.medium,
                        fontSize: theme.fontSize.title,
                    }}
                >
                    My Orders
                </Text>
                
                </View>
                <Menu
                    visible={statusMenu}
                    onDismiss={() => {
                        setStatusMenu(false);
                    }}
                    anchor={
                        <TouchableOpacity onPress={() => {
                            setStatusMenu(true);
                        }}
                            style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", backgroundColor: theme.colors.secondary, height: normalize(45), paddingHorizontal: normalize(15), borderRadius: normalize(4), elevation: 2 }}
                        >
                            <Image source={require('../assets/images/expand-arrow.png')}
                                style={{
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
                                    fontWeight: theme.fontWeight.bold
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
                        key: 'OrderScreen2',
                        alignSelf: "center"
                    },
                    {
                        width: '90%',
                        height: normalize(120),
                        marginVertical: normalize(5),
                        key: 'OrderScreen3',
                        alignSelf: "center"
                    },
                    {
                        width: '90%',
                        height: normalize(120),
                        marginVertical: normalize(5),
                        key: 'OrderScreen4',
                        alignSelf: "center"
                    },
                    {
                        width: '90%',
                        height: normalize(120),
                        marginVertical: normalize(5),
                        key: 'OrderScreen5',
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
                renderItem={({ item, index }) => {
                    return (
                        item?.shipping_address && 
                        <View
                            style={[{
                                    // backgroundColor: "#bbbbfa",
                                    backgroundColor: theme.colors.white,
                                    padding: normalize(10),
                                    borderRadius: normalize(10),
                                    elevation: 2,
                                    marginVertical: normalize(5),
                                    flexDirection: "row",
                                    flex: 1,
                                    borderWidth: 2,
                                    borderColor: theme.colors.white,
                                    shadowOpacity: .1,
                                    shadowColor: theme.colors.secondary
                                },
                                index + 1 === orders.length && orders.length > 3 && {
                                    marginBottom: normalize(25)
                                }
                            ]}
                            key={item.id}
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
                                        fontSize: theme.fontSize.subheading,
                                        fontWeight: theme.fontWeight.medium
                                    }}
                                >
                                    Order {item.name}
                                </SubHeading>
                                <Text
                                    style={{
                                        fontSize: theme.fontSize.paragraph,
                                    }}
                                >
                                    {/* Products Added {item?.line_items?.length} */}
                                </Text>
                                {/* <View>
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
                                </View> */}
                                <View>
                                <FlatList
                                    data={item.line_items }
                                    style={{
                                        marginVertical: normalize(10)
                                    }}
                                    horizontal
                                    renderItem={({item, index}) => {
                                        return(
                                            <Image
                                                source={{uri: item?.properties?.length > 0 ? item?.properties[1].value : `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAMFBMVEX09PTMzMzJycnPz8/d3d3V1dXi4uLo6Ojw8PDx8fH39/ft7e3Y2NjQ0NDp6enb29uHE20LAAACaklEQVR4nO3b6W6CQBhGYUTWD9T7v9uylLIN6jCk8Cbn+deEGo6DMOAYRQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIJyFiuzshLesStJAdVZdufEV38LFydkZm6w+IrBJrK86itkxgU1ifnaKmz363QvUvsbjmoNYdjuXPPMQz6R7lfLsGKeq3bd76LvfHwnFIXt0tOKYwjuF51kVtjMUbzqFVmR1/cpK30idwv7qH98yz0SVwvI+XP19JygqhY9xehMnXokihfl0/hZ77a5I4WM2zXz5DKJI4XwKvjHLNGeGRmE1L7w7N7fKeRLSKCy+KGwCnedZjcJofruXuo7SbpwdiRqFlk4D42y9rf0eyOtEjcL5BzFeb2rV5oRApNAmj6QcjyRs8g4sE0UKJ4nxemJq8yGeJ6oURpY/uic26frppy0uJvNEmcI2JM/yovlz8cxlGbhIFCrcsA6cX0/kC52Bt3hMlC90Bk5HUbzQPYL9KA6b6BXmk8/YZuCYqFdYj/f47wL/EtUKrR6/LXsfOCSKFbaBQ+KnwGa79sqpVWjp7x1Ec6B+DhQsHAK7xM+BeoVjYLPzr499eoXTwO+IFfoHihXuWbWgVVh792kV7lt3IlRoe0ZQqvCLax+FZ8c4UUghheebFu6jU1gk++gU7l3t3f2rRmGAyxcGr329cuEh60stunBh2Z3y6yxM/wX52S1u/bf3Ryzzdq9tuIDnYWv1q7NTNlhy0O8t/Nb6/SfLbnHoYbpjSep/sjLfOZ0ZXfTXJKPgH69deAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABDyA0uAKIxQw0bjAAAAAElFTkSuQmCC`}}
                                                style={[
                                                    {
                                                        height: normalize(75),
                                                        width: normalize(75),
                                                        borderRadius: normalize(7),
                                                        // left: -10
                                                        elevation: 2
                                                        
                                                    },
                                                    index > 0 && {
                                                        position: "absolute",
                                                        top: 0,
                                                        left: - (index * 20)
                                                    }
                                                ]}
                                            />
                                        )
                                    }}
                                    keyExtractor={item => item.id}
                                />
                                </View>
                                <Text
                                    style={[
                                        {
                                            fontSize: theme.fontSize.paragraph,
                                            textTransform: "uppercase",
                                            // fontWeight: theme.fontWeight.normal,
                                            color: "white",
                                            // alignItems: "center",
                                            // alignSelf: "center",
                                            textAlign: "center",
                                            padding: normalize(2),
                                        },
                                        item.fulfillment_status === "fulfilled" ? {
                                            backgroundColor: "#1c6946"
                                        } : item.fulfillment_status === "cancelled" ? {
                                            backgroundColor: "#541010"

                                        } : {
                                            backgroundColor: theme.colors.primary
                                        }
                                    ]}
                                    
                                >{item.fulfillment_status || "Processing"}
                                </Text>
                            </TouchableOpacity>
                            <View
                                style={{
                                    flex: .5,
                                    justifyContent: "space-around"
                                }}
                            >
                                <Text
                                    style={{
                                        fontSize: theme.fontSize.heading,
                                        fontWeight: theme.fontWeight.medium,
                                        lineHeight: theme.lineHeight.subheading,
                                        alignSelf: "center",
                                        // marginBottom: normalize(15),
                                        color: theme.colors.notification
                                    }}
                                >
                                    {item.currency === "USD" ? "$" : item.currency} {item.current_total_price}
                                </Text>
                                {/* <Image
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
                                /> */}
                                
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