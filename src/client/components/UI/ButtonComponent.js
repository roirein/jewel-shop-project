import { Button, Typography, useTheme } from "@mui/material";

const ButtonComponent = (props) => {

    const theme = useTheme()

    return (
        <Button
            type={props.type}
            onClick={() => props.onClick()}
            variant="contained"
            color="primary"
            sx={{
                width: '100%',
                height: '100%',
                '&.hover': {
                    backgroundColor: ''
                }
            }}
        >
            <Typography
                variant="button"
                fontWeight="bold"
                color="secondary"
            >
                {props.label}
            </Typography>
        </Button>
    )
}

export default ButtonComponent