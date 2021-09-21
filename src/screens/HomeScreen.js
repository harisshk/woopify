import React, { useEffect, useState } from 'react';
import { View, Text, SafeAreaView, FlatList, Image, TouchableOpacity, Dimensions, ScrollView, RefreshControl } from 'react-native';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';

import { setCategories } from '../redux/action/categories';
import { setProducts } from '../redux/action/products'
import { getAllCategories } from '../services/categories';
import { theme } from '../utils/theme';
import normalize from 'react-native-normalize';
import CategoryHomeScreen from '../components/CategoryHomeScreen';
import { getAllProducts } from '../services/products';
import SubHeading from '../components/SubHeading';
import ProductView01 from '../components/ProductView01';
import { client } from '../services';
import { List } from 'react-native-paper';
import SkeletonContent from 'react-native-skeleton-content-nonexpo';
const { width } = Dimensions.get('window');

const wait = (timeout) => {
  return new Promise(resolve => setTimeout(resolve, timeout));
}

const HomeScreen = ({ categories, setCategories, navigation, products, setProducts }) => {
  const [refreshing, setRefreshing] = useState(false);

  const [categoryIsLoading, setCategoryIsLoading] = useState(true);
  const [productIsLoading, setProductIsLoading] = useState(true);

  const onRefresh = () => {
    setRefreshing(true);
    getCategoriesHelper();
    getProductsHelper();
    setRefreshing(false);
  }
  useEffect(() => {
    getCategoriesHelper();
    getProductsHelper();
  }, []);

  /**
   * @description getting all categories and storing in redux
   * @returns void
   */
  let getCategoriesHelper = async () => {
    // client.collection.fetchAllWithProducts().then((collections) => {
    //   // Do something with the collections
    //   let data = Object.assign({}, { collections: collections })
    //   console.log(data);
    //   setCategories({ categories: data.collections })
    // });
    setCategoryIsLoading(true);
    let data = await getAllCategories();

    setCategoryIsLoading(false);
    if (data?.error) {
      console.log(data.error)
      console.log('----------Error Line 8 Home Screen----------');
      return;
    }
    const { custom_collections } = data;
    setCategories({ categories: custom_collections });
  }

  let getProductsHelper = async () => {
    // client.product.fetchAll().then((products) => {
    //   let data = Object.assign({}, { products: products });

    //   setProducts(data)
    // });

    setProductIsLoading(true);
    let data = await getAllProducts();

    setProductIsLoading(false);
    if (data?.error) {
      console.log(data.error)
      console.log('----------Error Line 8 Home Screen----------');
      return;
    }
    setProducts(data);
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: theme.colors.background,
      }}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{
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
            width: '100%',
            flexDirection: "row"
          }}
        >
          <View>
            <Text
              style={{
                fontSize: theme.fontSize.title,
                fontWeight: theme.fontWeight.medium
              }}
            >
              Shopify Connect
            </Text>
            <Text
              style={{
                color: theme.colors.secondary,
                marginVertical: normalize(8),
                fontSize: theme.fontSize.paragraph
              }}
            >
              Welcome !
            </Text>
          </View>
          <TouchableOpacity
            style={{
              flex: 1,
            }}
            onPress={() => {
              navigation.navigate('CartScreen');
            }}
          >
            <Image
              source={{ uri: "https://user-images.githubusercontent.com/54505967/132634830-0cbb53d4-7ed9-456f-be7a-8429fc514a15.png" }}
              resizeMode="contain"
              style={{
                width: 35,
                height: 40,
                alignSelf: "flex-end",
              }}
            />

          </TouchableOpacity>
        </View>
        <SubHeading>

          Collections
        </SubHeading>

        <SkeletonContent
          containerStyle={{ width: '100%', flexDirection: "row" }}
          isLoading={categoryIsLoading}
          layout={[
            {
              width: normalize(70),
              height: 70,
              key: 'imageLoader1',
              borderRadius: normalize(80),
              marginRight: normalize(10)
            },
            {
              width: normalize(70),
              height: 70,
              key: 'imageLoader2',
              marginRight: normalize(10),
              borderRadius: normalize(80),
            },
            {
              width: normalize(70),
              height: 70,
              key: 'imageLoader3',
              borderRadius: normalize(80),
              marginRight: normalize(10),
            },
            {
              width: normalize(70),
              height: 70,
              key: 'imageLoader4',
              marginRight: normalize(10),
              borderRadius: normalize(80),
            },
          ]}
        >
          <FlatList
            horizontal
            data={categories}
            style={{
              marginBottom: normalize(7)
            }}
            renderItem={({ item }) =>
              <CategoryHomeScreen
                item={item}
                navigation={navigation}
              />
            }
            keyExtractor={(item) => item.id}
          />
        </SkeletonContent>
        <SubHeading>
          All Products
        </SubHeading>
        <SkeletonContent
          containerStyle={{ width: '100%', flexDirection: "row" }}
          isLoading={true}
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
          isLoading={productIsLoading}
        >
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
                key={product.id}
                item={product}
                navigation={navigation}
              />
            )}
          </View>
        </SkeletonContent>
        <View
          style={{
            height: normalize(20)
          }} />

      </ScrollView>

    </SafeAreaView>
  )
}

const mapStateToProps = state => {
  return {
    categories: state.categories,
    products: state.products
  }
}

const mapDispatchToProps = dispatch => ({
  setCategories: response => dispatch(setCategories(response)),
  setProducts: response => dispatch(setProducts(response)),
});


export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);