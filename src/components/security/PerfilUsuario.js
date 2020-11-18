import React, { useState, useEffect } from "react";
import { useStateValue } from "../../sesion/store";
import {
  Container,
  Avatar,
  Typography,
  Grid,
  TextField,
  Button,
  Paper,
  Breadcrumbs,
  Link,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton,
} from "@material-ui/core";
import reactFoto from "../../logo.svg";

//utils
import { consumerFirebase } from "../../server";
import { openMensajePantalla } from "../../sesion/actions/snackBarAction";
import ImageUploader from "react-images-upload";
import { v4 as uuidv4 } from "uuid";

//icons
import HomeIcon from "@material-ui/icons/Home";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";

const style = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: 100,
  },
  cardGrid: {
    paddingTop: 8,
    paddingBottom: 8,
  },
  paper: {
    backgraundColor: "#f5f5ff",
    padding: "20px",
    minheight: 650,
  },
  form: {
    padding: "20px",
    marginTop: 2,
  },
  link: {
    display: "flex",
  },
  avatar: {
    height: 70,
    width: 70,
    marginButtom: 15,
  },
};
const PrefilUsuario = (props) => {
  const [{ sesion }, dispatch] = useStateValue();
  const firebase = props.firebase;

  let [estado, cambiarEstado] = useState({
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
    id: "",
    foto: "",
  });
  const [values, setValues] = useState({
    currentPassword: "",
    showCurrentPassword: false,
    newPassword: "",
    showNewPassword: false,
  });

  const cambiarDato = (e) => {
    const { name, value } = e.target;
    cambiarEstado((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validarEstadoFormulario = (sesion) => {
    if (sesion) {
      cambiarEstado(sesion.usuario);
    }
  };

  useEffect(() => {
    if (estado.id === "") {
      validarEstadoFormulario(sesion);
    }
  });

  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  const handleClickShowCurrentPassword = () => {
    setValues({ ...values, showCurrentPassword: !values.showCurrentPassword });
  };

  const handleMouseDownCurrentPassword = (event) => {
    event.preventDefault();
  };

  const handleClickShowNewPassword = () => {
    setValues({ ...values, showNewPassword: !values.showNewPassword });
  };

  const handleMouseDownNewPassword = (event) => {
    event.preventDefault();
  };

  const subirFoto = (fotos) => {
    const foto = fotos[0];
    const claveUnicaFoto = uuidv4();
    const nombreFoto = foto.name;
    const extensionFoto = nombreFoto.split(".").pop();
    const alias = (
      nombreFoto.split(".")[0] +
      "_" +
      claveUnicaFoto +
      "." +
      extensionFoto
    )
      .replace(/\s/g, "_")
      .toLowerCase();

    firebase.guardarDocumento(alias, foto).then((metadata) => {
      firebase.devolverDocumento(alias).then((urlFoto) => {
        estado.foto = urlFoto;
        firebase.db
          .collection("Users")
          .doc(firebase.auth.currentUser.uid)
          .set({ foto: urlFoto }, { merge: true })
          .then((usuarioDB) => {
            dispatch({
              type: "INICIAR_SESION",
              sesion: estado,
              autenticado: true,
            });
          });
      });
    });
  };

  const reauthenticate = (currentPassword) => {
    const firebase = require("firebase");
    let user = props.firebase.auth.currentUser;
    const cred = firebase.auth.EmailAuthProvider.credential(user.email, currentPassword);

    return user.reauthenticateWithCredential(cred);
  };

  const guardarDatos = (e) => {
    e.preventDefault();

    if (values.newPassword.length !== 0) {
      reauthenticate(values.currentPassword).then(() => {
        let user = props.firebase.auth.currentUser;
        user.updatePassword(values.newPassword).then(function () {
          openMensajePantalla(dispatch, {
            open: true,
            mensaje: "SE ACTUALIZO LA CONTRASEÑA",
          });
        }).catch((error)=>{
          openMensajePantalla(dispatch, {
            open: true,
            mensaje: `HUVO UN ERROR ACTUALIZANDO: ${error}`,
          });
        })
      }).catch((error)=>{
        openMensajePantalla(dispatch, {
          open: true,
          mensaje: `HUVO UN ERROR AUTENTICANDO: ${error}`,
        });
      })
    }

    firebase.db
      .collection("Users")
      .doc(firebase.auth.currentUser.uid)
      .set(estado, { merge: true })
      .then((success) => {
        dispatch({
          type: "INICIAR_SESION",
          sesion: estado,
          autenticado: true,
        });
        openMensajePantalla(dispatch, {
          open: true,
          mensaje: "SE GUARDARON LOS CAMBIOS",
        });
        props.history.replace("/")
      });
  };

  let fotokey = uuidv4();

  return sesion ? (
    <Container component="main" maxWidth="md" justify="center">
      <Paper style={style.paper}>
        <Grid item xs={12} sm={12}>
          <Breadcrumbs aria-label="breadcrumbs">
            <Link color="inherit" style={style.link} href="/">
              <HomeIcon />
              Principal
            </Link>
            <Typography color="textPrimary">Editar Perfil</Typography>
          </Breadcrumbs>
        </Grid>
      </Paper>
      <Paper style={style.form}>
        <div style={style.container}>
          <Avatar style={style.avatar} src={estado.foto || reactFoto} />
        </div>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              name="nombre"
              variant="outlined"
              fullWidth
              label="Nombre"
              value={estado.nombre}
              onChange={cambiarDato}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              name="apellido"
              variant="outlined"
              fullWidth
              label="Apellido"
              value={estado.apellido}
              onChange={cambiarDato}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              name="email"
              variant="outlined"
              fullWidth
              label="E-mail"
              value={estado.email}
              onChange={cambiarDato}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              name="telefono"
              variant="outlined"
              fullWidth
              label="Telefono"
              value={estado.telefono}
              onChange={cambiarDato}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl variant="outlined" fullWidth>
              <InputLabel htmlFor="outlined-adornment-password">
                Contraseña Actual
              </InputLabel>
              <OutlinedInput
                id="outlined-adornment-password"
                type={values.showCurrentPassword ? "text" : "password"}
                value={values.currentPassword}
                onChange={handleChange("currentPassword")}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowCurrentPassword}
                      onMouseDown={handleMouseDownCurrentPassword}
                      edge="end"
                    >
                      {values.showCurrentPassword ? (
                        <Visibility />
                      ) : (
                        <VisibilityOff />
                      )}
                    </IconButton>
                  </InputAdornment>
                }
                labelWidth={140}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl variant="outlined" fullWidth>
              <InputLabel htmlFor="outlined-adornment-password">
                Nueva Contraseña
              </InputLabel>
              <OutlinedInput
                id="outlined-adornment-password"
                type={values.showNewPassword ? "text" : "password"}
                value={values.newPassword}
                onChange={handleChange("newPassword")}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowNewPassword}
                      onMouseDown={handleMouseDownNewPassword}
                      edge="end"
                    >
                      {values.showNewPassword ? (
                        <Visibility />
                      ) : (
                        <VisibilityOff />
                      )}
                    </IconButton>
                  </InputAdornment>
                }
                labelWidth={140}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} md={12}>
            <ImageUploader
              withIcon={false}
              key={fotokey}
              singleImage={true}
              buttonText="Seleccione su imagen de perfil"
              onChange={subirFoto}
              imgExtension={[".jpg", ".gif", ".png", ".jpeg"]}
              maxFileSize={5242880}
            />
          </Grid>
        </Grid>
      </Paper>
      <Paper style={style.form}>
        <Grid container justify="center">
          <Grid item xs={12} md={6}>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              color="primary"
              style={style.submit}
              onClick={guardarDatos}
            >
              GUARDAR CAMBIOS
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  ) : null;
};

export default consumerFirebase(PrefilUsuario);
