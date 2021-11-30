import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  SafeAreaView, 
  TouchableOpacity, 
  ScrollView, 
  RefreshControl, 
  Image 
} from 'react-native';
import normalize from 'react-native-normalize';
import { connect } from 'react-redux';
import Footer from '../components/Footer';
import { icons } from '../constant';
import { theme } from '../utils/theme';



const Profile = ({ navigation, customer, cart, route }) => {

  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = () => {
    setRefreshing(true);
    setRefreshing(false);
  }
  const getGreetingsText = () => {
    const date = new Date();
    const hour = date.getHours();
    if (hour >= 5 && hour < 12) {
      return "Good morning";
    } else if (hour >= 12 && hour < 17) {
      return "Good afternoon";
    } else if ((hour >= 17 && hour <= 23) || hour < 5) {
      return "Good evening";

    }
  }

  const logoutHandler = async () => {
    await AsyncStorage.removeItem('user');
    await AsyncStorage.removeItem('checkoutId');
    navigation.navigate('SplashScreen');
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
        showsVerticalScrollIndicator={false}
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
      <ScrollView
        style={{
          padding: normalize(15)
        }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
      >
        <View
          style={{
            height: normalize(15)
          }}
        >

        </View>
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
              left: '45%',
              zIndex: 1
            }}
          >

            <Text
              style={{
                fontSize: theme.fontSize.heading,
                color: theme.colors.white,
                textTransform: "uppercase"
              }}
            >
              {customer?.first_name?.charAt(0)}{customer?.last_name?.charAt(0)}
            </Text>

          </View>
          <View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <Text
                style={{
                  fontSize: theme.fontSize.heading,
                  textAlign: "center"
                }}
              >
                {customer?.first_name} {customer?.last_name}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('EditProfileScreen')
                }}

              >
                <Image
                  source={icons?.EDIT}
                  style={{
                    padding: normalize(1),
                    height: normalize(20),
                    width: normalize(20),
                    marginLeft: normalize(20)
                  }}
                />
                {/* <List.Icon icon="circle-edit-outline" color={theme.colors.secondary} /> */}
              </TouchableOpacity>
            </View>

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
            {/* <View style={{ alignItems: "center" }}>
              <Text
                style={{
                  fontSize: theme.fontSize.paragraph,
                  fontWeight: theme.fontWeight.bold
                }}
              >
                View
              </Text>

              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('OrderTrackingScreen', { fetchFromId: true, orderId: customer.last_order_id });
                }}
                disabled={!customer.last_order_id}
              >
                <Text
                  style={[{
                    fontSize: theme.fontSize.paragraph,
                    marginTop: normalize(10),
                  }
                    , customer.last_order_id ? { color: theme.colors.primary } : { color: theme.colors.disabled }]}
                >
                  Last Order
                </Text>
              </TouchableOpacity>
            </View> */}

            {/* <View style={{ alignItems: "center" }}>
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
                  textAlign: "center",
                  fontWeight: theme.fontWeight.bold
                }}
              >
                {customer?.orders_count || 0}
              </Text>
            </View> */}

          </View>
        </View>
        <View
          style={{
            width: '97%',
            alignSelf: "center",
            borderBottomColor: "#e3e3e3",
            borderBottomWidth: 2,
            paddingBottom: normalize(15),
            borderRadius: normalize(12),
          }}

        >
          {customer?.default_address &&
            <View
              style={{
                flexDirection: "row",
                marginBottom: normalize(10)
              }}
            >
              <Text
                style={{
                  fontWeight: theme.fontWeight.bold,
                  lineHeight: theme.lineHeight.medium,
                  fontSize: theme.fontSize.paragraph
                }}
              >
                Default Address
              </Text>
              <TouchableOpacity
                style={{
                  backgroundColor: theme.colors.secondary,
                  padding: normalize(5),
                  marginLeft: normalize(7),
                  borderRadius: normalize(5),
                  justifyContent: "center"
                }}
                onPress={() => {
                  navigation.navigate('AddressesScreen');
                }}
              >
                <Text
                  style={{
                    color: theme.colors.white,
                    fontWeight: theme.fontWeight.medium,
                    fontSize: 11
                  }}
                >
                  View All
                </Text>
              </TouchableOpacity>
            </View>
          }
          {customer?.default_address ?
            <>
              <Text
                style={{
                  fontSize: normalize(15),
                  lineHeight: theme.lineHeight.paragraph
                }}
              >
                {customer?.default_address?.address1},
                {customer?.default_address?.address2}
              </Text>
              <Text
                style={{
                  fontSize: normalize(15),
                  lineHeight: theme.lineHeight.paragraph,
                  marginVertical: normalize(5)
                }}
              >
                {customer?.default_address?.city}, {customer?.default_address?.zip}
              </Text>
              <Text
                style={{
                  fontSize: normalize(15),
                  lineHeight: theme.lineHeight.paragraph
                }}
              >
                {customer?.default_address?.province}.
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  marginVertical: normalize(10)
                }}
              >
                {/* <TouchableOpacity
                onPress={()=>{
                  navigation.navigate('AddAddressScreen',{address:customer?.default_address, toUpdateAddress:true})
                }}
                style={{
                  padding: normalize(2),
                }}
              >
                <Text
                  style={{
                    color: theme.colors.primary,
                    fontSize: theme.fontSize.paragraph,
                    marginRight: normalize(10)
                  }}
                >
                  Edit Address
                </Text>
              </TouchableOpacity> */}
                {/* <TouchableOpacity
                style={{
                  padding: normalize(2),
                }}
                onPress={deleteAddressHandler}
                disabled={isLoading}
              >
              <Text
                  style={{
                    color: "red",
                    fontSize: theme.fontSize.paragraph,
                    marginRight: normalize(10)
                  }}
                >
                  Delete
                </Text>
              </TouchableOpacity> */}
              </View>
            </>
            :
            // <View
            //   style={{
            //     alignItems: "center",
            //     justifyContent: "center",
            //     marginVertical: normalize(15),
            //   }}
            // >
            //   <Text
            //     style={{
            //       fontSize: theme.fontSize.paragraph,
            //       color: "grey"
            //     }}
            //   >
            //     Not Available
            //   </Text>
            // </View>
            <></>
          }
        </View>
        <View
          style={{
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
            onPress={() => {
              navigation.navigate('OrdersScreen');
            }}
          >
            <Text
              style={{
                fontSize: theme.fontSize.paragraph,
                color: theme.colors.secondary
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
            onPress={() => {
              navigation.navigate('AddAddressScreen', { toUpdateAddress: false });

            }}
          >
            <Text
              style={{
                fontSize: theme.fontSize.paragraph,
                color: theme.colors.secondary
              }}
            >
              Add Address
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              marginVertical: normalize(10),
              borderBottomWidth: 2,
              borderBottomColor: "#e3e3e3",
              paddingBottom: normalize(10)
            }}
            onPress={() => {
              navigation.navigate('CartScreen')
              navigation.navigate('BottomTab', {
                screen: 'CartScreen',
                
                params: { previous_screen: route?.name, params: route?.params }
            }, 'CartScreen');
            }}
          >
            <Text
              style={{
                fontSize: theme.fontSize.paragraph,
                color: theme.colors.secondary
              }}
            >
              My Cart ({cart?.count || 0})
            </Text>
          </TouchableOpacity>
          {/* <TouchableOpacity
            style={{
              marginVertical: normalize(10),
              borderBottomWidth: 2,
              borderBottomColor: "#e3e3e3",
              paddingBottom: normalize(10)
            }}
            onPress={() => {
              navigation.navigate('OrdersScreen');
            }}
          >
            <Text
              style={{
                fontSize: theme.fontSize.paragraph,
                color: theme.colors.primary
              }}
            >
              View All Saved Address
            </Text>
          </TouchableOpacity> */}
          <TouchableOpacity
            style={{
              marginVertical: normalize(10),
              borderBottomWidth: 2,
              borderBottomColor: "#e3e3e3",
              paddingBottom: normalize(10)
            }}
            onPress={()=>{
              navigation.navigate('SettingScreen');
            }}
          >
            <Text
              style={{
                fontSize: theme.fontSize.paragraph,
                color: theme.colors.secondary
              }}
            >
              Store Policy
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              marginVertical: normalize(10),
              borderBottomWidth: 2,
              borderBottomColor: "#e3e3e3",
              paddingBottom: normalize(10)
            }}
            onPress={logoutHandler}
          >
            <Text
              style={{
                fontSize: theme.fontSize.paragraph,
                color: theme.colors.secondary
              }}
            >
              Log out
            </Text>
          </TouchableOpacity>
        </View>
        {/* <Footer /> */}
        <View
          style={{
            height: normalize(30)
          }}
        />
      </ScrollView>
    </SafeAreaView>
  )
}

const mapStateToProps = (state) => ({
  customer: state.customer,
  cart: state.cart
});

// const mapDispatchToProps = (dispatch) => ({
//   setCustomer: (user) => dispatch(setCustomer(user)),
// });

export default connect(mapStateToProps, null)(Profile);