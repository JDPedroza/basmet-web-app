import React, { Component } from "react";
import { consumerFirebase } from "../../server";
import {
  Container,
  Paper,
  Grid,
  Breadcrumbs,
  Link,
  Typography,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@material-ui/core";
import HomeIcon from "@material-ui/icons/Home";
import ImageUploader from "react-images-upload";
import { v4 as uuidv4 } from "uuid";
import { crearKeyword } from "../../sesion/actions/keyWords";

const style = {
  container: {
    paddingTop: "8px",
  },
  paper: {
    marginTop: 8,
    display: "flex",
    flexDirection: "column",
    alingItems: "center",
    padding: "20px",
    backgroundColor: "#f5f5f5",
  },
  link: {
    padding: "20px",
    backgroundColor: "#f5f5f5",
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

class EditarInmuebles extends Component {
  state = {
    inmueble: {
      direccion: "",
      ciudad: "",
      pais: "",
      descripcion: "",
      interior: "",
      fotos: [],
    },
  };

  cambiarDato = (e) => {
    let inmueble = Object.assign({}, this.state.inmueble);
    inmueble[e.target.name] = e.target.value;
    this.setState({ inmueble });
  };

  subirImagenes = (imagenes) => {
    const { inmueble } = this.state;
    const { id } = this.props.match.params;

    Object.keys(imagenes).forEach((key) => {
      let codigoDinamico = uuidv4();
      let nombreImagen = imagenes[key].name;
      let extensionImagen = nombreImagen.split(".").pop();
      imagenes[key].alias = (
        nombreImagen.split(".")[0] +
        "_" +
        codigoDinamico +
        "." +
        extensionImagen
      )
        .replace(/\s/g, "_ ")
        .toLowerCase();
    });

    this.props.firebase.guardarDocumentos(imagenes).then((urlImagenes) => {
      inmueble.fotos = inmueble.fotos.concat(urlImagenes);
      this.props.firebase.db
        .collection("Inmuebles")
        .doc(id)
        .set(inmueble, { merge: true })
        .then((success) => {
          this.setState({
            inmueble,
          });
        });
    });
  };

  eliminarFoto = (fotoUrl) => async () => {
    const { inmueble } = this.state;
    const { id } = this.props.match.params;

    let fotoID = fotoUrl.match(/[\w-]+.(jpg|png|jpeg|gif|svg)/);
    fotoID = fotoID[0];

    await this.props.firebase.eliminarDocumento(fotoID);

    let fotoList = this.state.inmueble.fotos.filter((foto) => {
      return foto !== fotoUrl;
    });

    inmueble.fotos = fotoList;

    this.props.firebase.db
      .collection("Inmuebles")
      .doc(id)
      .set(inmueble, { merge: true })
      .then((success) => {
        this.setState({
          inmueble,
        });
      });
  };

  async componentDidMount() {
    const { id } = this.props.match.params;
    const inmuebleCollection = this.props.firebase.db.collection("Inmuebles");
    const inmuebleDB = await inmuebleCollection.doc(id).get();

    this.setState({
      inmueble: inmuebleDB.data(),
    });
  }

  guardarInmueble = () => {
    const { id } = this.props.match.params;
    const { inmueble } = this.state;
    const textoBusqueda =
      inmueble.direccion + " " + inmueble.ciudad + " " + inmueble.pais;
    const keyWords = crearKeyword(textoBusqueda);
    inmueble.keyWords = keyWords;
    this.props.firebase.db
      .collection("Inmuebles")
      .doc(id)
      .set(inmueble, { merge: true })
      .then((success) => {
        this.props.history.push("/");
      });
  };

  render() {
    let imageId = uuidv4();

    return (
      <Container style={style.container}>
        <Paper style={style.paper}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Breadcrumbs aria-label="breadcrumbs">
                <Link color="inherit" style={style.link} href="/">
                  <HomeIcon style={style.homeIcon} />
                  Home
                </Link>
                <Typography color="textPrimary">Editar Inmueble</Typography>
              </Breadcrumbs>
            </Grid>
            <Grid item xs={12} sm={12}>
              <TextField
                name="direccion"
                label="Direccion del inmueble"
                fullWidth
                onChange={this.cambiarDato}
                value={this.state.inmueble.direccion}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="ciudad"
                label="Ciudad"
                fullWidth
                onChange={this.cambiarDato}
                value={this.state.inmueble.ciudad}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="pais"
                label="Pais"
                fullWidth
                onChange={this.cambiarDato}
                value={this.state.inmueble.pais}
              />
            </Grid>
            <Grid item xs={12} sm={12}>
              <TextField
                name="descripcion"
                label="Descripcion"
                fullWidth
                multiline
                rowsMax="4"
                onChange={this.cambiarDato}
                value={this.state.inmueble.descripcion}
              />
            </Grid>
            <Grid item xs={12} sm={12}>
              <TextField
                name="interior"
                label="Interior"
                fullWidth
                rowsMax="4"
                multiline
                onChange={this.cambiarDato}
                value={this.state.inmueble.interior}
              />
            </Grid>
          </Grid>
          <Grid container justify="center">
            <Grid item xs={12} sm={6}>
              <ImageUploader
                withIcon={true}
                key={imageId}
                singleImage={true}
                buttonText="Seleccione su imagen"
                onChange={this.subirImagenes}
                imgExtension={[".jpg", ".gif", ".png", ".jpeg"]}
                maxFileSize={5242880}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Table>
                <TableBody>
                  {this.state.inmueble.fotos
                    ? this.state.inmueble.fotos.map((foto, i) => {
                        return (
                          <TableRow key={i}>
                            <TableCell align="left">
                              <img src={foto} style={style.foto} />
                            </TableCell>
                            <TableCell aling="center">
                              <Button
                                variant="contained"
                                color="secondary"
                                size="small"
                                onClick={this.eliminarFoto(foto)}
                              >
                                Eliminar
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    : ""}
                </TableBody>
              </Table>
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
                Guardar Cambios
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    );
  }
}

export default consumerFirebase(EditarInmuebles);
