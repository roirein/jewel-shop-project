import { InputLabel, useTheme } from "@mui/material";

const InputLabelComponent = (props) => {

    const theme = useTheme()

    return (
        <InputLabel
            sx={{
                direction: (theme) => theme.direction
            }}
        >
            {props.label}
        </InputLabel>
    )
}

export default InputLabelComponent