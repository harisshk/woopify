import React, { useEffect, useState, useRef } from 'react';
import { View, Text, SafeAreaView, FlatList, Image, TouchableOpacity, Dimensions, ScrollView, RefreshControl, TextInput } from 'react-native';
import { connect } from 'react-redux';
import { setCategories } from '../redux/action/categories';
import { setProducts } from '../redux/action/products'
import { getAllCategories } from '../services/categories';
import { theme } from '../utils/theme';
import normalize from 'react-native-normalize';
import CategoryHomeScreen from '../components/CategoryHomeScreen';
import { getAllProducts } from '../services/products';
import SubHeading from '../components/SubHeading';
import ProductView01 from '../components/ProductView01';
import SkeletonContent from 'react-native-skeleton-content-nonexpo';
import { client } from '../services';
const { width } = Dimensions.get('window');

const HomeScreen = ({ categories, setCategories, navigation, products, setProducts, cart }) => {
  const [refreshing, setRefreshing] = useState(false);

  const listRef = useRef(null);

  const [contentVerticalOffset, setContentVerticalOffset] = useState(0);
  const CONTENT_OFFSET_THRESHOLD = 145;
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
    return () => {
      setContentVerticalOffset(0);
    }
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
    const data = await getAllCategories();

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
        ref={listRef}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
        onScroll={event => {
          setContentVerticalOffset(event.nativeEvent.contentOffset.y);
        }}
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
                width: normalize(30),
                height: normalize(35),
                alignSelf: "flex-end",
              }}
            />
            <View
              style={{
                height: normalize(20),
                width: normalize(20),
                elevation: 2,
                position: "absolute",
                right:-normalize(8),
                backgroundColor: theme.colors.primary,
                borderRadius: normalize(20),
                alignItems: "center", justifyContent: "center",
                top: -normalize(3)
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
        </View>
        <TouchableOpacity
          onPress={()=>{
            navigation.navigate('SearchScreen')
          }}
        >
          <View
            style={{
              backgroundColor: theme.colors.bottomTabActiveBg,
              padding: normalize(15),
              marginTop: normalize(15),
              borderRadius: 10,
            }}
          >
            <Text
              style={{
                fontWeight: theme.fontWeight.medium,
                fontSize: theme.fontSize.paragraph
              }}
            >
              Search...
            </Text>
          </View>
          <Image
            source={require('../assets/images/search.png')}
            style={{
              padding:1,
              height: normalize(23),
              width:normalize(23),
              position: "absolute",
              right: normalize(20),
              top: normalize(29)
            }}
          />
        </TouchableOpacity>
        <SubHeading>

          Collections
        </SubHeading>

        <SkeletonContent
          containerStyle={{ width: '100%', flexDirection: "row" }}
          isLoading={categoryIsLoading}
          layout={[
            {
              width: normalize(70),
              height: normalize(70),
              key: 'imageLoader1',
              borderRadius: normalize(80),
              marginRight: normalize(10)
            },
            {
              width: normalize(70),
              height: normalize(70),
              key: 'imageLoader2',
              marginRight: normalize(10),
              borderRadius: normalize(80),
            },
            {
              width: normalize(70),
              height: normalize(70),
              key: 'imageLoader3',
              borderRadius: normalize(80),
              marginRight: normalize(10),
            },
            {
              width: normalize(70),
              height: normalize(70),
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
            showsHorizontalScrollIndicator={false}
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
      {contentVerticalOffset > CONTENT_OFFSET_THRESHOLD && (
        <TouchableOpacity
          style={{
            position: 'absolute',
            bottom: normalize(15),
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
      )}
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
  setCategories: response => dispatch(setCategories(response)),
  setProducts: response => dispatch(setProducts(response)),
});


export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);