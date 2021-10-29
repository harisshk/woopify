import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import { useIsFocused } from '@react-navigation/native';
import React, { createRef, useEffect, useState } from 'react'
import { ActivityIndicator, Alert, Dimensions, FlatList, Image, RefreshControl, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import normalize from 'react-native-normalize'
import { client } from '../services';
import { theme } from '../utils/theme';
const { height } = Dimensions.get('screen');
import ActionSheet from 'react-native-actions-sheet';
import SubHeading from '../components/SubHeading';
import { setCart } from '../redux/action/cart';
import { connect } from 'react-redux';
import { getProductByVariant } from '../services/products';
import base64 from 'react-native-base64';
import StepperCounter from '../components/StepperCounter';

function CartScreen({ navigation, setCart, customer }) {
    const [cartItem, setCartItem] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [editItem, setEditItem] = useState(null);
    const isFocussed = useIsFocused();
    const editActionRef = createRef();
    const addressActionRef = createRef();
    const [editCartLoading, setEditCartLoading] = useState(false);
    const [selectedStock, setSelectedStock] = useState(1);
    const [checkoutId, setCheckoutId] = useState(null);
    const [totalStock, setTotalStock] = useState(0);
    const [policy, setPolicy] = useState(null);
    
    const [refreshing, setRefreshing] = useState(true);
    const onRefresh = () => {
        setRefreshing(true);
        getCartItem();
        setRefreshing(false);
    }
    const updateQuantity = async () => {
        if (checkoutId !== null) {
            try {
                const lineItemsToUpdate = [
                    { id: editItem.id, quantity: parseInt(selectedStock) }
                ];
                setEditCartLoading(true);
                let checkout = await client.checkout.updateLineItems(checkoutId, lineItemsToUpdate)
                let data = Object.assign({}, { checkout: checkout })
                setCartItem({ ...data.checkout });
                setEditCartLoading(false);
            } catch (error) {
                setEditCartLoading(false);
                console.log(error);
                console.log('-------------------------------------CartScreen Line No 44-----------------------------------------------');
            }

        }
    };

    const removeItemFromCart = async (item) => {
        const lineItemIdsToRemove = [
            item.id
        ];
        setEditCartLoading(true);
        try {
            let checkout = await client.checkout.removeLineItems(checkoutId, lineItemIdsToRemove);
            let data = Object.assign({}, { checkout: checkout });
            const cart = {
                cart: { count: checkout?.lineItems?.length }
            }
            setCart({ ...cart });
            setCartItem({ ...data.checkout });
            setEditCartLoading(false);
        } catch (error) {
            console.log(error);
            console.log('-----------------------------------------Line 54-----------------------------------')
            setEditCartLoading(false);
            Alert.alert('Error', 'Something went wrong')
        }

    }

    useEffect(async () => {

        getCartItem();
        return () => {
            setIsLoading(true);
        }
    }, [isFocussed]);

    const getCartItem = async () => {
        let temp = await AsyncStorage.getItem('checkoutId');
        if (temp !== null) {
            setCheckoutId(JSON.parse(temp));
            const checkout = await client.checkout.fetch(JSON.parse(temp));
            const data = Object.assign({}, { checkout: checkout })
            setCartItem({ ...data.checkout });
            setIsLoading(false);
            setRefreshing(false);
        } else {
            setCartItem({
                ...{
                    lineItems: []
                }
            })
            setRefreshing(false);
            setIsLoading(false);

        }
    }

    const shippingAddressHandler = async (address) => {
        const shippingAddress = {
            address1: address?.address1,
            address2: address?.address2,
            city: address?.city,
            company: address?.company || null,
            country: address?.country,
            firstName: address?.first_name,
            lastName: address?.last_name,
            phone: address?.phone,
            province: address?.province,
            zip: address?.zip
        };
        try {
            client.checkout.updateShippingAddress(checkoutId, shippingAddress).then(checkout => {
                navigation.navigate('CheckoutScreen', { uri: cartItem.webUrl });
                addressActionRef.current?.hide();
            });
        } catch (error) {
            console.log(error);
            console.log('----------------CartScreen Line 134----------------------');
            addressActionRef.current?.hide();
            Alert.alert('Error', 'Something went wrong');
        }


    }

    return (
        <SafeAreaView
            style={{
                flex: 1,
                backgroundColor: theme.colors.background
            }}

        >
            <ActionSheet
                ref={editActionRef}
                drawUnderStatusBar={true}
                containerStyle={{
                    height: height / 2.2,
                    justifyContent: "space-around"
                }}
            >
                <View
                    style={{
                        width: '100%',
                        justifyContent: "space-between"
                    }}
                >
                    <StepperCounter
                        max={totalStock}
                        min={1}
                        curr={selectedStock}
                        setCurr={setSelectedStock}
                        policy={policy}
                    />
                    {/* <Picker
                        selectedValue={selectedStock}
                        color={theme.colors.primary}
                        style={{
                            backgroundColor: theme.colors.primary,
                            width: '90%',
                            borderRadius: normalize(12),
                            alignSelf: "center",
                            height: '70%',
                        }}
                        itemStyle={{
                            fontSize: theme.fontSize.medium,
                            fontWeight: "bold"
                        }}
                        onValueChange={(itemValue, itemIndex) =>
                            setSelectedStock(itemValue)
                        }>
                        {totalStock.map(item => {
                            return (
                                <Picker.Item
                                    key={item.value}
                                    label={item.label}
                                    value={item.value}
                                    color={theme.colors.white}

                                />
                            )
                        })}
                    </Picker> */}

                    <TouchableOpacity
                        onPress={() => {
                            updateQuantity(parseInt(selectedStock));
                            editActionRef.current?.setModalVisible(false);
                        }}
                        style={{
                            backgroundColor: theme.colors.primary,
                            width: '90%',
                            alignSelf: 'center',
                            borderRadius: normalize(12)
                        }}
                    >
                        <SubHeading
                            style={{
                                fontSize: theme.fontSize.medium,
                                fontWeight: theme.fontWeight.medium,
                                textAlign: "center",
                                marginVertical: normalize(15)
                                , color: theme.colors.white,
                            }}
                        >
                            Update Quantity
                        </SubHeading>
                    </TouchableOpacity>
                </View>
            </ActionSheet>

            <ActionSheet
                ref={addressActionRef}
                drawUnderStatusBar={true}
                containerStyle={{
                    height: height / 1.34,
                }}
                extraScroll={true}
                nestedScrollEnabled={true}
            >
                <ScrollView
                    style={{
                        padding: normalize(10),
                        height: '97%',
                        margin: normalize(10)
                    }}
                    showsVerticalScrollIndicator={false}
                >
                    <Text
                        style={{
                            fontWeight: theme.fontWeight.normal,
                            fontSize: theme.fontSize.subheading,
                            textAlign: "center",
                            marginBottom: normalize(10)
                        }}
                    >
                        Choose Shipping Address
                    </Text>
                    {/* <ScrollView
                        showsVerticalScrollIndicator={false}

                        contentContainerStyle={{
                            // flex: 1,
                            backgroundColor: "red",
                            height: normalize(300)
                        }}
                        style={{
                            backgroundColor: "red",
                            height: normalize(300),
                            // flex:1
                        }}
                    >
                        {customer.addresses.length === 0 ?
                            <View
                                style={{
                                    justifyContent: "center",
                                    alignContent: "center",
                                    alignItems: "center",
                                    height: '100%'
                                }}
                            >
                                <Text
                                    style={{
                                        fontSize: theme.fontSize.subheading,
                                        fontWeight: theme.fontWeight.thin
                                    }}
                                >
                                    No Address Found
                                </Text>
                                <TouchableOpacity
                                    onPress={() => {
                                        navigation.navigate('AddAddressScreen', { toUpdateAddress: false });
                                        addressActionRef.current?.hide();
                                    }}
                                >

                                    <Text
                                        style={{
                                            color: theme.colors.primary,
                                            textDecorationLine: "underline",
                                            marginTop: normalize(14),
                                            fontSize: theme.fontSize.subheading,
                                        }}
                                    >
                                        Add Address to Continue.
                                    </Text>
                                </TouchableOpacity>
                            </View>
                            :
                            customer.addresses.map((item,index) => {
                                return (
                                    <TouchableOpacity
                                        style={{
                                            backgroundColor: theme.colors.imageBackground,
                                            padding: normalize(12),
                                            borderRadius: normalize(12),
                                            flexDirection: "row",
                                            marginVertical: normalize(5),
                                            elevation: normalize(5),
                                            alignItems: "center",
                                            minHeight: normalize(120)
                                        }}
                                        onPress={() => {
                                            shippingAddressHandler(item);
                                        }}
                                        key={index}
                                    >
                                        <View
                                            style={{
                                                flex: .8
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    fontSize: theme.fontSize.paragraph,
                                                    fontWeight: theme.fontWeight.medium,
                                                    lineHeight: theme.lineHeight.medium
                                                }}
                                            >
                                                {item.name},
                                            </Text>
                                            <Text
                                                style={{
                                                    fontSize: theme.fontSize.paragraph,
                                                    fontWeight: theme.fontWeight.normal,
                                                    lineHeight: theme.lineHeight.paragraph
                                                }}
                                            >
                                                {item.address1}, {item.address2},
                                            </Text>
                                            <Text
                                                style={{
                                                    fontSize: theme.fontSize.paragraph,
                                                    fontWeight: theme.fontWeight.normal,
                                                    lineHeight: theme.lineHeight.paragraph
                                                }}
                                            >
                                                {item.city}, {item.province},
                                            </Text>
                                            <Text
                                                style={{
                                                    fontSize: theme.fontSize.paragraph,
                                                    fontWeight: theme.fontWeight.normal,
                                                    lineHeight: theme.lineHeight.paragraph
                                                }}
                                            >
                                                {item.zip}, {item.country}.
                                            </Text>
                                            <Text
                                                style={{
                                                    fontSize: theme.fontSize.paragraph,
                                                    fontWeight: theme.fontWeight.medium,
                                                    lineHeight: theme.lineHeight.paragraph,
                                                    marginTop: normalize(5),
                                                    color: theme.colors.primary
                                                }}
                                            >
                                                {item?.address?.default === true && "(Default Address)"}
                                            </Text>
                                        </View>
                                        <View
                                            style={{
                                                flex: .2
                                            }}
                                        >
                                            <TouchableOpacity
                                                onPress={() => {
                                                    addressActionRef.current?.hide();
                                                    navigation.navigate('AddAddressScreen', { toUpdateAddress: true, address: item })
                                                }}
                                            >

                                                <Image
                                                    source={require('../assets/images/edit.png')}
                                                    style={{
                                                        padding: normalize(1),
                                                        height: normalize(20),
                                                        width: normalize(20),
                                                        marginLeft: normalize(20)
                                                    }}
                                                />
                                            </TouchableOpacity>
                                        </View>
                                    </TouchableOpacity>

                                )
                            })}
                        <TouchableOpacity
                            onPress={() => {
                                navigation.navigate('AddAddressScreen', { toUpdateAddress: false });
                                addressActionRef.current?.hide();
                            }}
                        >

                            <Text
                                style={{
                                    color: theme.colors.primary,
                                    textDecorationLine: "underline",
                                    marginTop: normalize(14),
                                    fontSize: theme.fontSize.subheading,
                                    textAlign: "center"
                                }}
                            >
                                Add Address to Continue.
                            </Text>
                        </TouchableOpacity>
                    </ScrollView> */}
                    
                    <View
                        style={{
                            // backgroundColor: "red",
                            // height: 320
                        }}
                    >
                    <FlatList
                        style={{
                            // height: '100%'
                        }}
                        data={customer.addresses}

                        renderItem={({item,index}) => {
                            return(
<TouchableOpacity
                                        style={{
                                            backgroundColor: theme.colors.imageBackground,
                                            padding: normalize(12),
                                            borderRadius: normalize(12),
                                            flexDirection: "row",
                                            marginVertical: normalize(5),
                                            elevation: normalize(5),
                                            alignItems: "center",
                                            minHeight: normalize(120)
                                        }}
                                        onPress={() => {
                                            shippingAddressHandler(item);
                                        }}
                                        key={index}
                                    >
                                        <View
                                            style={{
                                                flex: .8
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    fontSize: theme.fontSize.paragraph,
                                                    fontWeight: theme.fontWeight.medium,
                                                    lineHeight: theme.lineHeight.medium
                                                }}
                                            >
                                                {item.name},
                                            </Text>
                                            <Text
                                                style={{
                                                    fontSize: theme.fontSize.paragraph,
                                                    fontWeight: theme.fontWeight.normal,
                                                    lineHeight: theme.lineHeight.paragraph
                                                }}
                                            >
                                                {item.address1}, {item.address2},
                                            </Text>
                                            <Text
                                                style={{
                                                    fontSize: theme.fontSize.paragraph,
                                                    fontWeight: theme.fontWeight.normal,
                                                    lineHeight: theme.lineHeight.paragraph
                                                }}
                                            >
                                                {item.city}, {item.province},
                                            </Text>
                                            <Text
                                                style={{
                                                    fontSize: theme.fontSize.paragraph,
                                                    fontWeight: theme.fontWeight.normal,
                                                    lineHeight: theme.lineHeight.paragraph
                                                }}
                                            >
                                                {item.zip}, {item.country}.
                                            </Text>
                                            <Text
                                                style={{
                                                    fontSize: theme.fontSize.paragraph,
                                                    fontWeight: theme.fontWeight.medium,
                                                    lineHeight: theme.lineHeight.paragraph,
                                                    marginTop: normalize(5),
                                                    color: theme.colors.primary
                                                }}
                                            >
                                                {item?.address?.default === true && "(Default Address)"}
                                            </Text>
                                        </View>
                                        <View
                                            style={{
                                                flex: .2
                                            }}
                                        >
                                            <TouchableOpacity
                                                onPress={() => {
                                                    addressActionRef.current?.hide();
                                                    navigation.navigate('AddAddressScreen', { toUpdateAddress: true, address: item })
                                                }}
                                            >

                                                <Image
                                                    source={require('../assets/images/edit.png')}
                                                    style={{
                                                        padding: normalize(1),
                                                        height: normalize(20),
                                                        width: normalize(20),
                                                        marginLeft: normalize(20)
                                                    }}
                                                />
                                            </TouchableOpacity>
                                        </View>
                                    </TouchableOpacity>
                            )
                        }}
                        keyExtractor={(item,index) => index}
                    />
                    </View>
                </ScrollView>
            </ActionSheet>

            <View
                style={{
                    flex: 1,
                    padding: normalize(15)
                }}
            >
                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center"
                    }}
                >
                    <Text
                        style={{
                            fontWeight: theme.fontWeight.medium,
                            fontSize: theme.fontSize.heading,
                        }}
                    >
                        Your Cart
                    </Text>
                    <TouchableOpacity
                        onPress={() => {
                            navigation.goBack();
                        }}
                    >
                        <Text
                            style={{
                                fontWeight: theme.fontWeight.medium,
                                fontSize: theme.fontSize.paragraph,
                                color: theme.colors.primary
                            }}
                        >
                            Continue Shopping
                        </Text>
                    </TouchableOpacity>
                </View>

                <View
                    style={{
                        height: height / 1.5
                    }}
                >
                    {isLoading === false && cartItem?.lineItems?.length === 0 &&

                        <View
                            style={{
                                height: normalize(300),
                                justifyContent: "center",
                                alignItems: "center"
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: theme.fontSize.heading,
                                    fontWeight: theme.fontWeight.medium
                                }}
                            > Oops !!! No Cart Items found.</Text>
                        </View>
                    }
                    <View>
                    <FlatList
                        data={cartItem.lineItems}
                        style={{
                            marginVertical: normalize(10),
                            // flex: 1,
                            height: '90%',
                        }}
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={onRefresh}
                            />
                        }
                        showsVerticalScrollIndicator={false}
                        renderItem={({ item }) => {
                            return (
                                <TouchableOpacity
                                    style={{
                                        flex: 1,
                                        width: '98%',
                                        alignSelf: "center",
                                        flexDirection: "row",
                                        marginVertical: normalize(5)
                                    }}
                                >
                                    <Image
                                        style={{
                                            height: normalize(95),
                                            width: '100%',
                                            padding: 2,
                                            flex: .56,
                                            marginRight: normalize(5),
                                            borderRadius: normalize(10)
                                        }}
                                        resizeMode={"center"}
                                        source={{ uri: item.variant?.image?.src }}
                                    />
                                    <View
                                        style={{
                                            flex: 1,
                                            marginHorizontal: normalize(5),
                                            justifyContent: "space-around"
                                        }}
                                    >
                                        <Text
                                            style={{
                                                fontSize: theme.fontSize.paragraph
                                            }}
                                            numberOfLines={2}
                                        >
                                            {item.title}
                                        </Text>
                                        <Text
                                            style={{
                                                color: theme.colors.placeholder
                                            }}
                                        >
                                            {item.variant.title}
                                        </Text>

                                        <View
                                            style={{
                                                flexDirection: "row"
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    fontWeight: theme.fontWeight.medium,
                                                }}
                                            >
                                                Quantity {item.quantity}
                                            </Text>
                                            <TouchableOpacity
                                                onPress={async () => {
                                                    const variantId = base64.decode(item.variant.id + "").split("/");
                                                    const variant = await getProductByVariant(variantId[variantId.length - 1]);
                                                    const { inventory_quantity, inventory_policy} = variant.variant;
                                                    setPolicy(inventory_policy);
                                                    setTotalStock(inventory_quantity);
                                                    editActionRef.current?.setModalVisible(true);
                                                    // setTotalStock([...newStockCount]);
                                                    setSelectedStock(item?.quantity || 1);
                                                    setEditItem(item);
                                                }}
                                                style={{
                                                    alignItems: "center",
                                                }}
                                                disabled={editCartLoading}
                                            >
                                                {editCartLoading ?
                                                    <ActivityIndicator
                                                        color={theme.colors?.secondary}
                                                        style={{
                                                            marginLeft: normalize(12),
                                                        }}
                                                    /> :
                                                    <Text
                                                        style={{
                                                            fontWeight: theme.fontWeight.normal,
                                                            marginLeft: normalize(10),
                                                            color: theme.colors.secondary,
                                                        }}
                                                    >
                                                        Edit
                                                    </Text>
                                                }
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                onPress={() => {
                                                    removeItemFromCart(item);
                                                }}
                                                disabled={editCartLoading}
                                            >
                                                {editCartLoading === false &&
                                                    <Text
                                                        style={{
                                                            fontWeight: theme.fontWeight.thin,
                                                            marginLeft: normalize(10),
                                                            color: "red"
                                                        }}
                                                    >
                                                        Remove
                                                    </Text>
                                                }
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                    <View style={{ flex: .4, alignSelf: 'center' }}>
                                        <Text style={{ textAlign: "right", fontSize: theme.fontSize.medium }}>$ {item?.variant?.price}</Text>
                                    </View>
                                </TouchableOpacity>
                            )
                        }}
                        keyExtractor={item => item.id}
                    />
                    </View>
                </View>

                {isLoading === false && cartItem?.lineItems.length > 0 &&
                    <View
                        style={{
                            elevation: 2,
                            borderTopWidth: 2,
                            borderTopColor: "#f5f5f5",
                        }}
                    >
                        <View
                            style={{
                                flexDirection: "row",
                                justifyContent: "space-between"
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: theme.fontSize.medium,
                                }}
                            >
                                Total Amount
                            </Text>
                            <Text
                                style={{
                                    fontSize: theme.fontSize.medium,
                                    fontWeight: theme.fontWeight.bold
                                }}
                            >
                                ${cartItem.paymentDue}
                            </Text>
                        </View>
                        <TouchableOpacity
                            style={{
                                height: normalize(55),
                                alignSelf: 'center',
                                justifyContent: "center",
                                backgroundColor: theme.colors.secondary,
                                width: '100%',
                                borderRadius: normalize(12),
                                marginTop: normalize(15),
                                alignItems: "center",
                            }}
                            onPress={() => {
                                addressActionRef.current?.show();
                            }}
                        >
                            <Text
                                style={{
                                    color: theme.colors.white,
                                    fontSize: theme.fontSize.medium
                                }}
                            >
                                PROCEED CHECKOUT
                            </Text>
                        </TouchableOpacity>
                    </View>
                }
            </View>
            
        </SafeAreaView>
    )
}


const mapStateToProps = state => {
    return {
        customer: state.customer,
        cart: state.cart
    }
}

const mapDispatchToProps = dispatch => ({
    setCart: cart => dispatch(setCart(cart))
});

export default connect(mapStateToProps, mapDispatchToProps)(CartScreen);
