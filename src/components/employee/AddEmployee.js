import React, { useState } from "react";
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
  Select,
  MenuItem,
} from "@material-ui/core";

//icons
import HomeIcon from "@material-ui/icons/Home";
import { consumerFirebase } from "../../server";

//utils
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

const AddEmployee = (props) => {
  const [open, setOpen] = useState(false);
  const [{ sesion }, dispatch] = useStateValue();

  let [employee, changeDataEmployee] = useState({
    type_document: "",
    nid: "",
    name: "",
    country: "",
    city: "",
    address: "",
    phone: "",
    points_operation: "",
    inventories_employee: "",
  });

  let [validationFormEmployee, setDataValidationFormEmployee] = useState({
    type_document: false,
    nid: false,
    name: false,
    country: false,
    city: false,
    address: false,
    phone: false,
  });

  const changeData = (e) => {
    const { name, value } = e.target;

    changeDataEmployee((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const saveDataFirebase = async (e) => {
    e.preventDefault();

    let validation = true;

    console.log(employee.name.length);

    if (employee.name.length === 0) {
      validation = false;
      validationFormEmployee.name = true;
    } else {
      validationFormEmployee.name = false;
    }
    if (employee.type_document.length === 0) {
      validation = false;
      validationFormEmployee.type_document = true;
    } else {
      validationFormEmployee.type_document = false;
    }
    if (employee.nid.length === 0) {
      validation = false;
      validationFormEmployee.nid = true;
    } else {
      validationFormEmployee.nid = false;
    }
    if (employee.country.length === 0) {
      validation = false;
      validationFormEmployee.country = true;
    } else {
      validationFormEmployee.country = false;
    }
    if (employee.city.length === 0) {
      validation = false;
      validationFormEmployee.city = true;
    } else {
      validationFormEmployee.city = false;
    }
    if (employee.address.length === 0) {
      validation = false;
      validationFormEmployee.address = true;
    } else {
      validationFormEmployee.address = false;
    }
    if (employee.phone.length === 0) {
      validation = false;
      validationFormEmployee.phone = true;
    } else {
      validationFormEmployee.phone = false;
    }


    if (!validation) {
      openMensajePantalla(dispatch, {
        open: true,
        mensaje:
          "Errores en el formulario. Por favor, diligencie todos los campos solicitados",
      });
    } else {
      openMensajePantalla(dispatch, {
        open: true,
        mensaje:
          "Validacion completa",
      });
      /*
    let jsonFormatInventoriesEmployee = {
      tools_equipament: [],
      implements: [],
    };

    let idInventoriesEmployee;

    await props.firebase.db
      .collection("InventoriesEmployess")
      .add(jsonFormatInventoriesEmployee)
      .then((success) => {
        idInventoriesEmployee = success.id;
      })
      .catch((error) => {
        console.log("error: ", error);
      });

    employee.inventories_employee = idInventoriesEmployee;

    let id = "";

    await props.firebase.db
      .collection("Employees")
      .add(employee)
      .then((success) => {
        openMensajePantalla(dispatch, {
          open: true,
          mensaje: "Se guardaron los datos del empleado",
        });
        id = success.id;
      })
      .catch((error) => {
        console.log("error: ", error);
      });

    props.history.replace(`/empleados/mostrar/modify/assignment/${id}`);
    */
    }
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
              <Typography color="textPrimary">Empleados</Typography>
              <Typography color="textPrimary">Agregar</Typography>
            </Breadcrumbs>
          </Grid>
        </Grid>
      </Paper>
      <Paper style={style.form}>
        <Grid container spacing={2} style={style.gridForm}>
          <Grid item xs={12} md={12}>
            <Typography color="textPrimary">Datos Empleado</Typography>
          </Grid>
          <Grid item xs={12} md={12}>
            <TextField
              name="name"
              variant="outlined"
              fullWidth
              label="Nombre"
              value={employee.name}
              onChange={changeData}
              error={validationFormEmployee.name}
              helperText={
                validationFormEmployee.name
                  ? "Por favor ingrese un nombre: ej. Johan Pedroza"
                  : ""
              }
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel id="demo-controlled-open-select-label">
                Tipo Identificación
              </InputLabel>
              <Select
                name="type_document"
                labelId="demo-controlled-open-select-label"
                id="demo-controlled-open-select"
                open={open}
                onClose={handleClose}
                onOpen={handleOpen}
                value={employee.type_document}
                onChange={changeData}
                fullWidth
                error={validationFormEmployee.type_document}
                helperText={
                  validationFormEmployee.type_document
                    ? "Por favor seleccione un opción: ej. CC"
                    : ""
                }
              >
                <MenuItem value={"Tipo Identificación"}>
                  <em>AA</em>
                </MenuItem>
                <MenuItem value={"CC"}>CC</MenuItem>
                <MenuItem value={"CE"}>CE</MenuItem>
                <MenuItem value={"PA"}>PA</MenuItem>
                <MenuItem value={"RC"}>RC</MenuItem>
                <MenuItem value={"TI"}>TI</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              name="nid"
              variant="outlined"
              fullWidth
              type="number"
              label={employee.type_document || "Tipo Identificación"}
              value={employee.nid}
              onChange={changeData}
              error={validationFormEmployee.nid}
              helperText={
                validationFormEmployee.nid
                  ? "Por favor ingrese un valor: ej. 1010237908"
                  : ""
              }
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              name="country"
              variant="outlined"
              fullWidth
              label="Pais"
              value={employee.country}
              onChange={changeData}
              error={validationFormEmployee.country}
              helperText={
                validationFormEmployee.country
                  ? "Por favor ingrese un pais: ej. Colombia"
                  : ""
              }
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              name="city"
              variant="outlined"
              fullWidth
              label="Ciudad"
              value={employee.city}
              onChange={changeData}
              error={validationFormEmployee.city}
              helperText={
                validationFormEmployee.city
                  ? "Por favor ingrese una ciudad: ej. Bogotá"
                  : ""
              }
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              name="address"
              variant="outlined"
              fullWidth
              label="Dirección"
              value={employee.address}
              onChange={changeData}
              error={validationFormEmployee.address}
              helperText={
                validationFormEmployee.address
                  ? "Por favor ingrese una dirección: ej. Calle 70 sur #48-26"
                  : ""
              }
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              name="phone"
              variant="outlined"
              fullWidth
              type="number"
              label="Numero Telefono"
              value={employee.phone}
              onChange={changeData}
              error={validationFormEmployee.phone}
              helperText={
                validationFormEmployee.phone
                  ? "Por favor ingrese un telefóno: ej. 3137180035"
                  : ""
              }
            />
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

export default consumerFirebase(AddEmployee);
