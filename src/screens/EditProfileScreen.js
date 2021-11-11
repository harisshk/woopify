import React, { useState, useEffect } from 'react';
import { SafeAreaView, Text, View, TouchableOpacity, Alert, KeyboardAvoidingView, ScrollView, StyleSheet, Dimensions } from 'react-native';
import normalize from 'react-native-normalize';
import { ActivityIndicator, TextInput } from 'react-native-paper';
import { connect } from 'react-redux';
import { updateCustomerProfile } from '../services/customer';
import { theme } from '../utils/theme';
import Toast from 'react-native-simple-toast'
import { setCustomer } from '../redux/action/customer';
import RNPickerSelect from 'react-native-picker-select';
import { getCountryDialCode } from '../services/asset';


function EditProfileScreen({ navigation, customer, setCustomer }) {
    const [input, setInput] = useState({
        first_name: {
            value: customer?.first_name, error: ''
        },
        last_name: {
            value: customer?.last_name, error: ''
        },
        phone: {
            value: customer?.phone?.substring(customer?.phone?.charAt(1) == "1" ? 2 :3), error: ''
        },
        dialCode: {
            value: customer?.phone?.substring(0, customer?.phone?.charAt(1) == "1" ? 2 : 3), error: ''
        },
        isLoading: false,
        isChanged: false
    });

    const [countries, setCountries] = useState([]);
    const [countriesLoader, setCountriesLoader] = useState(true);

    useEffect(async() => {
        const response = await getCountryDialCode();
        const { data } = response;
        setCountries([...data?.countries?.map(item => {
            return({
                label: item?.flag + " " + item?.dialCode + " " + item?.country,
                value: item?.dialCode
            })
        })]);
        setCountriesLoader(false);
        return () => {
            
        }
    }, [])

    const changeText = (field, value) => {
        setInput({
            ...input,
            [field]: {
                ...input[field],
                value: value
            },
            isChanged: true,
        });
    }

    const updateProfileListener = async () => {
        try {
            setInput({
                ...input,
                isLoading: true,
            });
            const first_name = input.first_name.value.trim();
            const last_name = input.last_name.value.trim();
            const phone = input.phone?.value?.trim();
            const dialCode = input.dialCode?.value;
            if(dialCode.length >= 4 || dialCode.length === 0){
                Toast.show('Choose Dial Code');
                setInput({
                    ...input,
                    isLoading: false,
                });
                return;
            }
            if (!first_name) {
                setInput({
                    ...input,
                    first_name: {
                        ...input.first_name,
                        error: 'First Name Field is Missing'
                    },
                    isLoading: false,
                });
                Toast.show('First Name Field is Missing');
                return;
            };
            if (!last_name) {
                setInput({
                    ...input,
                    last_name: {
                        ...input.last_name,
                        error: 'Last Name Field is Missing'
                    },
                    isLoading: false,
                });
                Toast.show('Last Name Field is Missing');
                return;
            };
            if (!phone) {
                setInput({
                    ...input,
                    phone: {
                        ...input.phone,
                        error: 'Phone Number Field is Missing'
                    },
                    isLoading: false,
                });
                Toast.show('Phone Number Field is Missing');
                return;
            }
            const body = {
                customer: {
                    first_name: first_name,
                    last_name: last_name,
                    phone: dialCode+phone
                }
            }
            const response = await updateCustomerProfile(customer.id, body);
            if (response?.errors) {
                console.log(response)
                Toast.show('Something Went Wrong');
                setInput({
                    ...input,
                    isLoading: false,
                    isChanged: true
                })
                return;
            } else {
                setCustomer(response);
                Toast.show('Profile Updated');
            }
            setInput({
                ...input,
                isLoading: false,
                isChanged: false
            });
        } catch (error) {
            console.log(error);
            console.log('---------------------EditProfileScreen Line 40-------------------------');
            setInput({
                ...input,
                isLoading: false
            });
        }
    }

    const backHandler = () => {
        if (input.isChanged === true) {
            Alert.alert(
                'Go Back',
                'Discard Changes ?',
                [
                    {
                        text: 'Yes, Go Back', onPress: () => {
                            navigation.goBack();
                        }
                    },
                    {
                        text: 'No, Wait Here', onPress: () => {

                        }
                    }
                ],
                { cancelable: false }
            )
        } else {
            navigation.goBack();
        }
    }

    return (
        <SafeAreaView
            style={{
                flex: 1,
                backgroundColor: theme.colors.background
            }}
        >
            <KeyboardAvoidingView
                style={{
                    paddingBottom: normalize(15),
                    paddingHorizontal: normalize(15),
                    flex: 1,
                }}
                behavior="padding"
            >
                <ScrollView>
                    <View
                        style={{
                            flex: 1
                        }}
                    >
                        <TouchableOpacity

                            style={{
                                paddingVertical: normalize(10)
                            }}
                            onPress={backHandler}
                        >
                            <Text
                                style={{
                                    fontWeight: theme.fontWeight.bold,
                                    fontSize: theme.fontSize.medium,
                                    color: theme.colors.secondary
                                }}
                            >Back</Text>
                        </TouchableOpacity>
                        <Text
                            style={{

                                fontWeight: theme.fontWeight.normal,
                                lineHeight: theme.lineHeight.heading,
                                color: theme.colors.secondary,
                                fontSize: theme.fontSize.subheading,
                            }}
                        >
                            My Profile
                        </Text>
                        <Text
                            style={{
                                fontSize: theme.fontSize.title,
                                fontWeight: theme.fontWeight.medium,
                                lineHeight: theme.lineHeight.heading,
                                marginTop: normalize(5)
                            }}
                        >
                            {customer.first_name} {customer.last_name}
                        </Text>
                        {/* <View
                    style={{
                        width: '75%',
                        height: normalize(27),
                        borderBottomColor: theme.colors.disabled,
                        borderBottomWidth: 2,
                        marginBottom: normalize(20)
                    }}
                /> */}
                        <View
                            style={{
                                flex: .7,
                                justifyContent: "center",
                            }}
                        >

                            <TextInput
                                value={input.first_name.value}
                                label={"First Name"}
                                onChangeText={text => {
                                    changeText('first_name', text);
                                }}
                                style={{
                                    borderRadius: normalize(12),
                                    marginVertical: normalize(10),
                                }}

                                error={input.first_name.error}
                                maxLength={35}
                            />
                            <TextInput
                                value={input.last_name.value}
                                label={"Last Name"}
                                onChangeText={text => {
                                    changeText('last_name', text);
                                }}
                                style={{
                                    borderRadius: normalize(12),
                                    marginVertical: normalize(10),
                                }}
                                keyboardType="default"
                                error={input.last_name.error}
                                maxLength={35}
                            />
                            <View
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    alignContent: "center",
                                }}
                            >
                                {countriesLoader === false ?
                                    <RNPickerSelect
                                        onValueChange={(value) => {
                                            setInput({
                                                ...input,
                                                isChanged: true,
                                                dialCode: {
                                                    ...input.dialCode,
                                                    value: value
                                                }
                                            });
                                        }}
                                        value={input?.dialCode?.value}
                                        items={countries}
                                        placeholder={{
                                            label: 'Dial Code',
                                            value: 'Dial Code',
                                            key: 'dialCode',
                                            color: theme.colors.primary,
                                        }}
                                        style={{ ...pickerSelectStyles }}
                                        
                                    />
                                    :
                                    <View
                                        style={{
                                            width: '27%',
                                            borderColor: theme.colors.secondary,
                                            borderRadius: normalize(7),
                                            borderWidth: 1,
                                            height: normalize(57),
                                            marginRight: normalize(10)
                                        }}
                                    />
                                } 
                                <TextInput
                                    value={input.phone.value}
                                    label={"Phone Number"}
                                    onChangeText={text => {
                                        changeText('phone', text);
                                    }}
                                    style={{
                                        borderRadius: normalize(12),
                                        marginVertical: normalize(10),
                                        width: '69%'
                                    }}
                                    keyboardType="phone-pad"
                                    autoCompleteType={"tel"}
                                    error={input.phone.error}
                                    maxLength={10}
                                />
                            </View>
                            <TouchableOpacity
                                style={[
                                    input.isChanged === false || input.isLoading === true ? {
                                        backgroundColor: theme.colors.disabledButton,
                                    } : {
                                        backgroundColor: theme.colors.secondary,
                                    }, {
                                        padding: normalize(13),
                                        borderRadius: normalize(10),
                                        elevation: 2,
                                        justifyContent: "center",
                                        alignItems: "center",
                                        marginVertical: normalize(15),
                                    }
                                ]}
                                onPress={updateProfileListener}
                                disabled={input.isChanged === false || input.isLoading === true}
                            >
                                {input.isLoading === true ?
                                    <View
                                        style={{
                                            flexDirection: "row"
                                        }}
                                    >
                                        <Text
                                            style={{
                                                fontSize: theme.fontSize.medium,
                                                color: theme.colors.white,
                                                fontWeight: theme.fontWeight.medium
                                            }}
                                        >
                                            Loading
                                        </Text>
                                        <ActivityIndicator color={theme.colors.white} style={{ marginLeft: normalize(15) }} />
                                    </View>
                                    :
                                    <Text

                                        style={{
                                            fontSize: theme.fontSize.medium,
                                            color: theme.colors.white,
                                            fontWeight: theme.fontWeight.medium
                                        }}
                                    >

                                        Update Your Profile
                                    </Text>
                                }
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        fontSize: normalize(15),
        // paddingTop: normalize(10),
        paddingHorizontal: normalize(10),
        // paddingBottom: normalize(12),
        borderWidth: normalize(1),
        borderColor: theme.colors.secondary,
        borderRadius: normalize(4),
        backgroundColor: theme.colors.white,
        color: theme.colors.secondary,
        width: Dimensions.get('screen').width / 3.8, 
        marginTop: normalize(14),
        marginRight: normalize(5),
        paddingVertical: normalize(15)
        // height: 
    },
});

const mapStateToProps = (state) => ({
    customer: state.customer
})

const mapDispatchToProps = (dispatch) => ({
    setCustomer: (user) => dispatch(setCustomer(user)),
});
export default connect(mapStateToProps, mapDispatchToProps)(EditProfileScreen);
