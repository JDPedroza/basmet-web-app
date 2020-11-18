import React, { useState, useCallback, useEffect } from "react";

import {
  Container,
  Paper,
  Grid,
  Link,
  Breadcrumbs,
  Typography,
  Button,
  TextField,
} from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";

//icons
import HomeIcon from "@material-ui/icons/Home";

//utils
import { consumerFirebase } from "../../server";
import { useStateValue } from "../../sesion/store";
import MomentUtils from "@date-io/moment";
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

const AddVehicles = (props) => {
  const [{ sesion }, dispatch] = useStateValue();

  let today = new Date();
  let dd = today.getDate();
  let mm = today.getMonth() + 1;
  let yyyy = today.getFullYear();
  let date = `${dd}-${mm}-${yyyy}`;

  const [dataVehicle, changeDataVehicle] = useState({
    plate: "",
    type: "",
    brand: "",
    model: "",
    date_safe: date,
    date_technomechanical: date,
    employee_responsible: "",
    transfers_vehicle:[],
  });

  const [dateSafe, setDateSafe] = useState(new Date());
  const [dateTechnomechanical, setDateTechnomechanical] = useState(new Date());

  //dataEmployee
  const [employees, setEmployees] = useState([]);
  let [selectedEmployee, setSelectedEmployee] = useState(null);

  const fetchMyAPI = useCallback(async () => {
    //getDataEmployees
    let getDataEmployees = await props.firebase.db
      .collection("Employees")
      .orderBy("nid")
      .get();
    const employees = getDataEmployees.docs.map((doc) => {
      let data = doc.data();
      let id = doc.id;
      return {
        id,
        name: data.name,
        inventories_employee: data.inventories_employee,
      };
    });
    setEmployees(employees);
  }, []);

  useEffect(() => {
    fetchMyAPI();
  }, [fetchMyAPI]);

  const changeData = (e) => {
    let attribute = e.target.name;
    let value = e.target.value;
    changeDataVehicle({
      ...dataVehicle,
      [attribute]: value,
    });
  };

  const handleDateChangeSafe = (date) => {
    const format = date.format("DD-MM-YYYY");
    setDateSafe(date);
    changeDataVehicle({
      ...dataVehicle,
      date_safe: format,
    });
  };

  const handleDateChangeTechnomechanical = (date) => {
    const format = date.format("DD-MM-YYYY");
    setDateTechnomechanical(date);
    changeDataVehicle({
      ...dataVehicle,
      date_technomechanical: format,
    });
  };

  const updateDataVehicle = (employee) => {
    changeDataVehicle({
      ...dataVehicle,
      employee_responsible: employee.id,
    });
  };

  const saveDataFirebase = async (e) => {
    e.preventDefault();
    //guardamos el vehiculo
    console.log(dataVehicle);
    let idVehicle = "";
    await props.firebase.db
      .collection("Vehicles")
      .add(dataVehicle)
      .then((success) => {
        idVehicle = success.id;
        openMensajePantalla(dispatch, {
          open: true,
          mensaje: "SE AGREGO CORRECTAMENTE EL VEHICULO",
        });
      });

    //actualizamos los inventarios para el empleado
    let snapshotInventoriesEmployee = await props.firebase.db
      .collection("InventoriesEmployee")
      .doc(selectedEmployee.inventories_employee)
      .get();

    let dataInventoriesEmployee = snapshotInventoriesEmployee.data();

    let tempVehicles = dataInventoriesEmployee.vehicles;
    tempVehicles.push(idVehicle);

    dataInventoriesEmployee.vehicles = tempVehicles;

    await props.firebase.db
      .collection("InventoriesEmployee")
      .doc(selectedEmployee.inventories_employee)
      .set(dataInventoriesEmployee, {merge:true})
      .then((success) => {
        openMensajePantalla(dispatch, {
          open: true,
          mensaje: "SE ACTUALIZARON LAS ASIGNACIONES PARA EL EMPLEADO",
        });
        props.history.replace(`/vehiculos/mostrar/search`);
      });
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
              <Typography color="textPrimary">Vehiculos</Typography>
              <Typography color="textPrimary">Agregar</Typography>
            </Breadcrumbs>
          </Grid>
        </Grid>
      </Paper>
      <Paper style={style.form}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={12}>
            <Typography color="textPrimary">Datos Vehiculo</Typography>
          </Grid>
          <Grid item xs={6} md={6}>
            <TextField
              name="plate"
              variant="outlined"
              fullWidth
              label="Placa"
              value={dataVehicle.plate}
              onChange={changeData}
            />
          </Grid>
          <Grid item xs={6} md={6}>
            <TextField
              name="type"
              variant="outlined"
              fullWidth
              label="Tipo"
              value={dataVehicle.type}
              onChange={changeData}
            />
          </Grid>
          <Grid item xs={6} md={6}>
            <TextField
              name="brand"
              variant="outlined"
              fullWidth
              label="Marca"
              value={dataVehicle.brand}
              onChange={changeData}
            />
          </Grid>
          <Grid item xs={6} md={6}>
            <TextField
              name="model"
              variant="outlined"
              fullWidth
              label="Modelo"
              value={dataVehicle.model}
              onChange={changeData}
            />
          </Grid>
          <Grid item xs={6} md={6}>
            <MuiPickersUtilsProvider utils={MomentUtils}>
              <KeyboardDatePicker
                disableToolbar
                fullWidth
                variant="inline"
                format="DD/MM/yyyy"
                id="bill_date"
                label="Vencimiento seguro"
                value={dateSafe}
                onChange={handleDateChangeSafe}
                KeyboardButtonProps={{
                  "aria-label": "change date",
                }}
              />
            </MuiPickersUtilsProvider>
          </Grid>
          <Grid item xs={6} md={6}>
            <MuiPickersUtilsProvider utils={MomentUtils}>
              <KeyboardDatePicker
                disableToolbar
                fullWidth
                variant="inline"
                format="DD/MM/yyyy"
                id="bill_date"
                label="Vencimiento Tecnomecanica"
                value={dateTechnomechanical}
                onChange={handleDateChangeTechnomechanical}
                KeyboardButtonProps={{
                  "aria-label": "change date",
                }}
              />
            </MuiPickersUtilsProvider>
          </Grid>
          <Grid item xs={12} md={12}>
            <Typography color="textPrimary">Datos persona a cargo</Typography>
          </Grid>
          <Grid item xs={12} md={12}>
            <Autocomplete
              id="select_employee"
              options={employees}
              value={selectedEmployee}
              onChange={(event, newEmployee) => {
                setSelectedEmployee(newEmployee);
                updateDataVehicle(newEmployee);
              }}
              getOptionLabel={(employee) => employee.name}
              fullWidth
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Empleado a cargo"
                  variant="outlined"
                />
              )}
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

export default consumerFirebase(AddVehicles);
