import { CircularProgress } from "@mui/material"
import CenteredStack from "./CenteredStack"


const LoadingSpinner = () => {
    return (
        <CenteredStack
            width="100%"
            height="100%"
            sx={{
                backgroundColor: 'grey',
                opacity: 0.5
            }}
        >   
            <CircularProgress/>
        </CenteredStack>
    )
}

export default LoadingSpinner