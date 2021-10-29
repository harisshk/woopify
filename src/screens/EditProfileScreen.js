import React, { useState } from 'react';
import { SafeAreaView, Text, View, TouchableOpacity, Alert } from 'react-native';
import normalize from 'react-native-normalize';
import { ActivityIndicator, TextInput } from 'react-native-paper';
import { connect } from 'react-redux';
import { updateCustomerProfile } from '../services/customer';
import { theme } from '../utils/theme';
import Toast from 'react-native-simple-toast'
import { setCustomer } from '../redux/action/customer';
function EditProfileScreen({ navigation, customer, setCustomer }) {
    const [input, setInput] = useState({
        first_name: {
            value: customer?.first_name, error: ''
        },
        last_name: {
            value: customer?.last_name, error: ''
        },
        phone: {
            value: customer?.phone, error: ''
        },
        isLoading: false,
        isChanged: false
    });

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
            const phone = input.phone.value.trim();
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
                    phone: phone
                }
            }
            const response = await updateCustomerProfile(customer.id, body);
            setCustomer(response);
            if (response?.errors) {
                Toast.show('Something Went Wrong');
                setInput({
                    ...input,
                    isLoading: false,
                    isChanged: true
                })
                return;
            }else{
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
            setIsLoading(false);
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
            {/* <View
                style={{
                    height: normalize(200),
                    backgroundColor:"#A3861C",
                    borderRadius: normalize(50),
                    position: "absolute",
                    top: 0,
                    right: -50,
                    width: '50%'
                }}
            /> */}
            <View
                style={{
                    padding: normalize(15),
                    flex:1
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
                            fontWeight: theme.fontWeight.bold
                        }}
                    >{"<  "}Go Back</Text>
                </TouchableOpacity>
                <Text
                    style={{

                        fontWeight: theme.fontWeight.normal,
                        lineHeight: theme.lineHeight.heading,
                        color: theme.colors.secondary,
                        fontSize: theme.fontSize.subheading,
                    }}
                >
                    Welcome Buddy !!!
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
                        flex:.7,
                        justifyContent :"center",
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
                <TextInput
                    value={input.phone.value}
                    label={"Phone Number"}
                    onChangeText={text => {
                        changeText('phone', text);
                    }}
                    style={{
                        borderRadius: normalize(12),
                        marginVertical: normalize(10),
                    }}
                    keyboardType="phone-pad"
                    autoCompleteType={"tel"}
                    error={input.phone.error}
                    maxLength={13}
                />
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
            {/* <View
                style={{
                    height: normalize(170),
                    backgroundColor: "#A3861C",
                    borderRadius: normalize(35),
                    position: "absolute",
                    bottom: -17,
                    left: -45,
                    width: '50%'
                }}
            /> */}
        </SafeAreaView>
    )
}

const mapStateToProps = (state) => ({
    customer: state.customer
})

const mapDispatchToProps = (dispatch) => ({
    setCustomer: (user) => dispatch(setCustomer(user)),
});
export default connect(mapStateToProps, mapDispatchToProps)(EditProfileScreen);
