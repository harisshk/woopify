import React from 'react';
import { SafeAreaView, View, ScrollView, Text } from 'react-native';
import { theme } from '../utils/theme';
import ProductView01 from '../components/ProductView01';
import { connect } from 'react-redux';
import normalize from 'react-native-normalize';
import { CustomHeader } from '../components/CustomHeader';
import Footer from '../components/Footer';

function ViewProductsScreen({
    navigation,
    products
}) {

    return (
        <SafeAreaView
            style={{
                flex: 1,
                backgroundColor: theme.colors.background
            }}
        >
            <CustomHeader
                navigation={navigation}
                title={'New Arrivals'}

            />
            <ScrollView
                style={{
                    flex: 1
                }}
                showsVerticalScrollIndicator={false}
            >
                <View
                    style={{
                        flexWrap: "wrap",
                        width: '100%',
                        flexDirection: "row",
                        justifyContent: "space-between",
                        padding: normalize(15)
                    }}
                >
                    {products.map((product, index) =>
                        
                        <ProductView01
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
        products: state.products,
        cart: state.cart
    }
}

const mapDispatchToProps = dispatch => ({
});


export default connect(mapStateToProps, mapDispatchToProps)(ViewProductsScreen);