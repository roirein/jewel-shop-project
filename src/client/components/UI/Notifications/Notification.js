import { Stack, Typography, useTheme, alpha } from "@mui/material"

const Notification = (props) => {

    const theme = useTheme();

    return (
        <Stack
            direction="row"
            columnGap={theme.spacing(3)}
            sx={{
                p: theme.spacing(3),
                borderBottom: `${theme.spacing(0)} solid ${theme.palette.grey.main}`,
                backgroundColor: props.read ? 'white' : alpha(theme.palette.secondary.main, 0.5),
                cursor: 'pointer',
                direction: theme.direction
            }}
            onClick={() => props.onClick()}
            //onClick={() => props.onClick(props.resoucreId, props.resourceType)}
        >
            {props.icon}
            <Typography
                variant="body1"
            >
                {props.message}
            </Typography>
        </Stack>
    )
}

export default Notification