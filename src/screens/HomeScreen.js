import React, { useEffect, useState, useRef } from 'react';
import { View, Text, SafeAreaView, FlatList, Image, TouchableOpacity, Dimensions, ScrollView, RefreshControl, TextInput, ActivityIndicator } from 'react-native';
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
import Footer from '../components/Footer';
const { width } = Dimensions.get('window');
import NetInfo from "@react-native-community/netinfo";


const HomeScreen = ({ categories, setCategories, navigation, products, setProducts, cart }) => {
  const [refreshing, setRefreshing] = useState(false);
  const listRef = useRef(null);
  const [contentVerticalOffset, setContentVerticalOffset] = useState(0);
  const CONTENT_OFFSET_THRESHOLD = 145;
  const [categoryIsLoading, setCategoryIsLoading] = useState(true);
  const [productIsLoading, setProductIsLoading] = useState(true);
  const [limit, setLimit] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isEnd, setIsEnd] = useState(false);
  const MAX_PRODUCT = 10;

  const onRefresh = () => {
    setRefreshing(true);
    getCategoriesHelper();
    getProductsHelper();
    setRefreshing(false);
  }
  useEffect(() => {
    // getCategoriesHelper();
    getProductsHelper();
    return () => {
      setContentVerticalOffset(0);
    }
  }, [limit]);

  /**
   * @description getting all categories and storing in redux
   * @returns void
   */
  const getCategoriesHelper = async () => {
    setCategoryIsLoading(true);
    const data = await getAllCategories();
    setCategoryIsLoading(false);
    if (data?.error) {
      console.log(data.error)
      console.log('----------Error Line 60 Home Screen----------');
      return;
    }
    const { custom_collections } = data;
    setCategories({ categories: custom_collections });
  }

  const getProductsHelper = async () => {
    if (isEnd === true) {
      return;
    }
    if (limit === 1) {
      setProductIsLoading(true);
    } else {
      setIsLoadingMore(true);
    }
    const data = await getAllProducts(limit * MAX_PRODUCT);
    if (limit === 1) {
      setProductIsLoading(false);
    } else {
      setIsLoadingMore(false);
    }
    if (data?.error) {
      console.log(data.error)
      console.log('----------Error Line 90 Home Screen----------');
      return;
    }
    if (data?.products?.length === products.length) {
      setIsEnd(true);
      return;
    }
    if (limit === 1) {
      setProducts(data);
    } else {
      if (data?.products?.length < ((limit - 1) * MAX_PRODUCT)) {
        setIsEnd(true);
        return;
      }
      const temp = data?.products?.slice((limit - 1) * MAX_PRODUCT, data?.products?.length);
      if (!temp) {
        setIsEnd(true);
        return;
      }
      if (data?.products?.length <= products.length + temp.length) {
        setIsEnd(true);
      }
      setProducts({ products: temp });

    }
  }

  const handleLoadMore = async () => {
    if (isEnd === false) {
      setLimit((previousLimit) => previousLimit + 1);
    }
  };


  const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
    const paddingToBottom = 30;
    return layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom;
  };
  
  
  useEffect(()=>{
    const unsubscribe = NetInfo.addEventListener(state => {
      if(state.isConnected === false){
        navigation.navigate('NetworkIssueScreen');
      }
    });
  });

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: theme.colors.background,
      }}
    >
      <View
        style={{
          // flex:1
          elevation: 1,
          shadowColor: theme.colors.primary,
          shadowOpacity: 1
        }}
      >
        {/* <Text
              style={{
                fontSize: theme.fontSize.title,
                fontWeight: theme.fontWeight.medium
              }}
            >
              PetInPick
            </Text> */}
        <Image
          source={{ uri: `https://cdn.shopify.com/s/files/1/0602/9036/7736/files/1280x720-new-pnp_190x@2x.png?v=1634032473` }}
          style={{
            height: normalize(40),
            width: '100%',
            marginVertical: normalize(15)
          }}
          resizeMode="contain"
        />
        {/* <Text
              style={{
                color: theme.colors.secondary,
                marginVertical: normalize(10),
                fontSize: theme.fontSize.paragraph
              }}
            >
              Welcome !
            </Text> */}
      </View>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('SearchScreen')
        }}
        style={{

        }}
      >
        <View
          style={{
            backgroundColor: theme.colors.bottomTabActiveBg,
            padding: normalize(15),
            marginBottom: normalize(10),
            borderRadius: normalize(8),
            width: "90%",
            alignSelf: "center",
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
            padding: 1,
            height: normalize(23),
            width: normalize(23),
            position: "absolute",
            right: normalize(35),
            top: normalize(13)
          }}
        />
      </TouchableOpacity>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{
          // padding: normalize(15),
          paddingHorizontal: normalize(15),
          paddingBottom: normalize(15),
          flex: 1,
        }}
        ref={listRef}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }

        scrollEventThrottle={16}

        onScroll={({ nativeEvent }) => {
          if (isCloseToBottom(nativeEvent)) {
            handleLoadMore();
          }
        }}
      // onThre={0.5}
      // onScroll={event => {
      //   setContentVerticalOffset(event.nativeEvent.contentOffset.y);
      // }}
      >
        {/* <View
          style={{
            width: '100%',
            flexDirection: "row"
          }}
        > */}


        {/* <TouchableOpacity
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
                right:-normalize(10),
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
          </TouchableOpacity> */}
        {/* </View> */}

        {/* <SubHeading>

          Collections
        </SubHeading> */}

        {/* <SkeletonContent
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
        </SkeletonContent> */}

        {/* <SubHeading>
          All Products
        </SubHeading> */}
        {/* <View
          style={{
            height: normalize(20),
            width: '100%'
          }}
        /> */}
        <SkeletonContent
          containerStyle={[
            productIsLoading && {
              marginVertical: normalize(30)
            },
            { width: '100%', flexDirection: "row" }]}
          layout={[
            {
              width: width / 2.24,
              height: normalize(220),
              key: 'imageLoader1',
              borderRadius: normalize(7),
              marginRight: normalize(10)
            },
            {
              width: width / 2.24,
              height: normalize(220),
              key: 'imageLoader2',
              marginRight: normalize(7),
              borderRadius: normalize(10),
            },
          ]}
          isLoading={productIsLoading}
        >

        </SkeletonContent>
        <SkeletonContent
          containerStyle={{ width: '100%', flexDirection: "row" }}
          layout={[
            {
              width: width / 2.24,
              height: normalize(220),
              key: 'imageLoader1',
              borderRadius: normalize(7),
              marginRight: normalize(10)
            },
            {
              width: width / 2.24,
              height: normalize(220),
              key: 'imageLoader2',
              marginRight: normalize(7),
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
              justifyContent: "space-between",
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
        {isLoadingMore === true && 
          <View
            style={{
              marginVertical: normalize(15)
            }}
          >
            <ActivityIndicator size={"large"} color={theme.colors.primary} />
          </View>
        }
        {/* {isEnd === true && 
          <Text
            style={{
              marginVertical: normalize(5),
              textAlign: "center",
              fontSize: theme.fontSize.medium,
              color: theme.colors.disabled
            }}
          >

          </Text>
        } */}
        <Footer
        />
        <View
          style={{
            height: normalize(20)
          }} />

      </ScrollView>
      {/* {contentVerticalOffset > CONTENT_OFFSET_THRESHOLD && (
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
      )} */}
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