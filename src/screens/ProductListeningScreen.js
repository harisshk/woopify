import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {
    useEffect,
    useState,
    createRef
} from 'react';
import {
    ActivityIndicator,
    SafeAreaView,
    ScrollView,
    View,
    Text,
    TouchableOpacity,
    Dimensions,
    Image,
    Alert,
    FlatList,
} from 'react-native';
import base64 from 'react-native-base64';
import { Gallery } from 'react-native-gallery-view';
import normalize from 'react-native-normalize';
import { connect } from 'react-redux';
import { CustomHeader } from '../components/CustomHeader';
import SubHeading from '../components/SubHeading';
import { getProductInfo } from '../services/products';
import { theme } from '../utils/theme';
import ActionSheet from 'react-native-actions-sheet';
import { ACCESS_PASSWORD, API_KEY, AWS_URL, client, store, THEME_ID } from '../services';
import Toast from 'react-native-simple-toast';
import { setCart } from '../redux/action/cart';
import ImagePicker from 'react-native-image-crop-picker';
import { uploadImage, uploadImgToCDN } from '../services/asset';
import StepperCounter from '../components/StepperCounter';
import Footer from '../components/Footer';
import { icons, images as imageHelper } from '../constant';
import LightBox from 'react-native-lightbox-v2';
import Icon from 'react-native-vector-icons/Entypo';
import { requestHandler } from '../services/requestHandler';


Array.prototype.insert = function (i, ...rest) {
    return this.slice(0, i).concat(rest, this.slice(i));
}
export const ProductListeningScreen = ({ navigation, route, setCart, customer, navigator }) => {
    const [productType, setProductType] = useState('');
    const [product, setProduct] = useState({ ...route?.params?.product });
    const [isLoading, setIsLoading] = useState(true);
    const [options, setOptions] = useState([]);
    const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
    const [variantImages, setVariantImages] = useState([]);
    const [cartIsLoading, setCartIsLoading] = useState(false);
    const [selectedStock, setSelectedStock] = useState(1);
    const addToCartRef = createRef();

    const getProductInfoHelper = async () => {

        try {
            const data = await getProductInfo(product.id);
            setIsLoading(false);
            if (data?.errors) {
                Toast.show('Something went wrong');
                console.log('---------------------ProductListeningScreen Line 22-----------------------');
                setIsLoading(false);
                return;
            }
            const productInfo = data?.product;
            setProduct({ ...productInfo });
            const { options } = productInfo;
            setOptions([...options]);
            const allImages = productInfo.images;
            const currVariant = productInfo.variants[0];
            let newVariantImages = [];
            let selected = null;
            await allImages.map((item, index) => {
                if (item.variant_ids.includes(currVariant.id)) {
                    newVariantImages = newVariantImages.insert(0, item);
                    selected = index;
                } else if (selected != null && selected + 3 >= index) {
                    // newVariantImages = newVariantImages.insert(1, item);
                }
                if (item.variant_ids.length === 0) {
                    newVariantImages.push(item);
                }
            });
            if (currVariant.option2 !== null) {
                const optionAvailable = [[]];
                const option2 = [currVariant.option2];

                const option3 = [currVariant.option3];
                for (let i = 0; i < product.variants.length; i++) {
                    if (product.variants[i].option1 === currVariant.option1) {
                        option2.push(product.variants[i].option2);
                        option3.push(product.variants[i].option3);

                    }
                }
                optionAvailable.push(option2);
                optionAvailable.push(option3);
                setAvailableOptions([...optionAvailable]);
            }

            setVariantImages([...newVariantImages]);
            setIsLoading(false);
        } catch (error) {
            console.log('-------------------ProductListeningScreen Error 60----------------------------------');
            console.log(error);
        }

    }

    const addToCartListener = async (quantity) => {
        if (images.length === 0) {
            Toast.show('Add at-least Images to continue.', Toast.SHORT);
            addToCartRef?.current?.show();
            return;
        } else {
            addToCartRef?.current?.hide();
        }

        setCartIsLoading(true);
        if (images[0]?.uri) {
            let assets = [];
            for(let i = 0; i < images.length; i++){
                
                var body = JSON.stringify({
                    "asset": {
                        "attachment": images[i].attachment,
                        "key": `assets/${product.id}${customer.id}${i}${Math.floor(Math.random() * 200)}.png`,
                    }
                });
                
                var config = {
                    method: 'put',
                    url: `https://1b42fe48a6f3d18bb652e1c24e124738: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@petinpic.myshopify.com/admin/api/2021-10/themes/${THEME_ID}/assets.json`,
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    data: body
                };

                try{
                    const response = await requestHandler(config);
                    assets.push({
                        key: `Uploaded image ${i + 1}`,
                        value: `${response?.data?.asset?.public_url}`
                    });
                }catch(error){
                    console.log(error);
                    setIsLoading(false);
                    Toast.show('Error in uploading image to the shopify cdn.');
                    return;
                }
            }
            let checkoutExists = await AsyncStorage.getItem('checkoutId');

            if (checkoutExists === null) {
                client.checkout.create({email: customer.email}).then(async (checkout) => {
                    await AsyncStorage.setItem('checkoutId', JSON.stringify(checkout.id));
                    const variantId = base64.encode(product.variants[selectedVariantIndex < 0 ? 0 : selectedVariantIndex].admin_graphql_api_id + "");
                    const lineItemsToAdd = [
                        {
                            variantId: variantId,
                            quantity: quantity,
                            customAttributes: assets
                        }
                    ];
                    client.checkout.addLineItems(checkout.id, lineItemsToAdd).then((checkout) => {
                        const cart = {
                            cart: { count: checkout?.lineItems?.length }
                        }
                        setCart({ ...cart });
                        setCartIsLoading(false);
                        navigation.navigate('BottomTab', 
                            {
                                screen: 'CartScreen',
                                params: { previous_screen: route?.name, params: route?.params }
                            }, 
                            'CartScreen'
                        );
                        Toast.show('Added to Cart');
                    })
                    setCartIsLoading(false);
                    return;
                });
            }
            const checkoutId = JSON.parse(checkoutExists);
            const variantId = base64.encode(product.variants[selectedVariantIndex < 0 ? 0 : selectedVariantIndex].admin_graphql_api_id + "");
            const lineItemsToAdd = [{
                variantId: variantId,
                quantity: quantity,
                customAttributes: assets
            }];
            client.checkout.addLineItems(checkoutId, lineItemsToAdd).then((checkout) => {
                const cart = {
                    cart: { count: checkout?.lineItems?.length }
                }
                setCart({ ...cart });
                setCartIsLoading(false);
                setCartIsLoading(false);
                navigation.navigate('BottomTab', 
                    {
                        screen: 'CartScreen',
                        params: { previous_screen: route?.name, params: route?.params }
                    }, 
                    'CartScreen'
                );
                Toast.show('Added to Cart');
            }).catch(error => {
                setCartIsLoading(false);
                console.log('----------------Line 114-----------------');
                console.log(error);
            });
        } else {
            // data = {
            //     success: true,c
            //     noImage: true
            // };
        }
        // if (data?.success === true) {
        //     if (data?.noImage === true) {

        //     } else {
        //         Toast.showWithGravity('Image Uploaded Successfully...', Toast.SHORT, Toast.TOP);
        //     }
        //     if (data?.noImage === true) {
        //         let checkoutExists = await AsyncStorage.getItem('checkoutId');
        //         if (checkoutExists === null) {
        //             const variantId = base64.encode(product.variants[selectedVariantIndex < 0 ? 0 : selectedVariantIndex].admin_graphql_api_id + "");
        //             const lineItemsToAdd = [
        //                 {
        //                     variantId: variantId,
        //                     quantity: quantity,
        //                 }
        //             ];
        //             client.checkout.create({ email: customer?.email, lineItems: lineItemsToAdd }).then(async (checkout) => {
        //                 await AsyncStorage.setItem('checkoutId', JSON.stringify(checkout.id));
        //                 setCartIsLoading(false);
        //                 return;
        //             });
        //         }
        //         const checkoutId = JSON.parse(checkoutExists);
        //         /**
        //          * Rest API Id to StoreFront API ID
        //          */
        //         const variantId = base64.encode(product.variants[selectedVariantIndex < 0 ? 0 : selectedVariantIndex].admin_graphql_api_id + "");
        //         const lineItemsToAdd = [{
        //             variantId: variantId,
        //             quantity: quantity,
        //         }];

        //         client.checkout.addLineItems(checkoutId, lineItemsToAdd).then((checkout) => {
        //             const cart = {
        //                 cart: { count: checkout?.lineItems?.length }
        //             }
        //             setCart({ ...cart });
        //             setCartIsLoading(false);
        //             navigation.navigate('BottomTab', {
        //                 screen: 'CartScreen',
        //                 params: { previous_screen: route?.name, params: route?.params }
        //             }, 'CartScreen');
        //             Toast.show('Added to Cart');
        //         }).catch(error => {
        //             setCartIsLoading(false);
        //             console.log('----------------Line 114-----------------');
        //             console.log(error);
        //         });
        //     } else {
        //         const { assets } = data;                
        //     };
        // } else {
        //     Toast.show('Something went wrong ...', Toast.SHORT);
        //     setCartIsLoading(false);
        //     return;
        // }


    }
    const changeVariant = async (option1 = null, option2 = null, option3 = null) => {
        for (let i = 0; i < product?.variants?.length; i++) {
            const variant = product.variants[i];
            if (option1 !== null && option2 === null && option3 === null) {
                if (variant.option1 === option1) {
                    setIsLoading(true);
                    setSelectedVariantIndex(i);
                    const allImages = product.images;
                    const currVariant = variant;
                    let newVariantImages = [];
                    let selected = null;
                    await allImages.map((item, index) => {
                        if (item.variant_ids.includes(currVariant.id)) {
                            newVariantImages = newVariantImages.insert(0, item);
                            selected = index;
                        } else if (selected != null && selected + 3 >= index) {
                            // newVariantImages = newVariantImages.insert(1, item);
                        }
                        if (item.variant_ids.length === 0) {
                            newVariantImages.push(item);
                        }
                    });
                    setVariantImages([...newVariantImages]);
                    setIsLoading(false);
                    return;
                }
            } else if (option1 !== null && option2 !== null && option3 === null) {
                if (variant.option1 === option1 && variant.option2 === option2) {
                    const optionAvailable = [[]];
                    const option2 = [];
                    const option3 = [];
                    for (let i = 0; i < product.variants.length; i++) {
                        if (product.variants[i].option1 === option1) {
                            option2.push(product.variants[i].option2);
                            option3.push(product.variants[i].option3);
                        }
                    }
                    optionAvailable.push(option2);
                    optionAvailable.push(option3);
                    setAvailableOptions([...optionAvailable]);

                    setIsLoading(true);
                    setSelectedVariantIndex(i);
                    const allImages = product.images;
                    const currVariant = variant;
                    let newVariantImages = [];
                    let selected = null;
                    await allImages.map((item, index) => {
                        if (item.variant_ids.includes(currVariant.id)) {
                            newVariantImages = newVariantImages.insert(0, item);
                            selected = index;
                        } else if (selected != null && selected + 3 >= index) {
                            // newVariantImages = newVariantImages.insert(1, item);
                        }
                        if (item.variant_ids.length === 0) {
                            newVariantImages.push(item);
                        }
                    });
                    setVariantImages([...newVariantImages]);
                    setIsLoading(false);
                    return;
                }
            } else {
                if (variant.option1 === option1 && variant.option2 === option2 && variant.option3 === option3) {
                    const optionAvailable = [[]];
                    const option2 = [];
                    const option3 = [];
                    for (let i = 0; i < product.variants.length; i++) {
                        if (product.variants[i].option1 === option1) {
                            option2.push(product.variants[i].option2);
                            option3.push(product.variants[i].option3);
                        }
                    }
                    optionAvailable.push(option2);
                    optionAvailable.push(option3);
                    setAvailableOptions([...optionAvailable]);
                    setIsLoading(true);
                    setSelectedVariantIndex(i);
                    const allImages = product.images;
                    const currVariant = variant;
                    let newVariantImages = [];
                    let selected = null;
                    await allImages.map((item, index) => {
                        if (item.variant_ids.includes(currVariant.id)) {
                            newVariantImages = newVariantImages.insert(0, item);
                            selected = index;
                        } else if (selected != null && selected + 3 >= index) {
                            // newVariantImages = newVariantImages.insert(1, item);
                        }
                        if (item.variant_ids.length === 0) {
                            newVariantImages.push(item);
                        }
                    });
                    setVariantImages([...newVariantImages]);
                    setIsLoading(false);
                    return;
                }
            }

        }
    }

    const [availableOptions, setAvailableOptions] = useState([]);
    const [images, setImages] = useState([]);
    const [imageIsLoading, setImageIsLoading] = useState(false);

    const uploadImageHandler = async () => {
        try {
            if (imageIsLoading === true) {
                return;
            }
            setImageIsLoading(true);
            const options = {
                // cropping: true,
                includeBase64: true,
                mediaType: "photo",
                multiple: true,
                maxFiles: 3 - images.length || 1
            };
            const newImages = await ImagePicker.openPicker(options);
            setImageIsLoading(false);
            let temp = images;

            for (let i = 0; i < newImages.length; i++) {
                const img = newImages[i];
                if (img?.width >= 1000 && img?.height >= 1000) {
                } else {
                    Alert.alert('Image Size', ` Min Width 1000px and Min Height 1000px `)
                    return;
                }
                const upload = {
                    attachment: img?.data,
                    uri: img.sourceURL,
                };
                temp.push(upload);
            }
            // const upload = {
            //     attachment: image?.data,
            //     customer: customer?.id,
            //     product: product.id,
            //     uri: image.sourceURL,
            // };
            // const newImages = images;
            // newImages.push({
            //     ...upload
            // })
            setImages([...temp]);
        } catch (error) {
            setImageIsLoading(false);
            console.log(error);
            console.log('----------------------ProductListeningScreen Line 240---------------------------------');
        }
    }

    useEffect(() => {

        getProductInfoHelper();

        // unmount
        return () => {

        };
    }, []);

    return (
        <SafeAreaView
            style={{
                flex: 1,
                backgroundColor: theme.colors.background
            }}
        >
            <CustomHeader
                navigation={navigation}
                title={'Product Details'}
            />
            <ScrollView
                style={{
                    flex: 1,
                    padding: normalize(15)
                }}
                showsVerticalScrollIndicator={false}
            >
                {isLoading === true ?
                    <></>
                    :
                    <View>
                        {
                            variantImages?.length > 0 &&
                            <Gallery
                                images={variantImages}
                                borderColor={theme.colors.primary}
                            />
                        }
                        <Text
                            style={{
                                fontSize: theme.fontSize.title,
                                fontWeight: theme.fontWeight.medium,
                                lineHeight: theme.lineHeight.title
                            }}
                        >
                            {product?.title}
                        </Text>
                        <View
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                                marginBottom: normalize(15),
                                justifyContent: "space-between",
                                marginTop: normalize(8)
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: theme.fontSize.title,
                                    fontWeight: theme.fontWeight.normal,
                                    lineHeight: theme.lineHeight.title,
                                    color: theme.colors.primary,
                                }}
                            >
                                $ {product?.variants[selectedVariantIndex]?.price}
                            </Text>

                        </View>
                        {options.map((option, index) => {
                            return (
                                <View
                                    key={index + option?.name}
                                >
                                    <Text
                                        style={{
                                            fontSize: theme.fontSize.medium,
                                            lineHeight: theme.lineHeight.medium,
                                            fontWeight: theme.fontWeight.normal
                                        }}
                                    >
                                        {option.name}
                                    </Text>
                                    <View
                                        style={{
                                            flexDirection: "row",
                                            flexWrap: "wrap",
                                        }}
                                    >
                                        {option.values.map(item => {
                                            return (
                                                <TouchableOpacity
                                                    onPress={() => {
                                                        if (product?.options.length === 3) {
                                                            if (index + 1 === 1) {
                                                                changeVariant(item, product.variants[selectedVariantIndex][`option2`], product.variants[selectedVariantIndex][`option3`]);
                                                            } else if (index + 1 === 2) {
                                                                changeVariant(product.variants[selectedVariantIndex][`option1`], item, product.variants[selectedVariantIndex][`option3`]);
                                                            } else {
                                                                changeVariant(product.variants[selectedVariantIndex][`option1`], product.variants[selectedVariantIndex][`option2`], item);
                                                            }
                                                        } else if (product.options.length === 2) {
                                                            if (index + 1 === 1) {
                                                                changeVariant(item, product.variants[selectedVariantIndex][`option2`]);
                                                            } else if (index + 1 === 2) {
                                                                changeVariant(product.variants[selectedVariantIndex][`option1`], item);
                                                            }
                                                        } else {
                                                            changeVariant(item);
                                                        }
                                                    }}
                                                    style={[
                                                        {
                                                            padding: normalize(10),
                                                            marginVertical: normalize(10),
                                                            marginRight: normalize(15),
                                                            borderRadius: normalize(2),
                                                            elevation: 1,
                                                            borderColor: theme.colors.disabledButton,
                                                            borderWidth: 1,
                                                            elevation: 2,
                                                            shadowColor: theme.colors.secondary,
                                                            shadowOpacity: .2
                                                        },
                                                        index !== 0 && !availableOptions[index]?.includes(item) && {
                                                            display: 'none'
                                                        },
                                                        item === product.variants[selectedVariantIndex][`option${(index + 1) + ""}`] ? {
                                                            backgroundColor: theme.colors.secondary
                                                        } : {

                                                        },
                                                    ]
                                                    }
                                                    key={item}
                                                    disabled={index !== 0 && !availableOptions[index]?.includes(item)}
                                                >
                                                    <Text
                                                        style={[
                                                            {
                                                                fontSize: theme.fontSize.paragraph,
                                                                lineHeight: theme.lineHeight.paragraph,
                                                            },
                                                            item === product.variants[selectedVariantIndex][`option${(index + 1) + ""}`] &&
                                                            {
                                                                color: theme.colors.white
                                                            }
                                                        ]}
                                                    >
                                                        {item}
                                                    </Text>
                                                </TouchableOpacity>
                                            )
                                        })}
                                    </View>
                                </View>
                            )
                        })}
                        <Text
                            style={{
                                fontSize: theme.fontSize.heading,
                                lineHeight: theme.lineHeight.title,
                                marginTop: normalize(15),
                            }}
                        >
                            Product Description
                        </Text>
                        {product?.body_html?.replace(/<\/?[^>]+(>|$)/g, "").split(".").map((str, index) => {
                            if (str.trim().length > 0) {
                                return (
                                    <Text
                                        style={{
                                            fontSize: theme.fontSize.medium,
                                            lineHeight: theme.lineHeight.medium,
                                            color: theme.colors.unfocused,
                                            marginVertical: normalize(6),
                                            fontWeight: theme.fontWeight.medium
                                        }}
                                        key={index + ""}
                                    >
                                        * {str}.
                                    </Text>
                                )
                            }
                        })}
                        <View  
                            style={{
                                height: normalize(20)
                            }} 
                        />
                        {/* {product?.variants[selectedVariantIndex]?.inventory_quantity < 1
                            && product?.variants[selectedVariantIndex]?.inventory_policy !== "deny"
                            ? <TouchableOpacity
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
                                    width: '100%',
                                    alignSelf: "center",
                                    backgroundColor: theme.colors.secondary,
                                    justifyContent: "center",
                                    alignItems: "center",
                                    borderRadius: normalize(6),
                                    marginVertical: normalize(15)
                                }}
                                onPress={() => {
                                    addToCartRef.current?.show();
                                }}
                            >
                                {cartIsLoading ?
                                    <ActivityIndicator color={theme.colors.white} />
                                    :
                                    <Text
                                        style={{
                                            color: theme.colors.white,
                                            fontSize: theme.fontSize.medium,
                                            fontWeight: theme.fontWeight.medium,
                                            lineHeight: theme.lineHeight.medium
                                        }}
                                    >
                                        Customize 
                                    </Text>
                                }
                            </TouchableOpacity>
                        } */}
                    </View>
                }
                <View
                    style={{
                        height: normalize(50)
                    }}
                />
                <ActionSheet
                    ref={addToCartRef}
                    drawUnderStatusBar={true}
                    containerStyle={{
                        height: Dimensions.get('screen').height / 1.2
                    }}
                    headerAlwaysVisible={true}
                    openAnimationSpeed={10}

                >
                    <ScrollView
                        style={{
                       }}
                        contentContainerStyle={{
                            width: '100%',
                            alignItems: "center",
                            // height: '100%',
                            justifyContent: "space-between"
                       }}
                    >
                        {
                            images.length === 0 &&
                            <View
                                style={{
                                    backgroundColor: theme.colors.disabledButton,
                                    width: '90%',
                                    alignSelf: "center",
                                    height: normalize(330)
                                }}
                            >
                                <Image
                                    source={imageHelper.PHOTO_GUIDE}
                                    style={{
                                        height: '100%',
                                        width: '100%',
                                    }}
                                    resizeMode="contain"
                                />
                            </View>
                        }
                        <View
                            style={{
                                height: images.length === 0 ? normalize(10) : normalize(225),
                                width: '92%',
                                marginBottom: normalize(10)
                            }}
                        >
                            <FlatList
                                data={images}
                                showsVerticalScrollIndicator={false}
                                showsHorizontalScrollIndicator={false}
                                horizontal
                                keyExtractor={(item, index) => index}

                                renderItem={({ item, index }) => {
                                    return (
                                        <View
                                            style={{
                                                height: '100%',
                                                width: normalize(225),
                                                marginHorizontal: normalize(6),
                                            }}
                                            key={index}
                                        >
                                            <LightBox navigator={navigator}>
                                                <Image
                                                    source={{ uri: item?.uri }}
                                                    style={{
                                                        height: '100%',
                                                        padding: normalize(2),
                                                        borderRadius: normalize(2),
                                                        borderRadius: normalize(4),
                                                        width: '100%'
                                                    }}
                                                />
                                            </LightBox>
                                            <TouchableOpacity
                                                style={{
                                                    zIndex: 1,
                                                    position: "absolute",
                                                    top: normalize(5),
                                                    right: normalize(5),
                                                    padding: normalize(5),
                                                    borderRadius: normalize(20)
                                                }}
                                                onPress={() => {
                                                    const newImages = images.filter((image, i) => index !== i);
                                                    setImages([...newImages]);
                                                }}
                                            >
                                                <Icon
                                                    name={"cross"}
                                                    size={29}
                                                    color={theme.colors.black}
                                                    style={{
                                                        backgroundColor: theme.colors.white,
                                                        opacity: .5
                                                    }}
                                                />
                                            </TouchableOpacity>
                                        </View>
                                    )
                                }}
                            />
                           
                        </View>
                        {
                                images.length > 0 && 
                                <View
                                    style={{
                                        // paddingTop: normalize(10),
                                        alignSelf: "flex-start",
                                        width: "90%",
                                        paddingHorizontal: '7%'
                                    }}
                                >
                                    <Text
                                        style={{
                                            fontSize: theme.fontSize.heading,
                                            fontWeight: theme.fontWeight.normal,
                                            lineHeight: theme.lineHeight.title,
                                            color: theme.colors.secondary,
                                        }}
                                    >
                                        {product?.title}
                                    </Text>
                                    <Text
                                        style={{
                                            fontSize: theme.fontSize.title,
                                            fontWeight: theme.fontWeight.normal,
                                            lineHeight: theme.lineHeight.title,
                                            color: theme.colors.primary,
                                        }}
                                    >
                                        $ {product?.variants[selectedVariantIndex]?.price}
                                    </Text>
                                    <Text
                                        style={{
                                            fontSize: theme.fontSize.subheading,
                                            fontWeight: theme.fontWeight.normal,
                                            lineHeight: theme.lineHeight.subheading,
                                            color: theme.colors.secondary,
                                        }}
                                    >
                                       {product?.variants[selectedVariantIndex]?.title}
                                    </Text>

                                </View>
                            }
                        <View 
                            style={{
                                width: '100%',
                                alignSelf: "center"
                            }}
                        >
                            {
                                images.length < 3 &&
                                <TouchableOpacity
                                    onPress={() => {
                                        uploadImageHandler();
                                    }}
                                    style={{
                                        backgroundColor: theme.colors.white,
                                        width: '90%',
                                        borderRadius: normalize(5),
                                        borderWidth: 2,
                                        borderColor: theme.colors.customize,
                                        backgroundColor: theme.colors.customize,
                                        alignSelf: "center"
                                    }}
                                >
                                    <Text
                                        style={{
                                            fontSize: theme.fontSize.medium,
                                            lineHeight: theme.lineHeight.medium,
                                            fontWeight: theme.fontWeight.bold,
                                            textAlign: "center",
                                            color: theme.colors.white,
                                            marginVertical: normalize(10)
                                        }}
                                    >
                                        UPLOAD IMAGE
                                    </Text>
                                </TouchableOpacity>
                            }
                            <StepperCounter
                                max={product?.variants[selectedVariantIndex]?.inventory_quantity || 0} 
                                curr={selectedStock} 
                                setCurr={setSelectedStock} 
                                policy={product?.variants[selectedVariantIndex]?.inventory_policy} 
                            />
                            <Text
                                style={{
                                    textAlign: "center",
                                    fontSize: theme.fontSize.medium,
                                    fontWeight: theme.fontWeight.thin,
                                    lineHeight: theme.lineHeight.medium,
                                    marginBottom: normalize(15),

                                }}
                            >
                                Choose Quantity
                            </Text>
                            <TouchableOpacity
                                onPress={() => {
                                    // addToCartRef.current?.hide();
                                    addToCartListener(selectedStock);
                                }}
                                style={{
                                    backgroundColor: theme.colors.secondary,
                                    width: '90%',
                                    alignSelf: 'center',
                                    borderRadius: normalize(5),
                                    marginBottom: normalize(15)
                                }}
                            >
                                <SubHeading
                                    style={{
                                        fontSize: theme.fontSize.medium,
                                        fontWeight: theme.fontWeight.medium,
                                        textAlign: "center",
                                        marginVertical: normalize(15),
                                        color: theme.colors.white,
                                    }}
                                >
                                    ADD TO CART
                                </SubHeading>
                            </TouchableOpacity>
                            <View style={{ height: normalize(35) }} />
                        </View>
                        
                    </ScrollView>
                </ActionSheet>

            </ScrollView>
            <View
                style={{
                    position: "absolute",
                    width: '100%',
                    bottom: normalize(0),
                    height: normalize(65),
                    backgroundColor: theme.colors.white,
                }}
            >
                {
                    product?.variants[selectedVariantIndex]?.inventory_quantity < 1 && product?.variants[selectedVariantIndex]?.inventory_policy !== "deny" ?
                        <TouchableOpacity
                            style={{
                                flexDirection: "row",
                                alignItems: 'center',
                                justifyContent: "center",
                                height: '100%',
                                padding: normalize(10),
                                elevation: 2,
                                borderWidth: 1,
                                shadowColor: theme.colors.notification,
                                shadowOpacity: .2,
                                borderColor: theme.colors.disabledButton
                            }}
                            disabled={true}

                        >
                            <Text
                                style={{
                                    fontSize: theme.fontSize.subheading,
                                    marginTop: normalize(2),
                                    marginLeft: normalize(5),
                                    color: theme.colors.notification,
                                    fontWeight: theme.fontWeight.medium
                                }}
                            >
                                OUT OF STOCK
                            </Text>
                        </TouchableOpacity>
                        :
                        <TouchableOpacity
                            style={[{
                                flexDirection: "row",
                                alignItems: 'center',
                                justifyContent: "center",
                                backgroundColor: "#E50774",
                                height: '100%',
                                padding: normalize(10),
                                elevation: 2,
                                borderWidth: 1,
                                borderColor: theme.colors.disabledButton,
                            },
                            cartIsLoading === true && {
                                backgroundColor: theme.colors.disabled
                            }
                            ]}
                            onPress={() => {
                                // navigation.navigate('BottomTab', {
                                //     screen: 'CartScreen'
                                // });

                                addToCartRef.current?.show();
                            }}
                            disabled={cartIsLoading}
                        >
                            {
                                cartIsLoading === true ?
                                    <ActivityIndicator color={theme.colors.disabledButton} /> :
                                    // <Image
                                    //     source={icons?.CUSTOMIZE}
                                    //     style={{
                                    //         width: normalize(25),
                                    //         height: normalize(25)
                                    //     }}
                                    //     // resizeMode="contain"
                                    // />
                                    <></>
                            }
                            <Text
                                style={[{
                                    fontSize: theme.fontSize.subheading,
                                    marginTop: normalize(2),
                                    marginLeft: normalize(5),
                                    color: theme.colors.white,
                                    fontWeight: theme.fontWeight.bold
                                }
                                    ,
                                cartIsLoading === true &&
                                {
                                    color: theme.colors.disabledButton
                                }
                                ]}
                            >
                                {
                                    cartIsLoading === true ? ` Loading...` : `PERSONALIZE  IT`
                                }
                            </Text>
                        </TouchableOpacity>
                }
            </View>
        </SafeAreaView>
    )
}


const mapStateToProps = state => {
    return {
        categories: state.categories,
        products: state.products,
        cart: state.cart,
        customer: state.customer
    }
}

const mapDispatchToProps = (dispatch) => ({
    setCart: (customer) => dispatch(setCart(customer)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ProductListeningScreen)
