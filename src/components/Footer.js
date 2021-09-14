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
            marginBottom: normalize(10)
          }}
          > 
            © Audy Global Enterprise 2021
        </Text>
    )
}

export default Footer
