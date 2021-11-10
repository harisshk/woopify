import React from 'react';
import { View, Image, TouchableOpacity, Text } from 'react-native';
import normalize from 'react-native-normalize';
import { icons } from '../constant';
import { theme } from '../utils/theme';
export const CustomHeader = ({ navigation, title }) => {
    return (
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
                onPress={()=>{
                    navigation.goBack();
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
                {title}
            </Text>
        </View>
    )
}