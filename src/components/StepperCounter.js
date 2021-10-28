import React from 'react'
import { theme } from '../utils/theme';
import {View, TouchableOpacity, Text } from 'react-native';
import normalize from 'react-native-normalize';
function StepperCounter({max, min, curr, setCurr, policy}) {
    return (
        <View
            style={{
                flexDirection: "row",
                width: '70%',
                justifyContent: "center",
                alignItems: "center",
                marginVertical: normalize(15),
                alignSelf: "center"
            }}
        >
            <TouchableOpacity
                style={{
                    backgroundColor: theme.colors.primary,
                    alignSelf: "center",
                    height: normalize(50),
                    justifyContent: "center",
                    flex: 1,
                    borderTopLeftRadius: normalize(8),
                    borderBottomLeftRadius: normalize(8)
                }}
                onPress={() => {
                    if (max >= curr || policy === "deny") {
                        setCurr(curr + 1);
                    }
                }}
            >
                <Text
                    style={{
                        color: theme.colors.white,
                        textAlign: "center",
                        fontSize: theme.fontSize.title,
                        fontWeight: theme.fontWeight.bold
                    }}
                >
                    +
                </Text>
            </TouchableOpacity>
            <View
                style={{
                    backgroundColor: theme.colors.secondary,
                    flex: 1,
                    height: normalize(50),
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <Text
                    style={{
                        color: theme.colors.white,
                        fontSize: theme.fontSize.subheading
                    }}
                >
                    {curr}
                </Text>
            </View>
            <TouchableOpacity
                onPress={() => {
                    if (curr >= 2) {
                        setCurr(curr - 1);
                    }
                }}
                style={{
                    backgroundColor: theme.colors.primary,
                    alignSelf: "center",
                    height: normalize(50),
                    justifyContent: "center",
                    flex: 1, 
                    borderTopRightRadius: normalize(8),
                    borderBottomRightRadius: normalize(8)
                }}
            >
                <Text
                    style={{
                        color: theme.colors.white,
                        textAlign: "center",
                        fontSize: theme.fontSize.title,
                        fontWeight: theme.fontWeight.bold
                    }}
                >
                    -
                </Text>
            </TouchableOpacity>
        </View>
    )
}

export default StepperCounter
