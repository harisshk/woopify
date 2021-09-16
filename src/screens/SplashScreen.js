import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect } from 'react';
import { View , Text, SafeAreaView } from 'react-native';
import { connect } from 'react-redux';
import { setCustomer } from '../redux/action/customer';
import { getCustomerById } from '../services/customer';
import { theme } from '../utils/theme';

const SplashScreen = ({navigation, setCustomer}) => {
    useEffect(async() => {
      try {
        const user = await AsyncStorage.getItem('user');
        if (user !== null) {
          const parsedUser = JSON.parse(user);
          const data = await getCustomerById(parsedUser.id);
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
      <Text
        style={{
          fontWeight: theme.fontWeight.bold,
          lineHeight: theme.lineHeight.heading,
          fontSize: theme.fontSize.heading,
          textAlign: "center"
        }}
      >
        Shopify Connect
      </Text>
    </SafeAreaView>
  )
}


const mapStateToProps = (state) => ({
  customer: state.customer,
});

const mapDispatchToProps = (dispatch) => ({
  setCustomer: (customer) => dispatch(setCustomer(customer)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SplashScreen);