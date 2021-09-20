import React from 'react'
import { Dimensions, TouchableOpacity, Image, Text } from 'react-native';
import normalize from 'react-native-normalize';
import { out } from 'react-native/Libraries/Animated/Easing';
import { getProductInfo } from '../services/products';
import { theme } from '../utils/theme';
import Toast from 'react-native-simple-toast';
const { width } = Dimensions.get('screen');

function ProductView01({ item, navigation, isFromCategory = false }) {
    return (
        <TouchableOpacity
            onPress={async() => {
                if (true === isFromCategory) {
                    try{
                        const data = await getProductInfo(item.id);
                        navigation.navigate('ProductScreen', { product: data?.product });
                    }catch(error){
                        Toast.show('Something went wrong');
                    }
                    return;
                }
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
