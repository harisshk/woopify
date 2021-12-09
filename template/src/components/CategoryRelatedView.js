import React from 'react'
import { View } from 'react-native';

function CategoryRelatedView({item, navigation}) {
    return (
        <View>
            {item.tile}
        </View>
    )
}

export default CategoryRelatedView
