import { red } from '@material-ui/core/colors';
import { createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: red[800],
    },
    secondary: {
      main: '#FFF',
    },
    error: {
      main: red.A400,
    },
    background: {
      default: '#fff',
    },
  },
  overrides : {
    MuiTabs : {
      root : {
        //backgroundColor : red[800]
      },
    },
    MuiTab : {
      textColorPrimary : {
        color : '#CCC',
      },
      textColorInherit : {
        color : '#FFF'
      },
      selected : {
        color : '#FFF',
      }
    }
  }
});

export default theme;