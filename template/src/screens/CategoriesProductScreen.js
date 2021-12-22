import React, { useEffect, useState } from 'react'
import { SafeAreaView, ScrollView, View, Image, Dimensions, RefreshControl, Text } from 'react-native';
import normalize from 'react-native-normalize';
import SkeletonContent from 'react-native-skeleton-content-nonexpo';
import { connect } from 'react-redux';
import { CustomHeader } from '../components/CustomHeader';
import ProductView01 from '../components/ProductView01';
import SubHeading from '../components/SubHeading';
import { setCart } from '../redux/action/cart';
import { getAllProductsByCategory } from '../services/categories';
import { theme } from '../utils/theme';

const { width } = Dimensions.get('screen');
function CategoriesProduct({ navigation, route, setCart }) {
    const { category } = route.params;
    const [products, setProducts] = useState(category.products);
    const [isLoading, setIsLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const onRefresh = () => {
        setRefreshing(true);
        getProductsHelper();
        setRefreshing(false);
    }
    useEffect(() => {
        getProductsHelper();
    }, []);
    const getProductsHelper = async () => {

        setIsLoading(true);
        // const data = await getAllProductsByCategory(category.id);
        setIsLoading(false);
        // setProducts(data?.products || []);
    }
    return (
        <SafeAreaView
            style={{
                backgroundColor: theme.colors.background,
                flex: 1
            }}
        >
            <CustomHeader navigation={navigation} title={route?.params?.category?.title} />
            <ScrollView
                style={{
                    flex: 1,
                    padding: normalize(15)
                }}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
            >

                <View
                    style={{
                        flexWrap: "wrap",
                        width: '100%',
                        flexDirection: "row",
                        justifyContent: "space-between"
                    }}
                >
                    <SkeletonContent
                        containerStyle={{ width: '100%', flexDirection: "row" }}
                        layout={[
                            {
                                width: width / 2.24,
                                height: normalize(220),
                                key: 'imageLoader1',
                                borderRadius: normalize(10),
                                marginRight: normalize(10)
                            },
                            {
                                width: width / 2.24,
                                height: normalize(220),
                                key: 'imageLoader2',
                                marginRight: normalize(10),
                                borderRadius: normalize(10),
                            },
                        ]}
                        isLoading={isLoading}
                    >
                        {
                            products.length === 0 ?
                                <Text
                                    style={{
                                        fontSize: theme.fontSize.medium,
                                        lineHeight: theme.lineHeight.medium,
                                        color: theme.colors.black,
                                        textAlign: "center",
                                        width: "100%"
                                    }}
                                >
                                    No Products Found :(
                                </Text>
                                :
                                <View
                                    style={{
                                        flexWrap: "wrap",
                                        width: '100%',
                                        flexDirection: "row",
                                        justifyContent: "space-between",
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
                        }
                    </SkeletonContent>
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

const mapStateToProps = state => {
    return {
        categories: state.categories,
    }
}

const mapDispatchToProps = dispatch => ({
    setCategories: response => dispatch(setCategories(response)),
    setProducts: response => dispatch(setProducts(response)),
    setCart: cart => dispatch(setCart(cart))
});

export default connect(mapStateToProps, mapDispatchToProps)(CategoriesProduct);
