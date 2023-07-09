import { createTheme } from "@mui/material";

const theme = createTheme({
    direction: 'rtl',
    typography: {
        fontFamily: 'Assistant, sans-serif',
        fontWeightBold: 700
    },
    palette: {
        primary: {
            main: '#a05444',
            contrastText: '#000000'
        },
        secondary: {
            main: '#ffffff'
        },
    },
    spacing: [2, 4, 8, 12, 16, 24, 32 , 48, 64]
})

export default theme