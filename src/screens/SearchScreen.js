import React, { useState, useEffect } from 'react'
import { SafeAreaView, Text, View, TouchableOpacity, Image, TextInput, ScrollView, RefreshControl } from 'react-native';
import base64 from 'react-native-base64';
import normalize from 'react-native-normalize'
import ProductView01 from '../components/ProductView01';
import { client } from '../services';
import { getProductInfo } from '../services/products';
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
        const query = {
            query: text,
        };
        const graphqlProducts = await client.product.fetchQuery(query);
        let temp = [];
        for(let i = 0; i < graphqlProducts.length; i++){
            const product = graphqlProducts[i];
            const productIdArray = await base64.decode(product.id).split("/");
            const productId = productIdArray[productIdArray.length - 1];
            const data = await getProductInfo(productId);
            temp.push(data.product);
        }
        setProducts([...temp]);
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
                        source={require('../assets/images/left-arrow.png')}
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
                        // onSubmitEditing={searchHandler}
                    />
                    <TouchableOpacity
                        style={{
                            position: "absolute",
                            right: normalize(20),
                            top: normalize(29)
                        }}
                        onPress={()=>{
                            console.log(query)
                            searchHandler(query)
                        }}
                        disabled={isLoading}
                    >
                        <Image
                            source={require('../assets/images/search.png')}
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
                
                refreshControl={
                    <RefreshControl
                        refreshing={isLoading}
                        onRefresh={searchHandler}
                    />
                }
            >
                {isLoading === true &&
                    <Text
                        style={{
                            fontSize: theme.fontSize.medium,
                            color: theme.colors.disabledButton,
                            textAlign: "center"
                        }}
                    >
                        Searching for products ...
                    </Text>
                }
                {products.length === 0 && isLoading === false &&
                    <Text
                        style={{
                            fontSize: theme.fontSize.medium,
                            color: theme.colors.disabledButton,
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
                            isFromCategory={true}
                            key={product.id}
                            item={product}
                            navigation={navigation}
                        />
                    )}
                </View>

            </ScrollView>
        </SafeAreaView>
    )
}

export default SearchScreen
