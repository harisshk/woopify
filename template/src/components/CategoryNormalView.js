import React from 'react';
import {
    TouchableOpacity,
    Text,
    View,
    Image
} from "react-native";
import normalize from "react-native-normalize";
import { theme } from '../utils/theme';


function CategoryNormalView({ categories, navigation }) {
    return (
        <>
            {categories.map(item => {
                return (
                    <TouchableOpacity key={item.id}
                        style={{
                            marginVertical: normalize(10),
                            justifyContent: "center",
                            alignItems: "center",
                            flex: 1,
                        }}
                        onPress={() => {
                            navigation.navigate('CategoriesProductScreen', { category: item });
                        }}
                    >
                        <Image
                            source={{ uri: item?.image?.src || `https://cdn.shopify.com/s/files/1/0602/9036/7736/files/human-ls-dog_1512x.jpg?v=1635328680` }}
                            style={{
                                padding: normalize(2),
                                height: normalize(200),
                                width: '100%',
                                backgroundColor: theme.colors.imageBackground,
                            }}
                            resizeMode="contain"
                        />
                        <Text
                            style={{
                                fontSize: theme.fontSize.subheading,
                                lineHeight: theme.fontSize.subheading,
                                color: theme.colors.secondary,
                                position: "absolute",
                                bottom: normalize(14),
                                fontWeight: theme.fontWeight.medium,
                                zIndex: 1
                            }}
                            numberOfLines={1}
                        >
                            {item.title}
                        </Text>
                    </TouchableOpacity>
                )
            })}
        </>

    )
}

export default CategoryNormalView;
