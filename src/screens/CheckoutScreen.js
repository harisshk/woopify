import React, { createRef, useState } from 'react'
import { SafeAreaView, View, ActivityIndicator, TouchableOpacity, Text } from 'react-native'
import normalize from 'react-native-normalize';
import WebView from 'react-native-webview'
import { CustomHeader } from '../components/CustomHeader';
import { theme } from '../utils/theme';
import Icon from 'react-native-vector-icons/Entypo';

function CheckoutScreen({ navigation, route }) {
    const [uri, setUri] = useState(route?.params?.uri);
    const [isLoading, setIsLoading] = useState(true);

    const [isImagePreviewOn, setIsImagePreviewOn] = useState(false);

    const handleURIChanges = async (data) => {
        try {
            console.log(data);
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
            <CustomHeader
                navigation={navigation}
                title={'Checkout'}
            />
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
                    flex: 1,
                }}
                originWhitelist={['*']}
                source={{ uri: uri }}
            />
        </SafeAreaView>
    )
}

export default CheckoutScreen
