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
import { TextInput } from 'react-native-paper';
import Footer from '../components/Footer';
import { verifyEmail } from '../services/customer';
import { theme } from '../utils/theme';
import { isValidEmail } from '../utils/validation/email';
import Toast from 'react-native-simple-toast';
import SubHeading from '../components/SubHeading';


function LoginScreen({navigation}) {
    const [input, setInput] = useState({
        email: { value: '', error: '' }
    })
    const [isLoading, setIsLoading] = useState(false);

    const verifyEmailHandler = async () => {
        try {
            setIsLoading(true);
            const error = isValidEmail(input.email.value.trim());
            if (error === false) {
                setInput({
                    ...input,
                    email: {
                        error: "Enter valid Email"
                    }
                });
                setIsLoading(false);
                return;
            }
            const body = {
                email: input.email.value.trim()
            }
            const response = await verifyEmail(body);

            //If null returned 
            if (!response) {
                Toast.show('Something went wrong');
                setIsLoading(false);
                return;
            }

            const { data } = response;
            const { message, success } = data;
            Toast.show(message);
            console.log(data);
            setIsLoading(false);
            if (success === false) {
                setInput({
                    ...input,
                    email: {
                        error: message,
                    }
                });
            } else if (success === true) {
                navigation.navigate('OTPScreen', { 
                    correctOtp: data.otp,
                    email: input.email.value.trim(),
                    customer: data.customer 
                });
                setInput({
                    ...input,
                    email: {
                        value: '',
                        error: '',
                    }
                });
            }



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
                        source={require('../assets/images/send-email.png')}
                    />
                    <Text
                        style={{
                            textAlign: "center",
                            fontSize: theme.fontSize.heading,
                            fontWeight: theme.fontWeight.medium
                        }}
                    >
                        Login with Email OTP
                    </Text>
                    <Text
                        style={{
                            fontWeight: theme.fontWeight.thin,
                            fontSize: theme.fontSize.paragraph,
                            lineHeight: theme.lineHeight.subheading,
                            textAlign: "center",
                            marginVertical: normalize(15),
                            width: '95%',
                            alignSelf: "center"
                        }}
                    >
                        We will send you an
                        <Text
                            style={{
                                fontWeight: theme.fontWeight.bold
                            }}
                        >
                            {" "}One Time Password{" "}
                        </Text>
                        on this Email Address
                    </Text>

                    <TextInput
                        value={input.email.value}
                        onChangeText={(text) => {
                            setInput({ ...input, email: { value: text, error: '' } });
                        }}
                        mode="flat"
                        label="Enter Email"
                        style={{
                            borderRadius: normalize(12),
                            width: '90%',
                            alignSelf: "center",
                            backgroundColor: theme.colors.background,
                        }}
                        autoCompleteType="email"
                        returnKeyType="go"
                        error={input.email.error}
                        onSubmitEditing={verifyEmailHandler}
                    />
                    <Text
                        style={{
                            marginBottom: normalize(15),
                            width: '90%',
                            alignSelf: "center",
                            marginTop: normalize(4),
                            color: "#f2304e"
                        }}
                    >
                        {input.email.error}
                    </Text>
                    <TouchableOpacity
                        style={[
                            isLoading === true ? {
                                backgroundColor: theme.colors.disabledButton
                            } : {
                                backgroundColor: theme.colors.primary,
                            }, {
                                width: '95%',
                                alignSelf: "center",
                                borderRadius: normalize(12),
                                padding: normalize(6.5)
                            }
                        ]}
                        onPress={verifyEmailHandler}
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
                                GET OTP
                            </Text>
                        }
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={()=>{
                            navigation.navigate('RegisterScreen')
                        }}
                        disabled={isLoading}
                    >
                        <SubHeading
                            style={
                                
                                isLoading === true ? {
                                    color: "grey",
                                    textAlign: "center"
                                }:{
                                    textAlign: "center"
                                }
                            }
                        >
                            Create an account!
                        </SubHeading>
                    </TouchableOpacity>
                    <Footer />
                </ScrollView>

            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

export default LoginScreen
