import {Dialog, DialogActions, DialogTitle, DialogContent} from '@mui/material'

const ModalComponent = (props) => {
    return (
        <Dialog
            open={props.open}
            maxWidth={props.width}
            fullWidth
            PaperProps={{
                sx: {
                    border: '5px solid #a05444',
                    borderTop: '15px solid #a05444'
                }
            }}
        >
            <DialogTitle
                variant='h5'
                sx={{
                    textAlign: 'right',
                    fontWeight: 'bold',
                }}
            >
                {props.title}
            </DialogTitle>
            <DialogContent>
                {props.children}
            </DialogContent>
            <DialogActions>
                {props.actions}
            </DialogActions>
        </Dialog>
    )
}

export default ModalComponent;