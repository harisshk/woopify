import React, { useState } from 'react'
import { ActivityIndicator, SafeAreaView, View } from 'react-native'
import normalize from 'react-native-normalize';
import WebView from 'react-native-webview'
import { theme } from '../utils/theme'

function OrderTracking({ navigation, route }) {
    const { uri } = route.params;
    const [isLoading, setIsLoading] = useState(true);
    return (
        <SafeAreaView
            style={{
                flex: 1,
                backgroundColor: theme.colors.background
            }}
        >
            {isLoading === true &&
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
            }
            <WebView
                onLoad={() => {
                    setIsLoading(true)
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

export default OrderTracking;
