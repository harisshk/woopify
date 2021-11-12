import React from 'react'
import { View, Image, Text, TouchableOpacity } from 'react-native'
import normalize from 'react-native-normalize'
import { theme } from '../utils/theme'

function BannerView({
    item , 
    height = normalize(230), 
    width = '100%', 
    text1, 
    text2, 
    screen, 
    navigation
 }) {
    return (
        <View key={text1}>
            <Image
                source={item}
                style={{
                    height: height,
                    width: width
                }}
            />
            <View
                style={{
                    position: "absolute",
                    zIndex: 1,
                    backgroundColor: 'rgba(255, 255, 255, .6)' ,
                    borderRadius: normalize(4),
                    padding: normalize(12),
                    bottom: normalize(20),
                    left: normalize(20),
                }}
            >
                <Text
                    style={{
                        fontWeight: theme.fontWeight.normal,
                        lineHeight: theme.lineHeight.medium,
                        fontSize: theme.fontSize.paragraph
                    }}
                >
                    {text1}
                </Text>
                <Text
                    style={{
                        fontWeight: theme.fontWeight.medium,
                        fontSize: theme.fontSize.subheading,
                        lineHeight: theme.lineHeight.subheading,
                    }}
                >
                    {text2}
                </Text>
                <TouchableOpacity
                    style={{
                        backgroundColor: theme.colors.primary,
                        borderRadius: normalize(5),
                        marginTop: normalize(15)
                    }}
                    onPress={()=>{
                        navigation.navigate(screen);
                    }}
                >
                    <Text
                        style={{
                            textAlign: "center",
                            color: theme.colors.white,
                            fontSize: theme.fontSize.medium,
                            padding: normalize(5),
                            
                        }}
                    >
                        Shop Now
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default BannerView
