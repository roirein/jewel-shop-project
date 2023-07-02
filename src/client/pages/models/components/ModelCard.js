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
    <Card sx={{ maxWidth: 345, margin: '0 auto', direction: theme.direction }}>
      <CardMedia
        component="img"
        alt={props.title}
        height="250"
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
    </Card>
  );
}

export default ModelCardComponent