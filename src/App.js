import React, { useEffect } from "react";
import Grid from "@material-ui/core/Grid";
import ListaInmobuebles from "./components/views/ListaInmobuebles";
import AppNavBar from "./components/layouts/AppNawBar";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "./App.css";
import { MuiThemeProvider } from "@material-ui/core/styles";
import Theme from "./theme/theme";
import RegistrarUsuario from "./components/security/RegistrarUsuario";
import Login from "./components/security/Login";
import { FirebaseContext } from "./server";

import { useStateValue } from "./sesion/store";
import { Snackbar } from "@material-ui/core";
import RutaAutenticada from "./components/security/RutaAutenticada";
import PrefilUsuario from "./components/security/PerfilUsuario";
import NuevoInmueble from "./components/views/NuevoInmueble";
import EditarInmuebles from "./components/views/EditarInmuebles";
import AddProvider from './components/provider/AddProvider'
import TestSelect from './components/provider/TestSelect'

function App(props) {
  let firebase = React.useContext(FirebaseContext);
  const [autentificacionIniciada, setupFirebaseInicial] = React.useState(false);

  const [{ openSnackBar }, dispatch] = useStateValue();

  useEffect(() => {
    firebase.estaIniciado().then((val) => {
      setupFirebaseInicial(val);
    });
  });

  return autentificacionIniciada !== false ? (
    <React.Fragment>
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        open={openSnackBar ? openSnackBar.open : false}
        autoHideDuration={3000}
        ContentProps={{
          "arie-describedby": "message-id",
        }}
        message={
          <span id="message-id">
            {openSnackBar ? openSnackBar.mensaje : ""}
          </span>
        }
        onClose={() =>
          dispatch({
            type: "OPEN_SNACKBAR",
            openMensaje: {
              open: false,
              mensaje: "",
            },
          })
        }
      />
      <Router>
        <MuiThemeProvider theme={Theme}>
          <AppNavBar />
          <Grid container>
            <Switch>
              <RutaAutenticada
                exact
                path="/"
                autenticadoFirebase={firebase.auth.currentUser}
                component={ListaInmobuebles}
              />
              <RutaAutenticada
                exact
                path="/auth/editUsuario"
                autenticadoFirebase={firebase.auth.currentUser}
                component={PrefilUsuario}
              />
              <RutaAutenticada
                exact
                path="/inmueble/nuevo"
                autenticadoFirebase={firebase.auth.currentUser}
                component={NuevoInmueble}
              />
              <RutaAutenticada
                exact
                path="/inmueble/editar/:id"
                autenticadoFirebase={firebase.auth.currentUser}
                component={EditarInmuebles}
              />
              <Route
                path="/auth/registrarUsuario"
                exact
                component={RegistrarUsuario}
              />
              <Route path="/auth/loginUsuario" exact component={Login} />

              <RutaAutenticada
                exact
                path="/proveedor/agregar"
                autenticadoFirebase={firebase.auth.currentUser}
                component={AddProvider}
              />
              <RutaAutenticada
                exact
                path="/test/select"
                autenticadoFirebase={firebase.auth.currentUser}
                component={TestSelect}
              />
            </Switch>
          </Grid>
        </MuiThemeProvider>
      </Router>
    </React.Fragment>
  ) : null;
}

export default App;
