import React from 'react'
import { KeyboardAvoidingView, SafeAreaView, ScrollView } from 'react-native'
import { theme } from '../utils/theme'

function RegisterScreen() {
    return (
        <SafeAreaView
            style={{
                flex: 1,
                backgroundColor: theme.colors.background
            }}
        >
            <KeyboardAvoidingView
                style={{
                    flex: 1
                }}
                behavior="padding"
            >
                <ScrollView
                    style={{
                        flex: 1,
                        flexGrow: 1
                    }}
                >
                </ScrollView>
            </KeyboardAvoidingView>

        </SafeAreaView>
    )
}

export default RegisterScreen
