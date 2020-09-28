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
    padding: "20px",
    minheight: 650,
  },
  paperWarning: {
    marginTop: 2,
    padding: "5px",
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
};

const AddElement = (props) => {
  const [elementsRawMaterials, setElementsRawMaterial] = useState([
    { title: "Prueba", nid: "" },
  ]);
  const [elementsSupplies, setElementsSupplies] = useState([
    { title: "", nid: "" },
  ]);

  let [items, setDataItems] = useState({
    raw_materials: [
      {
        nid: 0,
        quantity: 0,
        description: "",
      },
    ],
    supplies: [
      {
        nid: 0,
        quantity: 0,
        description: "",
      },
    ]
  });

  const [value, setValue] = useState([{ title: "" }]);
  const [selectedTitlesSupplies, setSelectedTitlesSupplies] = useState([
    { title: "" },
  ]);

  const fetchMyAPI = useCallback(async () => {
    let itemsRawMaterials = [];
    //getDataRawMaterials
    let getDataRawMaterials = await props.firebase.db
      .collection("RawMaterial")
      .doc("6Ti3WLE0cav83i0rYozs")
      .get();
    let dataRawMaterials = getDataRawMaterials.data();

    for (let i = 0; i < dataRawMaterials.elements.length; i++) {
      let jsonFormatElements = {
        title: dataRawMaterials.elements[i].title,
        nid: dataRawMaterials.elements[i].nid,
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
      };
      itemsSupplies.push(jsonFormatElements);
    }

    setElementsSupplies(itemsSupplies);
  }, []);

  useEffect(() => {
    fetchMyAPI();
  }, [fetchMyAPI]);

  const handleItemChange = (i, event, table) => {
    let data = "";
    let atribute = "";
    if (table === "rawMaterials") {
      atribute = "raw_materials";
      data = items.data;
    } else {
      atribute = "supplies";
      data = items.supplies;
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
    if (table === "rawMaterials") {
      const tempValue = value;
      tempValue.push({ title: "" });

      setValue(tempValue);

      const raw_materials = items.raw_materials;
      raw_materials.push({
        quantity: 0,
        description: "",
      });
      setDataItems({
        ...items,
        raw_materials,
      });
    } else {
      const tempSelectedTitlesSupplies = selectedTitlesSupplies;
      tempSelectedTitlesSupplies.push({ title: "" });

      setSelectedTitlesSupplies(tempSelectedTitlesSupplies);

      const supplies = items.supplies;
      supplies.push({
        quantity: 0,
        description: "",
        unit_value: 0,
        total_value: 0,
      });
      setDataItems({
        ...items,
        supplies,
      });
    }
  };

  const handleItemRemove = (i, table) => {
    if (table === "rawMaterials") {
      const tempValue = value;
      tempValue.splice(i, 1);
      setValue(tempValue);

      const raw_materials = items.raw_materials;
      raw_materials.splice(i, 1);
      setDataItems({
        ...items,
        raw_materials,
      });
    } else {
      const tempSelectedTitlesSupplies = selectedTitlesSupplies;
      tempSelectedTitlesSupplies.splice(i, 1);
      setSelectedTitlesSupplies(tempSelectedTitlesSupplies);

      const supplies = items.supplies;
      supplies.splice(i, 1);
      setDataItems({
        ...items,
        supplies,
      });
    }
  };

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
              <Typography color="textPrimary">Productos en proceso </Typography>
              <Typography color="textPrimary">Nuevo Proceso</Typography>
            </Breadcrumbs>
          </Grid>
        </Grid>
      </Paper>
      <Paper style={style.paperForm}>
        <Grid container spacing={2} style={style.form}>
          <Grid item xs={12} md={12}>
            <Typography color="textPrimary" variant="h6">
              Insumos
            </Typography>
          </Grid>
          <TableContainer item xs={12} sm={12}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align="center" style={{ width: "65%" }}>
                    Descripcion
                  </TableCell>
                  <TableCell align="center" style={{ width: "15%" }}>
                    Cantidad
                  </TableCell>
                  <TableCell align="center" style={{ width: "10%" }}>
                    <IconButton
                      aria-label="addElement"
                      onClick={() => handleItemAdd("rawMaterials")}
                    >
                      <AddIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {items.raw_materials.map((item, idx) => {
                  return (
                    <TableRow key={idx}>
                      <TableCell align="center">
                        <Autocomplete
                          id="select_provider"
                          options={elementsSupplies}
                          value={value[idx].title}
                          onChange={(event, newDataProvider) => {
                            const data = items.raw_materials;
                            let tempValue = null;
                            if (newDataProvider !== null) {
                              tempValue = value;
                              tempValue[idx] = newDataProvider;
                              setValue(tempValue);
                              data[idx].description = newDataProvider.title;
                              data[idx].nid = newDataProvider.nid;
                            } else {
                              tempValue = value;
                              tempValue[idx] = { title: "", nid: "" };
                              setValue(tempValue);
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
                          id="quantity"
                          label=""
                          type="number"
                          value={item.quantity}
                          onChange={(e) =>
                            handleItemChange(idx, e, "rawMaterials")
                          }
                        />
                      </TableCell>
                      <TableCell align="center">
                        <IconButton
                          aria-label="edit"
                          onClick={() => handleItemRemove(idx, "rawMaterials")}
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
        <Grid container spacing={2} style={style.form}>
          <Grid item xs={12} md={12}>
            <Typography color="textPrimary" variant="h6">
              Materia Prima
            </Typography>
          </Grid>
          <TableContainer item xs={12} sm={12}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align="center" style={{ width: "65%" }}>
                    Descripcion
                  </TableCell>
                  <TableCell align="center" style={{ width: "15%" }}>
                    Cantidad
                  </TableCell>
                  <TableCell align="center" style={{ width: "10%" }}>
                    <IconButton
                      aria-label="addElement"
                      onClick={() => handleItemAdd("supplies")}
                    >
                      <AddIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {items.supplies.map((item, idx) => {
                  return (
                    <TableRow key={idx}>
                      <TableCell align="center">
                        <Autocomplete
                          id="select_element_raw_materials"
                          options={elementsRawMaterials}
                          value={selectedTitlesSupplies[idx].title}
                          onChange={(event, newDataProvider) => {
                            const data = items.supplies;
                            let tempValue = null;
                            if (newDataProvider !== null) {
                              tempValue = value;
                              tempValue[idx] = newDataProvider;
                              setValue(tempValue);
                              data[idx].description = newDataProvider.title;
                              data[idx].nid = newDataProvider.nid;
                            } else {
                              tempValue = value;
                              tempValue[idx] = { title: "", nid: "" };
                              setValue(tempValue);
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
                          id="quantity"
                          label=""
                          type="number"
                          value={item.quantity}
                          onChange={(e) => handleItemChange(idx, e, "supplies")}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <IconButton
                          aria-label="edit"
                          onClick={() => handleItemRemove(idx, "supplies")}
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
      <Paper style={style.paperWarning}>
        <Grid container spacing={2} style={style.form}>
          <Grid item xs={12} md={12}>
            <Typography color="textPrimary">
              Elementos Necesarios (Por favor, ingrese los elementos necesario
              para el desarrollo del producto)
            </Typography>
          </Grid>
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

export default consumerFirebase(AddElement);
