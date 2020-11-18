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

const AddProcesses = (props) => {
  //Generals
  const { type } = props.match.params;
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
  //e
  /*let [validationFormSt, setDataValidationFormSt] = useState({
    nid: false,
    name: false,
    country: false,
    city: false,
    address: false,
    phone: false,
    email: false,
  });*/
  //
  //dataName
  const [name, setName] = useState("");

  //dataRawMaterials
  const [elementsRawMaterials, setElementsRawMaterial] = useState([
    { title: "", nid: "" },
  ]);
  //dataSupplies
  const [elementsSupplies, setElementsSupplies] = useState([
    { title: "", nid: "" },
  ]);

  //selectedElementsAll
  const [items, setDataItems] = useState({
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
    ],
  });

  //selectedElementsRawMaterials
  const [selectedTitlesRawMaterials, setSelectedTitlesRawMaterials] = useState([
    { title: "" },
  ]);
  //selectedElementsSupplies
  const [selectedTitlesSupplies, setSelectedTitlesSupplies] = useState([
    { title: "" },
  ]);

  //getData
  const fetchMyAPI = useCallback(async () => {
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
      };
      itemsSupplies.push(jsonFormatElements);
    }
    setElementsSupplies(itemsSupplies);
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
    if (table === "rawMaterials") {
      atribute = "raw_materials";
      data = items.raw_materials;
      dataElemensAvaibles = elementsRawMaterials;
    } else {
      atribute = "supplies";
      data = items.supplies;
      dataElemensAvaibles = elementsSupplies;
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
      const tempSelectedTitlesRawMaterials = selectedTitlesRawMaterials;
      tempSelectedTitlesRawMaterials.push({ title: "" });

      setSelectedTitlesRawMaterials(tempSelectedTitlesRawMaterials);

      const raw_materials = items.raw_materials;
      raw_materials.push({
        nid: "",
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
        nid: "",
        quantity: 0,
        description: "",
      });
      setDataItems({
        ...items,
        supplies,
      });
    }
  };

  const handleItemRemove = (i, table) => {
    if (table === "rawMaterials") {
      const tempSelectedTitlesRawMaterials = selectedTitlesRawMaterials;
      tempSelectedTitlesRawMaterials.splice(i, 1);
      setSelectedTitlesRawMaterials(tempSelectedTitlesRawMaterials);

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

  //saveData
  const saveDataFirebase = async (e) => {
    e.preventDefault();

    let nid = uuidv4();

    let jsonFormatElementStandardization = {
      nid,
      name,
      raw_materials: items.raw_materials,
      supplies: items.supplies,
    };

    let dataStandardizationsBD = await props.firebase.db
      .collection("Standardizations")
      .doc("3qPO90cfep2Xhg89rvnu")
      .get();

    let dataStandardizations = dataStandardizationsBD.data();

    let arrayElements = dataStandardizations.elements;
    
    arrayElements.push(jsonFormatElementStandardization);

    let jsonFormatStandardization = {
      elements: arrayElements,
    }

    props.firebase.db
      .collection("Standardizations")
      .doc("3qPO90cfep2Xhg89rvnu")
      .set(jsonFormatStandardization, { merge: true })
      .then((success) => {
        openMensajePantalla(dispatch, {
          open: true,
          mensaje: "SE GUARDO EL PROCESO",
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
              <Typography color="textPrimary">Proceso</Typography>
            </Breadcrumbs>
          </Grid>
        </Grid>
      </Paper>
      <Paper style={style.paperForm}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={12}>
            <TextField
              name="product"
              variant="outlined"
              fullWidth
              label="Producto"
              value={name}
              onChange={changeDataName}
            />
          </Grid>
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
                  <TableCell align="center" style={{ width: "25%" }}>
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
                          options={elementsRawMaterials}
                          value={selectedTitlesRawMaterials[idx].title}
                          onChange={(event, newDataProvider) => {
                            const data = items.raw_materials;
                            let tempValue = null;
                            if (newDataProvider !== null) {
                              tempValue = selectedTitlesRawMaterials;
                              tempValue[idx] = newDataProvider;
                              setSelectedTitlesRawMaterials(tempValue);
                              data[idx].description = newDataProvider.title;
                              data[idx].nid = newDataProvider.nid;
                            } else {
                              tempValue = selectedTitlesRawMaterials;
                              tempValue[idx] = { title: "", nid: "" };
                              setSelectedTitlesRawMaterials(tempValue);
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
                  <TableCell align="center" style={{ width: "25%" }}>
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
                          id="select_element_supplies"
                          options={elementsSupplies}
                          value={selectedTitlesSupplies[idx].title}
                          onChange={(event, newDataProvider) => {
                            const data = items.supplies;
                            let tempValue = null;
                            if (newDataProvider !== null) {
                              tempValue = selectedTitlesSupplies;
                              tempValue[idx] = newDataProvider;
                              setSelectedTitlesSupplies(tempValue);
                              data[idx].description = newDataProvider.title;
                              data[idx].nid = newDataProvider.nid;
                            } else {
                              tempValue = selectedTitlesSupplies;
                              tempValue[idx] = { title: "", nid: "" };
                              setSelectedTitlesSupplies(tempValue);
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

export default consumerFirebase(AddProcesses);
