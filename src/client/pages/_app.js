import { ThemeProvider } from "@mui/material"
import theme from '../components/application/AppTheme';
import AppTemplate from "../components/application/AppTemplate";
import { IntlProvider } from "react-intl";
import messages from '../translations/locales/he.json'

const MyApp = ({Component, pageProps}) => {
    return (
        <ThemeProvider theme={theme}>
            <IntlProvider messages={messages}>
                <AppTemplate>
                    <Component {...pageProps}/>
                </AppTemplate>
            </IntlProvider>
        </ThemeProvider>
    )
}

export default MyApp