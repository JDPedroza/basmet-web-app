import React, { useState, useEffect, useCallback } from "react";
import {
  Container,
  Paper,
  Grid,
  Breadcrumbs,
  Link,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton,
  FormGroup,
  FormControlLabel,
  Checkbox,
} from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import app from "firebase/app";

//icons
import HomeIcon from "@material-ui/icons/Home";
import FileCopyIcon from "@material-ui/icons/FileCopy";

//utils
import { consumerFirebase } from "../../server";
import { useStateValue } from "../../sesion/store";
import { openMensajePantalla } from "../../sesion/actions/snackBarAction";
import { CopyToClipboard } from "react-copy-to-clipboard";
const generator = require("generate-password");

const style = {
  paper: {
    padding: 20,
  },
  gridForm: {
    width: "100%",
    padding: 20,
  },
  form: {
    marginTop: 2,
    padding: 20,
  },
  submit: {
    marginTop: 15,
    marginBottom: 20,
  },
  formControl: {
    margin: 1,
    minWidth: 120,
  },
};

const AddUsers = (props) => {
  const [{ sesion }, dispatch] = useStateValue();

  const [employees, setEmployees] = useState([]);
  let [selectedEmployee, setSelectedEmployee] = useState(null);

  let [user, changeDataUser] = useState({
    nombre: "",
    apellido: "",
    id: "",
    email: "",
    nid_employee: "",
    password: "",
  });

  let [modules, setModules] = useState({
    inventories: false,
    process: false,
    clients: false,
    points_operation: false,
    employees: false,
    transfers: false,
    providers: false,
    users: false,
    vehicles: false,
  });

  let [copy, setCopy] = useState(false);

  const fetchMyAPI = useCallback(async () => {
    //getDataEmployees
    let snapshotEmployees = await props.firebase.db
      .collection("Employees")
      .orderBy("nid")
      .get();
    const employees = snapshotEmployees.docs.map((doc) => {
      let data = doc.data();
      let id = doc.id;
      return {
        id,
        name: data.name,
        lastname: data.lastname,
        email: data.email,
        disabled: false,
      };
    });

    //getUser
    let snapshotUsers = await props.firebase.db.collection("Users").orderBy("nid_employee").get();
    const users = snapshotUsers.docs.map((doc) => {
      let data = doc.data();
      return {
        email: data.email,
      };
    });

    for(let i=0; i<employees.length; i++){
      let found = false;
      for(let j=0; j<users.length; j++){
        if(employees[i].email===users[j].email){
          found=true;
          employees[i].disabled=true;
        }
      }
    }
    setEmployees(employees);
  }, []);

  useEffect(() => {
    fetchMyAPI();
  }, [fetchMyAPI]);

  const updateDataEmployee = (employee) => {
    let password = generator.generate({
      length: 10,
      numbers: true,
    });

    if (employee !== null) {
      changeDataUser({
        ...user,
        nombre: employee.name,
        apellido: employee.lastname,
        email: employee.email,
        nid_employee: employee.id,
        password,
      });
    } else {
      changeDataUser({
        ...user,
        nombre: "",
        apellido: "",
        email: "",
        nid_employee: "",
        password: "",
      });
    }
  };

  const copied = () => {
    setCopy(true);
  };

  const handleChange = (event) => {
    setModules((prev) => ({
      ...prev,
      [event.target.name]: event.target.checked,
    }));
  };

  const saveDataFirebase = async (e) => {
    e.preventDefault();

    var config = {
      apiKey: "AIzaSyCjzt1nYemJqvhhxgMgOyh1wLOupE1hzRs",
      authDomain: "basmet-web-app.firebaseapp.com",
      databaseURL: "https://basmet-web-app.firebaseio.com",
    };
    var secondaryApp = app.initializeApp(config, "Secondary");

    await secondaryApp
      .auth()
      .createUserWithEmailAndPassword(user.email, user.password)
      .then(async (auth) => {
        await props.firebase.db
          .collection("Users")
          .doc(auth.user.uid)
          .set(
            {
              ...modules,
              ...user,
              id: auth.user.uid,
            },
            { merge: true }
          )
          .then((doc) => {
            openMensajePantalla(dispatch, {
              open: true,
              mensaje: "SE GUARDARON EL NUEVO USUARIO",
            });
          });
        secondaryApp.auth().signOut();
      });

    props.history.replace("/usuarios/mostrar");
  };

  return (
    <Container component="main" maxWidth="md" justify="center">
      <Paper style={style.paper}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Breadcrumbs aria-label="breadcrumbs">
              <Link color="inherit" style={style.link} href="/">
                <HomeIcon />
                Principal
              </Link>
              <Typography color="textPrimary">Usuarios</Typography>
              <Typography color="textPrimary">Agregar</Typography>
            </Breadcrumbs>
          </Grid>
        </Grid>
      </Paper>
      <Paper style={style.form}>
        <Grid container spacing={2} style={style.gridForm}>
          <Grid item xs={12} md={12}>
            <Autocomplete
              id="select_employee"
              options={employees}
              value={selectedEmployee}
              onChange={(event, newEmployee) => {
                setSelectedEmployee(newEmployee);
                updateDataEmployee(newEmployee);
              }}
              getOptionLabel={(employee) => `${employee.name} ${employee.lastname}`}
              getOptionDisabled={(employee) =>
                employee.disabled === true
              }
              fullWidth
              renderInput={(params) => (
                <TextField {...params} label="Empleado" variant="outlined" />
              )}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              disabled
              name="email"
              variant="outlined"
              fullWidth
              type="email"
              label="Correo Electronico"
              value={user.email}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl variant="outlined" fullWidth>
              <InputLabel htmlFor="outlined-adornment-password">
                Contraseña
              </InputLabel>
              <OutlinedInput
                disabled
                id="outlined-adornment-password"
                value={user.password}
                endAdornment={
                  <InputAdornment position="end">
                    <CopyToClipboard text={user.password} onCopy={copied}>
                      <IconButton
                        disabled={selectedEmployee !== null ? false : true}
                        aria-label="toggle password visibility"
                        edge="end"
                      >
                        <FileCopyIcon
                          style={
                            selectedEmployee === null
                              ? {}
                              : copy
                              ? { color: "#89ff89" }
                              : { color: "#ff8989" }
                          }
                        />
                      </IconButton>
                    </CopyToClipboard>
                  </InputAdornment>
                }
                labelWidth={90}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} md={12}>
            <Typography color="textPrimary">Aceso a modulos:</Typography>
          </Grid>
          <Grid item xs={12} md={12}>
            <FormGroup row>
              <Grid container spacing={1}>
                <Grid item xs={12} md={4} sm={6}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={modules.inventories}
                        onChange={handleChange}
                        name="inventories"
                        color="primary"
                        disabled={selectedEmployee !== null ? false : true}
                      />
                    }
                    label="Inventarios"
                  />
                </Grid>
                <Grid item xs={12} md={4} sm={6}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={modules.process}
                        onChange={handleChange}
                        name="process"
                        color="primary"
                        disabled={selectedEmployee !== null ? false : true}
                      />
                    }
                    label="Procesos"
                  />
                </Grid>
                <Grid item xs={12} md={4} sm={6}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={modules.clients}
                        onChange={handleChange}
                        name="clients"
                        color="primary"
                        disabled={selectedEmployee !== null ? false : true}
                      />
                    }
                    label="Clientes"
                  />
                </Grid>
                <Grid item xs={12} md={4} sm={6}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={modules.points_operation}
                        onChange={handleChange}
                        name="points_operation"
                        color="primary"
                        disabled={selectedEmployee !== null ? false : true}
                      />
                    }
                    label="Puntos de Operación"
                  />
                </Grid>
                <Grid item xs={12} md={4} sm={6}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={modules.employees}
                        onChange={handleChange}
                        name="employees"
                        color="primary"
                        disabled={selectedEmployee !== null ? false : true}
                      />
                    }
                    label="Empleados"
                  />
                </Grid>
                <Grid item xs={12} md={4} sm={6}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={modules.transfers}
                        onChange={handleChange}
                        name="transfers"
                        color="primary"
                        disabled={selectedEmployee !== null ? false : true}
                      />
                    }
                    label="Traslados"
                  />
                </Grid>
                <Grid item xs={12} md={4} sm={6}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={modules.providers}
                        onChange={handleChange}
                        name="providers"
                        color="primary"
                        disabled={selectedEmployee !== null ? false : true}
                      />
                    }
                    label="Proveedores"
                  />
                </Grid>
                <Grid item xs={12} md={4} sm={6}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={modules.users}
                        onChange={handleChange}
                        name="users"
                        color="primary"
                        disabled={selectedEmployee !== null ? false : true}
                      />
                    }
                    label="Usuarios"
                  />
                </Grid>
                <Grid item xs={12} md={4} sm={6}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={modules.vehicles}
                        onChange={handleChange}
                        name="vehicles"
                        color="primary"
                        disabled={selectedEmployee !== null ? false : true}
                      />
                    }
                    label="Vehiculos"
                  />
                </Grid>
              </Grid>
            </FormGroup>
          </Grid>
        </Grid>
      </Paper>
      <Paper style={style.form}>
        <Grid container justify="center">
          <Grid item xs={12} sm={6}>
            <Button
              disabled={copy ? false : true}
              type="button"
              fullWidth
              variant="contained"
              size="large"
              color="primary"
              style={style.submit}
              onClick={saveDataFirebase}
            >
              GUARDAR
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default consumerFirebase(AddUsers);
