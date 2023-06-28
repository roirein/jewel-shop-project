import { Typography } from "@mui/material";

const ErrorLabelComponent = (props) => {
    return (
        <Typography
            textAlign="right"
            variant="caption"
            color="error"
            component="p"
        >
            {props.label}
        </Typography>
    )
}

export default ErrorLabelComponent