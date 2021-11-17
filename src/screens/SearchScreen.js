import React, { useState, useEffect } from 'react'
import { SafeAreaView, Text, View, TouchableOpacity, Image, TextInput, ScrollView, RefreshControl } from 'react-native';
import base64 from 'react-native-base64';
import normalize from 'react-native-normalize'
import ProductView01 from '../components/ProductView01';
import { icons } from '../constant';
import { client } from '../services';
import { getProductInfo, searchProductsByQuery } from '../services/products';
import { theme } from '../utils/theme'

function SearchScreen({ navigation }) {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [query, setQuery] = useState("");

    const searchHandler = async (text = query) => {
        if(isLoading === true){
            return;
        }
        if(text.length === 0){
            setProducts([])
            return;
        }
        setIsLoading(true);
        // const query = {
        //     query: text,
        // };
        // const graphqlProducts = await client.product.fetchQuery(query);
        let temp = [];
        // for(let i = 0; i < graphqlProducts.length; i++){
            // const product = graphqlProducts[i];
            // const productIdArray = await base64.decode(product.id).split("/");
            // const productId = productIdArray[productIdArray.length - 1];
            // const data = await getProductInfo(productId);
            // temp.push(data.product);
        // }
        // setProducts([...temp]);
        const response = await searchProductsByQuery(text);
        const { resources } = response;
        const { results } = resources;
        setProducts([...results.products]);
        setIsLoading(false);
    }

    return (
        <SafeAreaView
            style={{
                flex: 1,
                backgroundColor: theme.colors.background,
            }}
        >
            <View
                style={{
                    padding: normalize(15),
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center"
                }}
            >
                <TouchableOpacity
                    style={{
                        padding: normalize(13),
                        alignSelf: "center",
                        marginTop: normalize(20)
                    }}
                    onPress={() => {
                        navigation.goBack();
                    }}
                >
                    <Image
                        source={icons?.BACK}
                        resizeMode="contain"
                        style={{
                            width: normalize(25),
                            height: normalize(25),
                            alignSelf: "flex-end"
                        }}
                    />
                </TouchableOpacity>
                <View
                    style={{
                        flex: 1
                    }}
                >
                    <TextInput
                        disabledButton={isLoading}
                        style={{
                            backgroundColor: theme.colors.bottomTabActiveBg,
                            padding: normalize(15),
                            marginTop: normalize(15),
                            borderRadius: 10,
                            fontWeight: theme.fontWeight.medium,
                            fontSize: theme.fontSize.paragraph
                        }}
                        placeholderTextColor={theme.colors.black}
                        placeholder="Search ..."
                        maxLength={32}
                        value={query}
                        onChangeText={(text) => {

                            setQuery(text);
                        }}
                        onSubmitEditing={() => {
                            searchHandler(query)
                        }}
                    />
                    <TouchableOpacity
                        style={{
                            position: "absolute",
                            right: normalize(20),
                            top: normalize(29),
                            zIndex: 1
                        }}
                        onPress={()=>{
                            searchHandler(query)
                        }}
                        disabled={isLoading}
                    >
                        <Image
                            source={icons?.SEARCH}
                            style={{
                                padding: 1,
                                height: normalize(23),
                                width: normalize(23),
                            }}
                        />
                    </TouchableOpacity>
                </View>
            </View>
            <ScrollView
                style={{
                    padding: normalize(15)
                }}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={isLoading}
                        onRefresh={()=>{}}
                    />
                }
            >
                {isLoading === true &&
                    <Text
                        style={{
                            fontSize: theme.fontSize.medium,
                            color: theme.colors.secondary,
                            textAlign: "center",
                            marginVertical: normalize(20)
                        }}
                    >
                        Searching for products ...
                    </Text>
                }
                {
                    query.length === 0 && 

                    <View>
                        <Text
                            style={{
                                textAlign: "center",
                                fontSize: theme.fontSize.subheading,
                                lineHeight: theme.lineHeight.medium,
                                marginBottom: normalize(12)
                            }}
                        >
                            Search for Best Gift Products.
                            
                        </Text>
                        <Text
                            style={{
                                textAlign: "center",
                                fontSize: theme.fontSize.subheading,
                                lineHeight: theme.lineHeight.subheading,
                                color: theme.colors.focused
                            }}
                        >
                            Pet Lover's Favorite
                        </Text>
                    </View>
                }
                {query.length !== 0 && products.length === 0 && isLoading === false &&
                    <Text
                        style={{
                            fontSize: theme.fontSize.medium,
                            color: theme.colors.secondary,
                            textAlign: "center"
                        }}
                    >
                        No Result Found ...
                    </Text>
                }
                <View
                    style={{
                        flexWrap: "wrap",
                        width: '100%',
                        flexDirection: "row",
                        justifyContent: "space-between"
                    }}
                >
                    {products.map((product) =>
                        <ProductView01
                            isFromCategory={false}
                            key={product.id}
                            item={product}
                            navigation={navigation}
                        />
                    )}
                </View>
                <View
                    style={{
                        height: normalize(20)
                    }}
                />
            </ScrollView>
        </SafeAreaView>
    )
}

export default SearchScreen
