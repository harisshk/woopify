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
import ActionButton from 'react-native-action-button';
import { Divider, List, Menu } from 'react-native-paper';
import { FlatList } from 'react-native-gesture-handler';


Array.prototype.insert = function (i, ...rest) {
    return this.slice(0, i).concat(rest, this.slice(i));
}
function ProductScreen({ navigation, route, navigator }) {
    
    const { height } = Dimensions.get('screen');
    const addToCartRef = createRef();
    const colorsVariantRef = createRef();

    const [isLoading, setIsLoading] = useState(true);
    const [currColor, setCurrColor] = useState(-1);
    const [currSize, setCurrSize] = useState(-1);
    const [product, setProduct] = useState(route.params?.product);
    const [currVariantIndex, setCurrentVariantIndex] = useState(-1);
    // const [images, setImages] = useState([...product.images]);
    const [cartIsLoading, setCartIsLoading] = useState(false);
    const [selectedStock, setSelectedStock] = useState(1);
    const [totalStock, setTotalStock] = useState([
        { label: "1", value: "1" },
        { label: "2", value: "2" },
        { label: "3", value: "3" },
        { label: "4", value: "4" },
        { label: "5", value: "5" },
    ]);


    const[variantChosen, setVariantChosen]= useState(0);
    const[optionsType, setOptionsType] = useState(null);
    const[variantIsLoading, setVariantIsLoading] = useState(true);
    const[variantImages, setVariantsImages] = useState([]); 
    const[isColorVariantPresent, setIsColorVariantPresent] = useState(false);
    const[isSizeVariantPresent, setIsSizeVariantPresent] = useState(false);
    const[sizesMenuState, setSizesMenuState] = useState(false);  

    useEffect(() => {
        getProductInfoHelper();
    }, []);

    const getProductInfoHelper = async () => {
        setIsLoading(true);
        // client.product.fetch("Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0LzcwMTA4MzI2NzkwNzk=").then((product) => {
        //     // setProduct(data.product);
        //     console.log('-------new---', product)
        //     // admin_graphql_api_id
        //     // setCurrentVariantIndex(-1);
        //     // // loadingImages(0, 0);
        //     // setIsLoading(false);
        // });
        const data = await getProductInfo(product.id);
        if(data?.errors){
            Toast.show('Something went wrong');
            console.log(data);
            console.log('---------------------Product Screen Line 68-------------------------------');
            setIsLoading(false);
            return;
        }
        const productInfo = data?.product;
        const { options } = productInfo;
        const colors = await options.filter(option => option?.name?.toLowerCase() === "color");
        const sizes = await options.filter(option => option?.name?.toLowerCase() === "size");
        if(colors.length > 0){
            setIsColorVariantPresent(true);
        }
        if(sizes.length > 0){
            setIsSizeVariantPresent(true);
        }
        
        setProduct({...productInfo});
        calculateVariantStock();
        setIsLoading(false);
    }

    const calculateVariantStock = async () => {
        const noOfOptionsAvailable = product?.options?.length;
        async function trySwitch(){
            switch(noOfOptionsAvailable){
                case 1:{
                    setOptionsType("single");
                    setVariantChosen(0);
                    const allImages = product.images;
                    const currVariant = product.variants[0];
                    let newVariantImages =[];
                    await allImages.map(item => {         
                        if (item.variant_ids.includes(currVariant.id)) {
                            newVariantImages = newVariantImages.insert(0, item);
            
                        } else if (item.variant_ids.length === 0) {
                            newVariantImages.push(item);
                        }
                    });
                    let newStockCount = [] ;
                    for(let i = 0 ; i < product?.variants[0].inventory_quantity; i++){
                        newStockCount.push({
                            value: (i+1)+"",
                            label: (i+1)+"",
                        });
                    }
                    setTotalStock([...newStockCount]);
                    setVariantsImages([...newVariantImages]);
                    setVariantIsLoading(false);
                    break;
                }
                case 2:{
                    setOptionsType("double");
                    // setVariantIsLoading(false);
                    break;
                }
                case 3:{
                    setOptionsType("triple");
                    break;
                }
                default:{
                    setOptionsType("multi");
                }
            }
        };

        trySwitch();
    }

    const onClickVariantHandler = async(title) => {
        async function trySwitch(){
            switch(optionsType){
                case "single":{
                    setVariantIsLoading(true);
                    let variantIndex = 0;
                    await product?.variants?.forEach((variant, index) => {
                        if( variant?.option1 === title || variant?.option2 === title || variant?.option3 === title ){
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
                    let newStockCount = [] ;
                    for(let i = 0 ; i < product.variants[variantIndex].inventory_quantity; i++){
                        newStockCount.push({
                            value: (i+1)+"",
                            label: (i+1)+"",
                        });
                    }
                    setTotalStock([...newStockCount]);
                    setVariantsImages([...newVariantImages]);
                    setVariantIsLoading(false);
                    break;
                }
                case "double":{
                    setVariantIsLoading(true);
                    
                    setVariantIsLoading(false);
                    break;
                }
                case "triple":{

                    break;
                }
                case "multi":{

                    break;
                }
                default:{
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
            Alert.alert('Success', 'Added to Cart');
            setCartIsLoading(false);
        }).catch(error => {
            Alert.alert('Error', 'Something went wrong');
            setCartIsLoading(false);
            console.log('----------------Line 114-----------------');
            console.log(error);
        });

    }

    const loadingImages = async (option, index) => {
        

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
            <CustomHeader navigation={navigation} title={'Product Details'} />
                
            {/* <ActionButton 
                style={{
                    // position: "absolute",
                    // bottom: normalize(90),
                    zIndex: 1,
                    height: '100%'
                }} 
                buttonColor={theme.colors.disabledButton}
                hideShadow={false}
                size={normalize(40)}
            >
                {product.variants.map((item,index) => {
                    return(
                        <ActionButton.Item 
                            buttonColor='#9b59b6' 
                            title={item.title} 
                            style={{
                                alignItems: "center",
                                justifyContent: "center",
                                width: 10
                            }}
                            onPress={() => {
                                if(index === variantChosen){
                                    return;
                                }
                                onClickVariantHandler(index);
                            }}
                            
                        >
                            {index === variantChosen ?
                                <Image 
                                    source={require('../assets/images/selected.png')}
                                    style={{
                                        padding: normalize(2),
                                        height: normalize(25),
                                        width: normalize(25),
                                        alignSelf :'center'
                                    }}
                                    resizeMode="contain"
                                />
                            :
                                <Text
                                    style={{
                                        fontWeight: "bold",
                                    }}
                                >
                                </Text>
                            }
                        </ActionButton.Item>
                    )
                })}
            
            </ActionButton> */}
            
            
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
                    height: height/3,
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
                    <FlatList
                        data={product.variants}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        renderItem={({item,index}) => {
                            return(
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
                        width: '87%',
                        height: height/2.6,
                        key: 'imageLoader',
                        borderRadius: normalize(12),
                        alignSelf: "center"
                    },
                    {  
                        marginHorizontal: normalize(15),
                        width: '87%',
                        height: normalize(90),
                        key: 'imageThumbnailLoader',
                        borderRadius: normalize(12),
                        alignSelf: "center",
                        marginBottom: normalize(10)
                    },
                    {  
                        marginHorizontal: normalize(24),
                        width: '80%',
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
                    showsVerticalScrollIndicator={false}
                >
                    {
                        variantIsLoading === false && 
                        <Gallery
                            // images={currVariantIndex >= 0 ? [product.variants[currVariantIndex].image] : product.images}
                            // images={images}
                            images={variantImages}
                            activeIndex={0}
                            navigator={navigator}
                            borderColor={theme.colors.primary}
                        />
                    }
                    <View
                        style={{
                            flexDirection:"row",
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
                    {/**
                    * Variants and Option for Color
                    */}
                    {isColorVariantPresent === true &&
                        <TouchableOpacity
                            style={{
                                flex:.2,
                                justifyContent: "center",
                                alignItems: "center"
                            }}
                            onPress={()=>{
                                colorsVariantRef.current?.setModalVisible(true);
                            }}
                            disabled={variantIsLoading}
                        >
                            <View
                                style={{
                                    borderRadius: normalize(35),
                                    borderBottomColor:theme.colors.notification,
                                    borderTopColor:"#e35e12",
                                    borderRightColor:theme.colors.primary,
                                    borderLeftColor:"#090861",
                                    borderWidth: 2,
                                    padding:normalize(5),
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
                                    color:theme.colors.placeholder,
                                    fontWeight: theme.fontWeight.bold,
                                    fontSize: normalize(12.1),
                                    textAlign: "center",
                                    marginTop :normalize(10),
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
                            fontSize: theme.fontSize.heading,
                            lineHeight: theme.lineHeight.subheading,
                            marginTop: normalize(10)
                        }}
                    >   
                    $ {product.variants[variantChosen].price}
                    </Text>
                    {isSizeVariantPresent !== false && 
                        <Menu
                            visible={sizesMenuState}
                            onDismiss={()=>{
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
                                        marginTop: normalize(15)
                                    }}
                                    onPress={()=>{
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
                                    <List.Icon 
                                        icon="arrow-down" 
                                        color={theme.colors.white}  
                                        style={{
                                            width: normalize(20),
                                        }}
                                    />
                                </TouchableOpacity>
                            }
                        >
                            {product?.options.filter(option => option?.name?.toLowerCase() === "size")[0]?.values.map(value => {
                                return(
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
                                )})
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
            </TouchableOpacity>  :
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
                    marginTop: normalize(15)

                }}
                onPress={() => {
                    // if (currVariantIndex === -1) {
                    //     Alert.alert('Note', 'Choose any variant to continue');
                    //     return;
                    // };
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

        </SafeAreaView>
    )
}

export default ProductScreen
