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
  Box,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Toolbar,
  Tooltip,
  IconButton,
  TableContainer,
} from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";

//icons
import HomeIcon from "@material-ui/icons/Home";
import ForwardIcon from "@material-ui/icons/Forward";
import AssignmentReturnedIcon from "@material-ui/icons/AssignmentReturned";

//utils
import { useStateValue } from "../../sesion/store";
import { consumerFirebase } from "../../server";
import UpdateInventoriesTransfer from "../fuctions/updateInventoriesTransfer";
import MergeArraysElements from "../fuctions/mergeArraysElements";
import { openMensajePantalla } from "../../sesion/actions/snackBarAction";
import GetElementsPointOperation from "../fuctions/getElementsPointOperation";
import MomentUtils from "@date-io/moment";
import moment from "moment";

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

const ShowElements = (props) => {
  const {
    numberTotalQuantity,
    stringTitle,
    funtionTrasnfer,
    arrayElements,
    arrayQuantities,
    funtionQuantities,
    stringTable,
  } = props;

  return (
    <Box margin={1}>
      <Toolbar>
        {numberTotalQuantity > 0 ? (
          <Grid container spacing={2}>
            <Grid item xs={10} md={10}>
              <Typography
                color="inherit"
                variant="h6"
                id="subTitle"
                component="div"
              >
                {numberTotalQuantity} {stringTitle} seleccionados
              </Typography>
            </Grid>
          </Grid>
        ) : (
          <Typography variant="h6" id="tableTitle" component="div">
            {stringTitle}
          </Typography>
        )}
        {numberTotalQuantity > 0 ? (
          <Tooltip title="Trasladar">
            <IconButton
              aria-label="Trasladar"
              onClick={() => {
                funtionTrasnfer(stringTable);
              }}
            >
              <AssignmentReturnedIcon />
            </IconButton>
          </Tooltip>
        ) : (
          ""
        )}
      </Toolbar>
      <Table size="small" aria-label="purchases">
        <TableHead>
          <TableRow>
            <TableCell style={{ width: "50%" }}>Elemento</TableCell>
            <TableCell style={{ width: "25%" }}>Cantidad Disponible</TableCell>
            <TableCell style={{ width: "25%" }}>Cantidad Traslado</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {arrayElements.map((element, idx) => (
            <TableRow key={`${element.description}_${idx}`}>
              <TableCell component="th" scope="row">
                {element.description}
              </TableCell>
              <TableCell component="th" scope="row">
                {element.quantity}
              </TableCell>
              <TableCell component="th" scope="row">
                <TextField
                  disabled={arrayElements[idx].quantity === 0 ? true : false}
                  name="quantity"
                  fullWidth
                  type="number"
                  value={arrayQuantities[idx]}
                  onChange={(event) => {
                    funtionQuantities(event, idx, stringTable);
                  }}
                />
                {arrayQuantities[idx] > arrayElements[idx].quantity ? (
                  <Typography style={{ color: "red", fontSize: 10 }}>
                    Cantidad NO disponible
                  </Typography>
                ) : (
                  ""
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
};

const ShowTransfers = (props) => {
  const { stringTitle, arrayElements } = props;
  return (
    <Box>
      <Grid containerstyle={style.form}>
        <Grid item xs={12} sm={12} style={{ paddingLeft: 15, paddingTop: 10 }}>
          <Typography variant="h6" id="tableTitle" component="div">
            {stringTitle}
          </Typography>
        </Grid>
      </Grid>
      <TableContainer item xs={12} sm={12}>
        <Table aria-label="collapsible table">
          <TableHead>
            <TableRow>
              <TableCell style={{ width: "70%" }} align="left">
                Descripción
              </TableCell>
              <TableCell style={{ width: "30%" }} align="right">
                Cantidad
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {arrayElements.map((element) => (
              <TableRow key={`${element.description}_data${stringTitle}`}>
                <TableCell>{element.description}</TableCell>
                <TableCell align="right">{element.quantity}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

const AddTransfers = (props) => {
  const [{ sesion }, dispatch] = useStateValue();
  const [dataPoitnsOperation, setDataPointsOperation] = useState([]);
  const [
    selectedPointOperationOutput,
    setSelectedPointOperationOutput,
  ] = useState(null);
  const [
    selectedPointOperationInput,
    setSelectedPointOperationInput,
  ] = useState(null);

  const [dataElementsPointOperation, setDataElementsPointOperation] = useState({
    implements: [],
    items_packaging: [],
    items_process: [],
    raw_materials: [],
    supplies: [],
    tools_equipment: [],
  });

  const [employeesOutput, setEmployeesOutput] = useState([]);
  const [employeesInput, setEmployeesInput] = useState([]);
  const [selectedEmployeeOutput, setSelectedEmployeeOutput] = useState(null);
  const [selectedEmployeeInput, setSelectedEmployeeInput] = useState(null);

  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [selectedDate, setSelectedDate] = useState(moment());

  const [quantityElements, setDataQuantityElements] = useState({
    quantity_implements: [],
    quantity_items_packaging: [],
    quantity_items_process: [],
    quantity_raw_materials: [],
    quantity_supplies: [],
    quantity_tools_equipment: [],
  });

  const [totalQuantityElements, setTotalQuantityElements] = useState({
    quantity_implements: 0,
    quantity_items_packaging: 0,
    quantity_items_process: 0,
    quantity_raw_materials: 0,
    quantity_supplies: 0,
    quantity_tools_equipment: 0,
  });

  const [transferElements, setTransferElements] = useState({
    active: false,
    implements: [],
    items_packaging: [],
    items_process: [],
    raw_materials: [],
    supplies: [],
    tools_equipment: [],
  });

  const fetchMyAPI = useCallback(async () => {
    //getDataPointsOperation
    let snapshotPointsOperation = await props.firebase.db
      .collection("PointsOperation")
      .orderBy("city")
      .get();

    const arrayPointsOperation = snapshotPointsOperation.docs.map((doc) => {
      let data = doc.data();
      let id = doc.id;
      return {
        id,
        address: data.address,
        city: data.city,
        country: data.country,
        nid_inventories: data.nid_inventories,
        nid_employees: data.nid_employees,
        name: `${data.address}, ${data.city} - ${data.country}`,
      };
    });

    setDataPointsOperation(arrayPointsOperation);

    //getDataVehicles
    let snapshotVehicles = await props.firebase.db
      .collection("Vehicles")
      .orderBy("plate")
      .get();

    let result = await Promise.all(
      snapshotVehicles.docs.map(async (doc) => {
        let data = doc.data();
        let id = doc.id;
        let snapshotEmployee = await props.firebase.db
          .collection("Employees")
          .doc(data.employee_responsible)
          .get();
        let dataEmployee = snapshotEmployee.data();
        return {
          ...data,
          id,
          name: `${data.type}, ${data.brand} - ${data.model}, (${data.plate})`,
          name_employee_responsible: dataEmployee.name,
        };
      })
    );
    setVehicles(result);
  }, []);

  useEffect(() => {
    fetchMyAPI();
  }, [fetchMyAPI]);

  const updateInventoriesPointOperation = async (pointOperation) => {
    let snapshotImplements = await props.firebase.db
      .collection("Inventories")
      .doc("Implements")
      .get();
    let dataImplements = snapshotImplements.data();
    let tempImplements = await calculateQuantityAvaible(
      dataImplements,
      pointOperation
    );

    let snapshotItemsPackaging = await props.firebase.db
      .collection("Inventories")
      .doc("ItemsPackaging")
      .get();
    let dataItemsPackaging = snapshotItemsPackaging.data();
    let tempItemsPackaging = await calculateQuantityAvaible(
      dataItemsPackaging,
      pointOperation
    );

    let snapshotItemsProcess = await props.firebase.db
      .collection("Inventories")
      .doc("ItemsProcess")
      .get();
    let dataItemsProcess = snapshotItemsProcess.data();
    let tempItemsProcess = await calculateQuantityAvaible(
      dataItemsProcess,
      pointOperation
    );

    let snapshotRawMaterials = await props.firebase.db
      .collection("Inventories")
      .doc("RawMaterials")
      .get();
    let dataRawMaterials = snapshotRawMaterials.data();
    let tempRawMaterials = await calculateQuantityAvaible(
      dataRawMaterials,
      pointOperation
    );

    let snapshotSupplies = await props.firebase.db
      .collection("Inventories")
      .doc("Supplies")
      .get();
    let dataSupplies = snapshotSupplies.data();
    let tempSupplies = await calculateQuantityAvaible(
      dataSupplies,
      pointOperation
    );

    let snapshotToolsEquipment = await props.firebase.db
      .collection("Inventories")
      .doc("ToolsEquipment")
      .get();
    let dataToolsEquipment = snapshotToolsEquipment.data();
    let tempToolsEquipment = await calculateQuantityAvaible(
      dataToolsEquipment,
      pointOperation
    );

    let jsonPrueba = {
      implements: tempImplements,
      items_packaging: tempItemsPackaging,
      items_process: tempItemsProcess,
      raw_materials: tempRawMaterials,
      supplies: tempSupplies,
      tools_equipment: tempToolsEquipment,
    };

    setDataElementsPointOperation(jsonPrueba);

    //calculamos las cantidades de los arrays
    let tempQuantityImplements = [];
    for (let i = 0; i < jsonPrueba.implements.length; i++) {
      tempQuantityImplements.push(0);
    }
    let tempQuantityItemsPackaging = [];
    for (let i = 0; i < jsonPrueba.items_packaging.length; i++) {
      tempQuantityItemsPackaging.push(0);
    }
    let tempQuantityItemsProcess = [];
    for (let i = 0; i < jsonPrueba.items_process.length; i++) {
      tempQuantityItemsProcess.push(0);
    }
    let tempQuantityRawMaterials = [];
    for (let i = 0; i < jsonPrueba.raw_materials.length; i++) {
      tempQuantityRawMaterials.push(0);
    }
    let tempQuantitySupplies = [];
    for (let i = 0; i < jsonPrueba.supplies.length; i++) {
      tempQuantitySupplies.push(0);
    }
    let tempQuantityToolsEquipment = [];
    for (let i = 0; i < jsonPrueba.tools_equipment.length; i++) {
      tempQuantityToolsEquipment.push(0);
    }

    setDataQuantityElements({
      quantity_implements: tempQuantityImplements,
      quantity_items_packaging: tempQuantityItemsPackaging,
      quantity_items_process: tempQuantityItemsProcess,
      quantity_raw_materials: tempQuantityRawMaterials,
      quantity_supplies: tempQuantitySupplies,
      quantity_tools_equipment: tempQuantityToolsEquipment,
    });
  };

  const updateEmployeesPointOperationOutput = async (pointOperation) => {
    let snapshotEmployeesPointOperation = await props.firebase.db
      .collection("EmployeesPointOperation")
      .doc(pointOperation.nid_employees)
      .get();

    let dataEmployeesPointOperation = snapshotEmployeesPointOperation.data();
    let results = await Promise.all(
      dataEmployeesPointOperation.employees.map(async (doc) => {
        let snapshotEmployee = await props.firebase.db
          .collection("Employees")
          .doc(doc)
          .get();
        let dataEmployee = snapshotEmployee.data();
        let id = snapshotEmployee.id;
        return {
          id,
          name: dataEmployee.name,
          transfers_employee: dataEmployee.transfers_employee,
        };
      })
    );

    setEmployeesOutput(results);
  };

  const updateEmployeesPointOperationInput = async (pointOperation) => {
    let snapshotEmployeesPointOperation = await props.firebase.db
      .collection("EmployeesPointOperation")
      .doc(pointOperation.nid_employees)
      .get();

    let dataEmployeesPointOperation = snapshotEmployeesPointOperation.data();
    let results = await Promise.all(
      dataEmployeesPointOperation.employees.map(async (doc) => {
        let snapshotEmployee = await props.firebase.db
          .collection("Employees")
          .doc(doc)
          .get();
        let dataEmployee = snapshotEmployee.data();
        let id = snapshotEmployee.id;
        return {
          id,
          name: dataEmployee.name,
          transfers_employee: dataEmployee.transfers_employee,
        };
      })
    );

    setEmployeesInput(results);
  };

  const calculateQuantityAvaible = async (data, pointOperation) => {
    let result = [];
    for (let i = 0; i < data.elements.length; i++) {
      let foundPointOperation = false;
      let quantityAvaible = 0;
      for (let j = 0; j < data.elements[i].distributions.length; j++) {
        if (
          data.elements[i].distributions[j].nid_point_operation ===
          pointOperation.id
        ) {
          foundPointOperation = true;
          quantityAvaible = parseInt(
            data.elements[i].distributions[j].quantity
          );
          for (
            let k = 0;
            k < data.elements[i].distributions[j].assignments.length;
            k++
          ) {
            quantityAvaible -= parseInt(
              data.elements[i].distributions[j].assignments[k].quantity
            );
          }
        }
      }
      if (foundPointOperation) {
        result.push({
          description: data.elements[i].title,
          nid: data.elements[i].nid,
          quantity: quantityAvaible,
        });
      }
    }
    return result;
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const changeQuantity = (e, idx, table) => {
    let attribute = "";
    let tempArray = [];
    let tempTotal = 0;
    if (table === "implements") {
      attribute = "quantity_implements";
      tempArray = quantityElements.quantity_implements;
    } else if (table === "items_packaging") {
      attribute = "quantity_items_packaging";
      tempArray = quantityElements.quantity_items_packaging;
    } else if (table === "items_process") {
      attribute = "quantity_items_process";
      tempArray = quantityElements.quantity_items_process;
    } else if (table === "raw_materials") {
      attribute = "quantity_raw_materials";
      tempArray = quantityElements.quantity_raw_materials;
    } else if (table === "supplies") {
      attribute = "quantity_supplies";
      tempArray = quantityElements.quantity_supplies;
    } else if (table === "tools_equipment") {
      attribute = "quantity_tools_equipment";
      tempArray = quantityElements.quantity_tools_equipment;
    }

    tempArray[idx] = e.target.value;

    for (let i = 0; i < tempArray.length; i++) {
      tempTotal += parseInt(tempArray[i]);
    }

    setDataQuantityElements({
      ...quantityElements,
      [attribute]: tempArray,
    });
    setTotalQuantityElements({
      ...totalQuantityElements,
      [attribute]: tempTotal,
    });
  };

  const updateTransferElements = (table) => {
    let tempArrayTransferElements = [];
    let tempArrayQuantities = [];
    let tempArrayElements = [];
    if (table === "implements") {
      tempArrayTransferElements = transferElements.implements;
      tempArrayQuantities = quantityElements.quantity_implements;
      tempArrayElements = dataElementsPointOperation.implements;
    } else if (table === "items_packaging") {
      tempArrayTransferElements = transferElements.items_packaging;
      tempArrayQuantities = quantityElements.quantity_items_packaging;
      tempArrayElements = dataElementsPointOperation.items_packaging;
    } else if (table === "items_process") {
      tempArrayTransferElements = transferElements.items_process;
      tempArrayQuantities = quantityElements.quantity_items_process;
      tempArrayElements = dataElementsPointOperation.items_process;
    } else if (table === "raw_materials") {
      tempArrayTransferElements = transferElements.raw_materials;
      tempArrayQuantities = quantityElements.quantity_raw_materials;
      tempArrayElements = dataElementsPointOperation.raw_materials;
    } else if (table === "supplies") {
      tempArrayTransferElements = transferElements.supplies;
      tempArrayQuantities = quantityElements.quantity_supplies;
      tempArrayElements = dataElementsPointOperation.supplies;
    } else if (table === "tools_equipment") {
      tempArrayTransferElements = transferElements.tools_equipment;
      tempArrayQuantities = quantityElements.quantity_tools_equipment;
      tempArrayElements = dataElementsPointOperation.tools_equipment;
    }

    //recorremos el array de cantidades para saber que elementos hay que pasar
    for (let i = 0; i < tempArrayQuantities.length; i++) {
      //validamos que halla elementos que pasar
      if (parseInt(tempArrayQuantities[i]) !== 0) {
        //validamos si ya se habia trapasado elementos
        if (tempArrayTransferElements.length !== 0) {
          //ya habia
          tempArrayElements[i].quantity -= parseInt(tempArrayQuantities[i]);
          //sumamos en el marcador de los traslados
          let tempLength = tempArrayTransferElements.length;
          for (let j = 0; j < tempLength; j++) {
            let found = false;
            if (tempArrayTransferElements[j].nid === tempArrayElements[i].nid) {
              //encontro el mismo elemento
              //sumamos el elemento
              tempArrayTransferElements[j].quantity =
                parseInt(tempArrayQuantities[i]) +
                parseInt(tempArrayTransferElements[j].quantity);
              tempArrayQuantities[i] = 0;
              found = true;
            }
            if (!found && j === tempLength - 1) {
              let jsonTransfer = {
                description: tempArrayElements[i].description,
                nid: tempArrayElements[i].nid,
                quantity: tempArrayQuantities[i],
              };
              tempArrayQuantities[i] = 0;
              tempArrayTransferElements.push(jsonTransfer);
            }
          }
        } else {
          //no habia
          //restamos en el marcador del elemento
          tempArrayElements[i].quantity -= parseInt(tempArrayQuantities[i]);
          //generamos el array de traslado:
          let jsonTransfer = {
            description: tempArrayElements[i].description,
            nid: tempArrayElements[i].nid,
            quantity: tempArrayQuantities[i],
          };
          tempArrayQuantities[i] = 0;
          tempArrayTransferElements.push(jsonTransfer);
        }
      }
    }

    setTransferElements({
      ...transferElements,
      active: true,
      [table]: tempArrayTransferElements,
    });

    let attribute = `quantity_${table}`;

    setTotalQuantityElements({
      ...totalQuantityElements,
      [attribute]: tempArrayQuantities,
    });
  };

  const saveDataFirebase = async (e) => {
    e.preventDefault();
    //generamos la fecha para el reporte
    let today = new Date();
    let dd = today.getDate();
    let mm = today.getMonth() + 1;
    let yyyy = today.getFullYear();
    let date = `${dd}-${mm}-${yyyy}`;

    //unimos todos los arrays para el reporte
    let arrayElements = [];
    arrayElements = MergeArraysElements(
      arrayElements,
      transferElements.implements
    );
    arrayElements = MergeArraysElements(
      arrayElements,
      transferElements.items_packaging
    );
    arrayElements = MergeArraysElements(
      arrayElements,
      transferElements.items_process
    );
    arrayElements = MergeArraysElements(
      arrayElements,
      transferElements.raw_materials
    );
    arrayElements = MergeArraysElements(
      arrayElements,
      transferElements.supplies
    );
    arrayElements = MergeArraysElements(
      arrayElements,
      transferElements.tools_equipment
    );

    //generamos el reporte
    let jsonFormatReport = {
      user: sesion.usuario,
      date,
      type: "Traslado de Elementos",
      data: { items: arrayElements },
    };

    //saveReport
    let idReport = "";
    await props.firebase.db
      .collection("Reports")
      .add(jsonFormatReport)
      .then((success) => {
        idReport = success.id;
      });
    let elementsPointOperationOutput = {
      implements: [],
      items_packaging: [],
      items_process: [],
      raw_materials: [],
      supplies: [],
      tools_equipment: [],
    };
    let elementsPointOperationInput = {
      implements: [],
      items_packaging: [],
      items_process: [],
      raw_materials: [],
      supplies: [],
      tools_equipment: [],
    };

    //agregamos los elementos de implementos
    if (transferElements.implements.length !== 0) {
      //obtenemos la data de la db
      let snapshotImplements = await props.firebase.db
        .collection("Inventories")
        .doc("Implements")
        .get();
      let dataImplements = snapshotImplements.data();
      let newArrayImplements = UpdateInventoriesTransfer(
        dataImplements,
        transferElements.implements,
        idReport,
        selectedPointOperationOutput,
        selectedPointOperationInput
      );
      let jsonFormatImplements = { elements: newArrayImplements };
      await props.firebase.db
        .collection("Inventories")
        .doc("Implements")
        .set(jsonFormatImplements, { merge: true })
        .then((success) => {
          openMensajePantalla(dispatch, {
            open: true,
            mensaje: "SE ACTUALIZARON LOS INVENTARIOS DE IMPLEMENTOS",
          });
        });
      //generamos los nuevos elementos por punto de operacion
      elementsPointOperationOutput.implements = GetElementsPointOperation(
        newArrayImplements,
        selectedPointOperationOutput.id
      );
      elementsPointOperationInput.implements = GetElementsPointOperation(
        newArrayImplements,
        selectedPointOperationInput.id
      );
    }
    //agregamos los elementos de elementos en embalaje
    if (transferElements.items_packaging.length !== 0) {
      //obtenemos la data de la db
      let snapshotItemsPackaging = await props.firebase.db
        .collection("Inventories")
        .doc("ItemsPackaging")
        .get();
      let dataItemsPackaging = snapshotItemsPackaging.data();
      let newArrayItemsPackaging = UpdateInventoriesTransfer(
        dataItemsPackaging,
        transferElements.items_packaging,
        idReport,
        selectedPointOperationOutput,
        selectedPointOperationInput
      );
      let jsonFormatItemsPackaging = { elements: newArrayItemsPackaging };
      await props.firebase.db
        .collection("Inventories")
        .doc("ItemsPackaging")
        .set(jsonFormatItemsPackaging, { merge: true })
        .then((success) => {
          openMensajePantalla(dispatch, {
            open: true,
            mensaje: "SE ACTUALIZARON LOS INVENTARIOS DE ELEMENTOS EN EMBALAJE",
          });
        });
      //generamos los nuevos elementos por punto de operacion
      elementsPointOperationOutput.items_packaging = GetElementsPointOperation(
        newArrayItemsPackaging,
        selectedPointOperationOutput.id
      );
      elementsPointOperationInput.items_packaging = GetElementsPointOperation(
        newArrayItemsPackaging,
        selectedPointOperationInput.id
      );
    }
    //agregamos los elementos de elementos en proceso
    if (transferElements.items_process.length !== 0) {
      //obtenemos la data de la db
      let snapshotItemsProcess = await props.firebase.db
        .collection("Inventories")
        .doc("ItemsProcess")
        .get();
      let dataItemsProcess = snapshotItemsProcess.data();
      let newArrayItemsProcess = UpdateInventoriesTransfer(
        dataItemsProcess,
        transferElements.items_process,
        idReport,
        selectedPointOperationOutput,
        selectedPointOperationInput
      );
      let jsonFormatItemsProcess = { elements: newArrayItemsProcess };
      await props.firebase.db
        .collection("Inventories")
        .doc("ItemsProcess")
        .set(jsonFormatItemsProcess, { merge: true })
        .then((success) => {
          openMensajePantalla(dispatch, {
            open: true,
            mensaje: "SE ACTUALIZARON LOS INVENTARIOS DE ELEMENTOS EN PROCESO",
          });
        });
      //generamos los nuevos elementos por punto de operacion
      elementsPointOperationOutput.items_process = GetElementsPointOperation(
        newArrayItemsProcess,
        selectedPointOperationOutput.id
      );
      elementsPointOperationInput.items_process = GetElementsPointOperation(
        newArrayItemsProcess,
        selectedPointOperationInput.id
      );
    }
    //agregamos los elementos de materia prima
    if (transferElements.raw_materials.length !== 0) {
      //obtenemos la data de la db
      let snapshotRawMaterials = await props.firebase.db
        .collection("Inventories")
        .doc("RawMaterials")
        .get();
      let dataRawMaterials = snapshotRawMaterials.data();
      let newArrayRawMaterials = UpdateInventoriesTransfer(
        dataRawMaterials,
        transferElements.raw_materials,
        idReport,
        selectedPointOperationOutput,
        selectedPointOperationInput
      );
      let jsonFormatRawMaterials = { elements: newArrayRawMaterials };
      await props.firebase.db
        .collection("Inventories")
        .doc("RawMaterials")
        .set(jsonFormatRawMaterials, { merge: true })
        .then((success) => {
          openMensajePantalla(dispatch, {
            open: true,
            mensaje: "SE ACTUALIZARON LOS INVENTARIOS DE MATERIA PRIMA",
          });
        });
      //generamos los nuevos elementos por punto de operacion
      elementsPointOperationOutput.raw_materials = GetElementsPointOperation(
        newArrayRawMaterials,
        selectedPointOperationOutput.id
      );
      elementsPointOperationInput.raw_materials = GetElementsPointOperation(
        newArrayRawMaterials,
        selectedPointOperationInput.id
      );
    }
    //agregamos los elementos de insumos
    if (transferElements.supplies.length !== 0) {
      //obtenemos la data de la db
      let snapshotSupplies = await props.firebase.db
        .collection("Inventories")
        .doc("Supplies")
        .get();
      let dataSupplies = snapshotSupplies.data();
      let newArraySupplies = UpdateInventoriesTransfer(
        dataSupplies,
        transferElements.supplies,
        idReport,
        selectedPointOperationOutput,
        selectedPointOperationInput
      );
      let jsonFormatSupplies = { elements: newArraySupplies };
      await props.firebase.db
        .collection("Inventories")
        .doc("Supplies")
        .set(jsonFormatSupplies, { merge: true })
        .then((success) => {
          openMensajePantalla(dispatch, {
            open: true,
            mensaje: "SE ACTUALIZARON LOS INVENTARIOS DE INSUMOS",
          });
        });
      //generamos los nuevos elementos por punto de operacion
      elementsPointOperationOutput.supplies = GetElementsPointOperation(
        newArraySupplies,
        selectedPointOperationOutput.id
      );
      elementsPointOperationInput.supplies = GetElementsPointOperation(
        newArraySupplies,
        selectedPointOperationInput.id
      );
    }
    //agregamos los elementos de herramientas y equipos
    if (transferElements.tools_equipment.length !== 0) {
      //obtenemos la data de la db
      let snapshotToolsEquipment = await props.firebase.db
        .collection("Inventories")
        .doc("ToolsEquipment")
        .get();
      let dataToolsEquipment = snapshotToolsEquipment.data();
      let newArrayToolsEquipment = UpdateInventoriesTransfer(
        dataToolsEquipment,
        transferElements.tools_equipment,
        idReport,
        selectedPointOperationOutput,
        selectedPointOperationInput
      );
      let jsonFormatToolsEquipment = { elements: newArrayToolsEquipment };
      await props.firebase.db
        .collection("Inventories")
        .doc("ToolsEquipment")
        .set(jsonFormatToolsEquipment, { merge: true })
        .then((success) => {
          openMensajePantalla(dispatch, {
            open: true,
            mensaje:
              "SE ACTUALIZARON LOS INVENTARIOS DE HERRAMIENTAS Y EQUIPOS",
          });
        });
      //generamos los nuevos elementos por punto de operacion
      elementsPointOperationOutput.tools_equipment = GetElementsPointOperation(
        newArrayToolsEquipment,
        selectedPointOperationOutput.id
      );
      elementsPointOperationInput.tools_equipment = GetElementsPointOperation(
        newArrayToolsEquipment,
        selectedPointOperationInput.id
      );
    }

    //actualizamos los elementos por inventario add nid_inventories
    //obtenemos los datos para point operation output
    let snapshotInventoriesPointOperationOutput = await props.firebase.db
      .collection("InventoriesPointOperation")
      .doc(selectedPointOperationOutput.nid_inventories)
      .get();

    let dataInventoriesPointOperationOutput = snapshotInventoriesPointOperationOutput.data();
    //generamos el json
    let jsonInventoriesPointOperationOutput = {
      implements:
        elementsPointOperationOutput.implements.length === 0
          ? dataInventoriesPointOperationOutput.implements
          : elementsPointOperationOutput.implements,
      items_packaging:
        elementsPointOperationOutput.items_packaging.length === 0
          ? dataInventoriesPointOperationOutput.items_packaging
          : elementsPointOperationOutput.items_packaging,
      items_process:
        elementsPointOperationOutput.items_process.length === 0
          ? dataInventoriesPointOperationOutput.items_process
          : elementsPointOperationOutput.items_process,
      raw_materials:
        elementsPointOperationOutput.raw_materials.length === 0
          ? dataInventoriesPointOperationOutput.raw_materials
          : elementsPointOperationOutput.raw_materials,
      supplies:
        elementsPointOperationOutput.supplies.length === 0
          ? dataInventoriesPointOperationOutput.supplies
          : elementsPointOperationOutput.supplies,
      tools_equipment:
        elementsPointOperationOutput.tools_equipment.length === 0
          ? dataInventoriesPointOperationOutput.tools_equipment
          : elementsPointOperationOutput.tools_equipment,
    };
    //subimos los nuevos datos
    await props.firebase.db
      .collection("InventoriesPointOperation")
      .doc(selectedPointOperationOutput.nid_inventories)
      .set(jsonInventoriesPointOperationOutput, { merge: true })
      .then((success) => {
        openMensajePantalla(dispatch, {
          open: true,
          mensaje: "SE ACTUALIZARON LOS ELEMENTOS POR INVENTARIO (SALIDA)",
        });
      });
    //obtenemos los datos para point operation output
    let snapshotInventoriesPointOperationInput = await props.firebase.db
      .collection("InventoriesPointOperation")
      .doc(selectedPointOperationInput.nid_inventories)
      .get();

    let dataInventoriesPointOperationInput = snapshotInventoriesPointOperationInput.data();
    //generamos el json
    let jsonInventoriesPointOperationInput = {
      implements:
        elementsPointOperationInput.implements.length === 0
          ? dataInventoriesPointOperationInput.implements
          : elementsPointOperationInput.implements,
      items_packaging:
        elementsPointOperationInput.items_packaging.length === 0
          ? dataInventoriesPointOperationInput.items_packaging
          : elementsPointOperationInput.items_packaging,
      items_process:
        elementsPointOperationInput.items_process.length === 0
          ? dataInventoriesPointOperationInput.items_process
          : elementsPointOperationInput.items_process,
      raw_materials:
        elementsPointOperationInput.raw_materials.length === 0
          ? dataInventoriesPointOperationInput.raw_materials
          : elementsPointOperationInput.raw_materials,
      supplies:
        elementsPointOperationInput.supplies.length === 0
          ? dataInventoriesPointOperationInput.supplies
          : elementsPointOperationInput.supplies,
      tools_equipment:
        elementsPointOperationInput.tools_equipment.length === 0
          ? dataInventoriesPointOperationInput.tools_equipment
          : elementsPointOperationInput.tools_equipment,
    };
    //subimos los nuevos datos
    await props.firebase.db
      .collection("InventoriesPointOperation")
      .doc(selectedPointOperationInput.nid_inventories)
      .set(jsonInventoriesPointOperationInput, { merge: true })
      .then((success) => {
        openMensajePantalla(dispatch, {
          open: true,
          mensaje: "SE ACTUALIZARON LOS ELEMENTOS POR INVENTARIO (Entrada)",
        });
      });
    //add transferencia
    const format = selectedDate.format("DD-MM-YYYY");
    let jsonTransfer = {
      point_operation_output: selectedPointOperationOutput.name,
      employee_responsible_output: selectedEmployeeOutput.name,
      point_operation_input: selectedPointOperationInput.name,
      employee_responsible_input: selectedEmployeeInput.name,
      vehicle: selectedVehicle.name,
      transfer_elements: transferElements,
      date: format,
    };

    let idTransfer = "";
    await props.firebase.db
      .collection("Transfers")
      .add(jsonTransfer)
      .then((success) => {
        idTransfer = success.id;
        openMensajePantalla(dispatch, {
          open: true,
          mensaje: "SE GUARDO EL TRASLADO",
        });
      });
    //actualizamos las transferencias por empleado
    let snapshotEmployeeOutput = await props.firebase.db
      .collection("Employees")
      .doc(selectedEmployeeOutput.id)
      .get();

    let dataEmployeeOutput = snapshotEmployeeOutput.data();

    dataEmployeeOutput.transfers_employee.push(idTransfer);
    await props.firebase.db
      .collection("Employees")
      .doc(selectedEmployeeOutput.id)
      .set(dataEmployeeOutput, { merge: true })
      .then((success) => {
        openMensajePantalla(dispatch, {
          open: true,
          mensaje: "SE ACTUALIZARON LOS TRASLADOR PARA EL EMPLEADO (SALIDA)",
        });
      });
    //actualizamos las transferencias por empleado
    let snapshotEmployeeInput = await props.firebase.db
      .collection("Employees")
      .doc(selectedEmployeeInput.id)
      .get();

    let dataEmployeeInput = snapshotEmployeeInput.data();

    dataEmployeeInput.transfers_employee.push(idTransfer);
    await props.firebase.db
      .collection("Employees")
      .doc(selectedEmployeeInput.id)
      .set(dataEmployeeInput, { merge: true })
      .then((success) => {
        openMensajePantalla(dispatch, {
          open: true,
          mensaje: "SE ACTUALIZARON LOS TRASLADOR PARA EL EMPLEADO (SALIDA)",
        });
      });

    props.history.replace(`/traslados/mostrar/search`);
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
              <Typography color="textPrimary">Traslados</Typography>
              <Typography color="textPrimary">Agregar</Typography>
            </Breadcrumbs>
          </Grid>
        </Grid>
      </Paper>
      <Paper style={{ padding: 40, marginTop: 2 }}>
        <Grid
          item
          xs={12}
          md={12}
          style={{ paddingLeft: 15, marginBottom: 20 }}
        >
          <Typography variant="h6" id="tableTitle" component="div">
            Datos de traslado
          </Typography>
        </Grid>
        <Grid container spacing={3}>
          <Grid item xs={5} md={5}>
            <Autocomplete
              id="select_point_operation"
              value={selectedPointOperationOutput}
              onChange={(event, newDataPointOperation) => {
                setSelectedPointOperationOutput(newDataPointOperation);
                updateInventoriesPointOperation(newDataPointOperation);
                updateEmployeesPointOperationOutput(newDataPointOperation);
              }}
              options={dataPoitnsOperation}
              getOptionLabel={(option) => option.name}
              renderInput={(params) => (
                <TextField {...params} label="Punto de Operación (Salida)" />
              )}
            />
          </Grid>
          <Grid item xs={2} md={2}>
            <ForwardIcon style={{ width: "100%", marginTop: 15 }} />
          </Grid>
          <Grid item xs={5} md={5}>
            <Autocomplete
              disabled={selectedPointOperationOutput !== null ? false : true}
              id="select_point_operation"
              value={selectedPointOperationInput}
              onChange={(event, newDataPointOperation) => {
                setSelectedPointOperationInput(newDataPointOperation);
                updateEmployeesPointOperationInput(newDataPointOperation);
              }}
              options={dataPoitnsOperation}
              getOptionLabel={(option) => option.name}
              getOptionDisabled={(option) =>
                option === selectedPointOperationOutput
              }
              renderInput={(params) => (
                <TextField
                  disabled={
                    selectedPointOperationOutput !== null ? false : true
                  }
                  {...params}
                  label="Punto de Operación (Entrada)"
                />
              )}
            />
          </Grid>
          <Grid item xs={5} md={5}>
            <Autocomplete
              disabled={selectedPointOperationOutput !== null ? false : true}
              id="select_employee_output"
              options={employeesOutput}
              value={selectedEmployeeOutput}
              onChange={(event, newEmployee) => {
                setSelectedEmployeeOutput(newEmployee);
              }}
              getOptionLabel={(employee) => employee.name}
              fullWidth
              renderInput={(params) => (
                <TextField
                  {...params}
                  disabled={
                    selectedPointOperationOutput !== null ? false : true
                  }
                  label="Empleado a cargo (Salida)"
                  variant="outlined"
                />
              )}
            />
          </Grid>
          <Grid item xs={2} md={2}>
            <ForwardIcon style={{ width: "100%", marginTop: 15 }} />
          </Grid>
          <Grid item xs={5} md={5}>
            <Autocomplete
              disabled={selectedPointOperationInput !== null ? false : true}
              id="select_employee_input"
              options={employeesInput}
              value={selectedEmployeeInput}
              onChange={(event, newEmployee) => {
                setSelectedEmployeeInput(newEmployee);
              }}
              getOptionLabel={(employee) => employee.name}
              fullWidth
              renderInput={(params) => (
                <TextField
                  {...params}
                  disabled={selectedPointOperationInput !== null ? false : true}
                  label="Empleado a cargo (Entrada)"
                  variant="outlined"
                />
              )}
            />
          </Grid>
          <Grid item xs={6} md={6}>
            <Autocomplete
              id="select_vehicle"
              options={vehicles}
              value={selectedVehicle}
              onChange={(event, newVehicle) => {
                setSelectedVehicle(newVehicle);
              }}
              getOptionLabel={(vehicle) => vehicle.name}
              fullWidth
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Vehiculo de trasporte"
                  variant="outlined"
                />
              )}
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
                label="Fecha"
                value={selectedDate}
                onChange={handleDateChange}
                KeyboardButtonProps={{
                  "aria-label": "change date",
                }}
              />
            </MuiPickersUtilsProvider>
          </Grid>
        </Grid>
      </Paper>
      {selectedPointOperationOutput !== null ? (
        <Paper style={style.form}>
          {dataElementsPointOperation.implements.length !== 0 ? (
            <ShowElements
              numberTotalQuantity={totalQuantityElements.quantity_implements}
              stringTitle="Implementos"
              funtionTrasnfer={updateTransferElements}
              arrayElements={dataElementsPointOperation.implements}
              arrayQuantities={quantityElements.quantity_implements}
              funtionQuantities={changeQuantity}
              stringTable="implements"
            />
          ) : (
            ""
          )}
          {dataElementsPointOperation.items_packaging.length !== 0 ? (
            <ShowElements
              numberTotalQuantity={
                totalQuantityElements.quantity_items_packaging
              }
              stringTitle="Elementos en embalaje"
              funtionTrasnfer={updateTransferElements}
              arrayElements={dataElementsPointOperation.items_packaging}
              arrayQuantities={quantityElements.quantity_items_packaging}
              funtionQuantities={changeQuantity}
              stringTable="items_packaging"
            />
          ) : (
            ""
          )}
          {dataElementsPointOperation.items_process.length !== 0 ? (
            <ShowElements
              numberTotalQuantity={totalQuantityElements.quantity_items_process}
              stringTitle="Elementos en proceso"
              funtionTrasnfer={updateTransferElements}
              arrayElements={dataElementsPointOperation.items_process}
              arrayQuantities={quantityElements.quantity_items_process}
              funtionQuantities={changeQuantity}
              stringTable="items_process"
            />
          ) : (
            ""
          )}
          {dataElementsPointOperation.raw_materials.length !== 0 ? (
            <ShowElements
              numberTotalQuantity={totalQuantityElements.quantity_raw_materials}
              stringTitle="Materia Prima"
              funtionTrasnfer={updateTransferElements}
              arrayElements={dataElementsPointOperation.raw_materials}
              arrayQuantities={quantityElements.quantity_raw_materials}
              funtionQuantities={changeQuantity}
              stringTable="raw_materials"
            />
          ) : (
            ""
          )}
          {dataElementsPointOperation.supplies.length !== 0 ? (
            <ShowElements
              numberTotalQuantity={totalQuantityElements.quantity_supplies}
              stringTitle="Insumos"
              funtionTrasnfer={updateTransferElements}
              arrayElements={dataElementsPointOperation.supplies}
              arrayQuantities={quantityElements.quantity_supplies}
              funtionQuantities={changeQuantity}
              stringTable="supplies"
            />
          ) : (
            ""
          )}
          {dataElementsPointOperation.tools_equipment.length !== 0 ? (
            <ShowElements
              numberTotalQuantity={
                totalQuantityElements.quantity_tools_equipment
              }
              stringTitle="Herramientas y equipos"
              funtionTrasnfer={updateTransferElements}
              arrayElements={dataElementsPointOperation.tools_equipment}
              arrayQuantities={quantityElements.quantity_tools_equipment}
              funtionQuantities={changeQuantity}
              stringTable="tools_equipment"
            />
          ) : (
            ""
          )}
        </Paper>
      ) : (
        ""
      )}
      {transferElements.active ? (
        <Paper style={style.form}>
          {transferElements.implements.length !== 0 ? (
            <ShowTransfers
              stringTitle="Implementos"
              arrayElements={transferElements.implements}
            />
          ) : (
            ""
          )}
          {transferElements.items_packaging.length !== 0 ? (
            <ShowTransfers
              stringTitle="Elementos en embalaje"
              arrayElements={transferElements.items_packaging}
            />
          ) : (
            ""
          )}
          {transferElements.items_process.length !== 0 ? (
            <ShowTransfers
              stringTitle="Elementos en proceso"
              arrayElements={transferElements.items_process}
            />
          ) : (
            ""
          )}
          {transferElements.raw_materials.length !== 0 ? (
            <ShowTransfers
              stringTitle="Materia Prima"
              arrayElements={transferElements.raw_materials}
            />
          ) : (
            ""
          )}
          {transferElements.supplies.length !== 0 ? (
            <ShowTransfers
              stringTitle="Insumos"
              arrayElements={transferElements.supplies}
            />
          ) : (
            ""
          )}
          {transferElements.tools_equipment.length !== 0 ? (
            <ShowTransfers
              stringTitle="Herramientas y equipos"
              arrayElements={transferElements.tools_equipment}
            />
          ) : (
            ""
          )}
        </Paper>
      ) : (
        ""
      )}
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

export default consumerFirebase(AddTransfers);
