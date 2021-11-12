import React, { useEffect, useState } from 'react'
import { ActivityIndicator, SafeAreaView, ScrollView, View } from 'react-native'
import { FlatList } from 'react-native-gesture-handler';
import normalize from 'react-native-normalize';
import { CustomHeader } from '../components/CustomHeader'
import Footer from '../components/Footer';
import PolicyButton from '../components/PolicyButton';
import { getAllPolicy } from '../services/policy';
import { theme } from '../utils/theme'

function SettingScreen({ navigation }) {
    const[isLoading, setIsLoading] = useState(true);
    const[policies, setPolicies] = useState([]);

    useEffect(async()=>{
        const response = await getAllPolicy();
        setPolicies([...response?.policies || []]);
        setIsLoading(false);
    },[]);


    return (
        <SafeAreaView
            style={{
                flex: 1,
                backgroundColor: theme.colors.background
            }}
        >
            <CustomHeader
                navigation={navigation}
                title={"Store Policy"}
            />
            <View
                style={{
                    flex: 1,
                    padding: normalize(15)
                }}
            >
        
            {isLoading === true ? 
                <ActivityIndicator
                    color={theme.colors.primary}
                    style={{
                        marginVertical: normalize(40)
                    }}
                />
                :
                <View
                    style={{
                        height: '75%'
                    }}
                >
                <FlatList

                    style={{
                        flex: 1
                    }}
                    showsVerticalScrollIndicator={false}
                    data={policies}
                    keyExtractor={item => item?.handle}

                    renderItem={({item}) => <PolicyButton title={item?.title} redirect={item?.url} handle={item?.handle} />}
                />
                </View>
                
            }
            <Footer />
            </View>
        </SafeAreaView>
    )
}

export default SettingScreen
