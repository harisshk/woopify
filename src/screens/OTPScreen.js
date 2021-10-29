import React, { useState } from 'react';
import {
    ActivityIndicator,
    Image,
    KeyboardAvoidingView,
    SafeAreaView,
    ScrollView,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import normalize from 'react-native-normalize';
import Footer from '../components/Footer';
import { theme } from '../utils/theme';
import Toast from 'react-native-simple-toast';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { connect } from 'react-redux';
import { setCustomer } from '../redux/action/customer';


function OTPScreen({ navigation, route, setCustomer }) {
    const { correctOtp, email, customer } = route.params;
    const [input, setInput] = useState({
        otp: { value: '', error: '' }
    })
    const [isLoading, setIsLoading] = useState(false);

    const verifyOTPHandler = async () => {
        try {
            setIsLoading(true);
            // const error = isValidOtp(input.otp.value.trim());
            // if (error === true) {
            //     setInput({
            //         ...input,
            //         otp: {
            //             value: '',
            //             error: "Invalid OTP"
            //         }
            //     });
            //     setIsLoading(false);
            //     return;
            // }
            if (correctOtp === input.otp.value.trim()) {
                await AsyncStorage.setItem("user", JSON.stringify(customer));
                setCustomer({ customer: customer });
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'BottomTab' }],
                });
                // navigation.navigate("SplashScreen");
                // Toast.show("Let's move in");
            } else {
                setInput({
                    ...input,
                    otp: {
                        error: "OTP Miss Match"
                    }
                })
                Toast.show("OTP Miss Match");
            }
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
        }
    }


    return (
        <SafeAreaView
            style={{
                flex: 1,
                backgroundColor: theme.colors.background,
            }}
        >
            <KeyboardAvoidingView
                behavior="padding"
                style={{
                    flex: 1,
                    padding: normalize(15)
                }}
            >
                <ScrollView
                    style={{
                        flex: 1,

                    }}
                    contentContainerStyle={{
                        flexGrow: 1,
                    }}
                    showsVerticalScrollIndicator={false}
                >
                    <Image
                        style={{
                            padding: normalize(5),
                            width: '80%',
                            height: normalize(210),
                            margin: normalize(50),
                            alignItems: "center",
                            alignSelf: "center"
                        }}
                        source={require('../assets/images/email-sent.png')}
                    />
                    <Text
                        style={{
                            textAlign: "center",
                            fontSize: theme.fontSize.heading,
                            fontWeight: theme.fontWeight.medium
                        }}
                    >
                        OTP Verification
                    </Text>
                    <Text
                        style={{
                            fontWeight: theme.fontWeight.thin,
                            fontSize: theme.fontSize.paragraph,
                            lineHeight: theme.lineHeight.subheading,
                            textAlign: "center",
                            marginTop: normalize(15),
                            width: '95%',
                            alignSelf: "center"
                        }}
                    >
                        Enter the OTP sent to
                        <Text
                            style={{
                                fontWeight: theme.fontWeight.bold
                            }}
                        >
                            {" "}{email}{" "}
                        </Text>
                    </Text>

                    {/* <TextInput
                        value={input.otp.value}
                        onChangeText={(text) => {
                            setInput({ ...input, otp: { value: text, error: '' } });
                        }}
                        mode="flat"
                        label="Enter OTP"
                        style={{
                            borderRadius: normalize(12),
                            width: '90%',
                            alignSelf: "center",
                            backgroundColor: theme.colors.background,
                        }}
                        autoCompleteType="off"
                        returnKeyType="go"
                        error={input.otp.error}
                        onSubmitEditing={verifyOTPHandler}
                    /> */}
                    <OTPInputView
                        style={{
                            width: '91%',
                            height: normalize(100),
                            alignSelf: "center",
                        }}
                        pinCount={6}
                        autoFocusOnLoad
                        codeInputFieldStyle={{
                            borderColor: theme.colors.secondary,
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
                        onCodeChanged={(text) => {
                            setInput({
                                otp: {
                                    value: text,
                                    error: ''
                                }
                            })
                        }}
                        placeholderTextColor={theme.colors.primary}
                        placeholderCharacter={"-"}
                        keyboardType="default"
                    />
                    <Text
                        style={{
                            marginBottom: normalize(15),
                            width: '90%',
                            alignSelf: "center",
                            color: "#f2304e"
                        }}
                    >
                        {input.otp.error}
                    </Text>
                    <TouchableOpacity
                        style={[
                            isLoading === true ? {
                                backgroundColor: "#8171ab"
                            } : {
                                backgroundColor: theme.colors.secondary,
                            }, {
                                width: '95%',
                                alignSelf: "center",
                                borderRadius: normalize(12),
                                padding: normalize(6.5)
                            }
                        ]}
                        onPress={verifyOTPHandler}
                        disabled={isLoading}
                    >
                        {isLoading === true ?
                            <View
                                style={{
                                    flexDirection: 'row',
                                    alignSelf: "center",
                                }}
                            >
                                <Text
                                    style={{
                                        color: theme.colors.white,
                                        fontWeight: theme.fontWeight.medium,
                                        lineHeight: theme.lineHeight.heading,
                                        textAlign: "center",
                                        fontSize: theme.fontSize.medium,
                                        marginRight: normalize(15)
                                    }}
                                >
                                    Loading
                                </Text>
                                <ActivityIndicator color="white" />
                            </View>
                            :
                            <Text
                                style={{
                                    color: theme.colors.white,
                                    fontWeight: theme.fontWeight.medium,
                                    lineHeight: theme.lineHeight.heading,
                                    textAlign: "center",
                                    fontSize: theme.fontSize.medium
                                }}
                            >
                                VERIFY {"&"} PROCEED
                            </Text>
                        }
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

export default connect(null, mapDispatchToProps)(OTPScreen);
