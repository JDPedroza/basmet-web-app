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

  const top100Films = [
    { title: 'The Shawshank Redemption', year: 1994 },
    { title: 'The Godfather', year: 1972 },
    { title: 'The Godfather: Part II', year: 1974 },
    { title: 'The Dark Knight', year: 2008 },
    { title: '12 Angry Men', year: 1957 },
    { title: "Schindler's List", year: 1993 },
    { title: 'Pulp Fiction', year: 1994 },
    { title: 'The Lord of the Rings: The Return of the King', year: 2003 },
    { title: 'The Good, the Bad and the Ugly', year: 1966 },
    { title: 'Fight Club', year: 1999 },
    { title: 'The Lord of the Rings: The Fellowship of the Ring', year: 2001 },
    { title: 'Star Wars: Episode V - The Empire Strikes Back', year: 1980 },
    { title: 'Forrest Gump', year: 1994 },
    { title: 'Inception', year: 2010 },
    { title: 'The Lord of the Rings: The Two Towers', year: 2002 },
    { title: "One Flew Over the Cuckoo's Nest", year: 1975 },
    { title: 'Goodfellas', year: 1990 },
    { title: 'The Matrix', year: 1999 },
    { title: 'Seven Samurai', year: 1954 },
    { title: 'Star Wars: Episode IV - A New Hope', year: 1977 },
    { title: 'City of God', year: 2002 },
    { title: 'Se7en', year: 1995 },
    { title: 'The Silence of the Lambs', year: 1991 },
    { title: "It's a Wonderful Life", year: 1946 },
    { title: 'Life Is Beautiful', year: 1997 },
    { title: 'The Usual Suspects', year: 1995 },
    { title: 'Léon: The Professional', year: 1994 },
    { title: 'Spirited Away', year: 2001 },
    { title: 'Saving Private Ryan', year: 1998 },
    { title: 'Once Upon a Time in the West', year: 1968 },
    { title: 'American History X', year: 1998 },
    { title: 'Interstellar', year: 2014 },
    { title: 'Casablanca', year: 1942 },
    { title: 'City Lights', year: 1931 },
    { title: 'Psycho', year: 1960 },
    { title: 'The Green Mile', year: 1999 },
    { title: 'The Intouchables', year: 2011 },
    { title: 'Modern Times', year: 1936 },
    { title: 'Raiders of the Lost Ark', year: 1981 },
    { title: 'Rear Window', year: 1954 },
    { title: 'The Pianist', year: 2002 },
    { title: 'The Departed', year: 2006 },
    { title: 'Terminator 2: Judgment Day', year: 1991 },
    { title: 'Back to the Future', year: 1985 },
    { title: 'Whiplash', year: 2014 },
    { title: 'Gladiator', year: 2000 },
    { title: 'Memento', year: 2000 },
    { title: 'The Prestige', year: 2006 },
    { title: 'The Lion King', year: 1994 },
    { title: 'Apocalypse Now', year: 1979 },
    { title: 'Alien', year: 1979 },
    { title: 'Sunset Boulevard', year: 1950 },
    { title: 'Dr. Strangelove or: How I Learned to Stop Worrying and Love the Bomb', year: 1964 },
    { title: 'The Great Dictator', year: 1940 },
    { title: 'Cinema Paradiso', year: 1988 },
    { title: 'The Lives of Others', year: 2006 },
    { title: 'Grave of the Fireflies', year: 1988 },
    { title: 'Paths of Glory', year: 1957 },
    { title: 'Django Unchained', year: 2012 },
    { title: 'The Shining', year: 1980 },
    { title: 'WALL·E', year: 2008 },
    { title: 'American Beauty', year: 1999 },
    { title: 'The Dark Knight Rises', year: 2012 },
    { title: 'Princess Mononoke', year: 1997 },
    { title: 'Aliens', year: 1986 },
    { title: 'Oldboy', year: 2003 },
    { title: 'Once Upon a Time in America', year: 1984 },
    { title: 'Witness for the Prosecution', year: 1957 },
    { title: 'Das Boot', year: 1981 },
    { title: 'Citizen Kane', year: 1941 },
    { title: 'North by Northwest', year: 1959 },
    { title: 'Vertigo', year: 1958 },
    { title: 'Star Wars: Episode VI - Return of the Jedi', year: 1983 },
    { title: 'Reservoir Dogs', year: 1992 },
    { title: 'Braveheart', year: 1995 },
    { title: 'M', year: 1931 },
    { title: 'Requiem for a Dream', year: 2000 },
    { title: 'Amélie', year: 2001 },
    { title: 'A Clockwork Orange', year: 1971 },
    { title: 'Like Stars on Earth', year: 2007 },
    { title: 'Taxi Driver', year: 1976 },
    { title: 'Lawrence of Arabia', year: 1962 },
    { title: 'Double Indemnity', year: 1944 },
    { title: 'Eternal Sunshine of the Spotless Mind', year: 2004 },
    { title: 'Amadeus', year: 1984 },
    { title: 'To Kill a Mockingbird', year: 1962 },
    { title: 'Toy Story 3', year: 2010 },
    { title: 'Logan', year: 2017 },
    { title: 'Full Metal Jacket', year: 1987 },
    { title: 'Dangal', year: 2016 },
    { title: 'The Sting', year: 1973 },
    { title: '2001: A Space Odyssey', year: 1968 },
    { title: "Singin' in the Rain", year: 1952 },
    { title: 'Toy Story', year: 1995 },
    { title: 'Bicycle Thieves', year: 1948 },
    { title: 'The Kid', year: 1921 },
    { title: 'Inglourious Basterds', year: 2009 },
    { title: 'Snatch', year: 2000 },
    { title: '3 Idiots', year: 2009 },
    { title: 'Monty Python and the Holy Grail', year: 1975 },
  ];

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
    nid_employees: "",
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
      raw_materials: [],
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

    const jsonFormatEmployeesPointOperation = {employees: []}
    let nidEmployeesPointOperation = "";

    //generar la lista de elementsProvider
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
    } else {
      openMensajePantalla(dispatch, {
        open: true,
        mensaje: "Se agrego el punto de operación",
      });
      props.history.push("/home");
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
      {type === "client" ? (
        <Paper style={style.paperForm}>
          <Grid container spacing={2} style={style.form}>
            <Grid item xs={12} md={12}>
              <Typography color="textPrimary">Datos Cliente</Typography>
            </Grid>
            <Grid item xs={12} md={12}>
              <Autocomplete
                id="select_clients"
                value={selectedClient}
                onChange={(event, newDataClient) => {
                  updateDataClient(newDataClient);
                  setSelectedClient(newDataClient);
                }}
                options={clients.data}
                getOptionLabel={(option) => option.name_client || option.business}
                renderInput={(params) => (
                  <TextField {...params} label="Nombre" variant="outlined" />
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
