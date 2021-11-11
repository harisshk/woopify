import React, { useState } from 'react';
import { KeyboardAvoidingView, SafeAreaView, ScrollView, View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { theme } from '../utils/theme';
import normalize from 'react-native-normalize';
import { isValidEmail } from '../utils/validation/email';
import { createNewCustomer, sendOTPViaEmail } from '../services/customer';
import Toast from 'react-native-simple-toast';
import { TextInput } from 'react-native-paper';
import Footer from '../components/Footer';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import { connect } from 'react-redux';
import { setCustomer } from '../redux/action/customer';
import AsyncStorage from '@react-native-async-storage/async-storage';

function RegisterScreen({navigation, setCustomer}) {
    const [input, setInput] = useState({
        email: { value: '', error: '', disabled: false },
        mobileNumber: { value: '', error: '', disabled: true },
        firstName: { value: '', error: '', disabled: true },
        lastName: { value: '', error: '', disabled: true },
        correctOtp: { value: '' },
        enteredOtp: { value: '', error: '', disabled: true, visible: false },
        password: { value: '', error: '', disabled: true, visible: false },
        newPassword: { value: '', error: '', disabled: true, visible: false },
        isLoading: false,
        isVerified: false
    });

    const emailVerificationHandler = async () => {
        try {
            setInput({
                ...input,
                isLoading: true
            })
            const email = input.email.value.trim();
            const check = isValidEmail(email);
            if (check === false) {
                setInput({
                    ...input,
                    email: {
                        ...input.email,
                        error: 'Invalid Email',
                    },
                    isLoading: false
                });
                return;
            }
            const body = {
                email: email,
            };
            const response = await sendOTPViaEmail(body);
            if (!response) {
                Toast.show('Something went wrong');
                setInput({
                    ...input,
                    email: {
                        ...input.email,
                        error: 'Invalid Email'
                    },
                    isLoading: false
                });
                return;
            }

            const { data } = response;
            const { success, message, otp } = data;
            Toast.show(message);
            if (success === true) {
                setInput({
                    ...input,
                    enteredOtp: {
                        ...input.enteredOtp,
                        visible: true,
                        disabled: false
                    },
                    correctOtp: {
                        ...input.correctOtp,
                        value: otp,
                    },
                    email: {
                        ...input.email,
                        disabled: true
                    },
                });
            } else {
                setInput({
                    ...input,
                    email: {
                        ...input.email,
                        error: message,
                    }
                });
            }
        } catch (error) {
            console.log('------------------Register Screen Line 25----------------------');
            console.log(error);
            setInput({
                ...input,
                isLoading: false
            })
        }
    }

    const otpVerification = async (otp) => {
        if (input.correctOtp.value === otp) {
            Toast.show('Verification Success');
            setInput({
                ...input,
                email: {
                    ...input.email,
                    disabled: true
                },
                enteredOtp: {
                    ...input.enteredOtp,
                    visible: false,
                    disabled: false
                },
                lastName: {
                    ...input.lastName,
                    disabled: false
                },
                firstName: {
                    ...input.firstName,
                    disabled: false
                },
                mobileNumber: {
                    ...input.mobileNumber,
                    disabled: false
                },
                newPassword: {
                    ...input.newPassword,
                    disabled: false,
                },
                password: {
                    ...input.password,
                    disabled: false
                },
                isVerified: true
            });
        } else {
            Toast.show('Miss Match OTP');
            return;
        }
    };

    const resetHandler = () => {
        setInput({
            ...input,
            lastName: {
                value: "", error: "", disabled: true
            },
            firstName: {
                value: "", error: "", disabled: true
            },
            mobileNumber: {
                value: "", error: "", disabled: true
            }
            ,
            email: {
                ...input.email, error: "", disabled: false
            },
            password: {
                ...input.password, value: "", error: "", disabled: false
            },
            newPassword: {
                ...input.newPassword, value: "", error: "", disabled: false
            },
            isVerified: false
        })
    }

    const changeText = (key, value) => {
        setInput({ ...input, [key]: { ...input[key], value: value, error: '', } });
    }

    const registerCustomerHandler = async () => {
        try {
            setInput({
                ...input,
                isLoading: true
            });
            const last_name = input.lastName.value.trim();
            const first_name = input.firstName.value.trim();
            const phone = input.mobileNumber.value.trim();
            const password = input.password.value.trim();
            const password_confirmation = input.newPassword.value.trim();
            if (password !== password_confirmation) {
                setInput({
                    ...input,
                    password: {
                        ...input.password,
                        value: '',
                        error: 'Miss Match Password'
                    },
                    newPassword: {
                        ...input.newPassword,
                        value: '',
                        error: 'Miss Match Password'
                    },
                    isLoading: false
                });
                Toast.show('All Fields are required');
                return;
            }
            if (!last_name || !first_name) {
                setInput({
                    ...input,
                    isLoading: false
                });
                Toast.show('All Fields are required');
                return;
            }
            const body = {
                customer:{
                    last_name: last_name,
                    first_name: first_name,
                    email: input.email.value,
                    phone: "+91" + phone,
                    verified_email: true,
                    password: password,
                    password_confirmation: password_confirmation,
                    send_email_welcome: true,
                }
            }
            let response = await createNewCustomer(body);
            if(response?.errors){
                const {errors} = response;
                if(errors?.email){
                    Toast.show(`Email ${errors.email[0]}`);
                    setInput({
                        ...input,
                        email:{
                            ...input.email,
                            error: errors.email[0]
                        },
                        isLoading: false
                    });
                }
                if(errors?.phone){
                    Toast.show(`Mobile Number ${errors?.phone[0]}`);   
                    setInput({
                        ...input,
                        mobileNumber:{
                            ...input.mobileNumber,
                            error: errors.phone[0]
                        },
                        isLoading: false
                    });
                }
                
            }else if(response?.customer){
               const {customer} = response;
               setCustomer({customer: customer});
               await AsyncStorage.setItem('user',JSON.stringify(customer));
               navigation.replace('BottomTab');
            }
            setInput({
                ...input,
                isLoading: false
            })
        } catch (error) {
            console.log(error);
            setInput({
                ...input,
                isLoading: false
            });
            Toast.show('Something went wrong');
            return;
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
                    flex: 1
                }}
                behavior="padding"
            >
                <ScrollView
                    style={{
                        flex: 1,
                        flexGrow: 1,
                        padding: normalize(15)
                    }}
                >
                    <View
                        style={{
                            marginVertical: normalize(20),

                        }}
                    >
                        <Text
                            style={{
                                fontSize: theme.fontSize.title,
                                lineHeight: theme.fontSize.title,
                                fontWeight: theme.fontWeight.medium,
                                paddingTop: normalize(10)
                            }}
                        >
                            Introduce
                        </Text>
                        <Text
                            style={{
                                fontSize: theme.fontSize.title,
                                lineHeight: theme.fontSize.title,
                                fontWeight: theme.fontWeight.medium,
                                paddingTop: normalize(10)
                            }}
                        >
                            Your Self First
                        </Text>
                    </View>
                    <View
                        style={{
                            flex: 1,
                            flexDirection: "row"
                        }}
                    >
                        <TextInput
                            value={input.email.value}
                            label={"Enter Email"}
                            onChangeText={text => {
                                changeText('email', text);
                            }}
                            style={{
                                flex: .8,
                                borderRadius: normalize(10)
                            }}
                            autoCompleteType="email"
                            error={input.email.error}

                            keyboardType="email-address"
                            disabled={input.email.disabled}
                        />

                        <TouchableOpacity
                            onPress={emailVerificationHandler}
                            style={[input.isLoading === true || input.email.disabled === true ? {
                                backgroundColor: theme.colors.disabledButton
                            } : {
                                backgroundColor: theme.colors.secondary,
                            }, {

                                padding: normalize(5),
                                borderRadius: normalize(8),
                                elevation: 2,
                                flex: .2,
                                alignSelf: "center",
                                marginLeft: normalize(5),
                                height: '100%',
                                justifyContent: "center"
                            }
                            ]}
                            disabled={input.isLoading || input.email.disabled}

                        >
                            {input.isLoading === true ?
                                <ActivityIndicator color={theme.colors.white} /> :
                                <Text
                                    style={[

                                        {
                                            color: theme.colors.white,
                                            fontWeight: theme.fontWeight.medium,
                                            fontSize: theme.fontSize.paragraph,
                                            textAlign: "center",

                                        }
                                    ]}
                                >
                                    {input.isVerified === true ? "DONE" : "SEND OTP"}
                                </Text>
                            }
                        </TouchableOpacity>

                    </View>
                    {input.email.disabled === true && input.isVerified === false &&
                        <OTPInputView
                            style={{
                                width: '91%',
                                height: normalize(100),
                                alignSelf: "center",
                            }}
                            pinCount={6}
                            autoFocusOnLoad
                            codeInputFieldStyle={{
                                borderColor: theme.colors.primary,
                                color: theme.colors.primary,
                                borderRadius: normalize(10),
                                fontSize: theme.fontSize.medium,
                                fontWeight: theme.fontWeight.medium
                            }}
                            codeInputHighlightStyle={{
                                width: normalize(50),
                                height: normalize(50),
                                borderWidth: 4,
                                // borderBottomWidth: 2,
                            }}
                            placeholderTextColor={theme.colors.primary}
                            placeholderCharacter={"-"}
                            keyboardType="default"
                            onCodeFilled={code => {
                                otpVerification(code);
                            }}

                        />}
                    {
                        input.email.disabled === true &&

                        <TouchableOpacity
                            style={{
                                alignSelf: "flex-end",
                                marginTop: normalize(5)
                            }}
                            disabled={input.isLoading}
                            onPress={resetHandler}
                        >
                            <Text
                                style={{
                                    fontSize: theme.fontSize.paragraph,
                                    fontWeight: theme.fontWeight.medium,
                                    color: theme.colors.primary
                                }}
                            >
                                Change Email
                            </Text>
                        </TouchableOpacity>
                    }
                    <Text
                        style={{
                            marginBottom: normalize(10),
                            marginTop: normalize(5),
                            color: "red",
                            fontWeight: theme.fontWeight.medium,
                            fontSize: theme.fontSize.paragraph
                        }}
                    >
                        {input.email.error}
                    </Text>

                    <TextInput
                        value={input.firstName.value}
                        label={"First Name "}
                        onChangeText={text => {
                            changeText('firstName', text);
                        }}
                        style={{
                            borderRadius: normalize(10)
                        }}
                        keyboardType="default"
                        autoCompleteType="name"
                        error={input.firstName.error}
                        disabled={input.firstName.disabled}

                        maxLength={15}
                    />
                    <Text
                        style={{
                            marginBottom: normalize(10),
                            marginTop: normalize(5),
                            color: "red",
                            fontWeight: theme.fontWeight.medium,
                            fontSize: theme.fontSize.paragraph
                        }}
                    >
                        {input.firstName.error}
                    </Text>
                    <TextInput
                        value={input.lastName.value}
                        label={"Last Name"}
                        onChangeText={text => {
                            changeText('lastName', text);
                        }}
                        autoCompleteType="name"
                        keyboardType="default"
                        error={input.lastName.error}
                        disabled={input.lastName.disabled}
                        style={{
                            borderRadius: normalize(10)
                        }}
                        maxLength={20}
                    />
                    <Text
                        style={{
                            marginBottom: normalize(10),
                            marginTop: normalize(5),
                            color: "red",
                            fontWeight: theme.fontWeight.medium,
                            fontSize: theme.fontSize.paragraph
                        }}
                    >
                        {input.lastName.error}
                    </Text>
                    {/* <TextInput
                        value={input.mobileNumber.value}
                        label={"Mobile Number"}
                        onChangeText={text => {
                            changeText('mobileNumber', text);
                        }}
                        style={{
                            flex: .8
                        }}
                        autoCompleteType="tel"
                        keyboardType="phone-pad"
                        error={input.mobileNumber.error}
                        disabled={input.mobileNumber.disabled}
                        style={{
                            borderRadius: normalize(10)
                        }}
                        maxLength={10}
                    /> */}
                    {/* <Text
                        style={{
                            marginBottom: normalize(10),
                            marginTop: normalize(5),
                            color: "red",
                            fontWeight: theme.fontWeight.medium,
                            fontSize: theme.fontSize.paragraph
                        }}
                    >
                        {input.mobileNumber.error}
                    </Text> */}
                    <TextInput
                        value={input.password.value}
                        label={"Enter your Password"}
                        onChangeText={text => {
                            changeText('password', text);
                        }}
                        style={{
                            flex: .8
                        }}
                        error={input.password.error}
                        disabled={input.password.disabled}
                        style={{
                            borderRadius: normalize(10)
                        }}
                        maxLength={10}
                        secureTextEntry={true}
                    />
                    <Text
                        style={{
                            marginBottom: normalize(10),
                            marginTop: normalize(5),
                            color: "red",
                            fontWeight: theme.fontWeight.medium,
                            fontSize: theme.fontSize.paragraph
                        }}
                    >
                        {input.password.error}
                    </Text>
                    <TextInput
                        value={input.newPassword.value}
                        label={"Re Enter Password"}
                        onChangeText={text => {
                            changeText('newPassword', text);
                        }}
                        style={{
                            flex: .8
                        }}

                        secureTextEntry={true}
                        error={input.newPassword.error}
                        disabled={input.newPassword.disabled}
                        style={{
                            borderRadius: normalize(10)
                        }}
                        maxLength={10}
                    />
                    <Text
                        style={{
                            marginBottom: normalize(10),
                            marginTop: normalize(5),
                            color: "red",
                            fontWeight: theme.fontWeight.medium,
                            fontSize: theme.fontSize.paragraph
                        }}
                    >
                        {input.newPassword.error}
                    </Text>
                    <TouchableOpacity
                        style={[
                            input.isLoading === true || input.isVerified === false ? {
                                backgroundColor: theme.colors.disabledButton,

                            } : {
                                backgroundColor: theme.colors.secondary,
                            }, {
                                padding: normalize(14),
                                borderRadius: normalize(7),
                                alignItems: "center",
                                marginTop: normalize(15)
                            }]}
                        disabled={input.isLoading || !input.isVerified}
                        onPress={registerCustomerHandler}
                    >
                        <Text
                            style={{
                                color: theme.colors.white,
                                fontSize: theme.fontSize.medium,
                                fontWeight: theme.fontWeight.medium
                            }}
                        >
                            REGISTER YOUR ACCOUNT</Text>
                    </TouchableOpacity>
                    <Footer />
                </ScrollView>
            </KeyboardAvoidingView>

        </SafeAreaView>
    )
}

const mapDispatchToProps = (dispatch) => ({
    setCustomer: (customer) => dispatch(setCustomer(customer)),
});
export default connect(null, mapDispatchToProps)(RegisterScreen)
