import React, { Component } from "react";
import {
  Container,
  Avatar,
  Typography,
  TextField,
  Button,
  Paper,
} from "@material-ui/core";
import LockOutlined from "@material-ui/icons/LockOpenOutlined";
import { compose } from "recompose";
import { consumerFirebase } from "../../server";
import { iniciarSesion } from "../../sesion/actions/sesionAction";
import { StateContext } from "../../sesion/store";
import { openMensajePantalla } from "../../sesion/actions/snackBarAction";

const style = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
  },
  paper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "20px",
  },
  avatar: {
    margin: 8,
    backgroundColor: "blue",
  },
  form: {
    width: "100%",
    marginTop: 8,
  },
};

class Login extends Component {
  static contextType = StateContext;

  state = {
    firebase: null,
    usuario: {
      email: "",
      password: "",
    },
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.firebase === prevState.firebase) {
      return null;
    }

    return {
      firebase: nextProps.firebase,
    };
  }

  onChange = (e) => {
    let usuario = Object.assign({}, this.state.usuario);
    usuario[e.target.name] = e.target.value;
    this.setState({
      usuario: usuario,
    });
  };

  login = async (e) => {
    e.preventDefault();
    const [{ sesion }, dispatch] = this.context;
    const { firebase, usuario } = this.state;
    const { email, password } = usuario;
    let callback = await iniciarSesion(dispatch, firebase, email, password);
    if (callback.status) {
      this.props.history.push("/");
    } else {
      openMensajePantalla(dispatch, {
        open: true,
        mensaje: callback.mensaje.message,
      });
    }
  };

  render() {
    return (
      <Container maxWidth="xs">
        <div style={style.container}>
          <Paper style={style.paper}>
            <Avatar stlye={style.avatar}>
              <LockOutlined />
            </Avatar>
            <Typography component="h1" variant="h5">
              Ingrese Usuario
            </Typography>
            <form style={style.form}>
              <TextField
                variant="outlined"
                label="E-Mail"
                name="email"
                fullWidth
                margin="normal"
                onChange={this.onChange}
                value={this.state.usuario.email}
              />
              <TextField
                variant="outlined"
                label="Contraseña"
                name="password"
                type="password"
                fullWidth
                margin="normal"
                onChange={this.onChange}
                value={this.state.usuario.password}
              />
              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                color="primary"
                onClick={this.login}
              >
                Enviar
              </Button>
            </form>
          </Paper>
        </div>
      </Container>
    );
  }
}

export default compose(consumerFirebase)(Login);
