import React, { useEffect } from "react";
import Grid from "@material-ui/core/Grid";
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

//inventory
import AddElements from "./components/inventory/AddElements";
import AddStandarizations from "./components/inventory/AddStandarizations";
import ListElements from "./components/inventory/ListElements";

//processes
import AddProcesses from "./components/process/AddProcesses";

//clients
import AddClients from "./components/client/AddClients";
import ListClients from "./components/client/ListClients";

//clients
import AddPointOperation from "./components/pointsOperation/AddPointOperation";

import AddProvider from "./components/provider/AddProvider";
import ListProvider from "./components/provider/ListProvider";
import EditProvider from "./components/provider/EditProvider";
import TestSelect from "./components/main/TestSelect";
import Home from "./components/main/home";

import Page404 from "./components/error/Page404";

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
                path="/perfil/modify"
                autenticadoFirebase={firebase.auth.currentUser}
                component={PrefilUsuario}
              />
              <Route path="/perfil/add" exact component={RegistrarUsuario} />
              <Route path="/iniciar_sesion" exact component={Login} />
              <RutaAutenticada
                exact
                path="/inventarios/agregar/productos_en_proceso/:type"
                autenticadoFirebase={firebase.auth.currentUser}
                component={AddStandarizations}
              />
              <RutaAutenticada
                exact
                path="/inventarios/agregar/:table/:type"
                autenticadoFirebase={firebase.auth.currentUser}
                component={AddElements}
              />
              <RutaAutenticada
                exact
                path="/inventarios/mostrar/:table/:query"
                autenticadoFirebase={firebase.auth.currentUser}
                component={ListElements}
              />

              <RutaAutenticada
                exact
                path="/procesos/agregar/:type"
                autenticadoFirebase={firebase.auth.currentUser}
                component={AddProcesses}
              />

              <RutaAutenticada
                exact
                path="/clientes/agregar/:type"
                autenticadoFirebase={firebase.auth.currentUser}
                component={AddClients}
              />
              <RutaAutenticada
                exact
                path="/clientes/mostrar/:type/:query"
                autenticadoFirebase={firebase.auth.currentUser}
                component={ListClients}
              />

              <RutaAutenticada
                exact
                path="/puntos_operacion/agregar/:type"
                autenticadoFirebase={firebase.auth.currentUser}
                component={AddPointOperation}
              />

              <RutaAutenticada
                exact
                path="/proveedor/agregar/:type"
                autenticadoFirebase={firebase.auth.currentUser}
                component={AddProvider}
              />
              <RutaAutenticada
                exact
                path="/proveedor/mostrar/:type/:query"
                autenticadoFirebase={firebase.auth.currentUser}
                component={ListProvider}
              />
              <RutaAutenticada
                exact
                path="/proveedor/editar/:id"
                autenticadoFirebase={firebase.auth.currentUser}
                component={EditProvider}
              />
              <RutaAutenticada
                exact
                path="/test/select"
                autenticadoFirebase={firebase.auth.currentUser}
                component={TestSelect}
              />
              <RutaAutenticada
                exact
                path="/home"
                autenticadoFirebase={firebase.auth.currentUser}
                component={Home}
              />
              <Route component={Page404} />
            </Switch>
          </Grid>
        </MuiThemeProvider>
      </Router>
    </React.Fragment>
  ) : null;
}

export default App;
