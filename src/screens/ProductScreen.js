import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createRef, useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    SafeAreaView,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
    Image
} from 'react-native';
import normalize from 'react-native-normalize';
import { Gallery } from 'react-native-gallery-view';
import ActionSheet from "react-native-actions-sheet";
import SubHeading from '../components/SubHeading';
import { client } from '../services';
import { theme } from '../utils/theme';
import { Picker } from '@react-native-picker/picker';
import { getProductInfo } from '../services/products';
import base64 from 'react-native-base64';
import { CustomHeader } from '../components/CustomHeader';
import SkeletonContent from 'react-native-skeleton-content-nonexpo';
import Toast from 'react-native-simple-toast';
import { Divider, Menu } from 'react-native-paper';
import { FlatList } from 'react-native-gesture-handler';
import { setCart } from '../redux/action/cart';
import { connect } from 'react-redux';


Array.prototype.insert = function (i, ...rest) {
    return this.slice(0, i).concat(rest, this.slice(i));
}
function ProductScreen({ navigation, route, navigator, setCart, cart }) {

    const { height } = Dimensions.get('screen');
    const addToCartRef = createRef();
    const colorsVariantRef = createRef();
    const scrollRef = React.useRef(null);

    const [isLoading, setIsLoading] = useState(true);
    const [product, setProduct] = useState(route.params?.product);
    const [cartIsLoading, setCartIsLoading] = useState(false);
    const [selectedStock, setSelectedStock] = useState(1);
    const [totalStock, setTotalStock] = useState([
        { label: "1", value: "1" },
        { label: "2", value: "2" },
        { label: "3", value: "3" },
        { label: "4", value: "4" },
        { label: "5", value: "5" },
    ]);


    const [variantChosen, setVariantChosen] = useState(0);
    const [optionsType, setOptionsType] = useState(null);
    const [variantIsLoading, setVariantIsLoading] = useState(true);
    const [variantImages, setVariantsImages] = useState([]);
    const [isColorVariantPresent, setIsColorVariantPresent] = useState(false);
    const [isSizeVariantPresent, setIsSizeVariantPresent] = useState(false);
    const [sizesMenuState, setSizesMenuState] = useState(false);
    const [selectedState, setSelectedState] = useState({
        option1: {
            value: '',
            isColor: false,
            index: 0,
        },
        option2: {
            value: '',
            isColor: false,
            index: 0
        },
    });
    const [listOfColors, setListOfColors] = useState([]);
    const [listOfSizes, setListOfSizes] = useState([]);

    useEffect(() => {
        getProductInfoHelper();
    }, []);

    const getProductInfoHelper = async () => {
        setIsLoading(true);
        const data = await getProductInfo(product.id);
        if (data?.errors) {
            Toast.show('Something went wrong');
            console.log('---------------------Product Screen Line 68-------------------------------');
            setIsLoading(false);
            return;
        }
        const productInfo = data?.product;
        const { options } = productInfo;
        
        const colors = await options.filter(option => option?.name?.toLowerCase() === "color");
        const sizes = await options.filter(option => option?.name?.toLowerCase() === "size");
        if (colors.length > 0) {
            setIsColorVariantPresent(true);
        }
        if (sizes.length > 0) {
            setIsSizeVariantPresent(true);
        }

        setProduct({ ...productInfo });
        calculateVariantStock();
        setIsLoading(false);
    }

    const calculateVariantStock = async () => {
        const noOfOptionsAvailable = product?.options?.length;
        async function trySwitch() {
            switch (noOfOptionsAvailable) {
                case 1: {
                    setOptionsType("single");
                    setVariantChosen(0);
                    const allImages = product.images;
                    const currVariant = product.variants[0];
                    let newVariantImages = [];
                    await allImages.map(item => {
                        if (item.variant_ids.includes(currVariant.id)) {
                            newVariantImages = newVariantImages.insert(0, item);
                        } else if (item.variant_ids.length === 0) {
                            newVariantImages.push(item);
                        }
                    });
                    let newStockCount = [];
                    for (let i = 0; i < product?.variants[0].inventory_quantity; i++) {
                        newStockCount.push({
                            value: (i + 1) + "",
                            label: (i + 1) + "",
                        });
                    }
                    setTotalStock([...newStockCount]);
                    setVariantsImages([...newVariantImages]);
                    setVariantIsLoading(false);
                    break;
                }
                case 2: {
                    setOptionsType("double");
                    setVariantChosen(0);
                    const allImages = product.images;
                    const currVariant = product.variants[0];
                    const isOptionOneIsColor = product?.options[0]?.name?.toLowerCase() === "color";
                    setSelectedState({
                        ...selectedState,
                        option1: {
                            isColor: isOptionOneIsColor,
                            value: currVariant.option1,
                            index: 0
                        },
                        option2: {
                            isColor: !isOptionOneIsColor,
                            value: currVariant.option2,
                            index: 0
                        }
                    });
                    let allColoredVariant = [];
                    let myColorSet = new Set();
                    //Getting unique Colors List and setting it to state
                    if (product?.options[0]?.name?.toLowerCase() === "color") {
                        for (let i = 0; i < product?.variants?.length; i++) {
                            let variant = product?.variants[i];
                            if (myColorSet.has(variant?.option1)) {
                                continue;
                            };
                            allColoredVariant.push(variant);
                            myColorSet.add(variant.option1);
                        };
                    } else {
                        for (let i = 0; i < product?.variants?.length; i++) {
                            let variant = product?.variants[i];
                            if (myColorSet.has(variant?.option2)) {
                                continue;
                            };
                            allColoredVariant.push(variant);
                            myColorSet.add(variant.option2);
                        };
                    };
                    let sizesMatchesSelectedColorList = [];
                    for (let i = 0; i < product.variants.length; i++) {
                        let variant = product.variants[i];
                        if (isOptionOneIsColor) {
                            if (currVariant.option1 === variant.option1) {
                                sizesMatchesSelectedColorList.push(variant.option2);
                            }
                        } else {
                            if (currVariant.option2 === variant.option2) {
                                sizesMatchesSelectedColorList.push(variant.option1);
                            }
                        }
                    }
                    setListOfColors([...allColoredVariant]);
                    setListOfSizes([...sizesMatchesSelectedColorList]);
                    let newVariantImages = [];
                    await allImages.map(item => {
                        if (item.variant_ids.includes(currVariant.id)) {
                            newVariantImages = newVariantImages.insert(0, item);
                        } else if (item.variant_ids.length === 0) {
                            newVariantImages.push(item);
                        }
                    });
                    let newStockCount = [];
                    for (let i = 0; i < product?.variants[0].inventory_quantity; i++) {
                        newStockCount.push({
                            value: (i + 1) + "",
                            label: (i + 1) + "",
                        });
                    }
                    setTotalStock([...newStockCount]);
                    setVariantIsLoading(false);
                    setVariantsImages([...newVariantImages]);
                    break;
                }
                default: {
                    setOptionsType("multi");
                }
            }
        };

        trySwitch();
    }

    const onClickVariantHandler = async (title) => {

        async function trySwitch() {
            switch (optionsType) {
                case "single": {
                    setVariantIsLoading(true);
                    let variantIndex = 0;
                    await product?.variants?.forEach((variant, index) => {
                        if (variant?.option1 === title || variant?.option2 === title || variant?.option3 === title) {
                            variantIndex = index;
                        }
                    })
                    setVariantChosen(variantIndex);
                    const currVariant = product.variants[variantIndex];
                    const allImages = product.images;
                    let newVariantImages = [];
                    await allImages.map(item => {
                        if (item.variant_ids.includes(currVariant.id)) {
                            newVariantImages = newVariantImages.insert(0, item);
                        } else if (item.variant_ids.length === 0) {
                            newVariantImages.push(item);
                        }
                    });
                    let newStockCount = [];
                    for (let i = 0; i < product.variants[variantIndex].inventory_quantity; i++) {
                        newStockCount.push({
                            value: (i + 1) + "",
                            label: (i + 1) + "",
                        });
                    }
                    setTotalStock([...newStockCount]);
                    setVariantsImages([...newVariantImages]);
                    setVariantIsLoading(false);
                    scrollRef.current?.scrollTo({
                        y: 0,
                        animated: true,
                    });
                    break;
                }
                case "double": {
                    setVariantIsLoading(true);
                    let variantIndex = 0;
                    await product?.variants?.forEach((variant, index) => {
                        if (variant?.title === title) {
                            variantIndex = index;
                        }
                    })
                    setVariantChosen(variantIndex);
                    const currVariant = product.variants[variantIndex];
                    const allImages = product.images;

                    let newVariantImages = [];
                    await allImages.map(item => {
                        if (item.variant_ids.includes(currVariant.id)) {
                            newVariantImages = newVariantImages.insert(0, item);
                        } else if (item.variant_ids.length === 0) {
                            newVariantImages.push(item);
                        }
                    });
                    let newStockCount = [];
                    for (let i = 0; i < product.variants[variantIndex].inventory_quantity; i++) {
                        newStockCount.push({
                            value: (i + 1) + "",
                            label: (i + 1) + "",
                        });
                    }
                    setTotalStock([...newStockCount]);
                    setVariantsImages([...newVariantImages]);
                    setVariantIsLoading(false);
                    scrollRef.current?.scrollTo({
                        y: 0,
                        animated: true,
                    });
                    break;
                }
                default: {
                    break;
                }
            }
        }

        trySwitch();
    }

    const addToCartListener = async (quantity) => {
        setCartIsLoading(true);
        let checkoutExists = await AsyncStorage.getItem('checkoutId');
        if (checkoutExists === null) {

            client.checkout.create().then(async (checkout) => {
                await AsyncStorage.setItem('checkoutId', JSON.stringify(checkout.id));
                /**
                 * Rest API Id to StoreFront API ID
                 */
                const variantId = base64.encode(product.variants[variantChosen < 0 ? 0 : variantChosen].admin_graphql_api_id + "");
                // const variantId = product.variants[variantChosen < 0 ? 0 : variantChosen].id;
                const lineItemsToAdd = [
                    {
                        variantId: variantId,
                        //variantId: product.variants[currVariantIndex < 0 ? 0 : currVariantIndex].id,
                        quantity: quantity,
                    }
                ];
                client.checkout.addLineItems(checkout.id, lineItemsToAdd).then((checkout) => {
                    const cart = {
                        cart: { count: checkout?.lineItems?.length }
                    }
                    setCart({ ...cart });
                    Toast.show('Added to Cart');
                    setCartIsLoading(false);
                })
                setCartIsLoading(false);
                return;
            });
            // const body = {
            //     checkouts:{
            //         line_items: lineItemsToAdd,
            //     }
            // }
            // const data = await createCheckout(body);
            // return;


        }
        checkoutExists = await AsyncStorage.getItem('checkoutId');
        const checkoutId = JSON.parse(checkoutExists);
        /**
         * Rest API Id to StoreFront API ID
         */
        const variantId = base64.encode(product.variants[variantChosen < 0 ? 0 : variantChosen].admin_graphql_api_id + "");
        const lineItemsToAdd = [{
            variantId: variantId,
            //variantId: product.variants[currVariantIndex < 0 ? 0 : currVariantIndex].id,
            quantity: quantity,
        }
        ];
        client.checkout.addLineItems(checkoutId, lineItemsToAdd).then((checkout) => {
            const cart = {
                cart: { count: checkout?.lineItems?.length }
            }
            setCart({ ...cart });
            setCartIsLoading(false);
        }).catch(error => {
            setCartIsLoading(false);
            console.log('----------------Line 114-----------------');
            console.log(error);
        });

    }

    const colorButtonsHandlers = async (item, index) => {
        const isOptionOneIsColor = selectedState.option1.isColor;
        let sizesMatchesSelectedColorList = [];
        for (let i = 0; i < product.variants.length; i++) {
            let variant = product.variants[i];
            let test = isOptionOneIsColor ? item.option1 : item.option2

            if (isOptionOneIsColor) {
                if (test === variant.option1) {
                    sizesMatchesSelectedColorList.push(variant.option2);
                }
            } else {
                if (test === variant.option2) {
                    sizesMatchesSelectedColorList.push(variant.option1);
                }
            }
        }
        setListOfSizes([...sizesMatchesSelectedColorList]);

        if (selectedState.option1.isColor === true) {
            setSelectedState({
                ...selectedState,
                option1: {
                    ...selectedState.option1,
                    index: index
                },
                option1: {
                    ...selectedState.option1,
                    index: 0
                },
            })
        } else {
            setSelectedState({
                ...selectedState,
                option2: {
                    ...selectedState.option2,
                    index: index,
                    value: selectedState.option1.isColor === true ? item.option1 : item.option2
                },
                option1: {
                    ...selectedState.option1,
                    index: 0,
                    value: selectedState.option1.isColor === true ? item.option1 : item.option2
                }
            })
        }
        // calculateAvailableSizes();

        colorsVariantRef.current?.setModalVisible(false);
        onClickVariantHandler(`${selectedState.option1.isColor === true ? item.option1 + " / " + sizesMatchesSelectedColorList[0] : sizesMatchesSelectedColorList[0] + " / " + item.option2}`);

    };

    const sizeButtonHandlers = async (value, index) => {
        if (selectedState.option1.isColor === true) {
            setSelectedState({
                ...selectedState,
                option2: {
                    ...selectedState.option2,
                    index: index,
                    value: value
                },
            })
        } else {
            setSelectedState({
                ...selectedState,
                option1: {
                    ...selectedState.option1,
                    index: index,
                    value: value
                },
            })
        }
        onClickVariantHandler(`${selectedState.option1.isColor === true ? selectedState.option1.value + " / " + value : value + " / " + selectedState.option2.value}`);
        setSizesMenuState(false);
    }


    return (
        <SafeAreaView
            style={{
                flex: 1,
                backgroundColor: theme.colors.background,
            }}
        >
            <CustomHeader navigation={navigation} title={'Product Details'} />

            {/**
             * ActionSheet for Selecting Count
             */}
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

            {/**
             * ActionSheet for Color Options
             */}
            <ActionSheet
                ref={colorsVariantRef}
                drawUnderStatusBar={true}
                containerStyle={{
                    height: height / 3,
                }}
            >
                <View
                    style={{
                        width: '100%',
                        justifyContent: "space-between",
                        padding: normalize(10)
                    }}
                >
                    <Text
                        style={{
                            color: theme.colors.primary,
                            fontWeight: theme.fontWeight.medium,
                            fontSize: theme.fontSize.subheading,
                            marginBottom: normalize(15),
                        }}
                    >
                        Choose Color thats suits you
                    </Text>
                    {optionsType === "single" ?
                        <FlatList
                            data={product.variants}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            renderItem={({ item, index }) => {
                                return (
                                    <TouchableOpacity
                                        style={[variantChosen === index && {
                                            borderWidth: 2,
                                            borderColor: theme.colors.primary,
                                        }, {
                                            margin: normalize(10),
                                            backgroundColor: "#f3f3f3",
                                            borderRadius: normalize(12),
                                            elevation: 2
                                        }]}
                                        onPress={() => {
                                            colorsVariantRef.current?.setModalVisible(false);
                                            onClickVariantHandler(item.title);
                                        }}
                                    >
                                        <Image
                                            style={{
                                                padding: normalize(2),
                                                height: normalize(150),
                                                width: normalize(150),
                                                padding: normalize(2),
                                                borderRadius: normalize(12),
                                            }}
                                            source={{ uri: product.images.filter(image => image.id === item.image_id)[0]?.src }}
                                            resizeMode={"contain"}
                                        />
                                    </TouchableOpacity>
                                )
                            }}
                            keyExtractor={(item) => item.id}
                        />
                        :
                        <FlatList
                            data={listOfColors || []}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            renderItem={({ item, index }) => {
                                return (
                                    <TouchableOpacity
                                        style={[(selectedState.option1.isColor === true ? selectedState.option1.index === index : selectedState.option2.index === index) && {
                                            borderWidth: 2,
                                            borderColor: theme.colors.primary,
                                        }, {
                                            margin: normalize(10),
                                            backgroundColor: "#f3f3f3",
                                            borderRadius: normalize(12),
                                            elevation: 2
                                        }]}
                                        onPress={() => {
                                            colorButtonsHandlers(item, index);
                                        }}
                                    >
                                        <Image
                                            style={{
                                                padding: normalize(2),
                                                height: normalize(150),
                                                width: normalize(150),
                                                padding: normalize(2),
                                                borderRadius: normalize(12),
                                            }}
                                            source={{ uri: product.images.filter(image => image.id === item.image_id)[0]?.src }}
                                            resizeMode={"contain"}
                                        />
                                    </TouchableOpacity>
                                )
                            }}
                            keyExtractor={(item) => item.id}
                        />
                    }
                    <View
                        style={{
                            height: normalize(15)
                        }}
                    />
                </View>
            </ActionSheet>

            <SkeletonContent
                containerStyle={{ width: '100%' }}
                isLoading={isLoading}
                layout={[
                    {
                        margin: normalize(15),
                        width: '90%',
                        height: height / 2.6,
                        key: 'imageLoader',
                        borderRadius: normalize(12),
                        alignSelf: "center"
                    },
                    {
                        marginHorizontal: normalize(15),
                        width: '89%',
                        height: normalize(70),
                        key: 'imageThumbnailLoader',
                        borderRadius: normalize(12),
                        alignSelf: "center",
                        marginBottom: normalize(10)
                    },
                    {
                        marginHorizontal: normalize(24),
                        width: '89%',
                        height: normalize(40),
                        key: 'productNameLoader',
                        borderRadius: normalize(12),
                        marginBottom: normalize(10)
                    },
                    {
                        marginHorizontal: normalize(24),
                        width: '57%',
                        height: normalize(40),
                        key: 'productPriceLoader',
                        borderRadius: normalize(12),
                        marginBottom: normalize(10)
                    }, {
                        marginHorizontal: normalize(24),
                        width: '57%',
                        height: normalize(31),
                        key: 'productPriceLoade1r',
                        borderRadius: normalize(12),
                        marginBottom: normalize(10)
                    },
                    {
                        marginHorizontal: normalize(24),
                        width: '71%',
                        height: normalize(40),
                        key: 'productDescriptionHeaderLoader',
                        borderRadius: normalize(12),
                    }
                ]}
            />
            {isLoading === false &&
                <ScrollView
                    style={{
                        flex: 1,
                        padding: normalize(15)
                    }}
                    ref={scrollRef}
                    showsVerticalScrollIndicator={false}
                >
                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "space-around",
                            alignItems: "center"
                        }}
                    >
                        <Text
                            style={{
                                fontSize: theme.fontSize.heading,
                                lineHeight: theme.lineHeight.heading,
                                flex: isColorVariantPresent === true ? .85 : 1,
                                textTransform: "capitalize"
                            }}
                        >
                            {product?.title}
                        </Text>
        
                        {listOfColors && isColorVariantPresent === true && variantIsLoading === false && optionsType === "double" &&
                            <TouchableOpacity
                                style={{
                                    flex: .2,
                                    justifyContent: "center",
                                    alignItems: "center"
                                }}
                                onPress={() => {
                                    colorsVariantRef.current?.setModalVisible(true);
                                }}
                                disabled={variantIsLoading}
                            >
                                <View
                                    style={{
                                        borderRadius: normalize(35),
                                        borderBottomColor: theme.colors.notification,
                                        borderTopColor: "#e35e12",
                                        borderRightColor: theme.colors.primary,
                                        borderLeftColor: "#090861",
                                        borderWidth: 2,
                                        padding: normalize(5),
                                        width: normalize(35),
                                        height: normalize(35),
                                        justifyContent: "center",
                                        alignItems: "center"
                                    }}
                                >
                                    <Text
                                        style={{
                                            fontWeight: theme.fontWeight.medium,
                                        }}
                                    >
                                        +{listOfColors?.length}
                                    </Text>
                                </View>
                                <Text
                                    style={{
                                        color: theme.colors.placeholder,
                                        fontWeight: theme.fontWeight.bold,
                                        fontSize: normalize(12.1),
                                        textAlign: "center",
                                        marginTop: normalize(10),
                                        textTransform: "uppercase"
                                    }}
                                >
                                    Color
                                </Text>
                            </TouchableOpacity>
                        }

                        {isColorVariantPresent === true && optionsType === "single" &&
                            <TouchableOpacity
                                style={{
                                    flex: .2,
                                    justifyContent: "center",
                                    alignItems: "center"
                                }}
                                onPress={() => {
                                    colorsVariantRef.current?.setModalVisible(true);
                                }}
                                disabled={variantIsLoading}
                            >
                                <View
                                    style={{
                                        borderRadius: normalize(35),
                                        borderBottomColor: theme.colors.notification,
                                        borderTopColor: "#e35e12",
                                        borderRightColor: theme.colors.primary,
                                        borderLeftColor: "#090861",
                                        borderWidth: 2,
                                        padding: normalize(5),
                                        width: normalize(35),
                                        height: normalize(35),
                                        justifyContent: "center",
                                        alignItems: "center"
                                    }}
                                >
                                    <Text
                                        style={{
                                            fontWeight: theme.fontWeight.medium,
                                        }}
                                    >
                                        +{product?.options.filter(option => option.name.toLowerCase() === "color")[0]?.values?.length}
                                    </Text>
                                </View>
                                <Text
                                    style={{
                                        color: theme.colors.placeholder,
                                        fontWeight: theme.fontWeight.bold,
                                        fontSize: normalize(12.1),
                                        textAlign: "center",
                                        marginTop: normalize(10),
                                        textTransform: "uppercase"
                                    }}
                                >
                                    Color
                                </Text>
                            </TouchableOpacity>
                        }
                    </View>
                    <Text
                        style={{
                            fontStyle: "italic",
                            color: theme.colors.placeholder,
                            fontSize: theme.fontSize.paragraph
                        }}
                    >
                        {product?.variants[variantChosen]?.title}
                    </Text>
                    <Text
                        style={{
                            fontSize: theme.fontSize.heading,
                            lineHeight: theme.lineHeight.subheading,
                            marginTop: normalize(15)
                        }}
                    >
                        $ {product.variants[variantChosen].price}
                    </Text>
                    {isSizeVariantPresent === true && optionsType === "double" &&
                        <Menu
                            visible={sizesMenuState}
                            onDismiss={() => {
                                setSizesMenuState(false);
                            }}
                            anchor={
                                <TouchableOpacity
                                    style={{
                                        flexDirection: "row",
                                        alignItems: "center",
                                        backgroundColor: theme.colors.disabledButton,
                                        width: '30%',
                                        borderRadius: normalize(12),
                                        justifyContent: "center",
                                        marginTop: normalize(15),
                                        height: normalize(40)
                                    }}
                                    onPress={() => {
                                        setSizesMenuState(true);
                                    }}
                                >
                                    <Text
                                        style={{
                                            fontSize: theme.fontSize.paragraph,
                                            fontWeight: theme.fontWeight.medium,
                                            color: theme.colors.white
                                        }}
                                    >
                                        {listOfSizes[selectedState.option1.isColor === true ? selectedState.option2.index : selectedState.option1.index]}
                                    </Text>
                                    {/* <List.Icon
                                        icon="arrow-down"
                                        color={theme.colors.white}
                                        style={{
                                            width: normalize(20),
                                        }}
                                    /> */}
                                    {/* <Image
                                        source={require('../assets/images/down-arrow.png')}
                                        style={{
                                            height: normalize(24),
                                            width: normalize(20),
                                            marginLeft: normalize(10)
                                        }}
                                    /> */}
                                </TouchableOpacity>
                            }
                        >
                            {listOfSizes.map((value, index) => {
                                return (
                                    <>
                                        <Menu.Item
                                            onPress={() => {
                                                sizeButtonHandlers(value, index);
                                            }}
                                            title={value}
                                        />
                                        <Divider />

                                    </>
                                )
                            })

                            }
                        </Menu>
                    }
                    {isSizeVariantPresent === true && optionsType === "single" &&
                        <Menu
                            visible={sizesMenuState}
                            onDismiss={() => {
                                setSizesMenuState(false);
                            }}
                            anchor={
                                <TouchableOpacity
                                    style={{
                                        flexDirection: "row",
                                        alignItems: "center",
                                        backgroundColor: theme.colors.disabledButton,
                                        width: '30%',
                                        borderRadius: normalize(12),
                                        justifyContent: "center",
                                        marginTop: normalize(15),
                                        height: normalize(45)
                                    }}
                                    onPress={() => {
                                        setSizesMenuState(true);
                                    }}
                                >
                                    <Text
                                        style={{
                                            fontSize: theme.fontSize.paragraph,
                                            fontWeight: theme.fontWeight.medium,
                                            color: theme.colors.white
                                        }}
                                    >
                                        {product.variants[variantChosen].option1}
                                    </Text>
                                    {/* <Image
                                        source={require('../assets/images/down-arrow.png')}
                                        style={{
                                            height: normalize(24),
                                            width: normalize(20),
                                            marginLeft: normalize(10)
                                        }}
                                    /> */}
                                </TouchableOpacity>
                            }
                        >
                            {product?.options.filter(option => option?.name?.toLowerCase() === "size")[0]?.values.map(value => {
                                return (
                                    <>
                                        <Menu.Item
                                            onPress={() => {
                                                onClickVariantHandler(value);
                                                setSizesMenuState(false);
                                            }}
                                            title={value}
                                        />
                                        <Divider />
                                    </>
                                )
                            })
                            }
                        </Menu>
                    }
                    <View
                        style={{
                            width: '98%',
                            alignSelf: "center"
                        }}
                    >
                        <SubHeading
                            style={{
                                fontSize: theme.fontSize.medium,
                                fontWeight: theme.fontWeight.medium,
                                lineHeight: theme.lineHeight.heading
                            }}
                        >
                            About the Product
                        </SubHeading>
                        {product.body_html.replace(/<\/?[^>]+(>|$)/g, "").split(/\r?\n/).map((item, index) => {
                            if (item.length > 0) {
                                return (
                                    <View
                                        style={{
                                            padding: normalize(2)
                                        }}
                                    >
                                        <Text
                                            style={{
                                                fontSize: theme.fontSize.medium,
                                                fontWeight: theme.fontWeight.normal,
                                                lineHeight: theme.lineHeight.heading
                                            }}
                                        >
                                            {'\u2022'} {item}
                                        </Text>
                                    </View>
                                )
                            }
                        })}
                    </View>

                    <View
                        style={{
                            height: normalize(20)
                        }}
                    />
                </ScrollView>
            }
            {product?.variants[variantChosen]?.inventory_quantity < 1 ? <TouchableOpacity
                disabled={true}
                style={{
                    height: normalize(55),
                    width: '85%',
                    alignSelf: "center",
                    backgroundColor: theme.colors.white,
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: normalize(12),
                    marginTop: normalize(15)
                }}
            >
                {cartIsLoading ?
                    <ActivityIndicator color={theme.colors.white} />
                    :
                    <Text
                        style={{
                            color: theme.colors.notification,
                            fontSize: theme.fontSize.medium,
                            fontWeight: theme.fontWeight.medium
                        }}
                    >
                        OUT OF STOCK
                    </Text>
                }
            </TouchableOpacity> :
                <TouchableOpacity
                    disabled={cartIsLoading}
                    style={{
                        height: normalize(55),
                        width: '85%',
                        alignSelf: "center",
                        backgroundColor: theme.colors.primary,
                        justifyContent: "center",
                        alignItems: "center",
                        borderRadius: normalize(12),
                        marginVertical: normalize(15)

                    }}
                    onPress={() => {
                        addToCartRef.current?.setModalVisible();
                    }}
                >
                    {cartIsLoading ?
                        <ActivityIndicator color={theme.colors.white} />
                        :
                        <Text
                            style={{
                                color: theme.colors.white,
                                fontSize: theme.fontSize.medium,
                                fontWeight: theme.fontWeight.medium
                            }}
                        >
                            Add to Cart
                        </Text>
                    }
                </TouchableOpacity>}
            <TouchableOpacity
                style={{
                    position: 'absolute',
                    bottom: normalize(110),
                    backgroundColor: theme.colors.bottomTabActiveBg,
                    padding: normalize(12),
                    borderRadius: normalize(20),
                    right: normalize(30),
                    elevation: 2
                }}
                onPress={() => {
                    navigation.navigate('CartScreen');
                }}
            >
                <Image
                    source={{ uri: "https://user-images.githubusercontent.com/54505967/132634830-0cbb53d4-7ed9-456f-be7a-8429fc514a15.png" }}
                    resizeMode="contain"
                    style={{
                        width: normalize(30),
                        height: normalize(30),
                        alignSelf: "flex-end",
                    }}
                />
                <View
                    style={{
                        height: normalize(20),
                        width: normalize(20),
                        elevation: 2,
                        position: "absolute",
                        right: 0,
                        backgroundColor: theme.colors.primary,
                        borderRadius: normalize(20),
                        alignItems: "center", justifyContent: "center",
                        top: -1
                    }}
                >
                    <Text
                        style={{
                            color: theme.colors.white,
                            textAlign: "center",
                            fontWeight: theme.fontWeight.medium
                        }}
                    >
                        {cart?.count || 0}
                    </Text>
                </View>
            </TouchableOpacity>
        </SafeAreaView>
    )
}


const mapDispatchToProps = dispatch => ({
    setCart: cart => dispatch(setCart(cart)),
});

const mapStateToProps = state => {
    return {
        categories: state.categories,
        products: state.products,
        cart: state.cart
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProductScreen);
