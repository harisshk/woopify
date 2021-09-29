import React, { useState } from 'react'
import { KeyboardAvoidingView, SafeAreaView, ScrollView, Text, View, TouchableOpacity, ActivityIndicator } from 'react-native'
import normalize from 'react-native-normalize'
import { Checkbox } from 'react-native-paper'
import { addNewAddress, getCustomerById, updateAddress, updateCustomerProfile } from '../services/customer'
import { theme } from '../utils/theme';
import Toast from 'react-native-simple-toast'
import { connect } from 'react-redux'
import { setCustomer } from '../redux/action/customer';
import { TextInput } from 'react-native-paper'
import { CustomHeader } from '../components/CustomHeader'


function AddAddressScreen({ navigation, customer, setCustomer, route }) {
    const { toUpdateAddress, address } = route.params;
    const [input, setInput] = useState({
        phone: { value: toUpdateAddress ? address?.phone : "", error: "" },
        firstName: { value: toUpdateAddress ? address?.first_name : "", error: "" },
        lastName: { value: toUpdateAddress ? address?.last_name : "", error: "" },
        address1: { value: toUpdateAddress ? address?.address1 : "", error: "" },
        address2: { value: toUpdateAddress ? address?.address2 : "", error: "" },
        city: { value: toUpdateAddress ? address?.city : "", error: "" },
        province: { value: toUpdateAddress ? address?.province : "", error: "" },
        country: { value: toUpdateAddress ? address?.country : "United States", error: "" },
        zip: { value: toUpdateAddress ? address?.zip : "", error: "" },
        default: toUpdateAddress ? address?.default : true,
        isLoading: false
    });

    const changeText = (field, text) => {
        setInput({
            ...input,
            [field]: {
                ...input[field],
                value: text
            }
        });
    };

    const addAddressHandler = async () => {
        try {
            setInput({
                ...input,
                isLoading: true
            });
            const address1 = input.address1.value.trim();
            const address2 = input.address2.value.trim();
            const city = input.city.value.trim();
            const province = input.province.value.trim();
            const phone = input.phone.value.trim();
            const first_name = input.firstName.value.trim();
            const last_name = input.lastName.value.trim();
            const zip = input.zip.value.trim();
            const country = input.country.value.trim();
            if (!address1) {
                setInput({
                    ...input,
                    isLoading: false,
                });
                Toast.show('Address Line 1 Missing');
                return;
            }
            if (!city) {
                setInput({
                    ...input,
                    isLoading: false,
                });
                Toast.show('City Field is Missing');
                return;
            }
            if (!province) {
                setInput({
                    ...input,
                    isLoading: false,
                });
                Toast.show('Province Field is Missing');
                return;
            }
            if (!phone) {
                setInput({
                    ...input,
                    isLoading: false,
                });
                Toast.show('Phone Number Field is Missing');
                return;
            }
            if (!zip) {
                setInput({
                    ...input,
                    isLoading: false,
                });
                Toast.show('Zip Code Field is Missing');
                return;
            }
            if (!country) {
                setInput({
                    ...input,
                    isLoading: false,
                });
                Toast.show('Country Field is Missing');
                return;
            }
            if (!last_name) {
                setInput({
                    ...input,
                    isLoading: false,
                });
                Toast.show('Last Name Field is Missing');
                return;
            }
            if (!first_name) {
                setInput({
                    ...input,
                    isLoading: false,
                });
                Toast.show('First Name Field is Missing');
                return;
            }
            const body = {
                address: {
                    address1: address1,
                    address2: address2,
                    city: city,
                    province: province,
                    phone: phone,
                    last_name: last_name,
                    first_name: first_name,
                    zip: zip,
                    country: country,
                    default: input.default
                }
            };
            const response = await addNewAddress(customer.id, body);
            if (response?.errors) {
                const { errors } = response;
                for (const field in errors) {
                    Toast.show(`${field} ${errors[field]}`);
                    setInput({
                        ...input,
                        [field]: {
                            ...input[field],
                            error: `${field} ${errors[field]}`
                        },
                        isLoading: false
                    });
                    return;
                }
            }else{
                setInput({
                    ...input,
                    isLoading: false
                });
                const body = {
                    customer:{
                        address
                    }
                }
                const response = await updateCustomerProfile(customer.id, body);
                const data = await getCustomerById(customer.id);
                setCustomer({ ...data });
                navigation.replace('AddressesScreen');
            }

        } catch (error) {
            console.log(error);
            console.log('-------------------AddAddressScreen Line 54----------------------');
            setInput({
                ...input,
                isLoading: false
            });
        }
    };

    const updateAddressHandler = async () => {
        try {
            setInput({
                ...input,
                isLoading: true
            });
            const address1 = input.address1.value.trim();
            const address2 = input.address2.value.trim();
            const city = input.city.value.trim();
            const province = input.province.value.trim();
            const phone = input.phone.value.trim();
            const first_name = input.firstName.value.trim();
            const last_name = input.lastName.value.trim();
            const zip = input.zip.value.trim();
            const country = input.country.value.trim();
            if (!address1) {
                setInput({
                    ...input,
                    isLoading: false,
                });
                Toast.show('Address Line 1 Missing');
                return;
            }
            if (!city) {
                setInput({
                    ...input,
                    isLoading: false,
                });
                Toast.show('City Field is Missing');
                return;
            }
            if (!province) {
                setInput({
                    ...input,
                    isLoading: false,
                });
                Toast.show('Province Field is Missing');
                return;
            }
            if (!phone) {
                setInput({
                    ...input,
                    isLoading: false,
                });
                Toast.show('Phone Number Field is Missing');
                return;
            }
            if (!zip) {
                setInput({
                    ...input,
                    isLoading: false,
                });
                Toast.show('Zip Code Field is Missing');
                return;
            }
            if (!country) {
                setInput({
                    ...input,
                    isLoading: false,
                });
                Toast.show('Country Field is Missing');
                return;
            }
            if (!last_name) {
                setInput({
                    ...input,
                    isLoading: false,
                });
                Toast.show('Last Name Field is Missing');
                return;
            }
            if (!first_name) {
                setInput({
                    ...input,
                    isLoading: false,
                });
                Toast.show('First Name Field is Missing');
                return;
            }
            const body = {
                address: {
                    id: address.id,
                    address1: address1,
                    address2: address2,
                    city: city,
                    province: province,
                    phone: phone,
                    first_name: first_name,
                    last_name:last_name,
                    zip: zip,
                    country: country,
                    default: input.default
                }
            };
            const response = await updateAddress(customer.id, address.id, body);
            
            if (response?.errors) {
                const { errors } = response;
                for (const field in errors) {
                    Toast.show(`${field} ${errors[field]}`);
                    setInput({
                        ...input,
                        [field]: {
                            ...input[field],
                            error: `${field} ${errors[field]}`
                        },
                        isLoading: false
                    });
                    return;
                }
            }else{
                setInput({
                    ...input,
                    isLoading: false
                });
                const data = await getCustomerById(customer.id);
                setCustomer({ ...data });
                navigation.goBack();
            }

        } catch (error) {
            console.log(error);
            console.log('-------------------AddAddressScreen Line 54----------------------');
            setInput({
                ...input,
                isLoading: false
            });
        }
    };

    return (
        <SafeAreaView
            style={{
                flex: 1,
                backgroundColor: theme.colors.background
            }}
        >
            <CustomHeader navigation={navigation} title={toUpdateAddress === true ? "Update Address" : "Add New Address"} />
            <KeyboardAvoidingView
                style={{
                    paddingBottom: normalize(15),
                    paddingHorizontal: normalize(15),
                    flex: 1,
                }}
                behavior="padding"
            >
                <ScrollView
                    style={{
                        flex: 1,
                    }}
                    contentContainerStyle={{
                        flexGrow: 1
                    }}
                    showsVerticalScrollIndicator={false}
                >
                    <View
                        style={{
                            padding: normalize(15),
                            backgroundColor: "#e6e6e6",
                            borderRadius: normalize(5)
                        }}
                    >
                    <Text
                        style={{
                            marginBottom: normalize(15),
                            fontSize: theme.fontSize.medium,
                            fontWeight: theme.fontWeight.normal
                        }}
                    >
                        Customer Info
                    </Text>
                    <TextInput
                        value={input.firstName.value}
                        onChangeText={(text) => {
                            changeText('firstName', text);
                        }}
                        error={input.firstName.error}
                        keyboardType="default"
                        autoCapitalize="words"
                        autoCorrect={true}
                        autoCompleteType="username"
                        label="First Name"
                        style={{
                            backgroundColor: "#fafafa",
                            borderRadius: normalize(12)
                        }}
                        maxLength={35}
                    />
                    <Text
                        style={{
                            color: "red",
                            textTransform: "capitalize",
                            marginLeft: normalize(6),
                            marginVertical: normalize(10)
                        }}
                    >
                        {input.firstName.error}
                    </Text>
                    <TextInput
                        value={input.lastName.value}
                        onChangeText={(text) => {
                            changeText('lastName', text);
                        }}
                        error={input.lastName.error}
                        keyboardType="default"
                        autoCapitalize="words"
                        autoCorrect={true}
                        autoCompleteType="username"
                        label="Last Name"
                        style={{
                            backgroundColor: "#fafafa",
                            borderRadius: normalize(12)
                        }}
                        maxLength={35}
                    />
                    <Text
                        style={{
                            color: "red",
                            textTransform: "capitalize",
                            marginLeft: normalize(6),
                            marginVertical: normalize(10)
                        }}
                    >
                        {input.lastName.error}
                    </Text>
                    <TextInput
                        value={input.phone.value}
                        onChangeText={(text) => {
                            changeText('phone', text);
                        }}
                        error={input.phone.error}
                        keyboardType="phone-pad"
                        label="Phone Number"
                        style={{
                            backgroundColor: "#fafafa",
                            borderRadius: normalize(12)
                        }}
                        maxLength={10}
                    />
                    <Text
                        style={{
                            color: "red",
                            textTransform: "capitalize",
                            marginLeft: normalize(6),
                            marginVertical: normalize(10)
                        }}
                    >
                        {input.phone.error}
                    </Text>
                    </View>
                    <View
                        style={{
                            height: normalize(2),
                            backgroundColor: "#e3e3e3",
                            marginVertical: normalize(20)
                        }}
                    >

                    </View>
                    <View
                        style={{
                            padding: normalize(15),
                            backgroundColor: "#e6e6e6",
                            borderRadius: normalize(5)
                        }}
                    >
                    <Text
                        style={{
                            marginBottom: normalize(15),
                            fontSize: theme.fontSize.medium,
                            fontWeight: theme.fontWeight.normal
                        }}
                    >
                        Address Info
                    </Text>
                    <TextInput
                        value={input.address1.value}
                        onChangeText={(text) => {
                            changeText('address1', text);
                        }}
                        error={input.address1.error}
                        keyboardType="default"
                        label="Address Line 1"
                        style={{
                            backgroundColor: "#fafafa",
                            borderRadius: normalize(12)
                        }}
                        maxLength={60}
                    />
                    <Text
                        style={{
                            color: "red",
                            textTransform: "capitalize",
                            marginLeft: normalize(6),
                            marginVertical: normalize(10)
                        }}
                    >
                        {input.address1.error}
                    </Text>
                    <TextInput
                        value={input.address2.value}
                        onChangeText={(text) => {
                            changeText('address2', text);
                        }}
                        error={input.address2.error}
                        keyboardType={"default"}
                        label="Address Line 2"
                        style={{
                            backgroundColor: "#fafafa",
                            borderRadius: normalize(12)
                        }}
                        maxLength={60}
                    />
                    
                    <Text
                        style={{
                            color: "red",
                            textTransform: "capitalize",
                            marginLeft: normalize(6),
                            marginVertical: normalize(10)
                        }}
                    >
                        {input.address2.error}
                    </Text>
                    <TextInput
                        value={input.city.value}
                        onChangeText={(text) => {
                            changeText('city', text);
                        }}
                        error={input.phone.error}
                        keyboardType="default"
                        label="City"
                        style={{
                            backgroundColor: "#fafafa",
                            borderRadius: normalize(12)
                        }}
                    />
                    <Text
                        style={{
                            color: "red",
                            textTransform: "capitalize",
                            marginLeft: normalize(6),
                            marginVertical: normalize(10)
                        }}
                    >
                        {input.phone.error}
                    </Text>
                    <View
                        style={{
                            flexDirection: "row"
                        }}
                    >
                        <View
                            style={{
                                flex: 1
                            }}
                        >
                            <TextInput
                                value={input.province.value}
                                onChangeText={(text) => {
                                    changeText('province', text);
                                }}
                                error={input.province.error}
                                keyboardType="default"
                                label="Province"
                                style={{
                                    backgroundColor: "#fafafa",
                                    borderRadius: normalize(12),
                                    marginHorizontal: normalize(5)
                                }}
                                maxLength={25}
                            />
                            <Text
                                style={{
                                    color: "red",
                                    textTransform: "capitalize",
                                    marginLeft: normalize(6),
                                    marginVertical: normalize(10)
                                }}
                            >
                                {input.province.error}
                            </Text>
                        </View>
                        <View
                            style={{
                                flex: 1
                            }}
                        >
                            <TextInput
                                value={input.zip.value}
                                onChangeText={(text) => {
                                    changeText('zip', text);
                                }}
                                error={input.phone.error}
                                keyboardType="default"
                                label="Zip Code"
                                autoCompleteType="postal-code"
                                style={{
                                    backgroundColor: "#fafafa",
                                    borderRadius: normalize(12),
                                    marginHorizontal: normalize(5)
                                }}
                                maxLength={6}
                            />
                            
                            <Text
                                style={{
                                    color: "red",
                                    textTransform: "capitalize",
                                    marginLeft: normalize(6),
                                    marginVertical: normalize(10)
                                }}
                            >
                                {input.zip.error}
                            </Text>
                        </View>

                    </View>
                    <TextInput
                        value={input.country.value}
                        onChangeText={(text) => {
                            changeText('country', text);
                        }}
                        error={input.phone.error}
                        keyboardType="default"
                        label="Country"
                        style={{
                            backgroundColor: "#fafafa",
                            borderRadius: normalize(12)
                        }}
                    />
                    
                    <Text
                        style={{
                            color: "red",
                            textTransform: "capitalize",
                            marginLeft: normalize(6),
                            marginVertical: normalize(10)
                        }}
                    >
                            {input.country.error}
                    </Text>
                    </View>
                    
                </ScrollView>
                {customer?.default_address?.id !== address?.id && 
                        <TouchableOpacity
                            style={{
                                marginVertical: normalize(15),
                                alignItems: "center",
                                flexDirection: "row",
                            }}
                            disabled={input.isLoading}
                            onPress={() => {
                                setInput({
                                    ...input,
                                    default: !input.default
                                })
                            }}
                        >
                            <View
                                style={{
                                    borderRadius: normalize(10),
                                    borderColor: theme.colors.primary,
                                    borderWidth: 1,
                                }}
                            >
                                <Checkbox
                                    status={input.default ? 'checked' : 'unchecked'}
                                    onPress={() => {
                                        setInput({
                                            ...input,
                                            default: !input.default
                                        })
                                    }}
                                    style={{
                                        backgroundColor: "red"
                                    }}
                                    color={theme.colors.primary}
                                />
                            </View>
                            <Text
                                style={{
                                    marginLeft: normalize(10),
                                    fontSize: theme.fontSize.paragraph,
                                    fontWeight: theme.fontWeight.normal
                                }}
                            >
                                Set as default Address
                            </Text>
                        </TouchableOpacity>
                    }
                    
                <TouchableOpacity
                        disabled={input.isLoading}
                        onPress={toUpdateAddress === false ? addAddressHandler : updateAddressHandler}
                        style={[
                            input.isLoading === true ? {
                                backgroundColor: theme.colors.disabledButton,

                            } : {
                                backgroundColor: theme.colors.primary,
                            },
                            {
                                alignItems: "center",
                                padding: normalize(13),
                                borderRadius: normalize(12),
                                marginVertical: normalize(15)
                            }]}
                    >
                        {input.isLoading === true ?
                            <View
                                style={{
                                    alignItems: "center",
                                    flexDirection: "row"
                                }}
                            >
                                <Text
                                    style={{
                                        color: theme.colors.white,
                                        fontSize: theme.fontSize.medium,
                                        fontWeight: theme.fontWeight.medium,
                                        marginRight: normalize(12)
                                    }}
                                >
                                    {toUpdateAddress === true ? "Updating" : "Adding"}
                                </Text>
                                <ActivityIndicator color={theme.colors.white} />
                            </View> :
                            <Text
                                style={{
                                    color: theme.colors.white,
                                    fontSize: theme.fontSize.medium,
                                    fontWeight: theme.fontWeight.medium
                                }}
                            >
                                {toUpdateAddress === true ? "Update Address" : "Add New Address"}
                            
                            </Text>
                        }
                    </TouchableOpacity>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

const mapStateToProps = (state) => ({
    customer: state.customer,
});

const mapDispatchToProps = (dispatch) => ({
    setCustomer: (user) => dispatch(setCustomer(user)),
});

export default connect(mapStateToProps, mapDispatchToProps)(AddAddressScreen);
