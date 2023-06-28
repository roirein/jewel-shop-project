import { Stack } from "@mui/material";

const CenteredStack = (props) => {
    return (
        <Stack
            justifyContent="center"
            alignItems="center"
            sx={props.sx}
            {...props}
        >
            {props.children}
        </Stack>
    )
}

export default CenteredStack;