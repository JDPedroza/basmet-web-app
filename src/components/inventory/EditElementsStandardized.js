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
import Autocomplete, {
  createFilterOptions,
} from "@material-ui/lab/Autocomplete";
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
      return `Datos de finalización.`;
    default:
      return "Unknown step";
  }
}

const EditElementsStandardizared = (props) => {
  //Generals
  const { id } = props.match.params;
  const [{ sesion }, dispatch] = useStateValue();

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
    start_date: "",
    finish_date: date,
    remainer: [],
    standardization: "",
    standardization_name: "",
    quantity: 1,
    step: 0,
    point_operation: "",
  });

  //getData
  const fetchMyAPI = useCallback(async () => {
    //obtenemos los datos
    let snapshotProcess = await props.firebase.db
      .collection("Processes")
      .doc(id)
      .get();
    let dataProcessBD = snapshotProcess.data();

    setDataProcess({
      ...dataProcess,
      employee_responsable: dataProcessBD.employee_responsable,
      employee_nid: dataProcessBD.employee_nid,
      start_date: dataProcessBD.start_date,
      remainer: [],
      standardization: dataProcessBD.standardization,
      standardization_name: dataProcessBD.standardization_name,
      quantity: dataProcessBD.quantity,
      step: dataProcessBD.step,
      point_operation: dataProcessBD.point_operation,
    });

    setActiveStep(dataProcessBD.step);
  }, []);

  useEffect(() => {
    fetchMyAPI();
  }, [fetchMyAPI]);

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
      finish_date: format,
    });
  };

  let [dataExtras, setDataExtras] = useState({
    raw_materials: true,
    supplies: true,
  });

  //saveData
  const saveDataFirebase = async (e) => {
    e.preventDefault();

    await props.firebase.db
      .collection("Processes")
      .doc(id)
      .set(dataProcess, { merge: true })
      .then((success) => {
        openMensajePantalla(dispatch, {
          open: true,
          mensaje: "SE ACTUALIZO EL ESTADO DEL PROCESO",
        });
      });

    let dataElements = {
      items: [
        {
          description: dataProcess.standardization_name,
          nid: dataProcess.standardization,
          quantity: dataProcess.quantity,
        },
      ],
    };

    let jsonFormatReport = {
      user: sesion.usuario,
      date,
      type: "Producto realizado",
      data: dataElements,
    };

    //saveReport
    let idReport = "";
    await props.firebase.db
      .collection("Reports")
      .add(jsonFormatReport)
      .then((success) => {
        idReport = success.id;
      })
      .catch((error) => {
        console.log("error: ", error);
      });

    let snapshotItemsPackaging = await props.firebase.db
      .collection("Inventories")
      .doc("ItemsPackaging")
      .get();
    let dataItemsPackaging = snapshotItemsPackaging.data();

    if (dataItemsPackaging.elements.length !== 0) {
      let found = false;
      let tempLength = dataItemsPackaging.elements.length;
      for (let i = 0; i < tempLength; i++) {
        if (dataItemsPackaging.elements[i].nid === dataProcess.standardization) {
          dataItemsPackaging.elements[i].quantity =
            parseInt(dataItemsPackaging.elements[i].quantity) + parseInt(dataProcess.quantity);
          dataItemsPackaging.elements[i].last_modify = idReport;
          found = true;
        }
        if (i === tempLength - 1 && !found) {
          let tempElements = dataItemsPackaging.elements;
          tempElements.push({
            distributions: [],
            title: dataProcess.standardization_name,
            last_modify: idReport,
            nid: dataProcess.standardization,
            quantity: dataProcess.quantity,
            providers: [],
          });
          dataItemsPackaging.elements = tempElements;
        }
      }
    } else {
      let tempElements = [];
      tempElements.push({
        distributions: [],
        title: dataProcess.standardization_name,
        last_modify: idReport,
        nid: dataProcess.standardization,
        quantity: dataProcess.quantity,
        providers: [],
      });
      dataItemsPackaging.elements = tempElements;
    }

    await props.firebase.db
      .collection("Inventories")
      .doc("ItemsPackaging")
      .set(dataItemsPackaging, { merge: true })
      .then((success) => {
        openMensajePantalla(dispatch, {
          open: true,
          mensaje: "SE ACTUALIZO EL INVENTARIO DE PRODUCTOS EN EMBALAJE",
        });
        props.history.replace(`/inventarios/agregar/asignar/productos_en_embalaje/${idReport}`);
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
              <Typography color="textPrimary">Actualizar</Typography>
              <Typography color="textPrimary">Proceso</Typography>
            </Breadcrumbs>
          </Grid>
        </Grid>
      </Paper>
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
                          <TextField
                            disabled={true}
                            name="select_employee"
                            variant="outlined"
                            fullWidth
                            label="Empleado"
                            value={dataProcess.employee_responsable}
                          />
                        </Grid>
                        <Grid item xs={6} md={6}>
                          <TextField
                            disabled={true}
                            name="start_date"
                            variant="outlined"
                            fullWidth
                            label="Fecha de inicio"
                            value={dataProcess.start_date}
                          />
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
                            disabled={true}
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
                                  disabled={true}
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
                                  disabled={true}
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
                        <Typography style={{ width: "100%" }}>
                          Cantidad: {dataProcess.quantity}
                        </Typography>
                      </Grid>
                    ) : (
                      <Grid container spacing={3}>
                        <Grid item xs={6} md={6}>
                          <MuiPickersUtilsProvider utils={MomentUtils}>
                            <KeyboardDatePicker
                              disableToolbar
                              fullWidth
                              variant="inline"
                              format="DD/MM/yyyy"
                              id="bill_date"
                              label="Fecha de finalización"
                              value={selectedDate}
                              onChange={handleDateChange}
                              KeyboardButtonProps={{
                                "aria-label": "change date",
                              }}
                            />
                          </MuiPickersUtilsProvider>
                        </Grid>
                      </Grid>
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
                        disabled={activeStep === steps.length - 1}
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
              FINALIZAR PROCESO
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default consumerFirebase(EditElementsStandardizared);