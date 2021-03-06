import React, { useState } from 'react'
import { Text, TouchableOpacity, View, Image } from 'react-native'
import normalize from 'react-native-normalize';
import { List } from 'react-native-paper';
import { deleteAddress, getCustomerById } from '../services/customer';
import { theme } from '../utils/theme';
import SkeletonContent from 'react-native-skeleton-content-nonexpo';
import { icons } from '../constant';


function AddressView({ navigation, address, canEdit, customer, setCustomer }) {
    const { address1, address2, name, province, city, country, zip } = address;
    const [isLoading, setIsLoading] = useState(false);
    const deleteAddressHandler = async () => {
        setIsLoading(true);
        await deleteAddress(customer.id, address.id);
        const data = await getCustomerById(customer.id);
        setCustomer({ ...data });
        setIsLoading(false);
    }
    return (
        <SkeletonContent
            containerStyle={{ width: '100%' }}
            isLoading={isLoading}
            layout={[
                {
                    width: '100%',
                    height: normalize(120),
                    marginVertical: normalize(5),
                    key: address.id
                },
            ]}
        >
            <View>
                <View
                    style={{
                        backgroundColor: theme.colors.imageBackground,
                        padding: normalize(15),
                        borderRadius: normalize(12),
                        flexDirection: "row",
                        marginVertical: normalize(5),
                        elevation: normalize(5),
                        alignItems: "center"
                    }}
                >

                    <View
                        style={{
                            flex: .8
                        }}
                    >
                        <Text
                            style={{
                                fontSize: theme.fontSize.paragraph,
                                fontWeight: theme.fontWeight.medium,
                                lineHeight: theme.lineHeight.medium
                            }}
                        >
                            {name},
                        </Text>
                        <Text
                            style={{
                                fontSize: theme.fontSize.paragraph,
                                fontWeight: theme.fontWeight.normal,
                                lineHeight: theme.lineHeight.paragraph
                            }}
                        >
                            {address1}, {address2},
                        </Text>

                        <Text
                            style={{
                                fontSize: theme.fontSize.paragraph,
                                fontWeight: theme.fontWeight.normal,
                                lineHeight: theme.lineHeight.paragraph
                            }}
                        >
                            {city}, {province},
                        </Text>
                        <Text
                            style={{
                                fontSize: theme.fontSize.paragraph,
                                fontWeight: theme.fontWeight.normal,
                                lineHeight: theme.lineHeight.paragraph
                            }}
                        >
                            {zip}, {country}.
                        </Text>
                        <Text
                            style={{
                                fontSize: theme.fontSize.paragraph,
                                fontWeight: theme.fontWeight.medium,
                                lineHeight: theme.lineHeight.paragraph,
                                marginTop: normalize(5),
                                color: theme.colors.primary
                            }}
                        >
                            {address.default === true && "(Default Address)"}
                        </Text>
                    </View>
                    <View
                        style={{
                            flex: .2,
                            justifyContent: "space-around",
                        }}
                    >
                        <TouchableOpacity
                            onPress={() => {
                                navigation.navigate('AddAddressScreen', { toUpdateAddress: true, address: address })
                            }}
                            style={{
                                alignSelf: "center",
                                marginVertical: normalize(10)
                            }}
                        >
                            <Image
                                source={icons?.EDIT}
                                style={{
                                    padding: normalize(1),
                                    height: normalize(20),
                                    width: normalize(20),
                                    
                                }}
                            />
                        </TouchableOpacity>
                        {address.default === false &&
                            <TouchableOpacity
                                onPress={deleteAddressHandler}
                                style={{
                                    alignSelf: "center",
                                    marginVertical: normalize(10)
                                }}
                            >
                            <Image
                                source={icons?.DELETE}
                                style={{
                                    padding: normalize(1),
                                    height: normalize(22),
                                    width: normalize(22),
                                }}
                            />
                            </TouchableOpacity>
                        }
                    </View>

                </View>

            </View>
        </SkeletonContent>
    )
}

export default AddressView
