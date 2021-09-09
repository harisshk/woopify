import React, { useEffect, useState } from 'react';
import { View, Text, SafeAreaView } from 'react-native';
import normalize from 'react-native-normalize';
import { customerId } from '../services';
import { getCustomerById } from '../services/customer';
import { theme } from '../utils/theme';



const Profile = ({ navigation }) => {
  const [customer, setCustomer] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    getCustomerInfo();
  }, []);

  let getGreetingsText = () => {
    let date = new Date();
    const hour = date.getHours();
    if (hour >= 5 && hour < 12) {
      return "Good morning";
    } else if (hour >= 12 && hour < 17) {
      return "Good afternoon";
    } else if ((hour >= 17 && hour <= 23) || hour < 5) {
      return "Good evening";
    
  }
  }

  let getCustomerInfo = async () => {
    setIsLoading(true);
    let data = await getCustomerById(customerId);
    setCustomer({ ...data.customer });
    console.log(data, '--')
    setIsLoading(false);
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: theme.colors.background
      }}
    >

      {/* <Text>Profile Screen</Text> */}
      <View
      style={{
        padding: normalize(15)
      }}
      >

        <Text
          style={{
            fontSize: theme.fontSize.heading,
            fontWeight: theme.fontWeight.medium
          }}
        >
          Hey {customer?.first_name}
        </Text>
        <Text
        style={{
          fontSize : theme.fontSize.medium,
          lineHeight: theme.fontSize.heading,
          color: "grey",
          marginTop: normalize(10)
        }}
        >
          {getGreetingsText()}
        </Text>
      </View>
    </SafeAreaView>
  )
}

export default Profile;