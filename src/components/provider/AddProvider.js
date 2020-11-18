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
import { consumerFirebase } from "../../server";
import { crearKeyword } from "../../sesion/actions/keyWords";

//e
import { useStateValue } from "../../sesion/store";
import { openMensajePantalla } from "../../sesion/actions/snackBarAction";
//

//temp
import HomeIcon from "@material-ui/icons/Home";

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

const ControlledOpenSelect = (props) => {
  const [open, setOpen] = useState(false);
  const [{ sesion }, dispatch] = useStateValue();
  const { type } = props.match.params;

  let [provider, changeDataProvider] = useState({
    business: "",
    type_document: "",
    nid: "",
    country: "",
    city: "",
    address: "",
    email: "",
    phone: "",
    contact_name: "",
    contact_email: "",
    contact_phone: "",
    keywords: "",
    type_provider: "",
    last_bill: "",
    nid_elements_provider: "",
  });
  //e
  let [validationFormProvider, setDataValidationFormProvider] = useState({
    type_document: false,
    nid: false,
    name: false,
    country: false,
    city: false,
    address: false,
    phone: false,
    email: false,
  });
  //

  useEffect(() => {
    const { type } = props.match.params;
    changeDataProvider((prev) => ({
      ...prev,
      type_provider: type,
    }));
  }, []);

  const changeData = (e) => {
    const { name, value } = e.target;

    changeDataProvider((prev) => ({
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

    /*const jsonFormatElementsProvider = { elements: [] };

    let nidElementsProvider = "";

    //generar la lista de elementsProvider
    await props.firebase.db
      .collection("ElementsProviders")
      .add(jsonFormatElementsProvider)
      .then((success) => {
        nidElementsProvider = success.id;
      });

    provider.nid_elements_provider = nidElementsProvider;

    let textSearch = "";

    if (provider.type_provider == "business") {
      textSearch =
        provider.business +
        " " +
        provider.type_document +
        " " +
        provider.nid +
        " " +
        provider.type_provider;
    } else {
      textSearch =
        provider.contact_name +
        " " +
        provider.type_document +
        " " +
        provider.nid +
        " " +
        provider.type_provider;
    }

    provider.keywords = crearKeyword(textSearch);*/
    //e
    let validation = true;
    console.log(provider)
    if (provider.name === 0) {
      validation = false;
      validationFormProvider.name = true;
    } else {
      validationFormProvider.name = false;
    }
    if (provider.type_document.length === 0) {
      validation = false;
      validationFormProvider.type_document = true;
    } else {
      validationFormProvider.type_document = false;
    }
    if (provider.nid.length === 0) {
      validation = false;
      validationFormProvider.nid = true;
    } else {
      validationFormProvider.nid = false;
    }
    if (provider.country.length === 0) {
      validation = false;
      validationFormProvider.country = true;
    } else {
      validationFormProvider.country = false;
    }
    if (provider.city.length === 0) {
      validation = false;
      validationFormProvider.city = true;
    } else {
      validationFormProvider.city = false;
    }
    if (provider.address.length === 0) {
      validation = false;
      validationFormProvider.address = true;
    } else {
      validationFormProvider.address = false;
    }
    if (provider.phone.length === 0) {
      validation = false;
      validationFormProvider.phone = true;
    } else {
      validationFormProvider.phone = false;
    }
    if (provider.email.length === 0) {
    validation = false;
    validationFormProvider.email = true;
    } else {
    validationFormProvider.email = false;
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

      //moví esta sección aquí
      /*props.firebase.db
      .collection("Providers")
      .add(provider)
      .then((success) => {
        props.history.push("/home");
      })
      .catch((error) => {
        console.log("error: ", error);
      });*/
      //
    }

    //
    

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
              <Typography color="textPrimary">Proveedores</Typography>
              <Typography color="textPrimary">Agregar</Typography>
              <Typography color="textPrimary">
                {provider.type_provider === "name"
                  ? "Empresa"
                  : "Persona Natural"}
              </Typography>
            </Breadcrumbs>
          </Grid>
        </Grid>
      </Paper>
      <Paper style={style.form}>
        {provider.type_provider === "name" ? (
          <Grid container spacing={2} style={style.gridForm}>
            <Grid item xs={12} md={12}>
              <Typography color="textPrimary">Datos Empresa</Typography>
            </Grid>
            <Grid item xs={12} md={12}>
              <TextField
                name="name"
                variant="outlined"
                fullWidth
                label="Nombre"
                value={provider.name}
                onChange={changeData}
                //e
                error={validationFormProvider.name}
                helperText={
                validationFormProvider.name
                  ? "Por favor ingrese un nombre de empresa: ej. ingacoples"
                  : ""
                }
                //
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
                  //e
                  error={validationFormProvider.type_document}
                  helperText={
                    validationFormProvider.type_document
                      ? "Por favor seleccione un opción: ej. CC"
                      : ""
                  }
                  //
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
                label={provider.type_document || "Tipo Identificación"}
                value={provider.nid}
                onChange={changeData}
                //e
                error={validationFormProvider.nid}
                helperText={
                  validationFormProvider.nid
                    ? "Por favor ingrese un valor: ej. 1013692638"
                    : ""
                }
                //
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
                //e
                error={validationFormProvider.country}
                helperText={
                  validationFormProvider.country
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
                value={provider.city}
                onChange={changeData}
                //e
                error={validationFormProvider.city}
                helperText={
                  validationFormProvider.city
                    ? "Por favor ingrese una ciudad: ej. Bogotá"
                    : ""
                }
                //
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
                //e
                error={validationFormProvider.address}
                helperText={
                  validationFormProvider.address
                    ? "Por favor ingrese una dirección: ej. Calle 66 sur #17-48"
                    : ""
                }
                //
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
                //e
                error={validationFormProvider.email}
                helperText={
                  validationFormProvider.email
                    ? "Por favor ingrese un correo: ej. maurobel1230@gmail.com"
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
                value={provider.phone}
                onChange={changeData}
                //e
                error={validationFormProvider.phone}
                helperText={
                  validationFormProvider.phone
                    ? "Por favor ingrese un telefóno: ej. 3132749738"
                    : ""
                }
                //
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
          <Grid container spacing={2} style={style.gridForm}>
            <Grid item xs={12} md={12}>
              <Typography color="textPrimary">Datos Persona Natural</Typography>
            </Grid>
            <Grid item xs={12} md={12}>
              <TextField
                name="name"
                variant="outlined"
                fullWidth
                label="Nombre"
                value={provider.name}
                onChange={changeData}
                //e
                error={validationFormProvider.name}
                helperText={
                validationFormProvider.name
                  ? "Por favor ingrese un nombre: ej. Edgar Beltrán"
                  : ""
                }

                //
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
                  //e
                  error={validationFormProvider.type_document}
                  helperText={
                    validationFormProvider.type_document
                      ? "Por favor seleccione un opción: ej. CC"
                      : ""
                  }
                  //
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
                label={provider.type_document || "Tipo Identificación"}
                value={provider.nid}
                onChange={changeData}
                //e
                error={validationFormProvider.nid}
                helperText={
                  validationFormProvider.nid
                    ? "Por favor ingrese un valor: ej. 1013692638"
                    : ""
                }
                //
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
                //e
                error={validationFormProvider.country}
                helperText={
                  validationFormProvider.country
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
                value={provider.city}
                onChange={changeData}
                //e
                error={validationFormProvider.city}
                helperText={
                  validationFormProvider.city
                    ? "Por favor ingrese una ciudad: ej. Bogotá"
                    : ""
                }
                //
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
                //e
                error={validationFormProvider.address}
                helperText={
                  validationFormProvider.address
                    ? "Por favor ingrese una dirección: ej. Calle 66 sur #17-48"
                    : ""
                }
                //
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
                //e
                error={validationFormProvider.email}
                helperText={
                  validationFormProvider.email
                    ? "Por favor ingrese un correo: ej. maurobel1230@gmail.com"
                    : ""
                }
                //
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
                //e
                error={validationFormProvider.phone}
                helperText={
                  validationFormProvider.phone
                    ? "Por favor ingrese un telefóno: ej. 3132749738"
                    : ""
                }
                //
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

export default consumerFirebase(ControlledOpenSelect);
