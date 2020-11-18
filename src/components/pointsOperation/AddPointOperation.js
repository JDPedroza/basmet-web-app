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


const AddElement = (props) => {

  const [{ sesion }, dispatch] = useStateValue();

  const { type } = props.match.params; //internal-client

  let [clients, setDataClients] = useState([]);

  let [client, setDataClient] = useState({
    id: 0,
    name_client: "",
    type_document: "",
    nid: "",
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
    nid_employees: "",
  });
   //e
   let [validationFormpointOperation, setDataValidationFormpointOperation] = useState({
    //name_client: false,
    //type_document: false,
    //nid: false,
    country: false,
    city: false,
    address: false,
    phone: false,
  });
  //


  const fetchMyAPI = useCallback(async () => {
    let objectQuery = props.firebase.db.collection("Clients").orderBy("nid");

    const snapshot = await objectQuery.get();

    const arrayClients = snapshot.docs.map((doc) => {
      let data = doc.data();
      let id = doc.id;
      return { id, ...data, name:"Hola mundo" };
    });
    setDataClients(arrayClients);
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
        points_operation : client.points_operation
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

   /* const jsonFormatInventoriesPointOperation = {
    const jsonFormatInventoriesPointOperation = {
      implements: [],
      items_packaging: [],
      items_process: [],
      raw_materials: [],
      supplies: [],
      tools_equipment: [],
    };

    let nidInventoriesPointOperation = "";

    //generar la lista de elementsPointOperation
    await props.firebase.db
      .collection("InventoriesPointOperation")
      .add(jsonFormatInventoriesPointOperation)
      .then((success) => {
        nidInventoriesPointOperation = success.id;
      });

    pointOperation.nid_inventories = nidInventoriesPointOperation;

    const jsonFormatEmployeesPointOperation = { employees: [] };
    let nidEmployeesPointOperation = "";

    //generar la lista de employeesPointOperation
    await props.firebase.db
      .collection("EmployeesPointOperation")
      .add(jsonFormatEmployeesPointOperation)
      .then((success) => {
        nidEmployeesPointOperation = success.id;
      });

    pointOperation.nid_employees = nidEmployeesPointOperation;

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

    if (type === "client") {
      //optenemos la data del cliente
      let snapshotClient =  await props.firebase.db.collection("Clients").doc(client.id).get()
      let dataClient = snapshotClient.data();

      //update client
      let arrayPointsOperation = dataClient.points_operation;
      arrayPointsOperation.push(nidPointsOperation);

      dataClient.points_operation = arrayPointsOperation;

      props.firebase.db
        .collection("Clients")
        .doc(client.id)
        .set(dataClient, {merge: true})
        .then((success) => {
          openMensajePantalla(dispatch, {
            open: true,
            mensaje: "SE ACTUALIZO EL CLIENTE",
          });
          props.history.push("/puntos_operacion/mostrar/all/search");
        })
        .catch((error) => {
          console.log("error: ", error);
        });
    } else {
      openMensajePantalla(dispatch, {
        open: true,
        mensaje: "SE AGREGO EL PUNTO DE OPERACIÓN",
      });
      props.history.push("/home");
    }*/

    //e
    let validation = true;
    if (client.name_client.length === 0) {
      validation = false;
      validationFormpointOperation.name = true;
    } else {
      validationFormpointOperation.name = false;
    }
    if (client.type_document.length === 0) {
      validation = false;
      validationFormpointOperation.type_document = true;
    } else {
      validationFormpointOperation.type_document = false;
    }
    if (client.nid.length === 0) {
        validation = false;
      validationFormpointOperation.nid = true;
    } else {
      validationFormpointOperation.nid = false;
    }
    if (pointOperation.country.length === 0) {
      validation = false;
      validationFormpointOperation.country = true;
    } else {
      validationFormpointOperation.country = false;
    }
    if (pointOperation.city.length === 0) {
      validation = false;
      validationFormpointOperation.city = true;
    } else {
      validationFormpointOperation.city = false;
      props.history.push("/puntos_operacion/mostrar/all/search");
    }
    if (pointOperation.address.length === 0) {
      validation = false;
      validationFormpointOperation.address = true;
    } else {
      validationFormpointOperation.address = false;
    }
    if (pointOperation.phone.length === 0) {
      validation = false;
      validationFormpointOperation.phone = true;
    } else {
      validationFormpointOperation.phone = false;
    }
    if (!validation) {
      openMensajePantalla(dispatch, {
      open: true,
      mensaje:
        "Errores en el formulario. Por favor, diligencie todos los campos solicitados",
      });
    } else {
      openMensajePantalla(dispatch, {
      open: true,
      mensaje:
        "Validacion completa",
      });
    }
  //
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
                {type === "propio" ? "Propio" : "Cliente"}
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
              //e
              error={validationFormpointOperation.country}
              helperText={
                validationFormpointOperation.country
                  ? "Por favor ingrese un pais: ej. Colombia"
                  : ""
              }
              //
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
              //e
              error={validationFormpointOperation.city}
              helperText={
                validationFormpointOperation.city
                  ? "Por favor ingrese una ciudad: ej. Bogotá"
                  : ""
              }
              //
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
              //e
              error={validationFormpointOperation.address}
              helperText={
                validationFormpointOperation.address
                  ? "Por favor ingrese una dirección: ej. Calle 66 sur #17-48"
                  : ""
              }
              //
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
              //e
              error={validationFormpointOperation.phone}
              helperText={
                validationFormpointOperation.phone
                  ? "Por favor ingrese un telefóno: ej. 3132749738"
                  : ""
              }
              //
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

export default consumerFirebase(AddElement);
