import React, { useState, useEffect } from "react";
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

//utils
import { crearKeyword } from "../../sesion/actions/keyWords";

//icons
import HomeIcon from "@material-ui/icons/Home";
import { consumerFirebase } from "../../server";

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

const AddClient = (props) => {
  const [open, setOpen] = useState(false);

  let [client, changeDataClient] = useState({
    type_client: "",
    type_document: "",
    nid: "",
    name: "",
    country: "",
    city: "",
    address: "",
    email: "",
    phone: "",
    contact_name: "",
    contact_email: "",
    contact_phone: "",
    points_operation: [],
    keywords: [],
  });

  useEffect(() => {
    const { type } = props.match.params;

    changeDataClient({
      ...client,
      type_client: type,
    });
  }, []);

  const changeData = (e) => {
    const { name, value } = e.target;

    changeDataClient((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const saveDataFirebase = async (e) => {
    e.preventDefault();


    let textSearch = "";

    if (client.type_client == "business") {
      textSearch =
        client.business +
        " " +
        client.type_document +
        " " +
        client.nid +
        " " +
        client.type_client;
    } else {
      textSearch =
        client.contact_name +
        " " +
        client.type_document +
        " " +
        client.nid +
        " " +
        client.type_client;
    }

    client.keywords = crearKeyword(textSearch);
    
    console.log(client)

    props.firebase.db
      .collection("Clients")
      .add(client)
      .then((success) => {
        props.history.push("/home");
      })
      .catch((error) => {
        console.log("error: ", error);
      });

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
              <Typography color="textPrimary">Clientes</Typography>
              <Typography color="textPrimary">Agregar</Typography>
            </Breadcrumbs>
          </Grid>
        </Grid>
      </Paper>
      <Paper style={style.form}>
        {client.type_client === "business" ? (
          <Grid container spacing={2} style={style.gridForm}>
            <Grid item xs={12} md={12}>
              <Typography color="textPrimary">Datos Empresa</Typography>
            </Grid>
            <Grid item xs={12} md={12}>
              <TextField
                name="business"
                variant="outlined"
                fullWidth
                label="Nombre"
                value={client.business}
                onChange={changeData}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel id="demo-controlled-open-select-label">
                  Tipo Identificación
                </InputLabel>
                <Select
                  name="type_document"
                  labelId="demo-controlled-open-select-label"
                  id="demo-controlled-open-select"
                  open={open}
                  onClose={handleClose}
                  onOpen={handleOpen}
                  value={client.type_document}
                  onChange={changeData}
                  fullWidth
                >
                  <MenuItem value={"NIT"}>NIT</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                name="nid"
                variant="outlined"
                fullWidth
                label={client.type_document || "Tipo Identificación"}
                value={client.nid}
                onChange={changeData}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                name="country"
                variant="outlined"
                fullWidth
                label="Pais"
                value={client.country}
                onChange={changeData}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                name="city"
                variant="outlined"
                fullWidth
                label="Ciudad"
                value={client.city}
                onChange={changeData}
              />
            </Grid>
            <Grid item xs={12} md={12}>
              <TextField
                name="address"
                variant="outlined"
                fullWidth
                label="Dirección"
                value={client.address}
                onChange={changeData}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                name="email"
                variant="outlined"
                fullWidth
                label="Correo"
                value={client.email}
                onChange={changeData}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                name="phone"
                variant="outlined"
                fullWidth
                label="Numero Telefono"
                value={client.phone}
                onChange={changeData}
              />
            </Grid>
            <Grid item xs={12} md={12}>
              <Typography color="textPrimary">
                Datos Contacto Directo <em>(opcional)</em>
              </Typography>
            </Grid>
            <Grid item xs={12} md={12}>
              <TextField
                name="contact_name"
                variant="outlined"
                fullWidth
                label="Nombre"
                value={client.contact_name}
                onChange={changeData}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                name="contact_email"
                variant="outlined"
                fullWidth
                label="Correo"
                value={client.contact_email}
                onChange={changeData}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                name="contact_phone"
                variant="outlined"
                fullWidth
                label="Numero Telefono"
                value={client.contact_phone}
                onChange={changeData}
              />
            </Grid>
          </Grid>
        ) : (
          <Grid container spacing={2} style={style.gridForm}>
            <Grid item xs={12} md={12}>
              <Typography color="textPrimary">Datos Persona Natural</Typography>
            </Grid>
            <Grid item xs={12} md={12}>
              <TextField
                name="contact_name"
                variant="outlined"
                fullWidth
                label="Nombre"
                value={client.contact_name}
                onChange={changeData}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel id="demo-controlled-open-select-label">
                  Tipo Identificación
                </InputLabel>
                <Select
                  name="type_document"
                  labelId="demo-controlled-open-select-label"
                  id="demo-controlled-open-select"
                  open={open}
                  onClose={handleClose}
                  onOpen={handleOpen}
                  value={client.type_document}
                  onChange={changeData}
                  fullWidth
                >
                  <MenuItem value={"Tipo Identificación"}>
                    <em>AA</em>
                  </MenuItem>
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
                name="nid"
                variant="outlined"
                fullWidth
                label={client.type_document || "Tipo Identificación"}
                value={client.nid}
                onChange={changeData}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                name="country"
                variant="outlined"
                fullWidth
                label="Pais"
                value={client.country}
                onChange={changeData}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                name="city"
                variant="outlined"
                fullWidth
                label="Ciudad"
                value={client.city}
                onChange={changeData}
              />
            </Grid>
            <Grid item xs={12} md={12}>
              <TextField
                name="address"
                variant="outlined"
                fullWidth
                label="Dirección"
                value={client.address}
                onChange={changeData}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                name="contact_email"
                variant="outlined"
                fullWidth
                label="Correo"
                value={client.contact_email}
                onChange={changeData}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                name="contact_phone"
                variant="outlined"
                fullWidth
                label="Numero Telefono"
                value={client.contact_phone}
                onChange={changeData}
              />
            </Grid>
          </Grid>
        )}
      </Paper>
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

export default consumerFirebase(AddClient);
