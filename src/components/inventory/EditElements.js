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

//utils
import { useStateValue } from "../../sesion/store";
import { openMensajePantalla } from "../../sesion/actions/snackBarAction";
import { consumerFirebase } from "../../server";

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
};

const EditElements = (props) => {
  const { table, id } = props.match.params;
  const [{ sesion }, dispatch] = useStateValue();

  const [dataProviders, setDataProviders] = useState([{ title: "", nid: "" }]);
  const [dataElement, setDataElement] = useState({ providers: [] });
  let [value, setValue] = useState([
    { title: "" },
    { title: "" },
    { title: "" },
    { title: "" },
    { title: "" },
    { title: "" },
  ]);

  const fetchMyAPI = useCallback(async () => {
    let doc = "";
    if (table === "materia_prima") {
      doc = "RawMaterials";
    } else if (table === "herramientas_y_equipos") {
      doc = "ToolsEquipment";
    } else {
      doc = "Supplies";
    }

    let snapshotInventory = await props.firebase.db
      .collection("Inventories")
      .doc(doc)
      .get();

    let dataInventory = snapshotInventory.data();

    let arrayProvidersElement = [];

    for (let i = 0; i < dataInventory.elements.length; i++) {
      if (dataInventory.elements[i].nid === id) {
        setDataElement(dataInventory.elements[i]);
        arrayProvidersElement = await Promise.all(
          dataInventory.elements[i].providers.map(async (provider) => {
            let snapshotProviders = await props.firebase.db
              .collection("Providers")
              .doc(provider)
              .get();

            let dataProvider = snapshotProviders.data();
            //agregamos el json al array
            return {
              title: dataProvider.business || dataProvider.contact_name,
            };
          })
        );
        setValue(arrayProvidersElement);
      }
    }

    let objectQuery = props.firebase.db.collection("Providers").orderBy("nid");

    const snapshot = await objectQuery.get();

    const arrayProviders = snapshot.docs.map((doc) => {
      let data = doc.data();
      let id = doc.id;
      return { id, title: data.business || data.contact_name };
    });

    setDataProviders(arrayProviders);
  }, []);

  useEffect(() => {
    fetchMyAPI();
  }, [fetchMyAPI]);

  const changeData = (e) => {
    const { name, value } = e.target;

    setDataElement((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleItemAdd = () => {
    const tempValue = value;
    tempValue.push({ title: "" });

    setValue(tempValue);

    const arrayProviders = dataElement.providers;

    arrayProviders.push({
      title: "",
    });

    setDataElement({
      ...dataElement,
      providers: arrayProviders,
    });
  };

  const handleItemRemove = (i) => {
    const tempValue = value;
    tempValue.splice(i, 1);
    setValue(tempValue);

    const arrayProviders = dataElement.providers;
    arrayProviders.splice(i, 1);

    setDataElement({
      ...dataElement,
      providers: arrayProviders,
    });
  };

  const saveDataFirebase = async (e) => {
    e.preventDefault();

    let today = new Date();
    let dd = today.getDate();
    let mm = today.getMonth() + 1;
    let yyyy = today.getFullYear();
    let date = `${dd}-${mm}-${yyyy}`;

    let jsonFormatReport = {
      user: sesion.usuario,
      date,
      type: "Modificación de elemento",
      data: dataElement,
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

    dataElement.last_modify = idReport;

    let doc = "";
    if (table === "materia_prima") {
      doc = "RawMaterials";
    } else if (table === "herramientas_y_equipos") {
      doc = "ToolsEquipment";
    } else {
      doc = "Supplies";
    }

    //recuperamos lo que esta en la base de datos
    let snapshotInventories = await props.firebase.db
      .collection("Inventories")
      .doc(doc)
      .get();
    let dataInventory = snapshotInventories.data();

    //remplazamos el elemento
    for (let i = 0; i < dataInventory.elements.length; i++) {
      if (dataInventory.elements[i].nid === id) {
        dataInventory.elements[i] = dataElement;
      }
    }

    //update Inventorie
    await props.firebase.db
      .collection("Inventories")
      .doc(doc)
      .set(dataInventory, { merge: true })
      .then((success) => {
        openMensajePantalla(dispatch, {
          open: true,
          mensaje: "SE GUARDARON LOS CAMBIOS DEL ELEMENTO",
        });
        props.history.replace(`/inventarios/mostrar/${table}/modify`);
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
              <Typography color="textPrimary">Inventario</Typography>
              <Typography color="textPrimary">Modificar</Typography>
              <Typography color="textPrimary">
                {table === "materia_prima"
                  ? "Materia Prima"
                  : table === "herramientas_y_equipos"
                  ? "Herramientas y Equipos"
                  : "Insumos"}
              </Typography>
            </Breadcrumbs>
          </Grid>
        </Grid>
      </Paper>
      <Paper style={style.paperForm}>
        <Grid container spacing={2} style={style.form}>
          <Grid item xs={12} md={12}>
            Datos del elemento
          </Grid>
          <Grid item xs={12} md={12}>
            <TextField
              name="title"
              variant="outlined"
              fullWidth
              label="Nombre del elemento"
              value={dataElement.title}
              onChange={changeData}
            />
          </Grid>
          <TableContainer item xs={12} sm={12}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align="center">
                    Nombres de los proveedores
                  </TableCell>
                  <TableCell align="center" style={{ width: "10%" }}>
                    <IconButton
                      aria-label="addElement"
                      onClick={() => handleItemAdd()}
                    >
                      <AddIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {dataElement.providers.map((item, idx) => {
                  return (
                    <TableRow key={idx}>
                      <TableCell align="center">
                        <Autocomplete
                          fullWidth
                          value={value[idx].title}
                          onChange={(event, itemAutoComplet) => {
                            const tempProviders = dataElement.providers;
                            let tempValue = value;
                            tempValue[idx] = itemAutoComplet;
                            setValue(tempValue);
                            tempProviders[idx] = itemAutoComplet.id || "";
                            setDataElement({
                              ...dataElement,
                              providers: tempProviders,
                            });
                          }}
                          selectOnFocus
                          clearOnBlur
                          handleHomeEndKeys
                          id={`${idx}_provider`}
                          options={dataProviders}
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
                          renderOption={(option) => option.title}
                          freeSolo
                          renderInput={(params) => (
                            <TextField {...params} fullWidth label="" />
                          )}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <IconButton
                          aria-label="edit"
                          onClick={() => handleItemRemove(idx)}
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
              GUARDAR CAMBIOS
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default consumerFirebase(EditElements);
