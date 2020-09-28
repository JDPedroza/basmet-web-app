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
} from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { consumerFirebase } from "../../server";

//utils
import { useStateValue } from "../../sesion/store";
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
    padding: "20px",
    minheight: 650,
  },
};

const AddPointOperation = (props) => {
  const { type } = props.match.params; //internal-client
  const [{ sesion }, dispatch] = useStateValue();

  let [clients, setDataClients] = useState({ data: [] });
  let [client, changeDataClient] = useState({
    id: "",
    name_client: "",
    type_document: "",
    nid: "",
    country: "",
    city: "",
    address: "",
    email: "",
    phone: "",
    points_operation: [],
  });
  let [selectedClient, setSelectedClient] = useState(null);

  let [pointOperation, changeDataPointOperation] = useState({
    id_client: "",
    country: "",
    city: "",
    address: "",
    phone: "",
    type: "",
    nid_inventories: "",
  });

  const fetchMyAPI = useCallback(async () => {
    let objectQuery = props.firebase.db.collection("Clients").orderBy("nid");

    const snapshot = await objectQuery.get();

    const arrayClients = snapshot.docs.map((doc) => {
      let data = doc.data();
      let id = doc.id;
      return { id, ...data };
    });

    setDataClients({
      data: arrayClients,
    });
  }, []);

  useEffect(() => {
    fetchMyAPI();
  }, [fetchMyAPI]);

  const updateDataClient = async (client) => {
    if (client !== null) {
      changeDataClient(() => ({
        id: client.id,
        name_client: client.business || client.contact_name,
        type_document: client.type_document,
        nid: client.nid,
        country: client.country,
        city: client.city,
        address: client.address,
        email: client.email || client.contact_email,
        phone: client.phone || client.contact_phone,
        points_operation: client.points_operation,
      }));
    }
  };

  const changeData = (e) => {
    const { name, value } = e.target;

    changeDataPointOperation((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const saveDataFirebase = async (e) => {
    e.preventDefault();

    const jsonFormatInventoriesPointOperation = {
      items_packaging: [],
      items_process: [],
      raw_material: [],
      supplies: [],
      tools_equipment: [],
    };

    let nidInventoriesPointOperation = "";

    //generar la lista de elementsProvider
    await props.firebase.db
      .collection("InventoriesPointOperation")
      .add(jsonFormatInventoriesPointOperation)
      .then((success) => {
        nidInventoriesPointOperation = success.id;
      });

    pointOperation.nid_inventories = nidInventoriesPointOperation;

    if (type === "client") {
      pointOperation.id_client = client.id;
    }
    pointOperation.type = type;

    let nidPointsOperation = "";
    await props.firebase.db
      .collection("PointsOperation")
      .add(pointOperation)
      .then((success) => {
        nidPointsOperation = success.id;
      })
      .catch((error) => {
        console.log("error: ", error);
      });

    if (type === "") {
      //update client
      let arrayPointsOperation = client.points_operation;
      arrayPointsOperation.push(nidPointsOperation);

      client.points_operation = arrayPointsOperation;

      props.firebase.db
        .collection("Clients")
        .doc(client.id)
        .set(client)
        .then((success) => {
          openMensajePantalla(dispatch, {
            open: true,
            mensaje: "Se agrego el punto de operación",
          });
          props.history.push("/home");
        })
        .catch((error) => {
          console.log("error: ", error);
        });
    }else{
      openMensajePantalla(dispatch, {
        open: true,
        mensaje: "Se agrego el punto de operación",
      });
      props.history.push("/home")
    }

  };

  return (
    <Container component="main" maxWidth="md" justify="center">
      <Paper style={style.paper}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Breadcrumbs aria-label="breadcrumbs">
              <Link color="inherit" style={style.link} href="/home">
                <HomeIcon />
                Principal
              </Link>
              <Typography color="textPrimary">Punto Operacion</Typography>
              <Typography color="textPrimary">Agregar</Typography>
              <Typography color="textPrimary">
                {type === "propio" ? "Propio" : "Cliente"}
              </Typography>
            </Breadcrumbs>
          </Grid>
        </Grid>
      </Paper>
      {type === "cliente" ? (
        <Paper style={style.paperForm}>
          <Grid container spacing={2} style={style.form}>
            <Grid item xs={12} md={12}>
              <Typography color="textPrimary">Datos Cliente</Typography>
            </Grid>
            <Grid item xs={12} md={12}>
              <Autocomplete
                id="select_clients"
                options={clients.data}
                value={selectedClient}
                onChange={(event, newDataClient) => {
                  updateDataClient(newDataClient);
                  setSelectedClient(newDataClient);
                }}
                getOptionLabel={(clients) =>
                  clients.business || clients.contact_name
                }
                fullWidth
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Cliente"
                    variant="outlined"
                    required
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel id="demo-controlled-open-select-label">
                  Tipo Identificación
                </InputLabel>
                <Select
                  disabled
                  name="type_document"
                  labelId="demo-controlled-open-select-label"
                  id="demo-controlled-open-select"
                  value={client.type_document}
                  fullWidth
                >
                  <MenuItem value={"Tipo Identificación"}>
                    <em>AA</em>
                  </MenuItem>
                  <MenuItem value={"NIT"}>NIT</MenuItem>
                  <MenuItem value={"CC"}>CC</MenuItem>
                  <MenuItem value={"CE"}>CE</MenuItem>
                  <MenuItem value={"PA"}>PA</MenuItem>
                  <MenuItem value={"RC"}>RC</MenuItem>
                  <MenuItem value={"TI"}>TI</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                disabled
                name="nid"
                variant="outlined"
                fullWidth
                label={client.type_document || "Tipo Identificación"}
                value={client.nid}
              />
            </Grid>
          </Grid>
        </Paper>
      ) : (
        ""
      )}
      <Paper style={style.paperForm}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={12}>
            <Typography color="textPrimary">Datos Punto Operación</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              name="country"
              variant="outlined"
              fullWidth
              label="Pais"
              value={pointOperation.country}
              onChange={changeData}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              name="city"
              variant="outlined"
              fullWidth
              label="Ciudad"
              value={pointOperation.city}
              onChange={changeData}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              name="address"
              variant="outlined"
              fullWidth
              label="Dirección"
              value={pointOperation.address}
              onChange={changeData}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              name="phone"
              variant="outlined"
              fullWidth
              label="Numero Telefono"
              value={pointOperation.phone}
              onChange={changeData}
            />
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

export default consumerFirebase(AddPointOperation);
