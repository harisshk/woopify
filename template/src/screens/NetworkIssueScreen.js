import React from 'react';
import { SafeAreaView,Text, TouchableOpacity } from 'react-native';
import normalize from 'react-native-normalize';
import { theme } from '../utils/theme';
import LottieView from 'lottie-react-native';
import NetInfo from '@react-native-community/netinfo';
function NetworkIssueScreen({
    navigation
}) {
    return (
        <SafeAreaView
            style={{
                flex: 1,
                backgroundColor: theme.colors.background
            }}
        >
            
            <LottieView
                ref={animation => {
                    this.animation = animation;
                }}
                source={require('../assets/animation/no-internet.json')}
                style={{
                    height: normalize(500),
                    // backgroundColor: "red",
                    width: '100%',
                    alignSelf: "center",
                    marginLeft: normalize(6)
                }}
            />
            <Text
                style={{
                    marginVertical: normalize(15),
                    fontSize: theme.fontSize.medium,
                    lineHeight: theme.lineHeight.paragraph,
                    fontWeight: theme.fontWeight.normal,
                    textAlign: "center"
                }}
            >
                Check your network connection
            </Text>
            <TouchableOpacity
                style={{
                    backgroundColor: theme.colors.primary,
                    width: '90%',
                    elevation: 2,
                    borderRadius: normalize(5),
                    alignSelf: "center"
                }}

                onPress={()=>{
                    NetInfo.fetch().then(state => {
                        if(state.isConnected === true){
                            navigation.goBack();
                        }
                    });
                }}
            >
                <Text
                    style={{
                        marginVertical: normalize(15),
                        fontSize: theme.fontSize.medium,
                        lineHeight: theme.lineHeight.paragraph,
                        fontWeight: theme.fontWeight.medium,
                        textAlign: "center"
                    }}
                >
                    Refresh
                </Text>
            </TouchableOpacity>
        </SafeAreaView>
    )
}

export default NetworkIssueScreen
