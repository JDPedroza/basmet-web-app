import React, { useState, useEffect, useCallback } from "react";
import {
  Breadcrumbs,
  Link,
  Container,
  Paper,
  Grid,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { consumerFirebase } from "../../server";

//icons
import HomeIcon from "@material-ui/icons/Home";

//utils
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

const EditPointsOperation = (props) => {
  const [{ sesion }, dispatch] = useStateValue();

  const { type, id } = props.match.params; //internal-client

  let [clients, setDataClients] = useState([]);

  let [client, setDataClient] = useState({
    id: 0,
    name_client: "",
    type_document: "",
    nid: "",
  });

  let [pointOperation, changeDataPointOperation] = useState({
    id_client: "",
    country: "",
    city: "",
    address: "",
    phone: "",
    type: "",
    nid_inventories: "",
    nid_employees: "",
  });

  let [tempSelectedClient, setTempSelectedClient] = useState(null);
  let [selectedClient, setSelectedClient] = useState(null);

  const fetchMyAPI = useCallback(async () => {
    let snapshotPointOperation = await props.firebase.db
      .collection("PointsOperation")
      .doc(id)
      .get();
    let dataPointOperation = snapshotPointOperation.data();

    if (type === "client") {
      let objectQuery = props.firebase.db.collection("Clients").orderBy("nid");

      const snapshot = await objectQuery.get();

      const arrayClients = snapshot.docs.map((doc) => {
        let data = doc.data();
        let id = doc.id;
        return { id, ...data };
      });
      setDataClients(arrayClients);

      //cargamos los datos de
      let snapshotClient = await props.firebase.db
        .collection("Clients")
        .doc(dataPointOperation.id_client)
        .get();
      let dataClient = snapshotClient.data();

      setSelectedClient(dataClient);
      setDataClient({
        id: dataPointOperation.id_client,
        name_client: dataClient.business || dataClient.contact_name,
        type_document: dataClient.type_document,
        nid: dataClient.nid,
      });
      setTempSelectedClient(dataPointOperation.id_client);
    }

    changeDataPointOperation(dataPointOperation);
  }, []);

  useEffect(() => {
    fetchMyAPI();
  }, [fetchMyAPI]);

  const updateDataClient = async (client) => {
    if (client !== null) {
      setDataClient(() => ({
        id: client.id,
        name_client: client.business || client.contact_name,
        type_document: client.type_document,
        nid: client.nid,
        points_operation: client.points_operation,
      }));
      changeDataPointOperation({
        ...pointOperation,
        id_client: client.id,
      });
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

    await props.firebase.db
      .collection("PointsOperation")
      .doc(id)
      .set(pointOperation, { merge: true })
      .then((success) => {
        openMensajePantalla(dispatch, {
          open: true,
          mensaje: "SE ACTUALIZO EL PUNTO DE OPERACIÓN",
        });
      });

    if (type === "client") {
      //validamos que haya cambiado el cliente responsable
      if (pointOperation.id_client !== tempSelectedClient) {
        //obtenemos la data del anterior cliente
        let snapshotTempClient = await props.firebase.db
          .collection("Clients")
          .doc(tempSelectedClient)
          .get();
        let dataTempClient = snapshotTempClient.data();
        //update client
        let arrayTempPointsOperation = dataTempClient.points_operation;
        let index = arrayTempPointsOperation.indexOf(tempSelectedClient);
        arrayTempPointsOperation.splice(index, 1);
        dataTempClient.points_operation = arrayTempPointsOperation;
        //subimos de nuevo la data
        await props.firebase.db
          .collection("Clients")
          .doc(tempSelectedClient)
          .set(dataTempClient, { merge: true })
          .then((success) => {
            openMensajePantalla(dispatch, {
              open: true,
              mensaje: "SE ACTUALIZO LA INFORMACIÓN DEL ANTERIOR CLIENTE",
            });
          });
        //agregamos el nuevo punto al nuevo cliente
        let snapshotClient = await props.firebase.db
          .collection("Clients")
          .doc(pointOperation.id_client)
          .get();

        let dataClient = snapshotClient.data();

        //update client
        let arrayPointsOperation = dataClient.points_operation;
        arrayPointsOperation.push(id);

        dataClient.points_operation = arrayPointsOperation;

        props.firebase.db
          .collection("Clients")
          .doc(client.id)
          .set(dataClient, { merge: true })
          .then((success) => {
            openMensajePantalla(dispatch, {
              open: true,
              mensaje: "SE ACTUALIZO LA INFORMACIÓN DEL NUEVO CLIENTE",
            });
          })
      }
    }
    props.history.push("/puntos_operacion/mostrar/all/search");
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
              <Typography color="textPrimary">Punto Operacion</Typography>
              <Typography color="textPrimary">Agregar</Typography>
              <Typography color="textPrimary">
                {type === "internal" ? "Interno" : "Cliente"}
              </Typography>
            </Breadcrumbs>
          </Grid>
        </Grid>
      </Paper>
      {type === "client" ? (
        <Paper style={style.paperForm}>
          <Grid container spacing={2} style={style.form}>
            <Grid item xs={12} md={12}>
              <Typography color="textPrimary">Datos Cliente</Typography>
            </Grid>
            <Grid item xs={12} md={12}>
              <Autocomplete
                id="select_client"
                options={clients}
                value={selectedClient}
                onChange={(event, newDataClient) => {
                  updateDataClient(newDataClient);
                  setSelectedClient(newDataClient);
                }}
                getOptionLabel={(client) =>
                  client.business || client.contact_name
                }
                fullWidth
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Nombre"
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
        <Grid container spacing={2} style={style.form}>
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

export default consumerFirebase(EditPointsOperation);
