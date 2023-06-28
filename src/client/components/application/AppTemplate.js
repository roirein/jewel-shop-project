import {Box, AppBar, useTheme} from '@mui/material';
import CenteredStack from '../UI/CenteredStack';

const AppTemplate = (props) => {

    const theme = useTheme();

    return (
        <Box
            width="100%"
            height="98vh"
            border={`${theme.spacing(1)} solid ${theme.palette.primary.main}`}
        >
            <AppBar
                position="static"
                color="primary"
                sx={{
                    height: '50px'
                }}
            />
            <CenteredStack>
                <img
                    width="250"
                    height="150"
                    src={'/images/logo1.png-1.svg'}
                />
            </CenteredStack>
            {props.children}
        </Box>
    )
}

export default AppTemplate