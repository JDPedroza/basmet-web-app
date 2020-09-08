import React, { Component } from "react";
import {
  Container,
  Paper,
  Grid,
  Breadcrumbs,
  Link,
  Typography,
  TextField,
  CardMedia,
  Card,
  CardContent,
  CardActions,
  Button,
} from "@material-ui/core";
import HomeIcon from "@material-ui/icons/Home";
import { consumerFirebase } from "../../server";
import logo from "../../logo.svg";

const style = {
  cardGrid: {
    paddingTop: 8,
    paddingBottom: 8,
  },
  paper: {
    backgraundColor: "#f5f5ff",
    padding: "20px",
    minheight: 650,
  },
  link: {
    display: "flex",
  },
  gridTextField: {
    marginTop: "20px",
  },
  card: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
  },
  cardMedia: {
    paddingTop: "56.25%",
  },
  cardContent: {
    flexGrow: 1,
  },
};

class ListaInmobuebles extends Component {
  state = {
    inmuebles: [],
    textoBusqueda: "",
  };

  cambiarBusquedaTexto = (e) => {
    const self = this;
    self.setState({
      [e.target.name]: e.target.value,
    });

    if (self.state.typingTimeOut) {
      clearTimeout(self.state.typingTimeOut);
    }
    self.setState({
      name: e.target.value,
      typing: false,
      typingTimeOut: setTimeout((goTime) => {
        let objectQuery = this.props.firebase.db
          .collection("Inmuebles")
          .orderBy("direccion")
          .where(
            "keywords",
            "array-contains",
            self.state.textoBusqueda.toLowerCase()
          );
        if (self.state.textoBusqueda.trim() === "") {
          objectQuery = this.props.firebase.db
            .collection("Inmuebles")
            .orderBy("direccion");
        }
        objectQuery.get().then((snapshot) => {
          const arrayInmueble = snapshot.docs.map((doc) => {
            let data = doc.data();
            let id = doc.id;
            return { id, ...data };
          });
          console.log(arrayInmueble);
          this.setState({
            inmuebles: arrayInmueble,
          });
        });
      }, 500),
    });
  };

  async componentDidMount() {
    let objectQuery = this.props.firebase.db
      .collection("Inmuebles")
      .orderBy("direccion");

    const snapshot = await objectQuery.get();

    const arrayInmueble = snapshot.docs.map((doc) => {
      let data = doc.data();
      let id = doc.id;
      return { id, ...data };
    });

    this.setState({
      inmuebles: arrayInmueble,
    });
  }

  eliminarInmueble = (id) => {
    this.props.firebase.db
      .collection("Inmuebles")
      .doc(id)
      .delete()
      .then((success) => {
          this.eliminarInmuebleLista(id);
      });
  };

  eliminarInmuebleLista = (id) => {
    const inmuebleListaNueva = this.state.inmuebles.filter(
      (inmueble) => inmueble.id !== id
    );
    this.setState({
      inmuebles: inmuebleListaNueva,
    });
  };

  editarInmueble = (id) => {
    this.props.history.push("/inmueble/editar/"+id)
  };

  render() {
    return (
      <Container style={style.cardGrid}>
        <Paper style={style.paper}>
          <Grid item xs={12} sm={12}>
            <Breadcrumbs aria-label="breadcrumbs">
              <Link color="inherit" style={style.link} href="/">
                <HomeIcon />
                HOME
              </Link>
              <Typography color="textPrimary">Mis Inmuebles</Typography>
            </Breadcrumbs>
          </Grid>
          <Grid item xs={12} sm={6} style={style.gridTextField}>
            <TextField
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
              name="textoBusqueda"
              variant="outlined"
              label="Ingrese el inmueble a buscar"
              onChange={this.cambiarBusquedaTexto}
              value={this.state.textoBusqueda}
            />
          </Grid>
          <Grid item xs={12} sm={12} style={style.gridTextField}>
            <Grid container spacing={4}>
              {this.state.inmuebles.map((card) => {
                return (
                  <Grid item key={card.id} xs={12} sm={6} md={4}>
                    <Card style={style.card}>
                      <CardMedia
                        style={style.cardMedia}
                        image={
                          card.fotos
                            ? card.fotos[0]
                              ? card.fotos[0]
                              : logo
                            : logo
                        }
                        title="Mi inmueble"
                      />
                      <CardContent style={style.cardContent}>
                        <Typography gutterBottom variant="h5" component="h2">
                          {card.ciudad + ", " + card.pais}
                        </Typography>
                      </CardContent>
                      <CardActions>
                        <Button size="small" color="primary" onClick={()=>this.editarInmueble(card.id)}>
                          Editar
                        </Button>
                        <Button size="small" color="primary" onClick={()=>this.eliminarInmueble(card.id)}>
                          Eliminar
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          </Grid>
        </Paper>
      </Container>
    );
  }
}

export default consumerFirebase(ListaInmobuebles);
