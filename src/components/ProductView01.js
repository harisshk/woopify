import React from 'react'
import { Dimensions, TouchableOpacity, Image, Text } from 'react-native';
import normalize from 'react-native-normalize';
import { out } from 'react-native/Libraries/Animated/Easing';
import { theme } from '../utils/theme';

const { width } = Dimensions.get('screen');

function ProductView01({ item, navigation, isFromCategory = false }) {
    return (
        <TouchableOpacity
            onPress={() => {
                // if (true === isFromCategory) {
                //     // let url = atob();

                //     // url.substring(56);
                //     let input = item.id+"";
                //     console.log(input)
                //     let str = input.replace(/=+$/, '');
                //     let output = '';

                //     if (str.length % 4 == 1) {
                //         throw new Error("'atob' failed: The string to be decoded is not correctly encoded.");
                //     }
                //     for (let bc = 0, bs = 0, buffer, i = 0;
                //         buffer = str.charAt(i++);

                //         ~buffer && (bs = bc % 4 ? bs * 64 + buffer : buffer,
                //             bc++ % 4) ? output += String.fromCharCode(255 & bs >> (-2 * bc & 6)) : 0
                //     ) {
                //         buffer = chars.indexOf(buffer);
                //     }
                //     console.log(output)
                //     navigation.navigate('ProductScreen', { product: {id : output.substring(56)} });

                // }
                navigation.navigate('ProductScreen', { product: item });
            }}
            style={{
                width: '46%',
                margin: normalize(5),
                justifyContent: "center",
                backgroundColor: theme.colors.imageBackground,
                padding: normalize(10),
                alignSelf: "center",
                height: normalize(210),
                borderRadius: normalize(15),
                elevation: 2,
            }}
        >
            <Image
                style={{
                    backgroundColor: theme.colors.imageBackground,
                    width: '100%',
                    height: normalize(140),
                    padding: normalize(5),
                    alignSelf: "center",
                    borderRadius: normalize(12),
                }}
                resizeMode="contain"
                source={{ uri: item.images[0].src }}
            />
            <Text

                style={{
                    fontWeight: theme.fontWeight.bold,
                    marginTop: normalize(12),
                    color: "grey"
                }}
            >
                {item.title.substring(0, 15)} {item.title.length > 15 && "..."}
            </Text>
            {item?.variants &&
                <Text
                    style={{
                        fontWeight: theme.fontWeight.medium,
                        fontSize: theme.fontSize.paragraph,
                        marginVertical: normalize(8)
                    }}
                >
                    ${item?.variants[0]?.price}
                </Text>
            }
        </TouchableOpacity>
    )
}

export default ProductView01
