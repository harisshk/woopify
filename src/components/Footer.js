import React from 'react'
import { Text } from 'react-native'
import normalize from 'react-native-normalize'
import { theme } from '../utils/theme'

function Footer() {
    return (
        <Text
          style={{
            textAlign: "center",
            fontSize: theme.fontSize.paragraph,
            marginVertical: normalize(8),
            color: "#9e9e9e",
            marginTop: normalize(20),
            marginBottom: normalize(10),
            width: '90%',
            alignSelf: "center",
            lineHeight: theme.lineHeight.subheading
          }}
          > 
            © 2021 Pet N Pic All Rights Reserved by AGE | Made with ❤️ by AGE | Proudly Made In USA
        </Text>
    )
}

export default Footer
