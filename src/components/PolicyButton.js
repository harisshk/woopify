import React from 'react'
import { TouchableOpacity, Text, Linking } from 'react-native';
import normalize from 'react-native-normalize';
import { theme } from '../utils/theme';

function PolicyButton({ redirect, title, handle }) {
    return (
        <TouchableOpacity
            onPress={()=>{
                try{
                    Linking.openURL(redirect);
                }catch(error){
                    console.log('Error in viewing policy');
                }
                
            }}
            key={handle}
            style={{
                paddingVertical: normalize(15),
                borderBottomWidth: 1,
                borderBottomColor: theme.colors.disabledButton
            }}
        >
            <Text
                style={{
                    color: theme.colors.secondary,
                    fontSize: theme.fontSize.medium,
                    lineHeight: theme.lineHeight.medium,
                    fontWeight: theme.fontWeight.medium
                }}
            >
                {title}
            </Text>
        </TouchableOpacity>
    )
}

export default PolicyButton;
