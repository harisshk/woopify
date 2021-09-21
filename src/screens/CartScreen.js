import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import { useIsFocused } from '@react-navigation/native';
import React, { createRef, useEffect, useState } from 'react'
import { ActivityIndicator, Alert, Dimensions, FlatList, Image, RefreshControl, SafeAreaView, Text, TouchableOpacity, View } from 'react-native'
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

function CartScreen({ navigation, setCart, customer }) {
    const [cartItem, setCartItem] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [editItem, setEditItem] = useState(null);
    const isFocussed = useIsFocused();
    const editActionRef = createRef();
    const [editCartLoading, setEditCartLoading] = useState(false);
    const [selectedStock, setSelectedStock] = useState(1);
    const [checkoutId, setCheckoutId] = useState(null);
    const [totalStock, setTotalStock] = useState([
        { label: "1", value: "1" },
        { label: "2", value: "2" },
        { label: "3", value: "3" },
        { label: "4", value: "4" },
        { label: "5", value: "5" },
    ]);
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
                    <Picker
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
                    </Picker>
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
                                fontWeight: theme.fontWeight.thin,
                                fontSize: theme.fontSize.paragraph,
                            }}
                        >
                            Continue Shopping
                        </Text>
                    </TouchableOpacity>
                </View>

                <View
                    style={{
                        height: height / 1.35
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
                    <FlatList
                        data={cartItem.lineItems}
                        style={{
                            marginVertical: normalize(10),
                            flex: 1,
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
                                <View
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
                                                    const { inventory_quantity } = variant.variant;
                                                    let newStockCount = [];
                                                    for (let i = 0; i < inventory_quantity; i++) {
                                                        newStockCount.push({
                                                            label: (i + 1) + "",
                                                            value: (i + 1) + ""
                                                        });
                                                    }
                                                    editActionRef.current?.setModalVisible(true);
                                                    setTotalStock([...newStockCount]);
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
                                                        color={theme.colors.primary}
                                                        style={{
                                                            marginLeft: normalize(12),
                                                        }}
                                                    /> :
                                                    <Text
                                                        style={{
                                                            fontWeight: theme.fontWeight.thin,
                                                            marginLeft: normalize(10),
                                                            color: theme.colors.primary

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
                                </View>
                            )
                        }}
                        keyExtractor={item => item.id}
                    />
                </View>

                {isLoading === false && cartItem?.lineItems.length > 0 &&
                    <View
                        style={{
                            elevation: 2,
                            borderTopWidth: 2,
                            borderTopColor: "#f5f5f5"
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
                                backgroundColor: theme.colors.primary,
                                width: '100%',
                                borderRadius: normalize(12),
                                marginTop: normalize(15),
                                alignItems: "center",
                            }}
                            onPress={() => {
                                if(customer?.default_address?._id){
                                    const shippingAddress = {
                                        address1: customer?.default_address?.address1,
                                        address2: customer?.default_address?.address2,
                                        city: customer?.default_address?.city,
                                        company: customer?.default_address?.company || null,
                                        country: customer?.default_address?.country,
                                        firstName:customer?.default_address?.first_name,
                                        lastName: customer?.default_address?.last_name,
                                        phone: customer?.default_address?.phone,
                                        province: customer?.default_address?.province,
                                        zip: customer?.default_address?.zip
                                        
                                    };
                                    client.checkout.updateShippingAddress(checkoutId, shippingAddress).then(checkout => {
                                        navigation.navigate('CheckoutScreen', { uri: cartItem.webUrl })
                                    });
                                }else{
                                    navigation.navigate('CheckoutScreen', { uri: cartItem.webUrl })
                                    
                                }
                                
                            }}
                        >
                            <Text
                                style={{
                                    color: theme.colors.white,
                                    fontSize: theme.fontSize.medium
                                }}
                            >
                                Proceed Checkout
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
