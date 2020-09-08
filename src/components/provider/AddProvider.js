import React, { useState } from "react";
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
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@material-ui/core";
import { consumerFirebase } from "../../server";
import { crearKeyword } from "../../sesion/actions/keyWords";

//temp
import HomeIcon from "@material-ui/icons/Home";

const style = {
  paper: {
    marginTop: 8,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  form: {
    width: "100%",
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

const ControlledOpenSelect = (props) => {

  const [open, setOpen] = useState(false);

  let [provider, changeDataProvider] = useState({
    business: "",
    type_document: "",
    id: "",
    country: "",
    city: "",
    address: "",
    email: "",
    phone: "",
    contact_name: "",
    contact_email: "",
    contact_phone: "",
    keywords: "",
    type_provider: "business",
  });

  const changeData = (e) => {
    const { name, value } = e.target;

    if (
      (name === "type_provider" && value === "business") ||
      value === "people"
    ) {
      console.log("reset");
      changeDataProvider((prev) => ({
        business: "",
        type_document: "",
        id: "",
        country: "",
        city: "",
        address: "",
        email: "",
        phone: "",
        contact_name: "",
        contact_email: "",
        contact_phone: "",
        [name]: value,
      }));
    } else {
      changeDataProvider((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const saveDataFirebase = (e) => {
    e.preventDefault();

    let textSearch = "";

    if (provider.type_provider == "business") {
      textSearch =
        provider.business +
        " " +
        provider.type_document +
        " " +
        provider.id +
        " " +
        provider.type_provider
    } else {
      textSearch =
        provider.contact_name +
        " " +
        provider.type_document +
        " " +
        provider.id +
        " " +
        provider.type_provider;
    }

    provider.keywords = crearKeyword(textSearch);

    props.firebase.db
      .collection("Providers")
      .add(provider)
      .then((success) => {
        props.history.push("/");
      })
      .catch((error) => {
        console.log("error: ", error)
      });
  };

  return (
    <Container component="main" maxWidth="md" justify="center">
      <Paper style={style.paper}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Breadcrumbs aria-label="breadcrumbs">
              <Link color="inherit" style={style.link} href="/">
                <HomeIcon style={style.homeIcon} />
                Home
              </Link>
              <Typography color="textPrimary">Agregar Proveedor</Typography>
            </Breadcrumbs>
          </Grid>
        </Grid>
        <Grid container spacing={2} style={style.form}>
          <Grid item xs={12} md={12} style={{ alignItems: "center" }}>
            <FormControl component="fieldset">
              <FormLabel component="legend">Tipo Proveedor</FormLabel>
              <RadioGroup
                row
                aria-label="position"
                name="type_provider"
                defaultValue="business"
                value={provider.type_provider}
                onChange={changeData}
              >
                <FormControlLabel
                  value="business"
                  control={<Radio color="primary" />}
                  label="Empresa"
                  labelPlacement="bottom"
                />
                <FormControlLabel
                  value="people"
                  control={<Radio color="primary" />}
                  label="Persona Natural"
                  labelPlacement="bottom"
                />
              </RadioGroup>
            </FormControl>
          </Grid>
        </Grid>
        {provider.type_provider === "business" ? (
          <Grid container spacing={2} style={style.form}>
            <Grid item xs={12} md={12}>
              <Typography color="textPrimary">Datos Empresa</Typography>
            </Grid>
            <Grid item xs={12} md={12}>
              <TextField
                name="business"
                variant="outlined"
                fullWidth
                label="Nombre"
                value={provider.business}
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
                  value={provider.type_document}
                  onChange={changeData}
                  fullWidth
                >
                  <MenuItem value={"NIT"}>NIT</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                name="id"
                variant="outlined"
                fullWidth
                label={provider.type_document || "Tipo Identificación"}
                value={provider.id}
                onChange={changeData}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                name="country"
                variant="outlined"
                fullWidth
                label="Pais"
                value={provider.country}
                onChange={changeData}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                name="city"
                variant="outlined"
                fullWidth
                label="Ciudad"
                value={provider.city}
                onChange={changeData}
              />
            </Grid>
            <Grid item xs={12} md={12}>
              <TextField
                name="address"
                variant="outlined"
                fullWidth
                label="Dirección"
                value={provider.address}
                onChange={changeData}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                name="email"
                variant="outlined"
                fullWidth
                label="Correo"
                value={provider.email}
                onChange={changeData}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                name="phone"
                variant="outlined"
                fullWidth
                label="Numero Telefono"
                value={provider.phone}
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
                value={provider.contact_name}
                onChange={changeData}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                name="contact_email"
                variant="outlined"
                fullWidth
                label="Correo"
                value={provider.contact_email}
                onChange={changeData}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                name="contact_phone"
                variant="outlined"
                fullWidth
                label="Numero Telefono"
                value={provider.contact_phone}
                onChange={changeData}
              />
            </Grid>
          </Grid>
        ) : (
          <Grid container spacing={2} style={style.form}>
            <Grid item xs={12} md={12}>
              <Typography color="textPrimary">Datos Persona Natural</Typography>
            </Grid>
            <Grid item xs={12} md={12}>
              <TextField
                name="contact_name"
                variant="outlined"
                fullWidth
                label="Nombre"
                value={provider.contact_name}
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
                  value={provider.type_document}
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
                name="id"
                variant="outlined"
                fullWidth
                label={provider.type_document || "Tipo Identificación"}
                value={provider.id}
                onChange={changeData}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                name="country"
                variant="outlined"
                fullWidth
                label="Pais"
                value={provider.country}
                onChange={changeData}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                name="city"
                variant="outlined"
                fullWidth
                label="Ciudad"
                value={provider.city}
                onChange={changeData}
              />
            </Grid>
            <Grid item xs={12} md={12}>
              <TextField
                name="address"
                variant="outlined"
                fullWidth
                label="Dirección"
                value={provider.address}
                onChange={changeData}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                name="contact_email"
                variant="outlined"
                fullWidth
                label="Correo"
                value={provider.contact_email}
                onChange={changeData}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                name="contact_phone"
                variant="outlined"
                fullWidth
                label="Numero Telefono"
                value={provider.contact_phone}
                onChange={changeData}
              />
            </Grid>
          </Grid>
        )}
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

export default consumerFirebase(ControlledOpenSelect);
