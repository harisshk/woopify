import React from 'react';
import {Text} from 'react-native';
import normalize from 'react-native-normalize';
import { theme } from '../utils/theme';


function SubHeading({ children , style }) {
    return (
        <Text style={{
            marginTop: normalize(20),
            marginBottom: normalize(15),
            fontWeight: theme.fontWeight.bold,
            fontSize: theme.fontSize.paragraph,
            ...style
        }}>
            {children}
        </Text>
    )
}

export default SubHeading
