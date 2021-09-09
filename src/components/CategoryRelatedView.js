import React from 'react'
import { View } from 'react-native'
import { theme } from '../utils/theme'

function CategoryRelatedView({item, navigation}) {
    return (
        <View>
            {item.tile}
        </View>
    )
}

export default CategoryRelatedView
