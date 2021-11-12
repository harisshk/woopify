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
import { icons, images } from '../constant';
import Carousel from 'react-native-banner-carousel';
import BannerView from '../components/BannerView';



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

  const banners = [
    {
      src: images?.BANNER_1,
      text1: `Pet Lover's Favorite`,
      text2: `Best gift = Happiness`,
      screen: `ViewProductsScreen`
    }, {
      src: images?.BANNER_2,
      text1: `Real Fun Just Started`,
      text2: `Surprise Your Pet`,
      screen: `ViewProductsScreen`
    }
  ];

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
    const data = await getAllProducts();
    setProducts(data);
    setIsEnd(true);
    setIsLoadingMore(false);
    setProductIsLoading(false);
    return;
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


  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      if (state.isConnected === false) {
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

        <Image
          source={images?.LOGO}
          style={{
            height: normalize(40),
            width: '100%',
            marginVertical: normalize(15)
          }}
          resizeMode="contain"
        />

      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{
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

      >
        <Carousel
          autoplay
          autoplayTimeout={5000}
          loop
          index={0}
          pageSize={width}
        >
          {
            banners.map((image, index) => {
              return (
                <BannerView
                  key={index + ""}
                  item={image?.src}
                  text1={image?.text1}
                  text2={image?.text2}
                  navigation={navigation}
                  screen={image?.screen}
                />
              )
            })
          }

        </Carousel>
        <Image
          source={images?.HELPER_1}
          style={{
            height: normalize(200),
            width: '100%',
            backgroundColor: theme.colors.backgroundColor,
          }}
          resizeMode="contain"
        />
        <Text
          style={{
            fontSize: theme.fontSize.subheading,
            lineHeight: theme.lineHeight.heading,
            textAlign: "center"
          }}
        >
          Specially Curated Collection
        </Text>
        <View
          style={{
            height: normalize(5),
            backgroundColor: theme.colors.primary,
            width: normalize(50),
            alignSelf: "center",
            marginTop: normalize(10)
          }}
        />
        
        {
          categories.map(item => {
            return(
              <CategoryHomeScreen
              key={item.id}
              item={item}
              navigation={navigation}
            />
            )
          })
        }

        <Text
          style={{
            fontSize: theme.fontSize.subheading,
            lineHeight: theme.lineHeight.heading,
            textAlign: "center"
          }}
        >
          New Arrivals
        </Text>
        <View
          style={{
            height: normalize(5),
            backgroundColor: theme.colors.primary,
            width: normalize(50),
            alignSelf: "center",
            marginTop: normalize(10)
          }}
        />
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
            index <= 6 && 
            <ProductView01
              key={product.id}
              item={product}
              navigation={navigation}
            />
          )}
        </View>

        <Footer
        />

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
    products: state.products,
    cart: state.cart
  }
}

const mapDispatchToProps = dispatch => ({
  setCategories: response => dispatch(setCategories(response)),
  setProducts: response => dispatch(setProducts(response)),
});


export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);