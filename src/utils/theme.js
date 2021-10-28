import { DefaultTheme } from 'react-native-paper';
import normalize from 'react-native-normalize';
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
        bottomTabBgColor:"#212121",
        bottomTabActiveBg: "#F8F8F8",
        inactiveTabIcons: "white",
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