import React, { useState } from 'react';
import { Image, View, FlatList, TouchableOpacity, Dimensions, ActivityIndicator } from "react-native"
import normalize from "react-native-normalize"
import { theme } from "../../utils/theme"
const { height } = Dimensions.get('window');
import Lightbox from 'react-native-lightbox';


export const Gallery = ({ navigator, activeIndex, images, color = "black" }) => {
    const [currIndex, setCurrentIndex] = useState(activeIndex);
    const [isLoading, setIsLoading] = useState(true);
    return (
        <View>
            {
                isLoading && <ActivityIndicator color={color} />
            }

            <Lightbox navigator={navigator}>

                <Image
                    source={{ uri: images[currIndex].src }}
                    style={{
                        width: '100%',
                        height: height / 2.6,
                        padding: normalize(5)
                    }}
                    resizeMode="contain"
                    onLoadEnd={() => {
                        setIsLoading(false)
                    }}
                    onLoad={() => {
                        setIsLoading(false);
                    }}

                    onLoadStart={() => {
                        setIsLoading(true);
                    }}
                />

            </Lightbox>
            <FlatList
                data={images}
                horizontal
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    marginVertical: normalize(20)
                }}
                showsHorizontalScrollIndicator={false}
                renderItem={({ item, index }) => {
                    return (
                        <TouchableOpacity
                            onPress={() => {
                                setCurrentIndex(index);
                            }}
                            style={{
                                marginRight: normalize(10),

                            }}

                        >
                            <Image
                                resizeMode="contain"
                                style={[
                                    currIndex === index && {
                                        borderColor: theme.colors.primary,
                                        borderWidth: 2,
                                    },
                                    {
                                        height: normalize(80),
                                        width: normalize(80),
                                        borderRadius: normalize(15),

                                    }]}
                                source={{ uri: item.src }}
                            />
                        </TouchableOpacity>
                    )
                }}
                keyExtractor={item => item.id}
            />
        </View>
    )
}