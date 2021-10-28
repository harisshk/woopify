import React, { useState } from 'react'
import { SafeAreaView, View, ActivityIndicator } from 'react-native'
import normalize from 'react-native-normalize';
import WebView from 'react-native-webview'
import { CustomHeader } from '../components/CustomHeader';
import { theme } from '../utils/theme'

function CheckoutScreen({navigation , route}) {
    const {uri} = route.params;
    const[isLoading,setIsLoading] = useState(true);
    return (
        <SafeAreaView
            style={{
                flex: 1,
                backgroundColor: theme.colors.background
            }}
        ><CustomHeader
                navigation={navigation}
                title={'Checkout'}
            />
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
                source={{uri :uri}}
            />
        </SafeAreaView>
    )
}

export default CheckoutScreen
