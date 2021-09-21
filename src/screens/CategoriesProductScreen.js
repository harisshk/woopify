import React, { useEffect, useState } from 'react'
import { SafeAreaView, ScrollView, View, Image } from 'react-native';
import normalize from 'react-native-normalize';
import { connect } from 'react-redux';
import { CustomHeader } from '../components/CustomHeader';
import ProductView01 from '../components/ProductView01';
import SubHeading from '../components/SubHeading';
import { client } from '../services';
import { getAllProductsByCategory } from '../services/categories';
import { theme } from '../utils/theme';

function CategoriesProduct({ navigation, route }) {
    const { category } = route.params;
    const [products, setProducts] = useState([]);
    useEffect(() => {
        getProductsHelper();
    }, []);
    let getProductsHelper = async () => {
        // client.collection.fetchWithProducts(category.id).then((collection) => {
        //     let data = Object.assign({}, collection);
        //     setProducts(data.products || []);
        // });
        let data = await getAllProductsByCategory(category.id);
        setProducts(data?.products || []);
    }
    return (
        <SafeAreaView
            style={{
                backgroundColor: theme.colors.background,
                flex: 1
            }}
        >
            <CustomHeader navigation={navigation} title={""}/>
            <ScrollView
                style={{
                    flex: 1,
                    padding: normalize(15)
                }}
            >
                <Image
                    source={{ uri: category.image.src }}
                    style={{
                        height: normalize(180),
                        width: '98%',
                        alignSelf: "center",
                        borderRadius: normalize(12),
                        elevation: 11
                    }}
                    resizeMode="center"
                />
                <SubHeading
                    style={{
                        alignItems: "center",
                        justifyContent: "center",
                        alignSelf: "center",
                        fontSize: normalize(20)
                    }}
                >
                    {route.params.category.title}
                </SubHeading>
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

const mapStateToProps = state => {
    return {
        categories: state.categories,
    }
}

const mapDispatchToProps = dispatch => ({
    setCategories: response => dispatch(setCategories(response)),
    setProducts: response => dispatch(setProducts(response)),
});

export default connect(mapStateToProps, mapDispatchToProps)(CategoriesProduct);
