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
  Select,
  MenuItem,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Divider,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  IconButton,
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
import { v4 as uuidv4 } from "uuid";
import { openMensajePantalla } from "../../sesion/actions/snackBarAction";

//icons
import HomeIcon from "@material-ui/icons/Home";
import AddIcon from "@material-ui/icons/Add";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";

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

const AddStandarizations = (props) => {
  //Generals
  const { type } = props.match.params;

  const data = {
    name: "Johan David Pedroza",
    date: "01-01-2017",
  };

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

  //dataProgress
  const [selectedDate, setSelectedDate] = useState(new Date());
  const classes = useStyles();
  const [activeStep, setActiveStep] = React.useState(0);
  const steps = getSteps();

  const [dataProccess, setDataProccess] = useState({
    employee_responsable: "",
    start_date: "",
    finish_date: "",
    remainer: [],
    standardization: "",
    quantity: 1,
    step: 0,
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
      .collection("RawMaterial")
      .doc("6Ti3WLE0cav83i0rYozs")
      .get();
    let dataRawMaterials = getDataRawMaterials.data();

    for (let i = 0; i < dataRawMaterials.elements.length; i++) {
      let jsonFormatElements = {
        title: dataRawMaterials.elements[i].title,
        nid: dataRawMaterials.elements[i].nid,
        quantity: dataRawMaterials.elements[i].quantity,
      };
      itemsRawMaterials.push(jsonFormatElements);
    }

    setElementsRawMaterial(itemsRawMaterials);

    //getDataSupplies
    let itemsSupplies = [];
    let getDataSupplies = await props.firebase.db
      .collection("Supplies")
      .doc("TdxeXYYQKxGxfF3dQIUe")
      .get();
    let dataSupplies = getDataSupplies.data();

    for (let i = 0; i < dataSupplies.elements.length; i++) {
      let jsonFormatElements = {
        title: dataSupplies.elements[i].title,
        nid: dataSupplies.elements[i].nid,
        quantity: dataSupplies.elements[i].quantity,
      };
      itemsSupplies.push(jsonFormatElements);
    }
    setElementsSupplies(itemsSupplies);
  }, []);

  useEffect(() => {
    fetchMyAPI();
  }, [fetchMyAPI]);

  //dataElementStandardized
  const updateTableStandardized = (element) => {
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
  };

  const changeDataProccess = (e) => {
    setDataProccess({
      ...dataProccess,
      [e.target.name]: e.target.value,
    });
  };

  //dataProgress

  const handleChange = (event) => {
    setBillExtras((prev) => ({
      ...prev,
      [event.target.name]: event.target.checked,
    }));
  };

  const handleNext = () => {
    if (activeStep === 0) {
      setDataProccess({
        ...dataProccess,
        step: 1,
      });
    }
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    console.log(dataProccess)
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
  };

  let [billExtras, setBillExtras] = useState({
    iva: false,
    rf: false,
  });

  //saveData
  const saveDataFirebase = async (e) => {
    e.preventDefault();
  };

  return (
    <Container component="main" maxWidth="md" justify="center">
      <Paper style={style.paper}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={12}>
            <Breadcrumbs aria-label="breadcrumbs">
              <Link color="inherit" style={style.link} href="/home">
                <HomeIcon />
                Principal
              </Link>
              <Typography color="textPrimary">Inventario</Typography>
              <Typography color="textPrimary">Agregar</Typography>
              <Typography color="textPrimary">Proceso</Typography>
              <Typography color="textPrimary">Realizar Producto</Typography>
            </Breadcrumbs>
          </Grid>
        </Grid>
      </Paper>
      <Paper style={style.paperForm}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={12}>
            <Autocomplete
              disabled={dataProccess.step === 0 ? false : true}
              id="select_element_standardized"
              options={elementsStandardized}
              value={selectedElementsStandardized}
              onChange={(event, newElementStandardized) => {
                updateTableStandardized(newElementStandardized);
                setSelectedElementsStandardized(newElementStandardized);
              }}
              getOptionLabel={(element) => element.name}
              fullWidth
              renderInput={(params) => (
                <TextField
                  {...params}
                  disabled={dataProccess.step === 0 ? false : true}
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
                      {element.quantity * dataProccess.quantity}
                      {element.quantity * dataProccess.quantity >
                      elementStandardized.raw_materials_avaible[idx] ? (
                        <Typography style={{ color: "red", fontSize: 10 }}>
                          Cantidad NO disponible en inventario (
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
                      {element.quantity * dataProccess.quantity}
                      {element.quantity * dataProccess.quantity >
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
                          <TextField
                            disabled={dataProccess.step === 0 ? false : true}
                            name="employee"
                            variant="outlined"
                            fullWidth
                            label="Empleado"
                          />
                        </Grid>
                        <Grid item xs={6} md={6}>
                          <MuiPickersUtilsProvider utils={MomentUtils}>
                            <KeyboardDatePicker
                              disabled={dataProccess.step === 0 ? false : true}
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
                        <Grid item xs={6} md={6}>
                          <TextField
                            disabled={dataProccess.step === 0 ? false : true}
                            name="quantity"
                            variant="outlined"
                            fullWidth
                            label="Cantidad a realizar"
                            type="number"
                            value={dataProccess.quantity}
                            onChange={changeDataProccess}
                          />
                        </Grid>
                        <Grid item xs={6} md={6}>
                          <FormGroup row>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  disabled={
                                    dataProccess.step === 0 ? false : true
                                  }
                                  checked={billExtras.iva}
                                  onChange={handleChange}
                                  name="iva"
                                  color="primary"
                                />
                              }
                              label="Materia Prima"
                            />
                            <FormControlLabel
                              control={
                                <Checkbox
                                  disabled={
                                    dataProccess.step === 0 ? false : true
                                  }
                                  checked={billExtras.rf}
                                  onChange={handleChange}
                                  name="rf"
                                  color="primary"
                                />
                              }
                              label="Insumos"
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
                        <Typography>
                          Empleado: {dataProccess.employee_responsable}
                        </Typography>
                        <Typography>
                          Inició de proceso: {dataProccess.date}
                        </Typography>
                        <Typography>Producto: {dataProccess.standardization}</Typography>
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
              GUARDAR
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default consumerFirebase(AddStandarizations);
