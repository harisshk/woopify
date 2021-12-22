import React from 'react';
import {
    TouchableOpacity,
    Text,
    View,
    Image,
    FlatList
} from "react-native";
import normalize from "react-native-normalize";
import { theme } from '../utils/theme';


function CategoryRoundedView({ categories, navigation }) {
    return (
        <>
            <FlatList
                data={categories}
                horizontal
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                style={{
                    marginBottom: normalize(17)
                }}
                keyExtractor={(item) => item.id}
                renderItem={({item}) => {
                    return (
                        <TouchableOpacity
                            key={item.id}
                            style={{
                                marginHorizontal: normalize(10),
                                justifyContent: "center",
                                alignItems: "center",
                                height: normalize(120),
                                width: normalize(100),
                             
                            }}
                            onPress={() => {
                                navigation.navigate('CategoriesProductScreen', { category: item });
                            }}
                        >
                            <Image
                                source={{ uri: item?.image?.src || `https://cdn.shopify.com/s/files/1/0602/9036/7736/files/human-ls-dog_1512x.jpg?v=1635328680` }}
                                style={{
                                    padding: normalize(2),
                                    height: "72%",
                                    width: "85%",
                                    backgroundColor: theme.colors.white,
                                    borderRadius: normalize(100)
                                }}
                                // resizeMode="contain"
                            />
                            <Text
                                style={{
                                    fontSize: theme.fontSize.paragraph,
                                    lineHeight: theme.fontSize.paragraph,
                                    color: theme.colors.secondary,
                                    marginTop: normalize(10)
                                }}
                                numberOfLines={1}
                            >
                                {item.title}
                            </Text>
                        </TouchableOpacity>
                    )
                }}
            />
        </>
    )
}

export default CategoryRoundedView;
