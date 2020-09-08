import React, { Component } from "react";
import {
  Container,
  Paper,
  Grid,
  Breadcrumbs,
  Link,
  Typography,
  Button,
  TextField,
  Table,
  TableBody,
  TableRow,
  TableCell,
} from "@material-ui/core";
import HomeIcon from "@material-ui/icons/Home";
import { consumerFirebase } from "../../server";
import { openMensajePantalla } from "../../sesion/actions/snackBarAction";
import ImageUploader from "react-images-upload";
import { v4 as uuidv4 } from "uuid";
import {crearKeyword} from '../../sesion/actions/keyWords'

const style = {
  container: {
    paddingTop: "8px",
  },
  paper: {
    marginTop: 8,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "20px",
    backgroundColor: "#f5f5f5",
  },
  link: {
    display: "flex",
  },
  homeIcon: {
    width: 20,
    height: 20,
    marginRight: "4px",
  },
  submit: {
    marginTop: 15,
    marginBottom: 10,
  },
  foto: {
    height: "100px",
  },
};

class NuevoInmueble extends Component {
  state = {
    inmueble: {
      direccion: "",
      ciudad: "",
      pais: "",
      descripcion: "",
      interior: "",
      fotos: [],
      keywords: ''
    },
    archivos: [],
  };

  entraDatoEnEstado = (e) => {
    let inmueble_ = Object.assign(this.state.inmueble);
    inmueble_[e.target.name] = e.target.value;
    this.setState({
      inmueble: inmueble_,
    });
  };

  subirFotos = (documentos) => {
    Object.keys(documentos).forEach(function (key) {
      documentos[key].urlTemp = URL.createObjectURL(documentos[key]);
    });
    this.setState({
      archivos: this.state.archivos.concat(documentos),
    });
  };

  eliminarFoto = (nombreFoto) => () => {
    this.setState({
      archivos: this.state.archivos.filter((archivo) => {
        return archivo.name !== nombreFoto;
      }),
    });
  };

  guardarInmueble = () => {
    const { archivos, inmueble } = this.state;

    Object.keys(archivos).forEach(function (key) {
      let valorDinamico = Math.floor(new Date().getTime() / 1000);
      let nombre = archivos[key].name;
      let extension = nombre.split(".").pop();
      archivos[key].alias = (
        nombre.split(".")[0] +
        "_" +
        valorDinamico +
        "." +
        extension
      )
        .replace(/\s/g, "_")
        .toLowerCase();
    });

    const textoBusqueda = inmueble.direccion + " " + inmueble.ciudad + " " + inmueble.pais;
    let keywords = crearKeyword(textoBusqueda);

    this.props.firebase.guardarDocumentos(archivos).then((arregloUrls) => {
      inmueble.fotos = arregloUrls;
      inmueble.keywords = keywords;

      this.props.firebase.db
        .collection("Inmuebles")
        .add(inmueble)
        .then((success) => {
          this.props.history.push("/");
        })
        .catch((error) => {
          openMensajePantalla({
            open: true,
            mensaje: "Hubieron errores en el proceso",
          });
        });
    });
  };

  render() {
    let imagenKey = uuidv4();

    return (
      <Container style={style.container}>
        <Paper style={style.paper}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={8}>
              <Breadcrumbs aria-label="breadcrumb">
                <Link color="inherit" style={style.link} href="/">
                  <HomeIcon style={style.homeicon} />
                  Home
                </Link>
                <Typography color="textPrimary">Nuevo Inmueble</Typography>
              </Breadcrumbs>
            </Grid>
            <Grid item xs={12} sm={12}>
              <TextField
                name="direccion"
                label="Direccion del inmueble"
                fullWidth
                onChange={this.entraDatoEnEstado}
                value={this.state.inmueble.direccion}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="ciudad"
                label="Ciudad"
                fullWidth
                onChange={this.entraDatoEnEstado}
                value={this.state.inmueble.ciudad}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="pais"
                label="Pais"
                fullWidth
                onChange={this.entraDatoEnEstado}
                value={this.state.inmueble.pais}
              />
            </Grid>
            <Grid item xs={12} sm={12}>
              <TextField
                name="descripcion"
                label="Descripción"
                fullWidth
                multiline
                onChange={this.entraDatoEnEstado}
                value={this.state.inmueble.descripcion}
              />
            </Grid>
            <Grid item xs={12} sm={12}>
              <TextField
                name="interior"
                label="Interior del inmueble"
                fullWidth
                multiline
                onChange={this.entraDatoEnEstado}
                value={this.state.inmueble.interior}
              />
            </Grid>
            <Grid container justify="center">
              <Grid item xs={12} sm={6}>
                <ImageUploader
                  withIcon={true}
                  key={1000}
                  buttonText="Seleccione Imagenes"
                  onChange={this.subirFotos}
                  imgExtension={[".jpg", ".gif", ".png", ".jpeg"]}
                  maxFileSize={5242880}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Table>
                  <TableBody>
                    {this.state.archivos.map((elemento, i) => {
                      return (
                        <TableRow key={i}>
                          <TableCell align="left">
                            <img src={elemento.urlTemp} style={style.foto} />
                          </TableCell>
                          <TableCell aling="center">
                            <Button
                              variant="contained"
                              color="secondary"
                              size="small"
                              onClick={this.eliminarFoto(elemento.name)}
                            >
                              Eliminar
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </Grid>
            </Grid>
          </Grid>
          <Grid container justify="center">
            <Grid item xs={12} sm={6}>
              <Button
                type="button"
                fullWidth
                variant="contained"
                size="large"
                color="primary"
                style={style.submit}
                onClick={this.guardarInmueble}
              >
                Guardar
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    );
  }
}

export default consumerFirebase(NuevoInmueble);
