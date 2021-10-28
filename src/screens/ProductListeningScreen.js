import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState, createRef } from 'react';
import {
    ActivityIndicator,
    SafeAreaView,
    ScrollView,
    View,
    Text,
    TouchableOpacity,
    Dimensions,
    Image
} from 'react-native';
import base64 from 'react-native-base64';
import { Gallery } from 'react-native-gallery-view';
import { FlatList } from 'react-native-gesture-handler';
import normalize from 'react-native-normalize';
import { connect } from 'react-redux';
import { CustomHeader } from '../components/CustomHeader';
import SubHeading from '../components/SubHeading';
import { setProducts } from '../redux/action/products';
import { getProductInfo } from '../services/products';
import { theme } from '../utils/theme';
import ActionSheet from 'react-native-actions-sheet';
import { Picker } from '@react-native-picker/picker';
import { client } from '../services';
import Toast from 'react-native-simple-toast';
import { setCart } from '../redux/action/cart';
import ImagePicker from 'react-native-image-crop-picker';
import { uploadImage } from '../services/asset';



Array.prototype.insert = function (i, ...rest) {
    return this.slice(0, i).concat(rest, this.slice(i));
}
export const ProductListeningScreen = ({ navigation, route, setCart, customer }) => {
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
                    newVariantImages = newVariantImages.insert(1, item);
                }
                else if (item.variant_ids.length === 0) {
                    newVariantImages.push(item);
                }
            });
            setVariantImages([...newVariantImages]);
            setIsLoading(false);
        } catch (error) {
            console.log('-------------------ProductListeningScreen Error 60----------------------------------');
            console.log(error);
        }

    }

    const addToCartListener = async (quantity) => {
        if(!image.uri){
            Toast.show('Add Image', Toast.SHORT);
            addToCartRef?.current?.show();
            return;
        }else {
            addToCartRef?.current?.hide();
        }
        setCartIsLoading(true);
        const response = await uploadImage(image);
        const { data } = response;
        if (data.success === true) {
            Toast.showWithGravity('Image Uploaded Successfully...', Toast.SHORT, Toast.TOP);
            const { asset } = data;
            let checkoutExists = await AsyncStorage.getItem('checkoutId');

            if (checkoutExists === null) {
                client.checkout.create().then(async (checkout) => {
                    await AsyncStorage.setItem('checkoutId', JSON.stringify(checkout.id));
                    /**
                     * Rest API Id to StoreFront API ID
                     */
                    const variantId = base64.encode(product.variants[selectedVariantIndex < 0 ? 0 : selectedVariantIndex].admin_graphql_api_id + "");
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
            }
            checkoutExists = await AsyncStorage.getItem('checkoutId');
            const checkoutId = JSON.parse(checkoutExists);
            /**
             * Rest API Id to StoreFront API ID
             */
            const variantId = base64.encode(product.variants[selectedVariantIndex < 0 ? 0 : selectedVariantIndex].admin_graphql_api_id + "");
            const lineItemsToAdd = [{
                variantId: variantId,
                quantity: quantity,
                customAttributes: [
                    { key: "Your Photo", value: asset?.public_url || "https://cdn.shopify.com/s/files/1/0602/9036/7736/t/8/assets/hari_1.png?v=1635339823" },
                    { key: "Preview", value: asset?.public_url || "https://cdn.shopify.com/s/files/1/0602/9036/7736/t/8/assets/hari_1.png?v=1635339823" },
                    { key: "_pplr_preview", value: 'Preview' },
                    // { key: "", value: "" }
                ]
            }];
            client.checkout.addLineItems(checkoutId, lineItemsToAdd).then((checkout) => {
                const cart = {
                    cart: { count: checkout?.lineItems?.length }
                }
                setCart({ ...cart });
                setCartIsLoading(false);
                Toast.show('Added to Cart');
            }).catch(error => {
                setCartIsLoading(false);
                console.log('----------------Line 114-----------------');
                console.log(error);
            });
        } else {
            Toast.show('Something went wrong ...', Toast.SHORT);
            return;
        }
        

    }
    const changeVariant = async (option1 = null, option2 = null, option3 = null) => {
        console.log('---changing variant---')
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
                            newVariantImages = newVariantImages.insert(1, item);
                        }
                        else if (item.variant_ids.length === 0) {
                            newVariantImages.push(item);
                        }
                    });
                    setVariantImages([...newVariantImages]);
                    setIsLoading(false);
                    return;
                }
            } else if (option1 !== null && option2 !== null && option3 === null) {
                if (variant.option1 === option1 && variant.option2 === option2) {
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
                            newVariantImages = newVariantImages.insert(1, item);
                        }
                        else if (item.variant_ids.length === 0) {
                            newVariantImages.push(item);
                        }
                    });
                    setVariantImages([...newVariantImages]);
                    setIsLoading(false);
                    return;
                }
            } else {
                if (variant.option1 === option1 && variant.option2 === option2 && variant.option3 === option3) {
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
                            newVariantImages = newVariantImages.insert(1, item);
                        }
                        else if (item.variant_ids.length === 0) {
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

    const[image, setImage] = useState({});
    const[imageIsLoading, setImageIsLoading] = useState(false);

    const uploadImageHandler = async() => {
        try{
            const options = {
                cropping: true,
                includeBase64: true,
                mediaType: "photo",
                multiple: false
            };
            const image = await ImagePicker.openPicker(options);
            const upload = {
                attachment: image?.data,
                customer: customer?.id,
                product: product.id,
                uri: image.sourceURL,
            };
            
            setImage({
                ...upload
            });
            // const response = await uploadImage(upload);
            // const { data } = response;
            // if(data.success === true){
            //     Toast.show('Image Uploaded Successfully...', Toast.SHORT);
                
            // }else{
            //     Toast.show('Something went wrong ...', Toast.SHORT);
            // }
        }catch(error){
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
    }, [])
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
            >
                {isLoading === true ?
                    <ActivityIndicator color="black" />
                    :
                    <View>{
                        variantImages?.length > 0 &&
                        <Gallery
                            images={variantImages}
                            borderColor={theme.colors.primary}
                        />}
                        <Text
                            style={{
                                fontSize: theme.fontSize.title,
                                fontWeight: theme.fontWeight.medium,
                                lineHeight: theme.lineHeight.title
                            }}
                        >
                            {product?.title}
                        </Text>
                        <Text
                            style={{
                                fontSize: theme.fontSize.title,
                                fontWeight: theme.fontWeight.normal,
                                lineHeight: theme.lineHeight.title,
                                color: theme.colors.notification,
                                marginBottom: normalize(15)
                            }}
                        >
                            $ {product?.variants[selectedVariantIndex]?.price}
                        </Text>
                        {options.map((option, index) => {
                            return (
                                <View
                                    key={index}
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
                                    <FlatList
                                        horizontal
                                        style={{
                                            marginVertical: normalize(10)
                                        }}
                                        renderItem={({ item }) => {
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
                                                        }

                                                    }}
                                                    style={[
                                                        {
                                                            padding: normalize(6),
                                                            marginRight: normalize(5),
                                                            borderRadius: normalize(5),
                                                            elevation: 1,
                                                            borderColor: theme.colors.unfocused,
                                                            borderWidth: 1
                                                        },
                                                        item === product.variants[selectedVariantIndex][`option${(index + 1) + ""}`] ? {
                                                            backgroundColor: theme.colors.secondary
                                                        } : {

                                                        },
                                                    ]
                                                    }
                                                >
                                                    <Text
                                                        style={[
                                                            {
                                                                fontSize: theme.fontSize.paragraph,
                                                                lineHeight: theme.lineHeight.paragraph,
                                                            },
                                                            item === product.variants[selectedVariantIndex][`option${(index + 1) + ""}`] &&
                                                            {
                                                                color: "white"
                                                            }
                                                        ]}
                                                    >
                                                        {item}
                                                    </Text>
                                                </TouchableOpacity>
                                            )
                                        }}
                                        data={option.values}
                                        keyExtractor={item => item}
                                    />
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
                        {product?.body_html?.replace(/<\/?[^>]+(>|$)/g, "").split(".").map(str => {
                            if (str.length > 0) {
                                return (
                                    <Text
                                        style={{
                                            fontSize: theme.fontSize.medium,
                                            lineHeight: theme.lineHeight.medium,
                                            color: theme.colors.unfocused,
                                            marginVertical: normalize(6),
                                            fontWeight: theme.fontWeight.medium
                                        }}
                                    >
                                        * {str}.
                                    </Text>
                                )
                            }
                        })}
                        {product?.variants[selectedVariantIndex]?.inventory_quantity < 1
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
                                    backgroundColor: theme.colors.primary,
                                    justifyContent: "center",
                                    alignItems: "center",
                                    borderRadius: normalize(12),
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
                                            fontWeight: theme.fontWeight.medium
                                        }}
                                    >
                                        ADD TO CART
                                    </Text>
                                }
                            </TouchableOpacity>}
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
                        height: Dimensions.get('screen').height - normalize(300)
                    }}
                >
                    <View
                        style={{
                            width: '100%',
                        }}
                    >
                        {
                            
                            <TouchableOpacity
                                style={{
                                    backgroundColor: theme.colors.primary,
                                    borderRadius: normalize(7),
                                    elevation: 4,
                                    // padding: normalize(15),
                                    width: "90%",
                                    alignSelf: "center",
                                    marginVertical: normalize(15)
                                }}
                                onPress={()=>{
                                    uploadImageHandler();
                                }}
                            >
                                {image?.uri ?  
                                    <>
                                    <Image
                                        source={{uri: (image.uri)}}
                                        style={{
                                            height: Dimensions.get('screen').height - normalize(600),
                                            width: '100%',
                                            padding: normalize(2),
                                            borderRadius: normalize(2),
                                        }}
                                    />
                                    <Text
                                        style={{
                                            color: theme.colors.white,
                                            textAlign: "center",
                                            marginVertical: normalize(10),
                                            lineHeight: theme.lineHeight.medium,
                                            fontSize: theme.fontSize.medium,
                                        }}
                                    >
                                        
                                        Remove and Re-Upload

                                    </Text>
                                    </>
                                :
                                <Text
                                    style={{
                                        fontSize: theme.fontSize.medium,
                                        lineHeight: theme.lineHeight.medium,
                                        fontWeight: theme.fontWeight.medium,
                                        textAlign: "center",
                                        color: theme.colors.white,
                                        marginVertical: normalize(10)
                                    }}
                                >
                                    UPLOAD IMAGE
                                </Text>
                                }
                            </TouchableOpacity>
                        }

                        <View
                            style={{
                                flexDirection: "row",
                                width: '70%',
                                justifyContent: "center",
                                alignItems: "center",
                                marginVertical: normalize(15),
                                alignSelf: "center"
                            }}
                        >
                            <TouchableOpacity
                                style={{
                                    backgroundColor: theme.colors.primary,
                                    alignSelf: "center",
                                    height: normalize(50),
                                    justifyContent: "center",
                                    flex: 1,
                                    borderTopLeftRadius: normalize(8),
                                    borderBottomLeftRadius: normalize(8)
                                }}
                                onPress={()=>{
                                    if(product?.variants[selectedVariantIndex]?.inventory_quantity >= selectedStock
                                        || product?.variants[selectedVariantIndex]?.inventory_policy === "deny"){
                                        setSelectedStock(selectedStock + 1);
                                    }
                                }}
                            >
                                <Text
                                    style={{
                                        color: theme.colors.white,
                                        textAlign: "center",
                                        fontSize: theme.fontSize.title,
                                        fontWeight: theme.fontWeight.bold
                                    }}
                                >
                                    +
                                </Text>
                            </TouchableOpacity>
                            <View
                                style={{
                                    backgroundColor: theme.colors.secondary,
                                    flex: 1,
                                    height: normalize(50),
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}
                            >
                            <Text
                                style={{
                                    color: theme.colors.white,
                                    fontSize: theme.fontSize.subheading
                                }}
                            >
                                {selectedStock}
                            </Text>
                            </View>
                            <TouchableOpacity
                                onPress={()=>{
                                    if(selectedStock >= 2){
                                        setSelectedStock(selectedStock - 1);
                                    }
                                }}
                                style={{
                                    backgroundColor: theme.colors.primary,
                                    alignSelf: "center",
                                    height: normalize(50),
                                    justifyContent: "center",
                                    flex: 1,borderTopRightRadius: normalize(8),
                                    borderBottomRightRadius: normalize(8)
                                }}
                            >
                                <Text
                                    style={{
                                        color: theme.colors.white,
                                        textAlign: "center",
                                        fontSize: theme.fontSize.title,
                                        fontWeight: theme.fontWeight.bold
                                    }}
                                >
                                    -
                                </Text>
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity
                            onPress={() => {
                                // addToCartRef.current?.hide();
                                addToCartListener(selectedStock);
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
                                    marginVertical: normalize(15), 
                                    color: theme.colors.white,
                                }}
                            >
                                ADD TO CART
                            </SubHeading>
                        </TouchableOpacity>
                    </View>
                </ActionSheet>
            </ScrollView>
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
