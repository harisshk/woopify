import { DefaultTheme, configureFonts } from 'react-native-paper';
import normalize from 'react-native-normalize';

// const fontConfig = {
//     web: {
//         regular: {
//             fontFamily: 'sans-serif',
//             fontWeight: 'normal',
//         },
//         medium: {
//             fontFamily: 'sans-serif-medium',
//             fontWeight: 'normal',
//         },
//         light: {
//             fontFamily: 'sans-serif-light',
//             fontWeight: 'normal',
//         },
//         thin: {
//             fontFamily: 'sans-serif-thin',
//             fontWeight: 'normal',
//         },
//     },
//     ios: {
//         regular: {
//             fontFamily: 'Jost-Regular',
//             // fontWeight: 'normal',
//         },
//         medium: {
//             fontFamily: 'Jost-Medium',
//             // fontWeight: 'normal',
//         },
//         light: {
//             fontFamily: 'Jost-Light',
//             // fontWeight: 'normal',
//         },
//         thin: {
//             fontFamily: 'Jost-Thin',
//             // fontWeight: 'normal',
//         },
//     },
//     android: {
//         regular: {
//             fontFamily: 'sans-serif',
//             fontWeight: 'normal',
//         },
//         medium: {
//             fontFamily: 'sans-serif-medium',
//             fontWeight: 'normal',
//         },
//         light: {
//             fontFamily: 'sans-serif-light',
//             fontWeight: 'normal',
//         },
//         thin: {
//             fontFamily: 'sans-serif-thin',
//             fontWeight: 'normal',
//         },
//     }
// };

export const theme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        primary: '#F1605F',
        secondary: '#212121',
        background: '#ffffff',
        focused: "red",
        unfocused: "gray",
        white: "#ffffff",
        black: "#000000",
        imageBackground: "#F8F8F8",
        disabledButton: "#EAEBEF",
        bottomTabBgColor: "#212121",
        bottomTabActiveBg: "#F8F8F8",
        inactiveTabIcons: "black",
        customize: "#E50774"
    },
    fontSize: {
        medium: normalize(18),
        paragraph: normalize(16),
        subheading: normalize(20),
        heading: normalize(24),
        title: normalize(30),
    },
    lineHeight: {
        medium: normalize(25.12),
        paragraph: normalize(21.22),
        subheading: normalize(30.9),
        heading: normalize(34.12),
        title: normalize(41.1),
    },
    fontWeight: {
        normal: "300",
        bold: "bold",
        medium: "500",
        thin: "200",
    },
};