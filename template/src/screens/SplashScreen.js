import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect } from 'react';
import { Text, SafeAreaView, Image, View } from 'react-native';
import { connect } from 'react-redux';
import { setCart } from '../redux/action/cart';
import { setCustomer } from '../redux/action/customer';
import { client } from '../services';
import { getCustomerById } from '../services/customer';
import { theme } from '../utils/theme';
import normalize from 'react-native-normalize';
import Footer from '../components/Footer';
import { images } from '../constant';

const SplashScreen = ({ navigation, setCustomer, setCart }) => {
  useEffect(async () => {
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
          setCart({ cart: cartItem });
        } else {
          const cartItem = {
            count: 0,
          }
          setCart({ cart: cartItem });
        }
        setCustomer({ ...data });
        navigation.reset({
          index: 0,
          routes: [{ name: 'BottomTab' }],
        });
      } else {
        navigation.reset({
          index: 0,
          routes: [{ name: 'LoginScreen' }],
        });
      }
    } catch (error) {
      console.error(error);
    }
  }, []);
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: theme.colors.background,
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      <Image
        source={images?.LOGO}
        style={{
          height: normalize(52),
          width: '100%',
        }}
        resizeMode="contain"
      />
      <Text
        style={{
          fontWeight: theme.fontWeight.medium,
          lineHeight: theme.lineHeight.subheading,
          fontSize: theme.fontSize.subheading,
          textAlign: "center",
          marginVertical: normalize(25),
          color: theme.colors.unfocused
        }}
      >
        Pet Lover's Favorite
      </Text>
      <View
        style={{
          position: "absolute",
          bottom: normalize(50),
          width: '90%',alignSelf: "center"
        }}
      >
        <Footer />
      </View>
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