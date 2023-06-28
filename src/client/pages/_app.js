import { ThemeProvider } from "@mui/material"
import theme from '../components/application/AppTheme';
import AppTemplate from "../components/application/AppTemplate";
import { IntlProvider } from "react-intl";
import messages from '../translations/locales/he.json'
import ContextProvider from "../components/context/ContextProvider";

const MyApp = ({Component, pageProps}) => {
    return (
        <ThemeProvider theme={theme}>
            <IntlProvider messages={messages}>
                <ContextProvider>
                    <AppTemplate>
                        <Component {...pageProps}/>
                    </AppTemplate>
                </ContextProvider>
            </IntlProvider>
        </ThemeProvider>
    )
}

export default MyApp