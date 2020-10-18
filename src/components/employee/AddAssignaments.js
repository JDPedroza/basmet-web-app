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
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  IconButton,
} from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { consumerFirebase } from "../../server";

//utils
import { useStateValue } from "../../sesion/store";
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
    padding: "20px",
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

const AddStandarizations = (props) => {
  //Employee
  const [dataEmployee, setDataEmployee] = useState({});

  //PointOperation
  let [pointsOperation, setDataPointsOperation] = useState({ data: [] });
  let [selectedPointOperation, setSelectedPointOperation] = useState(null);

  //Generals
  const { type, query, id } = props.match.params;
  const [{ sesion }, dispatch] = useStateValue();

  //dataName
  const [name, setName] = useState("");

  //datatoolsEquipment
  const [elementsToolsEquipment, setElementsToolsEquipment] = useState([
    { title: "", nid: "" },
  ]);
  //data_implements
  const [elementsImplements, setElementsImplements] = useState([
    { title: "", nid: "" },
  ]);

  //selectedElementsAll
  const [items, setDataItems] = useState({
    tools_equipment: [
      {
        nid: 0,
        quantity: 0,
        description: "",
      },
    ],
    _implements: [
      {
        nid: 0,
        quantity: 0,
        description: "",
      },
    ],
  });

  //selectedTitlesElementsToolsEquipment
  const [
    selectedTitlesToolsEquipment,
    setSelectedTitlesToolsEquipment,
  ] = useState([{ title: "" }]);
  //selectedTitlesElementsImplements
  const [selectedTitlesImplements, setSelectedTitlesImplements] = useState([
    { title: "" },
  ]);

  //getData
  const fetchMyAPI = useCallback(async () => {
    //getDataPointsOperation

    let objectQuery = props.firebase.db
      .collection("PointsOperation")
      .orderBy("city");

    const snapshot = await objectQuery.get();

    const arrayPointsOperation = snapshot.docs.map((doc) => {
      let data = doc.data();
      let id = doc.id;
      return { id, ...data };
    });

    setDataPointsOperation({
      data: arrayPointsOperation,
    });

    //getDataToolsEquipment
    let itemsToolsEquipment = [];
    let getDataToolsEquipment = await props.firebase.db
      .collection("Inventories")
      .doc("ToolsEquipment")
      .get();
    let dataToolsEquipment = getDataToolsEquipment.data();

    for (let i = 0; i < dataToolsEquipment.elements.length; i++) {
      let jsonFormatElements = {
        title: dataToolsEquipment.elements[i].title,
        nid: dataToolsEquipment.elements[i].nid,
      };
      for (
        let j = 0;
        j < dataToolsEquipment.elements[i].distributions.length;
        j++
      ) {
        jsonFormatElements = {
          ...jsonFormatElements,
          nid_point_operation:
            dataToolsEquipment.elements[i].distributions[j].nid_point_operation,
          quantity: dataToolsEquipment.elements[i].distributions[j].quantity,
          name_point_operation:
            dataToolsEquipment.elements[i].distributions[j].name,
        };
        itemsToolsEquipment.push(jsonFormatElements);
      }
    }
    console.log(itemsToolsEquipment);

    setElementsToolsEquipment(itemsToolsEquipment);

    //getDataImplements
    let itemsImplements = [];
    let getDataImplements = await props.firebase.db
      .collection("Inventories")
      .doc("Implements")
      .get();
    let dataImplements = getDataImplements.data();

    for (let i = 0; i < dataImplements.elements.length; i++) {
      let jsonFormatElements = {
        title: dataImplements.elements[i].title,
        nid: dataImplements.elements[i].nid,
        quantity: dataImplements.elements[i].quantity,
      };
      itemsImplements.push(jsonFormatElements);
    }
    setElementsImplements(itemsImplements);

    //getDataEmployee
    let snapshotEmployee = await props.firebase.db
      .collection("Employees")
      .doc(id)
      .get();

    let dataEmployee = snapshotEmployee.data();
    setDataEmployee(dataEmployee);
  }, []);

  useEffect(() => {
    fetchMyAPI();
  }, [fetchMyAPI]);

  const changeDataName = (e) => {
    let name = e.target.value;
    setName(name);
  };

  //newProgress
  const handleItemChange = (i, event, table) => {
    let data = [];
    let dataElemensAvaibles = [];
    let atribute = "";
    if (table === "toolsEquipment") {
      atribute = "tools_equipment";
      data = items.tools_equipment;
      dataElemensAvaibles = elementsToolsEquipment;
    } else {
      atribute = "_implements";
      data = items._implements;
      dataElemensAvaibles = elementsImplements;
    }

    const name = event.target.name;
    const value = event.target.value;

    if (name === "quantity") {
      data[i].quantity = value;
    } else if (name === "description") {
      data[i].description = value;
    }

    setDataItems({ ...items, [atribute]: data });
  };

  const handleItemAdd = (table) => {
    if (table === "toolsEquipment") {
      const tempSelectedTitlesToolsEquipment = selectedTitlesToolsEquipment;
      tempSelectedTitlesToolsEquipment.push({ title: "" });

      setSelectedTitlesToolsEquipment(tempSelectedTitlesToolsEquipment);

      const tools_equipment = items.tools_equipment;
      tools_equipment.push({
        nid: "",
        quantity: 0,
        description: "",
      });
      setDataItems({
        ...items,
        tools_equipment,
      });
    } else {
      const tempSelectedTitlesImplements = selectedTitlesImplements;
      tempSelectedTitlesImplements.push({ title: "" });

      setSelectedTitlesImplements(tempSelectedTitlesImplements);

      const _implements = items._implements;
      _implements.push({
        nid: "",
        quantity: 0,
        description: "",
      });
      setDataItems({
        ...items,
        _implements,
      });
    }
  };

  const handleItemRemove = (i, table) => {
    if (table === "toolsEquipment") {
      const tempSelectedTitlesToolsEquipment = selectedTitlesToolsEquipment;
      tempSelectedTitlesToolsEquipment.splice(i, 1);
      setSelectedTitlesToolsEquipment(tempSelectedTitlesToolsEquipment);

      const tools_equipment = items.tools_equipment;
      tools_equipment.splice(i, 1);
      setDataItems({
        ...items,
        tools_equipment,
      });
    } else {
      const tempSelectedTitlesImplements = selectedTitlesImplements;
      tempSelectedTitlesImplements.splice(i, 1);
      setSelectedTitlesImplements(tempSelectedTitlesImplements);

      const _implements = items._implements;
      _implements.splice(i, 1);
      setDataItems({
        ...items,
        _implements,
      });
    }
  };

  //saveData
  const saveDataFirebase = async (e) => {
    e.preventDefault();
    let snapshotEmployee = await props.firebase.db
      .collection("Employees")
      .doc(id)
      .get();
    let dataEmployee = snapshotEmployee.data();

    //asignamos los nuevos datos de punto de operación
    dataEmployee.points_operation = selectedPointOperation.id;

    //volvemos a subir el archivo
    /*
    await props.firebase.db
      .collection("Employees")
      .doc(id)
      .set(dataEmployee, { merge: true })
      .then((success) => {
        openMensajePantalla(dispatch, {
          open: true,
          mensaje: "SE ACTUALIZO LA INFORMACIÓN DEL EMPLEADO",
        });
      });
    */

    //actualizamos la lista de empleados del punto de operación
    let snapshotPointOperation = await props.firebase.db
      .collection("EmployeesPointOperation")
      .doc(selectedPointOperation.nid_employees)
      .get();
    let dataPointOperation = snapshotPointOperation.data();

    //validamos que ya exista algun empleado en la lista
    let arrayEmployees = [];
    if (dataPointOperation.employees.length !== 0) {
      for (let i = 0; i < dataPointOperation.employees.length; i++) {
        let found = false;
        if (id === dataPointOperation.employees[i]) {
          //ya se encuentra asignado a ese punto de operation
          found = true;
        }
        if (!found && i == dataPointOperation.employees.length - 1) {
          //ya realizo todo el recorrido y no encontro el empleado
          arrayEmployees = dataPointOperation.employees;
          arrayEmployees.push(id);
        }
      }
    } else {
      //no existe ningun empleado asignado al punto de operacion
      arrayEmployees.push(id);
    }

    let jsonFormatEmployeesPointOperation = { employess: arrayEmployees };

    //volvemos a subir el array de empleados
    /*
    await props.firebase.db
      .collection("EmployeesPointOperation")
      .doc(selectedPointOperation.nid_employees)
      .set(jsonFormatEmployeesPointOperation, {merge:true})
      .then((success) => {
        openMensajePantalla(dispatch, {
          open: true,
          mensaje: "SE ACTUALIZO LA LISTA DE EMPLEADOS PARA EL PUNTO DE OPERACIÓN",
        });
      });
    */

    //generamos el reporte para el inventario
    //generamos el array de items
    let idReport = "";
    let arrayItems = [];
    for (let j = 0; j < items.tools_equipment.length; j++) {
      if (items.tools_equipment[j].nid !== "") {
        arrayItems.push(items.tools_equipment[j]);
      }
    }
    for (let k = 0; k < items._implements.length; k++) {
      if (items._implements[k].nid !== "") {
        arrayItems.push(items._implements[k]);
      }
    }

    let today = new Date();
    let dd = today.getDate();
    let mm = today.getMonth() + 1;
    let yyyy = today.getFullYear();
    let date = `${dd}-${mm}-${yyyy}`;

    let dataElement = { items: arrayItems };

    let jsonFormatReport = {
      user: sesion.usuario,
      date,
      type: "Asignación a Proceso",
      data: dataElement,
    };

    /*
    await props.firebase.db
    .collection("Reports")
    .add(jsonFormatReport)
      .then((success)=>{
        idReport=success.id;
      })
    */
    //Altualizamos los inventarios

    let snapshotToolsEquipment = await props.firebase.db
      .collection("Inventories")
      .doc("ToolsEquipment")
      .get();
    let dataToolsEquipment = snapshotToolsEquipment.data();

    for (let w = 0; w < items.tools_equipment.length; w++) {
      for (let x = 0; x < dataToolsEquipment.elements.length; x++) {
        if (
          items.tools_equipment[w].nid === dataToolsEquipment.elements[w].nid
        ) {
          for (
            let y = 0;
            y < dataToolsEquipment.elements[w].distributions.length;
            y++
          ) {
            if (
              dataToolsEquipment.elements[w].distributions[y]
                .nid_point_operation === selectedPointOperation.id
            ) {
              let jsonFormatAssignments = {
                name_employee: dataEmployee.name,
                nid_employee: id,
                quantity: items.tools_equipment[w].quantity,
              };
              dataToolsEquipment.elements[w].distributions[
                y
              ].assignments = jsonFormatAssignments;
            }
          }
        }
      }
    }

    console.log(dataToolsEquipment);

    let snapshotImplements = await props.firebase.db
      .collection("Inventories")
      .doc("Implements")
      .get();
    let dataImplements = snapshotImplements.data();

    for (let w = 0; w < items._implements.length; w++) {
      for (let x = 0; x < dataImplements.elements.length; x++) {
        if (items._implements[w].nid === dataImplements.elements[w].nid) {
          for (
            let y = 0;
            y < dataImplements.elements[w].distributions.length;
            y++
          ) {
            if (
              dataImplements.elements[w].distributions[y]
                .nid_point_operation === selectedPointOperation.id
            ) {
              let jsonFormatAssignments = {
                name_employee: dataEmployee.name,
                nid_employee: id,
                quantity: items._implements[w].quantity,
              };
              dataImplements.elements[w].distributions[
                y
              ].assignments = jsonFormatAssignments;
            }
          }
        }
      }
    }

    console.log(dataImplements);
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
              <Typography color="textPrimary">Empleados</Typography>
              <Typography color="textPrimary">Agregar</Typography>
              <Typography color="textPrimary">Asignaciones</Typography>
              <Typography color="textPrimary">{dataEmployee.name}</Typography>
            </Breadcrumbs>
          </Grid>
        </Grid>
      </Paper>
      <Paper style={style.paperForm}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={12}>
            <Autocomplete
              id="select_point_operation"
              value={selectedPointOperation}
              onChange={(event, newDataPointOperation) => {
                setSelectedPointOperation(newDataPointOperation);
              }}
              options={pointsOperation.data}
              getOptionLabel={(option) => option.address}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Punto de Operación"
                  variant="outlined"
                />
              )}
            />
            <Typography style={{ fontSize: 10, paddingTop: 2 }}>
              Por favor seleccione un punto de operación antes de la asignación
              de elementos al empleado.
            </Typography>
          </Grid>
        </Grid>
      </Paper>
      <Paper style={style.paperForm}>
        <Grid container spacing={2} style={style.form}>
          <Grid item xs={12} md={12}>
            <Typography color="textPrimary" variant="h6">
              Herramientas y Equipos
            </Typography>
          </Grid>
          <TableContainer item xs={12} sm={12}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align="center" style={{ width: "65%" }}>
                    Descripcion
                  </TableCell>
                  <TableCell align="center" style={{ width: "25%" }}>
                    Cantidad
                  </TableCell>
                  <TableCell align="center" style={{ width: "10%" }}>
                    <IconButton
                      aria-label="addElement"
                      onClick={() => handleItemAdd("toolsEquipment")}
                    >
                      <AddIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {items.tools_equipment.map((item, idx) => {
                  return (
                    <TableRow key={idx}>
                      <TableCell align="center">
                        <Autocomplete
                          id="select_provider"
                          disabled={
                            selectedPointOperation !== null ? false : true
                          }
                          options={elementsToolsEquipment}
                          value={selectedTitlesToolsEquipment[idx].title}
                          onChange={(event, newDataProvider) => {
                            const data = items.tools_equipment;
                            let tempValue = null;
                            if (newDataProvider !== null) {
                              tempValue = selectedTitlesToolsEquipment;
                              tempValue[idx] = newDataProvider;
                              setSelectedTitlesToolsEquipment(tempValue);
                              data[idx].description = newDataProvider.title;
                              data[idx].nid = newDataProvider.nid;
                            } else {
                              tempValue = selectedTitlesToolsEquipment;
                              tempValue[idx] = { title: "", nid: "" };
                              setSelectedTitlesToolsEquipment(tempValue);
                              data[idx].description = "";
                              data[idx].nid = "";
                            }
                          }}
                          freeSolo
                          getOptionLabel={(item) => {
                            // Value selected with enter, right from the input
                            if (typeof item === "string") {
                              return item;
                            }
                            // Add "xxx" item created dynamically
                            if (item.inputValue) {
                              return item.inputValue;
                            }
                            // Regular item
                            return item.title;
                          }}
                          renderOption={(item) => (
                            <React.Fragment>
                              <Typography style={{ width: "100%" }}>
                                {`${item.title} - (${item.quantity})`}
                              </Typography>
                            </React.Fragment>
                          )}
                          getOptionDisabled={(item) =>
                            item.nid_point_operation !==
                            selectedPointOperation.id
                          }
                          fullWidth
                          renderInput={(params) => (
                            <TextField {...params} fullWidth label="" />
                          )}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <TextField
                          fullWidth
                          name="quantity"
                          disabled={
                            selectedPointOperation !== null ? false : true
                          }
                          id="quantity"
                          label=""
                          type="number"
                          value={item.quantity}
                          onChange={(e) =>
                            handleItemChange(idx, e, "toolsEquipment")
                          }
                        />
                      </TableCell>
                      <TableCell align="center">
                        <IconButton
                          aria-label="edit"
                          onClick={() =>
                            handleItemRemove(idx, "toolsEquipment")
                          }
                        >
                          <HighlightOffIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
          <Typography
            style={{
              fontSize: 10,
              paddingTop: 2,
              width: "100%",
            }}
          >
            Recuerde que si la opción no esta disponible es porque no hay
            elementos asignados a dicho punto de operación.
          </Typography>
        </Grid>
      </Paper>
      <Paper style={style.paperForm}>
        <Grid container spacing={2} style={style.form}>
          <Grid item xs={12} md={12}>
            <Typography color="textPrimary" variant="h6">
              Implementos
            </Typography>
          </Grid>
          <TableContainer item xs={12} sm={12}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align="center" style={{ width: "65%" }}>
                    Descripcion
                  </TableCell>
                  <TableCell align="center" style={{ width: "25%" }}>
                    Cantidad
                  </TableCell>
                  <TableCell align="center" style={{ width: "10%" }}>
                    <IconButton
                      aria-label="addElement"
                      onClick={() => handleItemAdd("_implements")}
                    >
                      <AddIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {items._implements.map((item, idx) => {
                  return (
                    <TableRow key={idx}>
                      <TableCell align="center">
                        <Autocomplete
                          id="select_element__implements"
                          options={elementsImplements}
                          disabled={
                            selectedPointOperation !== null ? false : true
                          }
                          value={selectedTitlesImplements[idx].title}
                          onChange={(event, newDataProvider) => {
                            const data = items._implements;
                            let tempValue = null;
                            if (newDataProvider !== null) {
                              tempValue = selectedTitlesImplements;
                              tempValue[idx] = newDataProvider;
                              setSelectedTitlesImplements(tempValue);
                              data[idx].description = newDataProvider.title;
                              data[idx].nid = newDataProvider.nid;
                            } else {
                              tempValue = selectedTitlesImplements;
                              tempValue[idx] = { title: "", nid: "" };
                              setSelectedTitlesImplements(tempValue);
                              data[idx].description = "";
                              data[idx].nid = "";
                            }
                          }}
                          freeSolo
                          getOptionLabel={(item) => {
                            // Value selected with enter, right from the input
                            if (typeof item === "string") {
                              return item;
                            }
                            // Add "xxx" item created dynamically
                            if (item.inputValue) {
                              return item.inputValue;
                            }
                            // Regular item
                            return item.title;
                          }}
                          fullWidth
                          renderInput={(params) => (
                            <TextField {...params} fullWidth label="" />
                          )}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <TextField
                          fullWidth
                          name="quantity"
                          disabled={
                            selectedPointOperation !== null ? false : true
                          }
                          id="quantity"
                          label=""
                          type="number"
                          value={item.quantity}
                          onChange={(e) =>
                            handleItemChange(idx, e, "_implements")
                          }
                        />
                      </TableCell>
                      <TableCell align="center">
                        <IconButton
                          aria-label="edit"
                          onClick={() => handleItemRemove(idx, "_implements")}
                        >
                          <HighlightOffIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Paper>
      <Paper style={style.paperForm}>
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
