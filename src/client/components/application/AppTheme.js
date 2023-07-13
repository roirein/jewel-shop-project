import { createTheme } from "@mui/material";

const theme = createTheme({
    direction: 'rtl',
    typography: {
        fontFamily: 'Assistant, sans-serif',
        fontWeightBold: 700,
    },
    palette: {
        primary: {
            main: '#a05444',
            contrastText: '#000000'
        },
        secondary: {
            main: '#d99182',
            contrastText: '#ffffff'
        },
        grey: {
            main: '#888888'
        },
        
    },
    spacing: [2, 4, 8, 12, 16, 24, 32 , 40, 48, 64]
})

export default theme