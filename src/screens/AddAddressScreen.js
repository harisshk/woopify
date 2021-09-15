import React, { useState } from 'react'
import { KeyboardAvoidingView, SafeAreaView, ScrollView, Text, View, Image, TouchableOpacity, ActivityIndicator } from 'react-native'
import normalize from 'react-native-normalize'
import { Checkbox, List } from 'react-native-paper'
import { addNewAddress, updateAddress } from '../services/customer'
import { theme } from '../utils/theme';
import Toast from 'react-native-simple-toast'
import { connect } from 'react-redux'
import { setCustomer } from '../redux/action/customer';
import SubHeading from '../components/SubHeading';
import { TextInput } from 'react-native-paper'

const CustomHeader = ({ navigation, title }) => {
    return (
        <View
            style={{
                padding: normalize(5),
                flexDirection: "row",
                alignItems: "center",
            }}
        >
            <View
                style={{
                    padding: normalize(13),
                    alignSelf: "flex-end"
                }}
            >
                <Image
                    source={require('../assets/images/left-arrow.png')}
                    resizeMode="contain"
                    style={{
                        width: normalize(25),
                        height: normalize(25),
                        alignSelf: "flex-end"
                    }}
                />
            </View>
            <Text
                style={{
                    fontSize: theme.fontSize.medium,
                    fontWeight: theme.fontWeight.medium,
                    lineHeight: theme.lineHeight.medium,
                    marginLeft: normalize(10)
                }}
            >
                {title}
            </Text>
        </View>
    )
}

function AddAddressScreen({ navigation, customer, setCustomer, route }) {
    const { toUpdateAddress, address } = route.params;
    const [input, setInput] = useState({
        phone: { value: toUpdateAddress ? address.phone : "", error: "" },
        name: { value: toUpdateAddress ? address.name : "", error: "" },
        address1: { value: toUpdateAddress ? address.address1 : "", error: "" },
        address2: { value: toUpdateAddress ? address.address2 : "", error: "" },
        city: { value: toUpdateAddress ? address.city : "", error: "" },
        province: { value: toUpdateAddress ? address.province : "", error: "" },
        country: { value: toUpdateAddress ? address.country : "", error: "" },
        zip: { value: toUpdateAddress ? address.zip : "", error: "" },
        default: toUpdateAddress ? address.default : true,
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
            const name = input.phone.value.trim();
            const zip = input.phone.value.trim();
            if (!address1 || !address2 || !city || !province || !phone || !name || !zip) {
                setInput({
                    ...input,
                    isLoading: false,
                });
                Toast.show('All Fields are required');
                return;
            }
            const body = {
                address: {
                    address1: address1,
                    address2: address2,
                    city: city,
                    province: province,
                    phone: phone,
                    name: name,
                    zip: zip
                }
            };
            const response = await addNewAddress(customer._id, body);
            console.log(response, '---------Line 84---------');

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
            const name = input.phone.value.trim();
            const zip = input.phone.value.trim();
            if (!address1 || !address2 || !city || !province || !phone || !name || !zip) {
                setInput({
                    ...input,
                    isLoading: false,
                });
                Toast.show('All Fields are required');
                return;
            }
            const body = {
                address: {
                    address1: address1,
                    address2: address2,
                    city: city,
                    province: province,
                    phone: phone,
                    name: name,
                    zip: zip
                }
            };
            const response = await updateAddress(customer._id, address.id, body);
            console.log(response, '---------Line 129---------');

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
            <CustomHeader navigation={navigation} title={"Add New Address"} />
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
                        value={input.name.value}
                        onChangeText={(text) => {
                            changeText('name', text);
                        }}
                        error={input.name.error}
                        keyboardType="default"
                        autoCapitalize="words"
                        autoCorrect={true}
                        autoCompleteType="username"
                        label="Name"
                        style={{
                            backgroundColor: "#fafafa",
                            borderRadius: normalize(12)
                        }}
                    />
                    <Text>{input.name.error}</Text>
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
                    />
                    <Text>{input.phone.error}</Text>
                    <View
                        style={{
                            height: normalize(2),
                            backgroundColor: "#e3e3e3",
                            marginVertical: normalize(20)
                        }}
                    >

                    </View>
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
                    />
                    <Text>{input.address1.error}</Text>
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
                    />
                    <Text>{input.address2.error}</Text>
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
                    <Text>{input.city.error}</Text>
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
                            />
                            <Text>{input.province.error}</Text>
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
                            />
                            <Text>{input.zip.error}</Text>
                        </View>

                    </View>
                    <View
                        style={{ marginVertical: normalize(10), alignItems: "center" }}
                    >
                        <Checkbox
                            status={input.default ? 'checked' : 'unchecked'}
                            onPress={() => {
                                setInput({
                                    ...input,
                                    default: !input.default
                                })
                            }}
                        />
                        <Text>Set as default Address</Text>
                    </View>
                    <TouchableOpacity
                        style={[
                            input.isLoading === true ? {
                                backgroundColor: theme.colors.disabledButton,

                            } : {
                                backgroundColor: theme.colors.primary,

                            },
                            {
                                alignItems: "center",
                                padding: normalize(13),
                                borderRadius: normalize(12)
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
                                    Adding
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
                                Add New Address
                            </Text>
                        }
                    </TouchableOpacity>
                </ScrollView>
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

export default connect(mapStateToProps, mapDispatchToProps)(AddAddressScreen)
