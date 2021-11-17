import React, { useState, createRef, useRef } from 'react';
import { Image, View, FlatList, TouchableOpacity, Dimensions, ActivityIndicator, Text, Animated } from "react-native"
const { height } = Dimensions.get('window');
import Lightbox from 'react-native-lightbox-v2';
import GestureRecognizer from 'react-native-swipe-gestures';



export const Gallery = ({
    navigator,
    activeIndex = 0,
    images,
    loaderColor = "black",
    borderColor = "red",
    thumbnailImageStyles = {
        height: 80,
        width: 80,
        borderRadius: 7,
        backgroundColor: "black"
    },
    mainImageStyle = {
        height: height / 2.4,
    },
    noImageFoundText = "No Image found"
}) => {
    const [currIndex, setCurrentIndex] = useState(activeIndex);
    const [isLoading, setIsLoading] = useState(false);
    const onSwipeLeft = () => {
        Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 1000
        }).start();



        setTimeout(function () {
            setCurrentIndex(currIndex === 0 ? images.length - 1 : currIndex - 1);

            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 1000
            }).start();
        }, 800);
        flatList.current.scrollToIndex({
            index: currIndex - 2 >= 0 ? currIndex - 1 : images.length - 1,
            animated: true,
        });
    };

    const onSwipeRight = () => {
        Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 1000
        }).start();



        setTimeout(function () {
            setCurrentIndex(currIndex === images.length - 1 ? 0 : currIndex + 1);


            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 1000
            }).start();
        }, 800);
        flatList.current.scrollToIndex({
            index: currIndex + 1 === images.length ? 0 : currIndex,
            animated: true,
        });
    };



    const flatList = createRef();

    const fadeAnim = useRef(new Animated.Value(1)).current;

    return (
        <View>
            {
                isLoading && <ActivityIndicator color={loaderColor} />
            }
            {images.length > 0 ?
                <GestureRecognizer
                    onSwipeLeft={(state) => onSwipeRight()}
                    onSwipeRight={(state) => onSwipeLeft()}
                    config={{

                        velocityThreshold: 0.3,
                        directionalOffsetThreshold: 80
                    }}
                    style={{
                        flex: 1,
                    }}
                >
                    <Animated.View
                        style={[
                            { ...mainImageStyle },
                            { opacity: fadeAnim }
                        ]}
                    >

                        <Lightbox navigator={navigator}>

                            <Image
                                source={{ uri: images[currIndex].src }}
                                style={{
                                    height: '100%',
                                    padding: 2,
                                    borderRadius: 2,
                                    width: '100%',

                                }}
                                resizeMode="contain"
                                onLoadEnd={() => {
                                    setIsLoading(false)
                                }}
                                onLoad={() => {
                                    setIsLoading(false);
                                }}

                                onLoadStart={() => {
                                    // setIsLoading(true);
                                }}
                            />

                        </Lightbox>
                    </Animated.View>
                </GestureRecognizer>
                :
                <View
                    style={[{ ...mainImageStyle },
                    {
                        width: '100%',
                        padding: 5,
                        justifyContent: "center"
                    }]}
                >
                    <Text
                        style={{
                            textAlign: "center",
                            fontSize: 20
                        }}
                    >
                        {noImageFoundText}
                    </Text>
                </View>
            }
            <FlatList

                flatListRef={React.createRef()}
                ref={flatList}
                data={images}
                horizontal
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    marginVertical: 20
                }}
                showsHorizontalScrollIndicator={false}
                renderItem={({ item, index }) => {
                    return (
                        <TouchableOpacity
                            onPress={() => {
                                setCurrentIndex(index);
                            }}
                            style={{
                                marginRight: 10,
                            }}
                            key={item.id}

                        >
                            <Image
                                resizeMode="contain"
                                style={[
                                    { ...thumbnailImageStyles },
                                    currIndex === index && {
                                        borderColor: borderColor,
                                        borderWidth: 2,
                                    },
                                ]}
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