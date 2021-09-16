import React from 'react';
import { FlatList, SafeAreaView, View } from 'react-native';
import normalize from 'react-native-normalize';
import { connect } from 'react-redux';
import AddressView from '../components/AddressView'
import { CustomHeader } from '../components/CustomHeader';
import { setCustomer } from '../redux/action/customer';
import { theme } from '../utils/theme';


function AddressesScreen({ navigation, customer, setCustomer }) {
    
    return (
        <SafeAreaView
            style={{
                flex: 1,
                backgroundColor: theme.colors.background
            }}
        >
            <CustomHeader navigation={navigation} title={"Saved Address"} />
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
                    keyExtractor={item => item.id}
                    style={{
                        width: '100%',
                        flex: 1,
                        alignSelf: "center"
                    }}
                    showsVerticalScrollIndicator={false}
                />
            </View>
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
