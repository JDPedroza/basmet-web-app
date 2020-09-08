import {createMuiTheme} from '@material-ui/core/styles';

const theme = createMuiTheme({
    typografy : {
        useNextVariants: true
    },
    palette : {
        primary : {
            main : '#006DBE'
        },
        common : {
            white: 'white'
        },
        secondary : {
            main : '#E53935'
        }
    },
    spacing : 10
})

export default theme;