import React, { createRef, useState } from 'react';
import { 
    SafeAreaView, 
    View, 
    ActivityIndicator, 
    TouchableOpacity, 
    Text, 
    Image,
    Alert
} from 'react-native';
import normalize from 'react-native-normalize';
import WebView from 'react-native-webview';
import { CustomHeader } from '../components/CustomHeader';
import { theme } from '../utils/theme';
import { icons } from '../constant';
import Icon from 'react-native-vector-icons/Entypo';

function CheckoutScreen({ navigation, route }) {
    const [uri, setUri] = useState(route?.params?.uri);
    const [isLoading, setIsLoading] = useState(true);

    const [isImagePreviewOn, setIsImagePreviewOn] = useState(false);

    const handleURIChanges = async (data) => {
        try {
            if (data?.url?.includes("cdn") || data?.url?.includes("jpeg") || data?.url?.includes("png") || data?.url?.includes("jpg")) {
                setIsImagePreviewOn(true);
            }
        } catch (error) {
            setIsLoading(false);
        }
    }

    const webViewRef = createRef();

    return (
        <SafeAreaView
            style={{
                flex: 1,
                backgroundColor: theme.colors.background
            }}
        >
            {/* <CustomHeader
                navigation={navigation}
                title={'Checkout'}
            /> */}
            <View
                style={{
                    padding: normalize(5),
                    flexDirection: "row",
                    alignItems: "center",
                }}
            >
                <TouchableOpacity
                    style={{
                        padding: normalize(13),
                        alignSelf: "flex-end"
                    }}
                    onPress={() => {
                        if(isImagePreviewOn === true){
                            try {
                                setIsImagePreviewOn(false);
                                webViewRef?.current?.goBack();
                            } catch (error) {
                                
                            }
                        } else{
                            Alert.alert(
                                "Confirmation",
                                "Cancel Checkout Process and go back.",
                                [
                                    {
                                        text: "Cancel",
                                        onPress: () => console.log("Cancel Pressed"),
                                        style: "cancel"
                                    },
                                    {
                                        text: "Confirm",
                                        onPress: () => {
                                            navigation.goBack();
                                        },

                                    }

                                ]
                            );
                            
                        }
                    }}
                >
                    <Image
                        source={icons?.BACK}
                        resizeMode="contain"
                        style={{
                            width: normalize(25),
                            height: normalize(25),
                            alignSelf: "flex-end"
                        }}
                    />
                </TouchableOpacity>
                <Text
                    style={{
                        fontSize: theme.fontSize.medium,
                        fontWeight: theme.fontWeight.medium,
                        lineHeight: theme.lineHeight.medium,
                        marginLeft: normalize(10)
                    }}
                >
                    {isImagePreviewOn ? `Image Preview` : `Checkout`}
                </Text>
            </View>
            
            {isImagePreviewOn === true && isLoading === false &&
                <TouchableOpacity
                    onPress={() => {
                        try {
                            setIsImagePreviewOn(false);
                            webViewRef?.current?.goBack();
                        } catch (error) {

                        }
                    }}
                    style={{
                        position: "absolute",
                        zIndex: 1,
                        top: normalize(120),
                        right: normalize(15)
                    }}

                >
                    <Icon
                        name={"cross"}
                        size={29}
                        color={theme.colors.black}
                        style={{
                            backgroundColor: theme.colors.white,
                            opacity: .7
                        }}
                    />
                </TouchableOpacity>

            }
            {isLoading === true ?
                <View
                    style={{
                        height: normalize(300),
                        justifyContent: "center",
                        alignItems: "center"
                    }}
                >
                    <ActivityIndicator
                        color={theme.colors.primary}
                        size={24}
                    />
                </View>
                :
                <></>
            }

            <WebView
                ref={webViewRef}
                onLoad={() => {
                    setIsLoading(true)
                }}
                onNavigationStateChange={(data) => {
                    handleURIChanges(data);
                }}

                onLoadStart={() => {
                    setIsLoading(true)
                }}
                onLoadEnd={() => {
                    setIsLoading(false)
                }}
                style={{
                    // flex: 1,
                    maxHeight: isLoading === true ? normalize(0) : '100%',
                    width: '100%'
                }}
                originWhitelist={['*']}
                source={{ uri: uri }}
            />
        </SafeAreaView>
    )
}

export default CheckoutScreen
