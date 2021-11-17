import React from 'react'
import { Dimensions, TouchableOpacity, Image, Text } from 'react-native';
import normalize from 'react-native-normalize';
import { getProductInfo } from '../services/products';
import { theme } from '../utils/theme';
import Toast from 'react-native-simple-toast';


function ProductView01({ item, navigation, isFromCategory = false }) {
    return (
        <TouchableOpacity
            onPress={async() => {
                if (true === isFromCategory) {
                    try{
                        const data = await getProductInfo(item.id);
                        navigation.navigate('ProductListeningScreen', { product: data?.product });
                    }catch(error){
                        Toast.show('Something went wrong');
                    }
                    return;
                }
                navigation.navigate('ProductListeningScreen', { product: item });
            }}
            style={{
                width: '49%',
                // margin: normalize(5),
                // justifyContent: "center",
                // padding: normalize(10),
                alignSelf: "center",
                height: normalize(260),
                borderRadius: normalize(2),
                elevation: 2,
                // borderWidth: 2,
                // borderColor: "#e3e3e3",
                marginVertical: normalize(2),
                padding: normalize(12),
                shadowColor: theme.colors.primary,
                
                // backgroundColor: "red"
            }}
        >
            <Image
                style={{
                    // backgroundColor: theme.colors.primary,
                    width: '100%',
                    // height: '80%',
                    padding: normalize(5),
                    alignSelf: "center",
                    borderRadius: normalize(2),
                    flex:1,
                }}
                resizeMode="contain"
                source={{ uri:item?.images ? item?.images[0]?.src : item?.featured_image?.url }}
            />
            <Text

                style={{
                    fontWeight: theme.fontWeight.medium,
                    marginTop: normalize(3),
                    color: theme.colors.black,
                    fontSize: theme.fontSize.medium,
                }}
                numberOfLines={2}
            >
                {item.title}
            </Text>
            {item?.variants &&
                <Text
                    style={{
                        fontWeight: theme.fontWeight.medium,
                        fontSize: theme.fontSize.subheading,
                        marginVertical: normalize(8),
                        color: theme.colors.primary
                    }}
                >
                    ${item?.variants[0]?.price || item?.price}
                </Text>
            }
        </TouchableOpacity>
    )
}

export default ProductView01
