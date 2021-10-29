import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect } from 'react';
import { Text, SafeAreaView, Image } from 'react-native';
import { connect } from 'react-redux';
import { setCart } from '../redux/action/cart';
import { setCustomer } from '../redux/action/customer';
import { client } from '../services';
import { getCustomerById } from '../services/customer';
import { theme } from '../utils/theme';
import normalize from 'react-native-normalize';

const SplashScreen = ({navigation, setCustomer, setCart}) => {
    useEffect(async() => {
      try {
        const user = await AsyncStorage.getItem('user');
        if (user !== null) {
          const parsedUser = JSON.parse(user);
          const data = await getCustomerById(parsedUser.id);
          const temp = await AsyncStorage.getItem('checkoutId');
          if (temp !== null) {
              const checkout = await client.checkout.fetch(JSON.parse(temp));
              const cartItem = {
                count: checkout?.lineItems?.length,
              };
              setCart({cart : cartItem});
          }else{
            const cartItem = {
              count: 0,
            }
            setCart({cart : cartItem});
          }
          setCustomer({...data});
          navigation.reset({
            index: 0,
            routes: [{ name: 'BottomTab' }],
          });
        }else{
          navigation.reset({
            index: 0,
            routes: [{ name: 'LoginScreen' }],
          });
        }
      } catch (error) {
        console.error(error);
      }
    },[]);
  return(
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: theme.colors.background,
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      {/* <Text
        style={{
          fontWeight: theme.fontWeight.bold,
          lineHeight: theme.lineHeight.heading,
          fontSize: theme.fontSize.heading,
          textAlign: "center"
        }}
      >
        Shopify Connect
      </Text> */}
      <Image
          source={{ uri: `https://cdn.shopify.com/s/files/1/0602/9036/7736/files/1280x720-new-pnp_190x@2x.png?v=1634032473` }}
          style={{
            height: normalize(50),
            width: '100%',
            shadowColor: theme.colors.primary,
            shadowOpacity: 2
          }}
          resizeMode="contain"
        />
    </SafeAreaView>
  )
}


const mapStateToProps = (state) => ({
  customer: state.customer,
});

const mapDispatchToProps = (dispatch) => ({
  setCustomer: (customer) => dispatch(setCustomer(customer)),
  setCart: (cart) => dispatch(setCart(cart))
});

export default connect(mapStateToProps, mapDispatchToProps)(SplashScreen);