import React from 'react'
import { SafeAreaView } from 'react-native'
import WebView from 'react-native-webview'
import { theme } from '../utils/theme'

function CheckoutScreen({navigation , route}) {
    const {uri} = route.params;
    return (
        <SafeAreaView
            style={{
                flex: 1,
                backgroundColor: theme.colors.background
            }}
        >
            <WebView

                style={{
                    flex: 1,
                }}
                originWhitelist={['*']}
                source={{uri :uri}}
            />
        </SafeAreaView>
    )
}

export default CheckoutScreen
