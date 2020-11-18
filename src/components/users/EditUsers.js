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
  FormGroup,
  FormControlLabel,
  Checkbox,
} from "@material-ui/core";

//icons
import HomeIcon from "@material-ui/icons/Home";

//utils
import { consumerFirebase } from "../../server";
import { useStateValue } from "../../sesion/store";
import { openMensajePantalla } from "../../sesion/actions/snackBarAction";

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

const EditUsers = (props) => {
  const { id } = props.match.params;
  const [{ sesion }, dispatch] = useStateValue();

  let [user, changeDataUser] = useState({
    name: "",
    email: "",
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

  const fetchMyAPI = useCallback(async () => {
    //getDataUser

    console.log(id);

    let snapshotUser = await props.firebase.db
      .collection("Users")
      .doc(id)
      .get();

    let dataUser = snapshotUser.data();

    changeDataUser({
      name: `${dataUser.nombre} ${dataUser.apellido}`,
      email: dataUser.email,
    });

    setModules({
      inventories: dataUser.inventories,
      process: dataUser.process,
      clients: dataUser.clients,
      points_operation: dataUser.points_operation,
      employees: dataUser.employees,
      transfers: dataUser.transfers,
      providers: dataUser.providers,
      users: dataUser.users,
      vehicles: dataUser.vehicles,
    });
  }, []);

  useEffect(() => {
    fetchMyAPI();
  }, [fetchMyAPI]);

  const handleChange = (event) => {
    setModules((prev) => ({
      ...prev,
      [event.target.name]: event.target.checked,
    }));
  };

  const saveDataFirebase = async (e) => {
    e.preventDefault();

    let snapshotUser = await props.firebase.db
      .collection("Users")
      .doc(id)
      .get();

    let dataUser = snapshotUser.data();

    let jsonNewUser = {
      ...dataUser,
      inventories: modules.inventories,
      process: modules.process,
      clients: modules.clients,
      points_operation: modules.points_operation,
      employees: modules.employees,
      transfers: modules.transfers,
      providers: modules.providers,
      users: modules.users,
      vehicles: modules.vehicles,
    };

    await props.firebase.db
      .collection("Users")
      .doc(id)
      .set(jsonNewUser, { merge: true })
      .then((success) => {
        openMensajePantalla(dispatch, {
          open: true,
          mensaje: "SE ACTUALIZO EL USUARIO",
        });
      });

    props.history.replace("/usuarios/mostrar/search");
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
              <Typography color="textPrimary">Modificar</Typography>
              <Typography color="textPrimary">{user.name}</Typography>
            </Breadcrumbs>
          </Grid>
        </Grid>
      </Paper>
      <Paper style={style.form}>
        <Grid container spacing={2} style={style.gridForm}>
          <Grid item xs={12} md={6}>
            <TextField
              disabled
              name="employee"
              variant="outlined"
              fullWidth
              label="Empleado"
              value={user.name}
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

export default consumerFirebase(EditUsers);
