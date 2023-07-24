import { ThemeProvider } from "@mui/material"
import theme from '../components/application/AppTheme';
import AppTemplate from "../components/application/AppTemplate";
import { IntlProvider } from "react-intl";
import messages from '../translations/locales/he.json'
import ContextProvider from "../context/ContextProvider";
import { Provider } from "react-redux";
import store from "../store";

const MyApp = ({Component, pageProps}) => {
    return (
        <ThemeProvider theme={theme}>
            <IntlProvider messages={messages}>
                <Provider store={store}>
                    <AppTemplate>
                        <Component {...pageProps}/>
                    </AppTemplate>
                </Provider>
            </IntlProvider>
        </ThemeProvider>
    )
}

export default MyApp