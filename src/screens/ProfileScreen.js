import React, { useEffect, useState } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity } from 'react-native';
import normalize from 'react-native-normalize';
import { Subheading } from 'react-native-paper';
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
    console.log('working',data.customer)
    setIsLoading(false);
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: theme.colors.background
      }}
    >
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
            fontSize: theme.fontSize.medium,
            lineHeight: theme.fontSize.heading,
            color: "grey",
            marginTop: normalize(10)
          }}
        >
          {getGreetingsText()}
        </Text>
      </View>
      <View
        style={{
          padding: normalize(15)
        }}
      >
        <View
          style={{
            backgroundColor: theme.colors.white,
            borderColor: "#e3e3e3",
            borderWidth: 2,
            elevation: 2,
            borderRadius: normalize(10),
            padding: normalize(15),
            marginVertical: normalize(20),
          }}
        >
          <View
            style={{
              backgroundColor: theme.colors.primary,
              padding: normalize(12),
              width: normalize(60),
              height: normalize(60),
              borderRadius: normalize(60),
              alignItems: "center",
              justifyContent: "center",
              position: "absolute",
              top: -normalize(45),
              left: '45%'
            }}
          >
            <Text
              style={{
                fontSize: theme.fontSize.heading,
                color: theme.colors.white
              }}
            >
              {customer?.first_name.charAt(0)}{customer?.last_name.charAt(0)}
            </Text>
          </View>
          <View>
            <Text
              style={{
                fontSize: theme.fontSize.heading,
                textAlign: "center"
              }}
            >{customer?.first_name} {customer?.last_name}
            </Text>
            <Text
              style={{
                fontSize: theme.fontSize.medium,
                textAlign: "center",
                marginVertical: normalize(10)
              }}
            >
              {customer?.email}
            </Text>
            <Text
              style={{
                fontSize: theme.fontSize.medium,
                textAlign: "center",
                marginVertical: normalize(10)
              }}
            >
              {customer?.phone}
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-around",
              marginTop: normalize(10)
            }}
          >
            <View style={{ alignItems: "center" }}>
              <Text
                style={{
                  fontSize: theme.fontSize.paragraph,
                  fontWeight: theme.fontWeight.bold
                }}
              >
                View
              </Text>
              <TouchableOpacity
                onPress={()=>{
                  navigation.navigate('OrderTracking',{ fetchFromId: true, orderId : customer.last_order_id });
                }}
              >
                <Text
                  style={{
                    color: theme.colors.primary,
                    fontSize: theme.fontSize.paragraph,
                    marginTop: normalize(10),
                  }}
                >
                  Last Order
                </Text>
              </TouchableOpacity>
            </View>

            <View style={{ alignItems: "center" }}>
              <Text
                style={{
                  fontSize: theme.fontSize.paragraph,
                  fontWeight: theme.fontWeight.bold,
                }}
              >
                Total Orders
              </Text>
              <Text
                style={{
                  color: theme.colors.primary,
                  fontSize: theme.fontSize.paragraph,
                  marginTop: normalize(10),
                  textAlign: "center"
                }}
              >
                {customer?.orders_count || 0}
              </Text>
            </View>

          </View>
        </View>
        <View
          style={{ 
            width: '97%', 
            alignSelf: "center" ,
            borderBottomColor : "#e3e3e3",
            borderBottomWidth : 2,
            paddingBottom: normalize(15),
            borderRadius: normalize(12),
            elevation: 2
          }}

        >
          <Subheading
            style={{
              fontWeight: theme.fontWeight.bold,
              lineHeight: theme.lineHeight.medium,
              fontSize: theme.fontSize.paragraph
            }}
          >
            Default Address
          </Subheading>
          <Text style={{
            fontSize: normalize(15),
            lineHeight: theme.lineHeight.paragraph
          }}>
            {customer?.default_address?.address1},
            {customer?.default_address?.address2}
          </Text>

          <Text style={{
            fontSize: normalize(15),
            lineHeight: theme.lineHeight.paragraph,
            marginVertical: normalize(5)
          }}>
            {customer?.default_address?.city}, {customer?.default_address?.zip}
          </Text>
          <Text style={{
            fontSize: normalize(15),
            lineHeight: theme.lineHeight.paragraph
          }}>
            {customer?.default_address?.province}.
          </Text>
        </View>
      
          <View
          style={{
            // width: '95%',
            // alignSelf: "center",
            padding: normalize(10)
          }}
          >
            <TouchableOpacity
              style={{
                marginVertical: normalize(10),
                borderBottomWidth: 2,
                borderBottomColor: "#e3e3e3",
                paddingBottom: normalize(10)
              }}
              onPress={()=>{
                navigation.navigate('OrderScreen');
              }}
            >
              <Text
                style={{
                  fontSize: theme.fontSize.paragraph,
                  color: theme.colors.primary
                }}
              >
                My Orders
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                marginVertical: normalize(10),
                borderBottomWidth: 2,
                borderBottomColor: "#e3e3e3",
                paddingBottom: normalize(10)
              }}
            >
              <Text
                style={{
                  fontSize: theme.fontSize.paragraph,
                  color: theme.colors.primary
                }}
              >
                Log out
              </Text>
            </TouchableOpacity>
          </View>
          <Text
          style={{
            textAlign: "center",
            fontSize: theme.fontSize.paragraph,
            marginVertical: normalize(8),
            color: "#9e9e9e"
          }}
          >© Audy Global Enterprise 2021</Text>
      </View>
    </SafeAreaView>
  )
}

export default Profile;