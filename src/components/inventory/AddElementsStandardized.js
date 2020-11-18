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
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import StepContent from "@material-ui/core/StepContent";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { consumerFirebase } from "../../server";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";

//utils
import { useStateValue } from "../../sesion/store";
import MomentUtils from "@date-io/moment";
import { openMensajePantalla } from "../../sesion/actions/snackBarAction";

//icons
import HomeIcon from "@material-ui/icons/Home";

const style = {
  paper: {
    backgraundColor: "#f5f5ff",
    padding: "20px",
    minheight: 650,
  },
  paperForm: {
    backgraundColor: "#f5f5ff",
    marginTop: 2,
    padding: "40px",
    minheight: 650,
  },
  form: {
    width: "100%",
    padding: 20,
    backgraundColor: "#f5f5ff",
  },
  submit: {
    marginTop: 15,
    marginBottom: 20,
  },
  formControl: {
    margin: 1,
    minWidth: 120,
  },
  divForm: {
    marginTop: "20px",
    marginLeft: "20px",
  },
  divButtom: {
    marginTop: "20px",
  },
};

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  button: {
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  actionsContainer: {
    marginBottom: theme.spacing(2),
  },
  resetContainer: {
    padding: theme.spacing(3),
  },
}));

function getSteps() {
  return [
    "Entrega de implementos",
    "Desarrollo del producto",
    "Entrega de producto",
  ];
}

function getStepContent(step) {
  switch (step) {
    case 0:
      return `Datos de inició.`;
    case 1:
      return `Datos de proceso.`;
    case 2:
      return `Datos de finalización`;
    default:
      return "Unknown step";
  }
}

const AddElementsStandardized = (props) => {
  //Generals
  const [{ sesion }, dispatch] = useStateValue();

  //elementsStandardized
  const [elementsStandardized, setElementsStandardized] = useState([]);
  let [
    selectedElementsStandardized,
    setSelectedElementsStandardized,
  ] = useState(null);

  //dataElementsStandardized
  const [elementStandardized, setDataElementStandardized] = useState({
    selected: false,
    nid: "",
    quantity: 0,
    raw_materials: [],
    raw_materials_avaible: [],
    supplies: [],
    supplies_avaible: [],
  });

  //dataRawMaterials
  const [elementsRawMaterials, setElementsRawMaterial] = useState([
    { title: "", nid: "" },
  ]);
  //dataSupplies
  const [elementsSupplies, setElementsSupplies] = useState([
    { title: "", nid: "" },
  ]);

  //dataEmployee
  const [employees, setEmployees] = useState([]);
  let [selectedEmployee, setSelectedEmployee] = useState(null);

  //dataProgress
  const [selectedDate, setSelectedDate] = useState(new Date());
  const classes = useStyles();
  const [activeStep, setActiveStep] = React.useState(0);
  const steps = getSteps();

  let today = new Date();
  let dd = today.getDate();
  let mm = today.getMonth() + 1;
  let yyyy = today.getFullYear();
  let date = `${dd}-${mm}-${yyyy}`;

  const [dataProcess, setDataProcess] = useState({
    employee_responsable: "",
    employee_nid: "",
    start_date: date,
    finish_date: "",
    remainer: [],
    standardization: "",
    standardization_name: "",
    quantity: 1,
    step: 0,
    point_operation: "",
  });

  //getData
  const fetchMyAPI = useCallback(async () => {
    //getDataStandardizations
    let data = await props.firebase.db
      .collection("Standardizations")
      .doc("3qPO90cfep2Xhg89rvnu")
      .get();

    let jsonFormatStandardizations = data.data();

    setElementsStandardized(jsonFormatStandardizations.elements);

    //getDataRawMaterials
    let itemsRawMaterials = [];
    let getDataRawMaterials = await props.firebase.db
      .collection("Inventories")
      .doc("RawMaterials")
      .get();
    let dataRawMaterials = getDataRawMaterials.data();

    for (let i = 0; i < dataRawMaterials.elements.length; i++) {
      let jsonFormatElements = {
        title: dataRawMaterials.elements[i].title,
        nid: dataRawMaterials.elements[i].nid,
        quantity: dataRawMaterials.elements[i].quantity,
        distributions: dataRawMaterials.elements[i].distributions,
      };
      itemsRawMaterials.push(jsonFormatElements);
    }

    setElementsRawMaterial(itemsRawMaterials);

    //getDataSupplies
    let itemsSupplies = [];
    let getDataSupplies = await props.firebase.db
      .collection("Inventories")
      .doc("Supplies")
      .get();
    let dataSupplies = getDataSupplies.data();

    for (let i = 0; i < dataSupplies.elements.length; i++) {
      let jsonFormatElements = {
        title: dataSupplies.elements[i].title,
        nid: dataSupplies.elements[i].nid,
        quantity: dataSupplies.elements[i].quantity,
        distributions: dataSupplies.elements[i].distributions,
      };
      itemsSupplies.push(jsonFormatElements);
    }
    setElementsSupplies(itemsSupplies);

    //getDataEmployees
    let getDataEmployees = await props.firebase.db
      .collection("Employees")
      .orderBy("nid")
      .get();
    const employees = getDataEmployees.docs.map((doc) => {
      let data = doc.data();
      let id = doc.id;
      return { id, name: data.name, points_operation: data.points_operation };
    });
    setEmployees(employees);
  }, []);

  useEffect(() => {
    fetchMyAPI();
  }, [fetchMyAPI]);

  //dataElementStandardized
  const updateTableStandardizedElement = (element) => {
    let quantityElementRawMaterials = [];
    let quantityElementSupplies = [];

    //validationRawMaterials
    for (let i = 0; i < element.raw_materials.length; i++) {
      for (let j = 0; j < elementsRawMaterials.length; j++) {
        if (element.raw_materials[i].nid === elementsRawMaterials[j].nid) {
          quantityElementRawMaterials.push(elementsRawMaterials[j].quantity);
        }
      }
    }

    //validationRawSupplies
    for (let i = 0; i < element.supplies.length; i++) {
      for (let j = 0; j < elementsSupplies.length; j++) {
        if (element.supplies[i].nid === elementsSupplies[j].nid) {
          quantityElementSupplies.push(elementsSupplies[j].quantity);
        }
      }
    }

    setDataElementStandardized({
      selected: true,
      nid: element.nid,
      raw_materials: element.raw_materials,
      raw_materials_avaible: quantityElementRawMaterials,
      supplies: element.supplies,
      supplies_avaible: quantityElementSupplies,
      quantity: 1,
    });

    setDataProcess({
      ...dataProcess,
      standardization: element.nid,
      standardization_name: element.name,
    });
  };

  //dataEmployee
  const updateTableStandardizedEmployee = async (employee) => {
    let quantityElementRawMaterials = [];
    let quantityElementSupplies = [];

    //validationRawMaterials
    for (let i = 0; i < elementStandardized.raw_materials.length; i++) {
      for (let j = 0; j < elementsRawMaterials.length; j++) {
        if (
          elementStandardized.raw_materials[i].nid ===
          elementsRawMaterials[j].nid
        ) {
          //entramos a mirar la distribución
          if (elementsRawMaterials[j].distributions.length !== 0) {
            for (
              let k = 0;
              k < elementsRawMaterials[j].distributions.length;
              k++
            ) {
              if (
                elementsRawMaterials[j].distributions[k].nid_point_operation ===
                employee.points_operation
              ) {
                quantityElementRawMaterials.push(
                  elementsRawMaterials[j].distributions[k].quantity
                );
              } else {
                quantityElementRawMaterials.push(0);
              }
            }
          } else {
            quantityElementRawMaterials.push(0);
          }
        }
      }
    }

    //validationRawSupplies
    for (let i = 0; i < elementStandardized.supplies.length; i++) {
      for (let j = 0; j < elementsSupplies.length; j++) {
        if (elementStandardized.supplies[i].nid === elementsSupplies[j].nid) {
          //entramos a mirar la distribución
          if (elementsSupplies[j].distributions.length !== 0) {
            for (let k = 0; k < elementsSupplies[j].distributions.length; k++) {
              if (
                elementsSupplies[j].distributions[k].nid_point_operation ===
                employee.points_operation
              ) {
                quantityElementSupplies.push(
                  elementsSupplies[j].distributions[k].quantity
                );
              } else {
                quantityElementSupplies.push(0);
              }
            }
          } else {
            quantityElementSupplies.push(0);
          }
        }
      }
    }

    setDataElementStandardized({
      ...elementStandardized,
      raw_materials_avaible: quantityElementRawMaterials,
      supplies_avaible: quantityElementSupplies,
    });

    let snapshotPointOperation = await props.firebase.db
      .collection("PointsOperation")
      .doc(employee.points_operation)
      .get();
    let dataPointOperation = snapshotPointOperation.data();

    setDataProcess({
      ...dataProcess,
      employee_responsable: employee.name,
      employee_nid: employee.id,
      point_operation: `${dataPointOperation.address}, ${dataPointOperation.city} - ${dataPointOperation.country}`,
    });
  };

  const changeDataProcess = (e) => {
    setDataProcess({
      ...dataProcess,
      [e.target.name]: e.target.value,
    });
  };

  //dataProgress
  const handleChange = (event) => {
    let attribute = event.target.name;
    let checked = event.target.checked;
    setDataExtras((prev) => ({
      ...prev,
      [attribute]: checked,
    }));
  };

  const handleNext = () => {
    if (activeStep === 0) {
      setDataProcess({
        ...dataProcess,
        step: 1,
      });
    } else if (activeStep === 1) {
      setDataProcess({
        ...dataProcess,
        step: 2,
      });
    }
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const handleDateChange = (date) => {
    const format = date.format("DD-MM-YYYY");
    setSelectedDate(date);
    setDataProcess({
      ...dataProcess,
      start_date: format,
    });
  };

  let [dataExtras, setDataExtras] = useState({
    raw_materials: false,
    supplies: false,
  });

  //saveData
  const saveDataFirebase = async (e) => {
    e.preventDefault();

    //generamos el reporte de cambios en inventarios
    let today = new Date();
    let dd = today.getDate();
    let mm = today.getMonth() + 1;
    let yyyy = today.getFullYear();
    let date = `${dd}-${mm}-${yyyy}`;

    //generamos los elementos
    //obtenemos la estandarización
    let snapShotStandardization = await props.firebase.db
      .collection("Standardizations")
      .doc("3qPO90cfep2Xhg89rvnu")
      .get();
    let dataStandardization = snapShotStandardization.data();
    let dataElements = [];

    //generamos la data
    for (let i = 0; i < dataStandardization.elements.length; i++) {
      if (dataStandardization.elements[i].nid === dataProcess.standardization) {
        let jsonDataElement = {};
        for (
          let j = 0;
          j < dataStandardization.elements[i].raw_materials.length;
          j++
        ) {
          jsonDataElement = {
            description:
              dataStandardization.elements[i].raw_materials[j].description,
            nid: dataStandardization.elements[i].raw_materials[j].nid,
            quantity:
              dataStandardization.elements[i].raw_materials[j].quantity *
              dataProcess.quantity,
          };
          dataElements.push(jsonDataElement);
        }
        for (
          let k = 0;
          k < dataStandardization.elements[i].supplies.length;
          k++
        ) {
          jsonDataElement = {
            description:
              dataStandardization.elements[i].supplies[k].description,
            nid: dataStandardization.elements[i].supplies[k].nid,
            quantity:
              dataStandardization.elements[i].supplies[k].quantity *
              dataProcess.quantity,
          };
          dataElements.push(jsonDataElement);
        }
      }
    }

    let jsonFormatReport = {
      user: sesion.usuario,
      date,
      type: "Subtracción para realización de producto",
      data: dataElements,
    };

    let idReport = "";
    //saveReport
    await props.firebase.db
      .collection("Reports")
      .add(jsonFormatReport)
      .then((success) => {
        idReport = success.id;
      })
      .catch((error) => {
        console.log("error: ", error);
      });

    //actulizamos los inventarios
    //obtenemos los datos que se encuentran en la base de datos
    let snapshotRawMaterials = await props.firebase.db
      .collection("Inventories")
      .doc("RawMaterials")
      .get();
    let dataRawMaterials = snapshotRawMaterials.data();

    for (let i = 0; i < dataElements.length; i++) {
      for (let j = 0; j < dataRawMaterials.elements.length; j++) {
        if (dataElements[i].nid === dataRawMaterials.elements[j].nid) {
          for (
            let k = 0;
            k < dataRawMaterials.elements[j].distributions.length;
            k++
          ) {
            if (
              selectedEmployee.points_operation ===
              dataRawMaterials.elements[j].distributions[k].nid_point_operation
            ) {
              dataRawMaterials.elements[j].distributions[k].quantity =
                parseInt( dataRawMaterials.elements[j].distributions[k].quantity)
                - parseInt(dataElements[i].quantity);
              dataRawMaterials.elements[j].quantity =
                parseInt(dataRawMaterials.elements[j].quantity) -
                parseInt(dataElements[i].quantity);
              dataRawMaterials.elements[j].last_modify = idReport;
            }
          }
        }
      }
    }
    console.log("dataRawMaterials", dataRawMaterials);

    await props.firebase.db
      .collection("Inventories")
      .doc("RawMaterials")
      .set(dataRawMaterials, { merge: true })
      .then((success) => {
        openMensajePantalla(dispatch, {
          open: true,
          mensaje: "SE ACTUALIZO EL INVENTARIO DE MATERIAS PRIMA",
        });
      });

    let snapshotSupplies = await props.firebase.db
      .collection("Inventories")
      .doc("Supplies")
      .get();
    let dataSupplies = snapshotSupplies.data();

    for (let i = 0; i < dataElements.length; i++) {
      for (let j = 0; j < dataSupplies.elements.length; j++) {
        if (dataElements[i].nid === dataSupplies.elements[j].nid) {
          for (
            let k = 0;
            k < dataSupplies.elements[j].distributions.length;
            k++
          ) {
            if (
              selectedEmployee.points_operation ===
              dataSupplies.elements[j].distributions[k].nid_point_operation
            ) {
              dataSupplies.elements[j].distributions[k].quantity =
                parseInt(dataSupplies.elements[j].distributions[k].quantity) -
                parseInt(dataElements[i].quantity);
              dataSupplies.elements[j].quantity =
                parseInt(dataSupplies.elements[j].quantity) - parseInt(dataElements[i].quantity);
              dataSupplies.elements[j].last_modify = idReport;
            }
          }
        }
      }
    }

    console.log("dataSupplies", dataSupplies);

    let idProcess = "";
    await props.firebase.db
      .collection("Inventories")
      .doc("Supplies")
      .set(dataSupplies, { merge: true })
      .then((success) => {
        openMensajePantalla(dispatch, {
          open: true,
          mensaje: "SE ACTUALIZO EL INVENTARIO DE INSUMOS",
        });
      });
      

    //guardamos el proceso
    await props.firebase.db
      .collection("Processes")
      .add(dataProcess)
      .then((success) => {
        openMensajePantalla(dispatch, {
          open: true,
          mensaje: "SE HA GENERADO EL PROCESO",
        });
      });

    //actualizamos los procesos del empleado
    let snapshotEmployee = await props.firebase.db
      .collection("Employees")
      .doc(selectedEmployee.id)
      .get();

    let dataEmployee = snapshotEmployee.data();

    let tempProcesses = dataEmployee.processes_employee;
    tempProcesses.push(idProcess);

    dataEmployee.processes_employee = tempProcesses;
    await props.firebase.db
      .collection("Employees")
      .doc(selectedEmployee.id)
      .set(dataEmployee, { merge: true })
      .then((success) => {
        openMensajePantalla(dispatch, {
          open: true,
          mensaje: "SE ACTUALIZO LA INFORMACIÓN DEL EMPLEADO",
        });
        props.history.replace(`/procesos/mostrar/search`);
      });
  };

  return (
    <Container component="main" maxWidth="md" justify="center">
      <Paper style={style.paper}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={12}>
            <Breadcrumbs aria-label="breadcrumbs">
              <Link color="inherit" style={style.link} href="/">
                <HomeIcon />
                Principal
              </Link>
              <Typography color="textPrimary">Inventario</Typography>
              <Typography color="textPrimary">Agregar</Typography>
              <Typography color="textPrimary">Producto en Proceso</Typography>
            </Breadcrumbs>
          </Grid>
        </Grid>
      </Paper>
      <Paper style={style.paperForm}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={12}>
            <Autocomplete
              disabled={dataProcess.step === 0 ? false : true}
              id="select_element_standardized"
              options={elementsStandardized}
              value={selectedElementsStandardized}
              onChange={(event, newElementStandardized) => {
                updateTableStandardizedElement(newElementStandardized);
                setSelectedElementsStandardized(newElementStandardized);
              }}
              getOptionLabel={(element) => element.name}
              fullWidth
              renderInput={(params) => (
                <TextField
                  {...params}
                  disabled={dataProcess.step === 0 ? false : true}
                  label="Producto"
                  variant="outlined"
                  required
                />
              )}
            />
          </Grid>
        </Grid>
      </Paper>
      {elementStandardized.selected ? (
        <Paper style={style.paperForm}>
          <Grid containerstyle={style.form}>
            <Grid item xs={12} sm={12}>
              <Typography>Elementos Necesarios (Materia Prima)</Typography>
            </Grid>
          </Grid>
          <TableContainer item xs={12} sm={12}>
            <Table aria-label="collapsible table">
              <TableHead>
                <TableRow>
                  <TableCell style={{ width: "70%" }} align="left">
                    Descripción
                  </TableCell>
                  <TableCell style={{ width: "25%" }} align="right">
                    Cantidad Requerida
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {elementStandardized.raw_materials.map((element, idx) => (
                  <TableRow key={`${element.description}_data_raw_materials`}>
                    <TableCell>{element.description}</TableCell>
                    <TableCell align="right">
                      {element.quantity * dataProcess.quantity}
                      {element.quantity * dataProcess.quantity >
                      elementStandardized.raw_materials_avaible[idx] ? (
                        <Typography style={{ color: "red", fontSize: 10 }}>
                          Cantidad NO disponible en inventario o punto de
                          operación (
                          {elementStandardized.raw_materials_avaible[idx]})
                        </Typography>
                      ) : (
                        ""
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Grid container style={(style.form, { marginTop: "20px" })}>
            <Grid item xs={12} sm={12}>
              <Typography>Elementos Necesarios (Insumos)</Typography>
            </Grid>
          </Grid>
          <TableContainer item xs={12} sm={12}>
            <Table aria-label="collapsible table">
              <TableHead>
                <TableRow>
                  <TableCell style={{ width: "70%" }} align="left">
                    Descripción
                  </TableCell>
                  <TableCell style={{ width: "25%" }} align="right">
                    Cantidad Requerida
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {elementStandardized.supplies.map((element, idx) => (
                  <TableRow key={`${element.description}_data_raw_materials`}>
                    <TableCell>{element.description}</TableCell>
                    <TableCell align="right">
                      {element.quantity * dataProcess.quantity}
                      {element.quantity * dataProcess.quantity >
                      elementStandardized.supplies_avaible[idx] ? (
                        <Typography style={{ color: "red", fontSize: 10 }}>
                          Cantidad NO disponible en inventario (
                          {elementStandardized.supplies_avaible[idx]})
                        </Typography>
                      ) : (
                        ""
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      ) : (
        ""
      )}
      <Paper style={style.paperForm}>
        <div className={classes.root}>
          <Stepper activeStep={activeStep} orientation="vertical">
            {steps.map((label, index) => (
              <Step key={label} style={{ minheight: "auto" }}>
                <StepLabel>{label}</StepLabel>
                <StepContent>
                  <Typography>{getStepContent(index)}</Typography>
                  <div style={style.divForm}>
                    {index === 0 ? (
                      <Grid container spacing={3}>
                        <Grid item xs={6} md={6}>
                          <Autocomplete
                            disabled={dataProcess.step === 0 ? false : true}
                            id="select_employee"
                            options={employees}
                            value={selectedEmployee}
                            onChange={(event, newEmployee) => {
                              setSelectedEmployee(newEmployee);
                              updateTableStandardizedEmployee(newEmployee);
                            }}
                            getOptionLabel={(employee) => employee.name}
                            fullWidth
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                disabled={dataProcess.step === 0 ? false : true}
                                label="Empleado"
                                variant="outlined"
                                required
                              />
                            )}
                          />
                        </Grid>
                        <Grid item xs={6} md={6}>
                          <MuiPickersUtilsProvider utils={MomentUtils}>
                            <KeyboardDatePicker
                              disabled={dataProcess.step === 0 ? false : true}
                              disableToolbar
                              fullWidth
                              variant="inline"
                              format="DD/MM/yyyy"
                              id="bill_date"
                              label="Fecha de inicio"
                              value={selectedDate}
                              onChange={handleDateChange}
                              KeyboardButtonProps={{
                                "aria-label": "change date",
                              }}
                            />
                          </MuiPickersUtilsProvider>
                        </Grid>
                        <Grid item xs={12} md={12}>
                          <TextField
                            disabled={true}
                            name="point_operation"
                            variant="outlined"
                            fullWidth
                            label="Punto de Operación"
                            value={dataProcess.point_operation}
                          />
                        </Grid>
                        <Grid item xs={6} md={6}>
                          <TextField
                            disabled={dataProcess.step === 0 ? false : true}
                            name="quantity"
                            variant="outlined"
                            fullWidth
                            label="Cantidad a realizar"
                            type="number"
                            value={dataProcess.quantity}
                            onChange={changeDataProcess}
                          />
                        </Grid>
                        <Grid item xs={6} md={6}>
                          <FormGroup row>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  disabled={
                                    dataProcess.step === 0 ? false : true
                                  }
                                  checked={dataExtras.raw_materials}
                                  onChange={handleChange}
                                  name="raw_materials"
                                  color="primary"
                                />
                              }
                              label="Materia Prima"
                              name="raw_materials"
                            />
                            <FormControlLabel
                              control={
                                <Checkbox
                                  disabled={
                                    dataProcess.step === 0 ? false : true
                                  }
                                  checked={dataExtras.supplies}
                                  onChange={handleChange}
                                  name="supplies"
                                  color="primary"
                                />
                              }
                              label="Insumos"
                              name="supplies"
                            />
                          </FormGroup>
                          <Typography style={{ fontSize: 10 }}>
                            Por favor confirme que se hizo entrega de los
                            elementos, para el desarrollo del producto.
                          </Typography>
                        </Grid>
                      </Grid>
                    ) : index === 1 ? (
                      <Grid container spacing={3}>
                        <Typography style={{ width: "100%" }}>
                          Empleado: {dataProcess.employee_responsable}
                        </Typography>
                        <Typography style={{ width: "100%" }}>
                          Punto de Operación: {dataProcess.point_operation}
                        </Typography>
                        <Typography style={{ width: "100%" }}>
                          Inició de proceso: {dataProcess.start_date}
                        </Typography>
                        <Typography style={{ width: "100%" }}>
                          Producto: {dataProcess.standardization_name}
                        </Typography>
                      </Grid>
                    ) : (
                      ""
                    )}
                  </div>
                  <div
                    className={classes.actionsContainer}
                    style={style.divButtom}
                  >
                    <div>
                      <Button
                        disabled={activeStep === 0}
                        onClick={handleBack}
                        className={classes.button}
                      >
                        Atras
                      </Button>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={handleNext}
                        className={classes.button}
                      >
                        {activeStep === steps.length - 1
                          ? "Finalizar"
                          : "Siguiente"}
                      </Button>
                    </div>
                  </div>
                </StepContent>
              </Step>
            ))}
          </Stepper>
          {activeStep === steps.length && (
            <Paper square elevation={0} className={classes.resetContainer}>
              <Typography>
                All steps completed - you&apos;re finished
              </Typography>
              <Button onClick={handleReset} className={classes.button}>
                Reset
              </Button>
            </Paper>
          )}
        </div>
      </Paper>
      <Paper style={{ padding: "10px", marginTop: 2 }}>
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
              GUARDAR ESTADO
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default consumerFirebase(AddElementsStandardized);
