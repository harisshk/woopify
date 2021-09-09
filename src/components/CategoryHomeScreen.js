import React from 'react';
import {TouchableOpacity , Image , Text} from 'react-native';
import normalize from 'react-native-normalize';
import { theme } from '../utils/theme';

function CategoryHomeScreen({item , navigation}) {
    return (
        <TouchableOpacity key={item.id}
            style={{
                marginRight: normalize(20),
                justifyContent: "center",
                alignItems: "center"
            }}
            onPress={()=>{
                navigation.navigate('CategoriesProductScreen',{category : item});
            }}
        >
            <Image
                source={{ uri: item.image.src }}
                style={{
                    padding: normalize(2),
                    height: normalize(65),
                    width: normalize(65),
                    borderRadius: normalize(65),
                    backgroundColor: theme.colors.secondary,
                }}
            />
            <Text
                style={{
                    fontSize: theme.fontSize.paragraph,
                    lineHeight: theme.fontSize.paragraph,
                    color: theme.colors.secondary,
                    marginTop: normalize(10)
                }}
            >{item.title.substring(0, 6)}{item.title.length > 6 && "..."}</Text>
        </TouchableOpacity>
    )
}

export default CategoryHomeScreen
