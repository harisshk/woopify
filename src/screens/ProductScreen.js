import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createRef, useEffect, useState } from 'react'
import { ActivityIndicator, Alert, FlatList, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import normalize from 'react-native-normalize';
import { Gallery } from 'react-native-gallery-view';
import ActionSheet from "react-native-actions-sheet";
import SubHeading from '../components/SubHeading';
import { client } from '../services';
import { theme } from '../utils/theme';
import { Picker } from '@react-native-picker/picker';
import { getProductInfo } from '../services/products';
import base64 from 'react-native-base64'


function ProductScreen({ navigation, route, navigator }) {
    const [isLoading, setIsLoading] = useState(true);
    const [currColor, setCurrColor] = useState(-1);
    const [currSize, setCurrSize] = useState(-1);
    const [product, setProduct] = useState(route.params.product);
    const [currVariantIndex, setCurrentVariantIndex] = useState(-1);
    const addToCartRef = createRef();
    const [images, setImages] = useState([...product.images]);
    const [cartIsLoading, setCartIsLoading] = useState(false);
    const [selectedStock, setSelectedStock] = useState(1);
    const [totalStock, setTotalStock] = useState([
        { label: "1", value: "1" },
        { label: "2", value: "2" },
        { label: "3", value: "3" },
        { label: "4", value: "4" },
        { label: "5", value: "5" },
    ]);

    useEffect(() => {
        getProductInfoHelper();
    }, []);
    let getProductInfoHelper = async () => {
        setIsLoading(true);
        // client.product.fetch(product.id).then((product) => {
        //     let data = Object.assign({}, { product: product })
        //     setProduct(data.product);
        //     setCurrentVariantIndex(-1);
        //     // loadingImages(0, 0);
        //     setIsLoading(false);
        // });
        let data = await getProductInfo(product.id);
        setProduct(data.product);
        console.log(data.product)
        // loadingImages(0, 0);
        setIsLoading(false);
    }

    let addToCartListener = async (quantity) => {
        setCartIsLoading(true);
        let checkoutExists = await AsyncStorage.getItem('checkoutId');
        if (checkoutExists === null) {
            client.checkout.create().then(async (checkout) => {
                // Do something with the checkout
                await AsyncStorage.setItem('checkoutId', JSON.stringify(checkout.id));
                /**
                 * Rest API Id to StoreFront API ID
                 */
                let variantId =  base64.encode(product.variants[currVariantIndex < 0 ? 0 : currVariantIndex].admin_graphql_api_id+"");
                const lineItemsToAdd = [
                    {
                        variantId: variantId,
                        //variantId: product.variants[currVariantIndex < 0 ? 0 : currVariantIndex].id,
                        quantity: quantity,
                    }
                ];
                client.checkout.addLineItems(checkout.id, lineItemsToAdd).then((checkout) => {
                    Alert.alert('Success', 'Added to Cart');
                    setCartIsLoading(false);
                });
                setCartIsLoading(false);
                return;
            });
        }
        checkoutExists = await AsyncStorage.getItem('checkoutId');
        let checkoutId = JSON.parse(checkoutExists);
        /**
         * Rest API Id to StoreFront API ID
         */
        let variantId =  base64.encode(product.variants[currVariantIndex < 0 ? 0 : currVariantIndex].admin_graphql_api_id+"");
        const lineItemsToAdd = [{
                variantId: variantId,
                //variantId: product.variants[currVariantIndex < 0 ? 0 : currVariantIndex].id,
                quantity: quantity,
            }
        ];        
        client.checkout.addLineItems(checkoutId, lineItemsToAdd).then((checkout) => {
            Alert.alert('Success', 'Added to Cart');
            setCartIsLoading(false);
        }).catch(error =>{
            Alert.alert('Error','Something went wrong');
            setCartIsLoading(false);
            console.log('----------------Line 114-----------------');
            console.log(error);
        });

    }
    let loadingImages = async (option, index) => {
        Array.prototype.insert = function (i, ...rest) {
            return this.slice(0, i).concat(rest, this.slice(i));
        }

        setIsLoading(true);
        let variantId = "";
        let temp = 0;
        for (let i = 0; i < product.variants.length; i++) {
            let variant = product.variants[i];
            let matchString = product.options[option].values[index];
            // let matchString = product.options[option].values[index].value;
            if (product.options.length > 1 && option == 1) {
                if (currColor < 0) {
                    setCurrColor(0);
                }
                matchString = product.options[0].values[currColor < 0 ? 0 : currColor] + " / " + product.options[option].values[index];

                // matchString = product.options[0].values[currColor < 0 ? 0 : currColor].value + " / " + product.options[option].values[index].value
            } else if (product.options.length > 1 && option == 0) {
                if (currSize < 0) {
                    setCurrSize(0);
                }
                matchString = product.options[option].values[index] + " / " + product.options[1].values[currSize < 0 ? 0 : currSize];

                // matchString = product.options[option].values[index].value + " / " + product.options[1].values[currSize < 0 ? 0 : currSize].value
            }
            if (variant.title == (matchString)) {
                variantId = variant.id;
                temp = i;
                setCurrentVariantIndex(i);
                break;
            }
        }

        let newImages = [];
        await product.images.filter(image => {
            if (image.variant_ids.includes(variantId)) {
                newImages = newImages.insert(0, image);

            } else if (image.variant_ids.length === 0) {
                newImages.push(image);
            }
        });
        setImages([...newImages]);
        setIsLoading(false);
    };

    return (
        <SafeAreaView
            style={{
                flex: 1,
                backgroundColor: theme.colors.background,
            }}
        >
            <ActionSheet
                ref={addToCartRef}
                drawUnderStatusBar={true}
                containerStyle={{
                    height: '27%',
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
                            addToCartRef.current?.setModalVisible(false);
                            addToCartListener(parseInt(selectedStock));
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
                            Choose Quantity
                        </SubHeading>
                    </TouchableOpacity>
                </View>
            </ActionSheet>

            {isLoading === false ?
                <ScrollView
                    style={{
                        flex: 1,
                        padding: normalize(15)
                    }}
                >
                    <Gallery
                        // images={currVariantIndex >= 0 ? [product.variants[currVariantIndex].image] : product.images}
                        images={images}
                        activeIndex={0}
                        navigator={navigator}
                        borderColor={theme.colors.primary}
                    />
                    <Text
                        style={{
                            fontSize: theme.fontSize.heading,
                            lineHeight: theme.lineHeight.heading
                        }}
                    >
                        {product?.title}
                    </Text>
                    <Text
                        style={{
                            marginTop: normalize(15),
                            fontSize: theme.fontSize.subheading,
                            fontWeight: theme.fontWeight.bold
                        }}
                    >
                        {currVariantIndex >= 0 ? `$ ${product?.variants[currVariantIndex]?.price}` : `Choose Variant`}
                    </Text>
                    <SubHeading>
                        Colors
                    </SubHeading>
                    <FlatList
                        horizontal
                        data={product?.options[0].values}
                        showsHorizontalScrollIndicator={false}
                        renderItem={({ item, index }) => {
                            return (
                                <TouchableOpacity
                                    style={[
                                        index === currColor && { borderWidth: 2, borderColor: theme.colors.primary },
                                        {
                                            backgroundColor: item?.value?.toLowerCase(),
                                            minWidth: normalize(50),
                                            borderRadius: normalize(13),
                                            paddingHorizontal: normalize(10),
                                            marginRight: normalize(10)
                                        }]}
                                    onPress={() => {
                                        setCurrColor(index)
                                        loadingImages(0, index);
                                    }}
                                >
                                    <Text
                                        style={{
                                            textAlign: "center",
                                            fontSize: theme.fontSize.paragraph,
                                            fontWeight: theme.fontWeight.thin,
                                            padding: normalize(2)
                                        }}
                                    >
                                        {item?.value || item}
                                    </Text>

                                </TouchableOpacity>
                            )
                        }}
                        keyExtractor={item => item?.value || item}
                    />
                    {product?.options.length > 1 &&
                        <FlatList
                            horizontal
                            style={{
                                marginVertical: normalize(20)
                            }}
                            data={product?.options[1].values}
                            showsHorizontalScrollIndicator={false}
                            renderItem={({ item, index }) => {
                                return (
                                    <TouchableOpacity
                                        style={[
                                            index === currSize && { borderWidth: 2, borderColor: theme.colors.primary },
                                            {
                                                minWidth: normalize(50),
                                                borderRadius: normalize(13),
                                                paddingHorizontal: normalize(10),
                                                marginRight: normalize(10)
                                            }]}
                                        onPress={() => {
                                            setCurrSize(index);
                                            loadingImages(1, index);
                                        }}
                                    >
                                        <Text
                                            style={{
                                                textAlign: "center",
                                                fontSize: theme.fontSize.paragraph,
                                                fontWeight: theme.fontWeight.thin,
                                                padding: normalize(2)
                                            }}
                                        >
                                            {item?.value || item}
                                        </Text>
                                    </TouchableOpacity>
                                )
                            }}
                            keyExtractor={item => item?.value || item}
                        />
                    }
                    <TouchableOpacity
                        disabled={cartIsLoading}
                        style={{
                            height: normalize(55),
                            width: '100%',
                            alignSelf: "center",
                            backgroundColor: theme.colors.primary,
                            justifyContent: "center",
                            alignItems: "center",
                            marginVertical: normalize(20),
                            borderRadius: normalize(12)
                        }}
                        onPress={() => {
                            if (currVariantIndex === -1) {
                                Alert.alert('Note', 'Choose any variant to continue');
                                return;
                            };
                            addToCartRef.current?.setModalVisible();

                        }}
                    >
                        {cartIsLoading ? <ActivityIndicator color={theme.colors.white} /> :

                            <Text
                                style={{
                                    color: theme.colors.white,
                                    fontSize: theme.fontSize.medium,
                                    fontWeight: theme.fontWeight.medium
                                }}
                            >Add to Cart</Text>
                        }
                    </TouchableOpacity>
                </ScrollView>
                :
                <></>

            }

        </SafeAreaView>
    )
}

export default ProductScreen
