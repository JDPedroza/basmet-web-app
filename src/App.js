import React, { useEffect } from "react";
//route
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

//all
import Login from "./components/security/Login";
import AppNavBar from "./components/layouts/AppNawBar";
import Page404 from "./components/error/Page404";
import Loading from "./components/error/Loading";
import NoAccess from "./components/error/NoAccess";
import Footer from "./components/layouts/Footer";

//utils
import { useStateValue } from "./sesion/store";
import { FirebaseContext } from "./server";

//diseño
import "./App.css";
import { Fab, Tooltip, Snackbar } from "@material-ui/core";
import { MuiThemeProvider } from "@material-ui/core/styles";
import Theme from "./theme/theme";

//utils route
import RutaAutenticada from "./components/security/RutaAutenticada";

//myuser
import PrefilUsuario from "./components/security/PerfilUsuario";

//home
import Home from "./components/main/home";

//inventory
import AddElements from "./components/inventory/AddElements";
import AddAssignamentsElements from "./components/inventory/AddAssignaments";
import AddElementsStandardized from "./components/inventory/AddElementsStandardized";
import ListElements from "./components/inventory/ListElements";
import ListElementsStandardized from "./components/inventory/ListElementsStandardized";
import EditElements from "./components/inventory/EditElements";
import EditElementsStandardized from "./components/inventory/EditElementsStandardized";

//processes
import AddProcesses from "./components/process/AddProcesses";
import ListProcesses from "./components/process/ListProcesses";
import EditProcesses from "./components/process/EditProcesses";

//clients
import AddClients from "./components/client/AddClients";
import ListClients from "./components/client/ListClients";
import EditClients from "./components/client/EditClients";

//puntos de operacion
import AddPointOperation from "./components/pointsOperation/AddPointOperation";
import ListPointsOperation from "./components/pointsOperation/ListPointsOperation";
import EditPointsOperation from "./components/pointsOperation/EditPointsOperation";

//providers
import AddProvider from "./components/provider/AddProvider";
import ListProvider from "./components/provider/ListProvider";
import EditProvider from "./components/provider/EditProvider";

//employees
import AddEmployee from "./components/employee/AddEmployee";
import AddAssignaments from "./components/employee/AddAssignaments";
import ListEmployee from "./components/employee/ListEmployee";

//users
import AddUser from "./components/users/AddUsers";
import ListUsers from "./components/users/ListUsers";

//transfers
import AddTransfers from "./components/transfers/AddTransfers";
import ListTransfers from "./components/transfers/ListTransfers";
import AddVehicles from "./components/transfers/AddVehicles";
import ListVehicles from "./components/transfers/ListVehicles";
import EditVehicles from "./components/transfers/EditVehicles";

//
import RegistrarUsuario from "./components/security/RegistrarUsuario";

//utils
import TestSelect from "./components/main/TestSelect";
import { salirSesion } from "./sesion/actions/sesionAction";

//icons
import ExitToAppIcon from "@material-ui/icons/ExitToApp";

//reports
import ListReports from "./components/reports/ListReports";
import EditUsers from "./components/users/EditUsers";

function App(props) {
  let firebase = React.useContext(FirebaseContext);
  const [autentificacionIniciada, setupFirebaseInicial] = React.useState(false);

  const [{ openSnackBar, sesion }, dispatch] = useStateValue();

  useEffect(() => {
    firebase.estaIniciado().then((val) => {
      setupFirebaseInicial(val);
    });
  });

  const salirSesionApp = () => {
    salirSesion(dispatch, firebase).then((success) => {});
  };

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
          <div id="container">
            {window.location.pathname === "/" ? (
              <Tooltip title="Cerrar Sesión" aria-label="Cerrar Sesión">
                <Fab
                  aria-label="Cerrar Sesión"
                  style={{
                    position: "fixed",
                    bottom: 25,
                    right: 25,
                    zIndex: 1000,
                    backgroundColor: "#2E3B55",
                    color: "white",
                  }}
                  onClick={salirSesionApp}
                >
                  <ExitToAppIcon />
                </Fab>
              </Tooltip>
            ) : (
              ""
            )}
            <Switch>
              <RutaAutenticada
                exact
                path="/perfil/modify"
                autenticadoFirebase={firebase.auth.currentUser}
                component={PrefilUsuario}
              />
              <Route path="/iniciar_sesion" exact component={Login} />

              <RutaAutenticada
                exact
                path="/inventarios/agregar/productos_en_proceso"
                autenticadoFirebase={firebase.auth.currentUser}
                component={
                  sesion !== undefined
                    ? sesion.usuario.inventories
                      ? AddElementsStandardized
                      : NoAccess
                    : Loading
                }
              />
              <RutaAutenticada
                exact
                path="/inventarios/mostrar/productos_en_proceso/:query"
                autenticadoFirebase={firebase.auth.currentUser}
                component={
                  sesion !== undefined
                    ? sesion.usuario.inventories
                      ? ListElementsStandardized
                      : NoAccess
                    : Loading
                }
              />
              <RutaAutenticada
                exact
                path="/inventarios/editar/productos_en_proceso/:id"
                autenticadoFirebase={firebase.auth.currentUser}
                component={
                  sesion !== undefined
                    ? sesion.usuario.inventories
                      ? EditElementsStandardized
                      : NoAccess
                    : Loading
                }
              />
              <RutaAutenticada
                exact
                path="/inventarios/agregar/:table/:type"
                autenticadoFirebase={firebase.auth.currentUser}
                component={
                  sesion !== undefined
                    ? sesion.usuario.inventories
                      ? AddElements
                      : NoAccess
                    : Loading
                }
              />
              <RutaAutenticada
                exact
                path="/inventarios/agregar/asignar/:table/:id"
                autenticadoFirebase={firebase.auth.currentUser}
                component={
                  sesion !== undefined
                    ? sesion.usuario.inventories
                      ? AddAssignamentsElements
                      : NoAccess
                    : Loading
                }
              />
              <RutaAutenticada
                exact
                path="/inventarios/mostrar/:table/:query"
                autenticadoFirebase={firebase.auth.currentUser}
                component={
                  sesion !== undefined
                    ? sesion.usuario.inventories
                      ? ListElements
                      : NoAccess
                    : Loading
                }
              />
              <RutaAutenticada
                exact
                path="/inventarios/editar/:table/:id"
                autenticadoFirebase={firebase.auth.currentUser}
                component={
                  sesion !== undefined
                    ? sesion.usuario.inventories
                      ? EditElements
                      : NoAccess
                    : Loading
                }
              />

              <RutaAutenticada
                exact
                path="/procesos/agregar/:type"
                autenticadoFirebase={firebase.auth.currentUser}
                component={
                  sesion !== undefined
                    ? sesion.usuario.process
                      ? AddProcesses
                      : NoAccess
                    : Loading
                }
              />
              <RutaAutenticada
                exact
                path="/procesos/mostrar/:query"
                autenticadoFirebase={firebase.auth.currentUser}
                component={
                  sesion !== undefined
                    ? sesion.usuario.process
                      ? ListProcesses
                      : NoAccess
                    : Loading
                }
              />
              <RutaAutenticada
                exact
                path="/procesos/update/:id"
                autenticadoFirebase={firebase.auth.currentUser}
                component={
                  sesion !== undefined
                    ? sesion.usuario.process
                      ? EditProcesses
                      : NoAccess
                    : Loading
                }
              />

              <RutaAutenticada
                exact
                path="/clientes/agregar/:type"
                autenticadoFirebase={firebase.auth.currentUser}
                component={
                  sesion !== undefined
                    ? sesion.usuario.clients
                      ? AddClients
                      : NoAccess
                    : Loading
                }
              />
              <RutaAutenticada
                exact
                path="/clientes/mostrar/:type/:query"
                autenticadoFirebase={firebase.auth.currentUser}
                component={
                  sesion !== undefined
                    ? sesion.usuario.clients
                      ? ListClients
                      : NoAccess
                    : Loading
                }
              />
              <RutaAutenticada
                exact
                path="/clientes/editar/:type/:id"
                autenticadoFirebase={firebase.auth.currentUser}
                component={
                  sesion !== undefined
                    ? sesion.usuario.clients
                      ? EditClients
                      : NoAccess
                    : Loading
                }
              />

              <RutaAutenticada
                exact
                path="/puntos_operacion/agregar/:type"
                autenticadoFirebase={firebase.auth.currentUser}
                component={
                  sesion !== undefined
                    ? sesion.usuario.points_operation
                      ? AddPointOperation
                      : NoAccess
                    : Loading
                }
              />
              <RutaAutenticada
                exact
                path="/puntos_operacion/mostrar/:type/:query"
                autenticadoFirebase={firebase.auth.currentUser}
                component={
                  sesion !== undefined
                    ? sesion.usuario.points_operation
                      ? ListPointsOperation
                      : NoAccess
                    : Loading
                }
              />
              <RutaAutenticada
                exact
                path="/puntos_operacion/editar/:type/:id"
                autenticadoFirebase={firebase.auth.currentUser}
                component={
                  sesion !== undefined
                    ? sesion.usuario.points_operation
                      ? EditPointsOperation
                      : NoAccess
                    : Loading
                }
              />

              <RutaAutenticada
                exact
                path="/empleados/add"
                autenticadoFirebase={firebase.auth.currentUser}
                component={
                  sesion !== undefined
                    ? sesion.usuario.employees
                      ? AddEmployee
                      : NoAccess
                    : Loading
                }
              />
              <RutaAutenticada
                exact
                path="/empleados/mostrar/:query"
                autenticadoFirebase={firebase.auth.currentUser}
                component={
                  sesion !== undefined
                    ? sesion.usuario.employees
                      ? ListEmployee
                      : NoAccess
                    : Loading
                }
              />
              <RutaAutenticada
                exact
                path="/empleados/mostrar/:query/:type"
                autenticadoFirebase={firebase.auth.currentUser}
                component={
                  sesion !== undefined
                    ? sesion.usuario.employees
                      ? ListEmployee
                      : NoAccess
                    : Loading
                }
              />
              <RutaAutenticada
                exact
                path="/empleados/:laststep/:query/:type/:id"
                autenticadoFirebase={firebase.auth.currentUser}
                component={
                  sesion !== undefined
                    ? sesion.usuario.employees
                      ? AddAssignaments
                      : NoAccess
                    : Loading
                }
              />

              <RutaAutenticada
                exact
                path="/traslados/agregar"
                autenticadoFirebase={firebase.auth.currentUser}
                component={
                  sesion !== undefined
                    ? sesion.usuario.transfers
                      ? AddTransfers
                      : NoAccess
                    : Loading
                }
              />
              <RutaAutenticada
                exact
                path="/traslados/mostrar/search"
                autenticadoFirebase={firebase.auth.currentUser}
                component={
                  sesion !== undefined
                    ? sesion.usuario.transfers
                      ? ListTransfers
                      : NoAccess
                    : Loading
                }
              />

              <RutaAutenticada
                exact
                path="/vehiculos/agregar"
                autenticadoFirebase={firebase.auth.currentUser}
                component={
                  sesion !== undefined
                    ? sesion.usuario.vehicles
                      ? AddVehicles
                      : NoAccess
                    : Loading
                }
              />
              <RutaAutenticada
                exact
                path="/vehiculos/mostrar/:query"
                autenticadoFirebase={firebase.auth.currentUser}
                component={
                  sesion !== undefined
                    ? sesion.usuario.vehicles
                      ? ListVehicles
                      : NoAccess
                    : Loading
                }
              />
              <RutaAutenticada
                exact
                path="/vehiculos/editar/:id"
                autenticadoFirebase={firebase.auth.currentUser}
                component={
                  sesion !== undefined
                    ? sesion.usuario.vehicles
                      ? EditVehicles
                      : NoAccess
                    : Loading
                }
              />

              <RutaAutenticada
                exact
                path="/proveedor/agregar/:type"
                autenticadoFirebase={firebase.auth.currentUser}
                component={
                  sesion !== undefined
                    ? sesion.usuario.providers
                      ? AddProvider
                      : NoAccess
                    : Loading
                }
              />
              <RutaAutenticada
                exact
                path="/proveedor/mostrar/:type/:query"
                autenticadoFirebase={firebase.auth.currentUser}
                component={
                  sesion !== undefined
                    ? sesion.usuario.providers
                      ? ListProvider
                      : NoAccess
                    : Loading
                }
              />
              <RutaAutenticada
                exact
                path="/proveedor/editar/:id"
                autenticadoFirebase={firebase.auth.currentUser}
                component={
                  sesion !== undefined
                    ? sesion.usuario.providers
                      ? EditProvider
                      : NoAccess
                    : Loading
                }
              />

              <RutaAutenticada
                exact
                path="/usuarios/agregar/"
                autenticadoFirebase={firebase.auth.currentUser}
                component={
                  sesion !== undefined
                    ? sesion.usuario.users
                      ? AddUser
                      : NoAccess
                    : Loading
                }
              />
              <RutaAutenticada
                exact
                path="/usuarios/mostrar/:query"
                autenticadoFirebase={firebase.auth.currentUser}
                component={
                  sesion !== undefined
                    ? sesion.usuario.users
                      ? ListUsers
                      : NoAccess
                    : Loading
                }
              />
              <RutaAutenticada
                exact
                path="/usuarios/editar/:id"
                autenticadoFirebase={firebase.auth.currentUser}
                component={
                  sesion !== undefined
                    ? sesion.usuario.users
                      ? EditUsers
                      : NoAccess
                    : Loading
                }
              />

              <RutaAutenticada
                exact
                path="/reportes/mostrar/search"
                autenticadoFirebase={firebase.auth.currentUser}
                component={ListReports}
              />

              <RutaAutenticada
                exact
                path="/test/select"
                autenticadoFirebase={firebase.auth.currentUser}
                component={TestSelect}
              />
              <RutaAutenticada
                exact
                path="/"
                autenticadoFirebase={firebase.auth.currentUser}
                component={Home}
              />
              <Route component={Page404} />
            </Switch>
          </div>
          <Footer />
        </MuiThemeProvider>
      </Router>
    </React.Fragment>
  ) : null;
}

export default App;
