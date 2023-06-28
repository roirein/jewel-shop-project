import { Snackbar, Alert, useTheme } from "@mui/material";

const NotificationComponent = (props) => {

    const theme = useTheme()
    
    return (
        <Snackbar
            open={props.open}
            autoHideDuration={5000}
            onClose={() => props.onClose()}
            anchorOrigin={{
                horizontal: 'right',
                vertical: 'bottom'
            }}
        >
            <Alert
                severity="info"
                onClose={() => props.onClose()}
                sx={{
                    width: '100%',
                    backgroundColor: 'white',
                    border: `${theme.spacing(1)} solid ${theme.palette.primary.main}`,
                    borderTopWidth: theme.spacing(3),
                    direction: theme.direction,
                    gap: theme.spacing(4)
                }}
            >
                {props.message}
            </Alert>
        </Snackbar>
    )
}

export default NotificationComponent