import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material';
import { useContext } from 'react';
import AppContext from '../../../context/AppContext';
import ButtonComponent from '../../../components/UI/ButtonComponent';
import { useIntl } from 'react-intl';
import { buttonMessages, modelsPageMessages } from '../../../translations/i18n';

const ModelCardComponent = (props) => {

  const contextValue = useContext(AppContext)  
  const intl = useIntl();
  const theme = useTheme();

  return (
    <Card sx={{ maxWidth: 345, margin: '0 auto' }}>
      <CardMedia
        component="img"
        alt={props.title}
        height="140"
        image={props.image}
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {props.title}
        </Typography>
        <Typography variant="body2">
            {props.description}
        </Typography>
      </CardContent>
      {/* <CardActions>
        {contextValue.permissionLevel === 1 && (
            <>
                {(props.status === 1 || props.status === 2) && (
                    <>
                        <ButtonComponent
                            label={intl.formatMessage(buttonMessages.approve)}
                            onClick={() => {
                                contextValue.socket.emit('model-respose', {
                                    approved: true
                                })
                            }}
                        />
                        <ButtonComponent
                            label={intl.formatMessage(buttonMessages.reject)}
                        />
                    </>
                )}
                {props.status === 3 && (
                    <ButtonComponent
                        label={intl.formatMessage(modelsPageMessages.updatePrice)}
                    />
                )}
            </>
        )}

        <Button size="small">Share</Button>
        <Button size="small">Learn More</Button>
      </CardActions> */}
    </Card>
  );
}

export default ModelCardComponent