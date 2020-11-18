import React, { useCallback, useEffect, useState } from "react";

//icons
import HomeIcon from "@material-ui/icons/Home";
import AssignmentReturnedIcon from "@material-ui/icons/AssignmentReturned";

//diseño
import {
  Container,
  Paper,
  Grid,
  Breadcrumbs,
  Link,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Checkbox,
  Toolbar,
  TextField,
  Tooltip,
  IconButton,
  Button,
} from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";

//utils
import { consumerFirebase } from "../../server";
import { useStateValue } from "../../sesion/store";
import { openMensajePantalla } from "../../sesion/actions/snackBarAction";

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
};

const AddAssignamentsElemensts = (props) => {
  //history
  const { table } = props.match.params;
  const [{ sesion }, dispatch] = useStateValue();

  //general
  const [dataElements, setDataElements] = useState([]);
  const [dataPoitnsOperation, setDataPointsOperation] = useState([]);
  const [selectedPointOperation, setSelectedPointOperation] = useState(null);

  const [allItemsSelected, setAllItemsSelected] = useState(false);
  const [itemsSelected, setItemsSelected] = useState([]);

  const [numberItemsSelected, setNumbreItemsSelected] = useState(0);

  const [quantityELementsSelected, setQuantityElementsSelected] = useState([]);
  const [quantity, setQuantity] = useState(0);

  const [assignmentsPointOperation, setAssignmentsPointOperation] = useState(
    []
  );

  const fetchMyAPI = useCallback(async () => {
    //getDataElements
    const { id } = props.match.params;
    let data = await props.firebase.db
      .collection("Reports")
      .doc(id)
      .get();
    let dataReport = data.data();
    let arrayElementsAdd = [];
    let tempItemsSelected = [];
    let tempQuantityElementsSelected = [];

    for (
      let i = 0;
      i < dataReport.data.items.length;
      i++
    ) {
      let jsonFormatElementAdd = {
        nid: dataReport.data.items[i].nid,
        description:
          dataReport.data.items[i]
            .description,
        quantity:
          dataReport.data.items[i].quantity,
        disable: false,
        quantity_assignament: 0,
        quantity_avaible:
          dataReport.data.items[i].quantity,
      };
      arrayElementsAdd.push(jsonFormatElementAdd);
      tempItemsSelected.push(false);
      tempQuantityElementsSelected.push(
        dataReport.data.items[i].quantity
      );
    }

    setItemsSelected(tempItemsSelected);
    setDataElements(arrayElementsAdd);
    setQuantityElementsSelected(tempQuantityElementsSelected);

    //getDataPointsOperation
    let objectQuery = props.firebase.db
      .collection("PointsOperation")
      .orderBy("city");

    const snapshot = await objectQuery.get();

    const jsonFormatElementPointOperation = {
      raw_materials: [],
      supplies: [],
      tools_equipament: [],
      items_process: [],
    };

    const arrayPointsOperation = snapshot.docs.map((doc) => {
      let data = doc.data();
      let id = doc.id;

      return {
        id,
        ...data,
      };
    });

    setDataPointsOperation(arrayPointsOperation);
  }, []);

  useEffect(() => {
    fetchMyAPI();
  }, [fetchMyAPI]);

  const allHandleChange = (event) => {
    setAllItemsSelected(event.target.checked);
    let tempNumberItemsSelected = 0;
    for (let i = 0; i < itemsSelected.length; i++) {
      if (event.target.checked) {
        itemsSelected[i] = true;
        tempNumberItemsSelected++;
      } else {
        itemsSelected[i] = false;
        tempNumberItemsSelected = 0;
      }
    }
    setItemsSelected(itemsSelected);
    setNumbreItemsSelected(tempNumberItemsSelected);
  };

  const handleChange = (event, index) => {
    itemsSelected[index] = event.target.checked;
    setItemsSelected(itemsSelected);
    let tempNumberItemsSelected = 0;
    for (let i = 0; i < itemsSelected.length; i++) {
      if (itemsSelected[i]) {
        tempNumberItemsSelected++;
      }
    }
    setNumbreItemsSelected(tempNumberItemsSelected);
  };

  const changeDataQuantityElements = (event, index) => {
    let tempQuantityElementsSelected = quantityELementsSelected;
    setQuantity(event.target.value);
    tempQuantityElementsSelected[index] = event.target.value;
    setQuantityElementsSelected(tempQuantityElementsSelected);
  };

  const assignElements = () => {
    let tempArrayElementsPointOperation = [];

    for (let x = 0; x < itemsSelected.length; x++) {
      //formato de elemento a pushear si esta seleccionado
      let jsonFormatElement = {
        nid: "",
        description: "",
        quantity: 0,
      };
      if (itemsSelected[x]) {
        if (quantityELementsSelected[x] === dataElements[x].quantity_avaible) {
          jsonFormatElement = {
            nid: dataElements[x].nid,
            description: dataElements[x].description,
            quantity: quantityELementsSelected[x],
          };
          dataElements[x].quantity_assignament = dataElements[x].quantity;
          dataElements[x].disable = true;
          dataElements[x].quantity_avaible = 0;
          quantityELementsSelected[x] = 0;
        } else {
          let quantity =
            dataElements[x].quantity_avaible - quantityELementsSelected[x];
          jsonFormatElement = {
            nid: dataElements[x].nid,
            description: dataElements[x].description,
            quantity: quantityELementsSelected[x],
          };
          dataElements[x].quantity_assignament =
            parseInt(dataElements[x].quantity_assignament) +
            parseInt(quantityELementsSelected[x]);
          dataElements[x].quantity_avaible = quantity;
          quantityELementsSelected[x] = parseInt(
            dataElements[x].quantity_avaible
          );
        }
        tempArrayElementsPointOperation.push(jsonFormatElement);
      }
    }
    //generamos el json necesario para mostrar las nuevas asignaciones
    let jsonFormatElementsPointOperation = {};

    //validamos si ya se hicieron asignaciones
    if (assignmentsPointOperation.length !== 0) {
      let tempLength = assignmentsPointOperation.length;
      let foundPointOperation = false;
      for (let k = 0; k < tempLength; k++) {
        //validamos si ya existe el punto de operacion
        if (assignmentsPointOperation[k].nid === selectedPointOperation.id) {
          foundPointOperation = true;
          //generamos el array donde guardaremos todos los elementos
          let newArrayElementsPointOperation = [];
          //obtenemos las asignaciones de elementos anterior
          let lastArrayElementsPointOperation =
            assignmentsPointOperation[k].elements;

          for (let i = 0; i < lastArrayElementsPointOperation.length; i++) {
            let jsonFormatElement = null;
            let found = false;
            for (let j = 0; j < tempArrayElementsPointOperation.length; j++) {
              if (
                lastArrayElementsPointOperation[i].nid ===
                tempArrayElementsPointOperation[j].nid
              ) {
                //sumamos los elementos anteriores y los nuevos y generamos el formato
                jsonFormatElement = {
                  nid: lastArrayElementsPointOperation[i].nid,
                  description: lastArrayElementsPointOperation[i].description,
                  quantity:
                    parseInt(lastArrayElementsPointOperation[i].quantity) +
                    parseInt(tempArrayElementsPointOperation[j].quantity),
                };
                found = true;
              } else {
                if (
                  j === tempArrayElementsPointOperation.length - 1 &&
                  !found
                ) {
                  jsonFormatElement = lastArrayElementsPointOperation[i];
                }
              }
            }
            if (jsonFormatElement !== null) {
              newArrayElementsPointOperation.push(jsonFormatElement);
            }
          }
          //validamos los elementos nuevos
          for (let y = 0; y < tempArrayElementsPointOperation.length; y++) {
            let found = false;
            for (let z = 0; z < newArrayElementsPointOperation.length; z++) {
              if (
                tempArrayElementsPointOperation[y].nid ===
                newArrayElementsPointOperation[z].nid
              ) {
                found = true;
              }
            }
            if (!found) {
              //elemento no agregado antes
              newArrayElementsPointOperation.push(
                tempArrayElementsPointOperation[y]
              );
            }
          }
          //reescribimos el elemento
          jsonFormatElementsPointOperation = {
            nid: assignmentsPointOperation[k].nid,
            name: assignmentsPointOperation[k].name,
            elements_point_operation:
              assignmentsPointOperation[k].elements_point_operation,
            elements: newArrayElementsPointOperation,
          };
          //reagregamos el elemento
          assignmentsPointOperation[k] = jsonFormatElementsPointOperation;
        } else {
          //generamos el nuevo elemento de proveedor
          if (k === tempLength - 1 && !foundPointOperation) {
            jsonFormatElementsPointOperation = {
              nid: selectedPointOperation.id,
              name: `${selectedPointOperation.address}, ${selectedPointOperation.city} - ${selectedPointOperation.country}`,
              elements_point_operation: selectedPointOperation.nid_inventories,
              elements: tempArrayElementsPointOperation,
            };
            assignmentsPointOperation.push(jsonFormatElementsPointOperation);
          }
        }
      }
    } else {
      //generamos el primer elemento
      jsonFormatElementsPointOperation = {
        nid: selectedPointOperation.id,
        name: `${selectedPointOperation.address}, ${selectedPointOperation.city} - ${selectedPointOperation.country}`,
        elements_point_operation: selectedPointOperation.nid_inventories,
        elements: tempArrayElementsPointOperation,
      };
      assignmentsPointOperation.push(jsonFormatElementsPointOperation);
    }

    //reseteamos los selected
    for (let w = 0; w < itemsSelected.length; w++) {
      itemsSelected[w] = false;
    }

    setSelectedPointOperation(null);
    setNumbreItemsSelected(0);
  };

  const saveDataFirebase = async () => {
    //distributionInventory
    for (let h = 0; h < assignmentsPointOperation.length; h++) {
      let data = await props.firebase.db
        .collection("InventoriesPointOperation")
        .doc(assignmentsPointOperation[h].elements_point_operation)
        .get();

      //elementsPointOperation
      let dataElementsPointOperation = data.data();
      let endDataElementsPointOperation = {};
      let tempArrayInventory = [];
      let newArrayElementsPointOperation = [];
      let endArrayInventory = [];

      let attribute = "";
      if (table === "materia_prima") {
        attribute = "raw_materials";
        tempArrayInventory = dataElementsPointOperation.raw_materials;
      } else if (table === "herramientas_y_equipos") {
        attribute = "tools_equipment";
        tempArrayInventory = dataElementsPointOperation.tools_equipment;
      } else if (table === "insumos"){
        attribute = "supplies";
        tempArrayInventory = dataElementsPointOperation.supplies;
      } else if (table === "implementos"){
        attribute = "implements";
        tempArrayInventory = dataElementsPointOperation.supplies;
      } else if (table === "productos_en_proceso"){
        attribute = "items_process";
        tempArrayInventory = dataElementsPointOperation.supplies;
      } else if (table === "productos_en_embalaje"){
        attribute = "items_packaging";
        tempArrayInventory = dataElementsPointOperation.supplies;
      } 

      //validamos si ya tiene información
      if (tempArrayInventory.length !== 0) {
        for (let i = 0; i < tempArrayInventory.length; i++) {
          let jsonFormatElement = null;
          let found = false;
          for (
            let j = 0;
            j < assignmentsPointOperation[h].elements.length;
            j++
          ) {
            if (
              tempArrayInventory[i].nid ===
              assignmentsPointOperation[h].elements[j].nid
            ) {
              //sumamos los elementos anteriores y los nuevos y generamos el formato
              jsonFormatElement = {
                nid: tempArrayInventory[i].nid,
                description: tempArrayInventory[i].description,
                quantity:
                  parseInt(tempArrayInventory[i].quantity) +
                  parseInt(assignmentsPointOperation[h].elements[j].quantity),
              };
              found = true;
            } else {
              if (
                j === assignmentsPointOperation[h].elements.length - 1 &&
                !found
              ) {
                jsonFormatElement = tempArrayInventory[i];
              }
            }
          }
          if (jsonFormatElement !== null) {
            newArrayElementsPointOperation.push(jsonFormatElement);
          }
        }
        //validamos los elementos nuevos
        for (let y = 0; y < assignmentsPointOperation[h].elements.length; y++) {
          let found = false;
          for (let z = 0; z < newArrayElementsPointOperation.length; z++) {
            if (
              assignmentsPointOperation[h].elements[y].nid ===
              newArrayElementsPointOperation[z].nid
            ) {
              found = true;
            }
          }
          if (!found) {
            //elemento no agregado antes
            newArrayElementsPointOperation.push(
              assignmentsPointOperation[h].elements[y]
            );
          }
        }
        //asignamos el array mofificado
        endArrayInventory = newArrayElementsPointOperation;
      } else {
        //asignamos el array completamente nuevo
        endArrayInventory = assignmentsPointOperation[h].elements;
      }

      endDataElementsPointOperation = {
        ...dataElementsPointOperation,
        [attribute]: endArrayInventory,
      };

      await props.firebase.db
        .collection("InventoriesPointOperation")
        .doc(assignmentsPointOperation[h].elements_point_operation)
        .set(endDataElementsPointOperation, { merge: true })
        .then((success) => {
          openMensajePantalla(dispatch, {
            open: true,
            mensaje: `ASIGNACIÓN DE ELEMENTOS COMPLETADA PARA: ${assignmentsPointOperation[h].name}`,
          });
        });
    }

    let today = new Date();
    let dd = today.getDate();
    let mm = today.getMonth() + 1;
    let yyyy = today.getFullYear();
    let date = `${dd}-${mm}-${yyyy}`;

    let jsonFormatReport = {
      user: sesion.usuario,
      date,
      type: "Agregar / Asignar Elementos Punto Operación",
      data: {items: assignmentsPointOperation},
    };

    //generamos el reporte
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

    //Proceso de actualizacion Inventories
    let doc = "";
    if (table === "materia_prima") {
      doc = "RawMaterials";
    } else if (table === "herramientas_y_equipos") {
      doc = "ToolsEquipment";
    } else if (table === "insumos"){
      doc = "Supplies"
    } else if (table === "implementos"){
      doc = "Implements"
    } else if (table === "productos_en_proceso"){
      doc = "ItemsProcess"
    } else if (table === "productos_en_embalaje"){
      doc = "ItemsPackaging"
    } 

    //obtenemos la data del elemento guardado
    let data = await props.firebase.db.collection("Inventories").doc(doc).get();

    let inventory = data.data();
    //done-console.log(inventory)

    for (let o = 0; o < assignmentsPointOperation.length; o++) {
      //done - console.log("Validando cada asignacion a punto de operacion")
      for (let p = 0; p < assignmentsPointOperation[o].elements.length; p++) {
        //done - console.log("Validando cada elemento asignado a cada punto de operacion 8")
        //miramos dentro de los elementos ya guardado en la base de datos
        for (let q = 0; q < inventory.elements.length; q++) {
          if (
            assignmentsPointOperation[o].elements[p].nid ===
            inventory.elements[q].nid
          ) {
            //sacamos el array de distribuciones
            let distribution = inventory.elements[q].distributions;
            let tempLengthDistribution = distribution.length;
            //validamos que distribution tenga contenido
            if (tempLengthDistribution !== 0) {
              //buscamos si existe el elemento
              let found = false;
              for (let r = 0; r < tempLengthDistribution; r++) {
                if (
                  distribution[r].nid_point_operation ===
                  assignmentsPointOperation[o].nid
                ) {
                  //encontramos el elemento
                  distribution[r].quantity =
                    parseInt(
                      assignmentsPointOperation[o].elements[p].quantity
                    ) + parseInt(distribution[r].quantity);
                  found = true;
                } else {
                  if (r === tempLengthDistribution - 1 && !found) {
                    distribution.push({
                      nid_point_operation: assignmentsPointOperation[o].nid,
                      name: assignmentsPointOperation[o].name,
                      quantity: parseInt(
                        assignmentsPointOperation[o].elements[p].quantity
                      ),
                    });
                  }
                }
              }
            } else {
              distribution.push({
                nid_point_operation: assignmentsPointOperation[o].nid,
                name: assignmentsPointOperation[o].name,
                quantity: parseInt(
                  assignmentsPointOperation[o].elements[p].quantity
                ),
              });
            }
            //resobreescribimos distribution
            inventory.elements[q].distributions = distribution;
            //resobreescribimos last_modify
            inventory.elements[q].last_modify = idReport
          }
        }
      }
    }

    //volvemos a subir el inventario
    await props.firebase.db
      .collection("Inventories")
      .doc(doc)
      .set(inventory, { merge: true })
      .then((success) => {
        openMensajePantalla(dispatch, {
          open: true,
          mensaje: `ACTUALIZACIÓN DE ASIGNACIONES COMPLETADA`,
        });
        props.history.replace(`/inventarios/mostrar/${table}/search`);
      });

  };

  return (
    <Container component="main" maxWidth="md" justify="center">
      <Paper style={style.paper}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={8}>
            <Breadcrumbs aria-label="breadcrumbs">
              <Link color="inherit" style={style.link} href="/">
                <HomeIcon />
                Principal
              </Link>
              <Typography color="textPrimary">Inventario</Typography>
              <Typography color="textPrimary">Asignar</Typography>
              <Typography color="textPrimary">
                {table === "materia_prima"
                  ? "Materia Prima"
                  : table === "herramientas_y_equipos"
                  ? "Herramientas y Equipos"
                  : table === "productos_en_proceso"
                  ? "Productos en Proceso"
                  : table === "productos_en_embalaje"
                  ? "Productos en Embalaje"
                  : table === "insumos"
                  ? "Insumos"
                  : "Implementos"
                  }
              </Typography>
            </Breadcrumbs>
          </Grid>
        </Grid>
      </Paper>
      <Paper style={style.paperForm}>
        <Toolbar>
          {numberItemsSelected > 0 ? (
            <Grid container spacing={2}>
              <Grid item xs={6} md={6}>
                <Typography
                  color="inherit"
                  variant="h6"
                  id="subTitle"
                  component="div"
                >
                  {numberItemsSelected} elementos seleccionados
                </Typography>
              </Grid>
              <Grid item xs={6} md={6}>
                <Autocomplete
                  id="select_point_operation"
                  value={selectedPointOperation}
                  onChange={(event, newDataPointOperation) => {
                    setSelectedPointOperation(newDataPointOperation);
                  }}
                  options={dataPoitnsOperation}
                  getOptionLabel={(option) => option.address}
                  renderInput={(params) => (
                    <TextField {...params} label="Punto de Operación" />
                  )}
                />
              </Grid>
            </Grid>
          ) : (
            <Typography variant="h6" id="tableTitle" component="div">
              Elementos a asignar
            </Typography>
          )}
          {numberItemsSelected > 0 ? (
            <Tooltip title="Asignar">
              <IconButton aria-label="Asignar" onClick={assignElements}>
                <AssignmentReturnedIcon />
              </IconButton>
            </Tooltip>
          ) : (
            ""
          )}
        </Toolbar>
        <TableContainer item xs={12} sm={12}>
          <Table aria-label="collapsible table">
            <TableHead>
              <TableRow>
                <TableCell style={{ width: "10%" }}>
                  <Checkbox
                    checked={allItemsSelected}
                    onChange={(event) => allHandleChange(event)}
                  />
                </TableCell>
                <TableCell style={{ width: "30%" }} align="left">
                  Descripción
                </TableCell>
                <TableCell style={{ width: "20%" }} align="right">
                  Cant. nueva
                </TableCell>
                <TableCell style={{ width: "20%" }}>Cant. asignada</TableCell>
                <TableCell style={{ width: "20%" }}>Cant. a asignar</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {dataElements.map((element, idx) => (
                <TableRow key={`element_${idx}_data`}>
                  <TableCell>
                    <Checkbox
                      disabled={element.disable}
                      checked={itemsSelected[idx]}
                      onChange={(event) => handleChange(event, idx)}
                    />
                  </TableCell>
                  <TableCell>{element.description}</TableCell>
                  <TableCell align="right">{element.quantity}</TableCell>
                  <TableCell>{element.quantity_assignament}</TableCell>
                  <TableCell>
                    <TextField
                      disabled={element.disable}
                      label=""
                      type="number"
                      value={quantityELementsSelected[idx]}
                      onChange={(event) =>
                        changeDataQuantityElements(event, idx)
                      }
                      helperText={
                        parseInt(quantityELementsSelected[idx]) >
                        parseInt(dataElements[idx].quantity)
                          ? "Cantidad no disponible"
                          : ""
                      }
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      {assignmentsPointOperation.length !== 0 ? (
        <div>
          {assignmentsPointOperation.map((pointOperation, idx) => (
            <Paper style={style.paperForm}>
              <Toolbar>
                <Typography variant="h6" id="sub-title" component="div">
                  {pointOperation.name}
                </Typography>
              </Toolbar>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow
                      key={`titles_element_${idx}_data_point_operation`}
                    >
                      <TableCell align="left">Descripción</TableCell>
                      <TableCell align="right">Cantidad nueva</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {pointOperation.elements.map((element, idx) => (
                      <TableRow key={`element_${idx}_data_point_operation`}>
                        <TableCell>{element.description}</TableCell>
                        <TableCell align="right">{element.quantity}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          ))}
        </div>
      ) : (
        ""
      )}
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
              GUARDAR ASIGNACIONES
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default consumerFirebase(AddAssignamentsElemensts);
