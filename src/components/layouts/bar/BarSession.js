import React, { Component } from "react";
import {
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  Avatar,
  Tooltip,
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { consumerFirebase } from "../../../server";
import { compose } from "recompose";
import { StateContext } from "../../../sesion/store";
import { salirSesion } from "../../../sesion/actions/sesionAction";
import MenuIzquierda from "./MenuIzquierda";
import fotoUsuarioTemp from "../../../logo.svg";
import { withRouter } from "react-router-dom";

const styles = (theme) => ({
  sectionDesktop: {
    display: "none",
    [theme.breakpoints.up("md")]: {
      display: "flex",
    },
  },
  sectionMobile: {
    display: "flex",
    [theme.breakpoints.up("md")]: {
      display: "none",
    },
  },
  grow: {
    flexGrow: 1,
  },
  avatarSize: {
    width: 40,
    height: 40,
  },
  listItemText: {
    fontSize: "14px",
    fontWeight: 600,
    paddinLeft: "15px",
    color: "#212121",
  },
  list: {
    width: 300,
  },
});

class BarSesion extends Component {
  static contextType = StateContext;

  state = {
    firebase: null,
    rigth: false,
    left: false,
  };

  prueba = () => {
    console.log("pruebacompletada");
  };

  salirSesionApp = () => {
    const { firebase } = this.state;
    const [{ sesion }, dispatch] = this.context;
    salirSesion(dispatch, firebase).then((success) => {
      this.props.history.push("/iniciar_sesion");
    });
  };

  toggleDrawer = (side, open) => () => {
    this.setState({
      [side]: open,
    });
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    let nuevosObjetos = {};
    if (nextProps.firebase != prevState.firebase) {
      nuevosObjetos.firebase = nextProps.firebase;
    }
    return nuevosObjetos;
  }

  render() {
    const { classes } = this.props;
    const [{ sesion }, dispatch] = this.context;
    const { usuario } = sesion;
    let textoUsuario = `${usuario.nombre} ${usuario.apellido}`;

    return (
      <div>
        <Drawer open={this.state.left} anchor="left">
          <div role="button">
            <MenuIzquierda classes={classes} close={this.toggleDrawer} />
          </div>
        </Drawer>
        <Toolbar>
          <IconButton color="inherit" onClick={this.toggleDrawer("left", true)}>
            <i className="material-icons">menu</i>
          </IconButton>
          <Typography variant="h6">BASMET</Typography>
          <div className={classes.grow}></div>
          <div className={classes.sectionDesktop}>
            <Typography
              variant="h6"
              style={{ paddingRight: 10, paddingTop: 15 }}
            >
              {textoUsuario}
            </Typography>
            <Tooltip title="Editar Perfil" aria-label="Editar Perfil">
              <IconButton href="/perfil/modify">
                <Avatar src={usuario.foto || fotoUsuarioTemp} />
              </IconButton>
            </Tooltip>
          </div>
          <div className={classes.sectionMobile}>
            <Tooltip title="Editar Perfil" aria-label="Editar Perfil">
              <IconButton href="/perfil/modify">
                <Avatar src={usuario.foto || fotoUsuarioTemp} />
              </IconButton>
            </Tooltip>
          </div>
        </Toolbar>
      </div>
    );
  }
}

export default compose(
  withRouter,
  consumerFirebase,
  withStyles(styles)
)(BarSesion);
