import React,{useState} from 'react';
import { FlatList, RefreshControl, SafeAreaView, Text, TouchableOpacity, View } from 'react-native';
import normalize from 'react-native-normalize';
import { connect } from 'react-redux';
import AddressView from '../components/AddressView'
import { CustomHeader } from '../components/CustomHeader';
import { setCustomer } from '../redux/action/customer';
import { theme } from '../utils/theme';


function AddressesScreen({ navigation, customer, setCustomer }) {
    const [refreshing, setRefreshing] = useState(false);
    const onRefresh = () => {
        setRefreshing(true);
        setRefreshing(false);
    }
    return (
        <SafeAreaView
            style={{
                flex: 1,
                backgroundColor: theme.colors.background
            }}
        >
            <CustomHeader navigation={navigation} title={"Saved Address"} />
            {customer.addresses.length > 0 ?
                <View
                    style={{
                        flex: 1,
                        padding: normalize(15)
                    }}
                >
                    <FlatList
                        data={customer.addresses}
                        renderItem={({ item }) => {
                            return <AddressView address={item} customer={customer} key={item.id} setCustomer={setCustomer} navigation={navigation} canEdit={false} />
                        }}

                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={onRefresh}
                            />
                        }

                        keyExtractor={item => item.id}
                        style={{
                            width: '100%',
                            flex: 1,
                            alignSelf: "center"
                        }}
                        showsVerticalScrollIndicator={false}
                    />
                </View> :
                <View
                    style={{
                        height: normalize(400),
                        alignItems: "center",
                        justifyContent: "center"
                    }}
                >
                    <Text
                        style={{
                            fontSize: theme.fontSize.heading,
                            fontWeight: theme.fontWeight.normal
                        }}
                    >
                        No Address Found :( 
                    </Text>
                    <TouchableOpacity
                        style={{
                            marginVertical: normalize(50)
                        }}
                        onPress={()=>{
                            navigation.navigate('AddAddressScreen',{toUpdateAddress: false});
                        }}
                    >
                        <Text
                            style={{
                                color: theme.colors.primary,
                                fontSize: theme.fontSize.medium,
                                textDecorationLine:"underline"
                            }}
                        >
                            Add Address
                        </Text>
                    </TouchableOpacity>
                </View>
            }
        </SafeAreaView>
    )
}

const mapStateToProps = (state) => ({
    customer: state.customer,
});

const mapDispatchToProps = (dispatch) => ({
    setCustomer: (user) => dispatch(setCustomer(user)),
});
export default connect(mapStateToProps, mapDispatchToProps)(AddressesScreen);
