import React, { useEffect, useState } from 'react'
import { ActivityIndicator, SafeAreaView, View } from 'react-native'
import normalize from 'react-native-normalize';
import WebView from 'react-native-webview'
import { CustomHeader } from '../components/CustomHeader';
import { getOrdersByOrderId } from '../services/orders';
import { theme } from '../utils/theme'

function OrderTrackingScreen({ navigation, route }) {
    const { fetchFromId , orderId } = route.params;
    const [isLoading, setIsLoading] = useState(true);
    const [isOrderFetched,setIsOrderFetched] = useState(fetchFromId ? true : false);
    const [uri,setUri] = useState(route.params?.uri)
    useEffect(async()=>{
        if(fetchFromId === true){
            try{
                let response = await getOrdersByOrderId(orderId);
                console.log(response)
                let {order} = response;
                setUri(order?.order_status_url);

                setIsOrderFetched(false);
            }catch(error){
                setIsOrderFetched(false);
                console.log(error);
                console.log('-----------------------OrderTracking Line 23------------------------');
            }
            
        }
    },[])
    return (
        <SafeAreaView
            style={{
                flex: 1,
                backgroundColor: theme.colors.background
            }}
        >
            <CustomHeader navigation={navigation} title={"Order Tracking"} />
            {isOrderFetched === true || isLoading === true ?
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
            {isOrderFetched === false && 
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
            }
        </SafeAreaView>
    )
}

export default OrderTrackingScreen;
