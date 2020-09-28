import React, { useEffect, useState, useCallback } from "react";

//icons
import EditIcon from "@material-ui/icons/Edit";
import HomeIcon from "@material-ui/icons/Home";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";

//utils
import { consumerFirebase } from "../../server";
import PropTypes from "prop-types";

//diseño
import {
  Container,
  Paper,
  Grid,
  Breadcrumbs,
  Link,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  IconButton,
  Box,
  Collapse,
} from "@material-ui/core";

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
    form: {
      padding: "20px",
      marginTop: 2,
    },
    link: {
      display: "flex",
    },
  };

function Row(props) {
  const { row, query } = props;
  const [open, setOpen] = React.useState(false);

  return (
    <React.Fragment>
      <TableRow key={row.nid}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {row.type_document}
        </TableCell>
        <TableCell>{row.nid}</TableCell>
        <TableCell>{row.name}</TableCell>
        <TableCell>{row.address}</TableCell>
        <TableCell>{row.phone}</TableCell>
        <TableCell>{row.email}</TableCell>
        {query === "modify" ? (
          <TableCell allgn="center">
            <IconButton aria-label="edit" href={`/proveedor/editar/${row.id}`}>
              <EditIcon fontSize="small" />
            </IconButton>
          </TableCell>
        ) : (
          ""
        )}
      </TableRow>
      <TableRow key="titles">
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={12}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <Typography variant="h6" gutterBottom component="div">
                Puntos de operación
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>Dirección</TableCell>
                    <TableCell>Ver en detalle</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.points_operation.map((point_operation) => (
                    <TableRow key={point_operation.date}>
                      <TableCell component="th" scope="row">
                        {`${point_operation.address} - ${point_operation.city}, ${point_operation.country}`}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {point_operation.id}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

Row.propTypes = {
  row: PropTypes.shape({
    type_document: PropTypes.string.isRequired,
    nid: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    address: PropTypes.string.isRequired,
    city: PropTypes.string.isRequired,
    phone: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    points_operation: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        address: PropTypes.string.isRequired,
        city: PropTypes.string.isRequired,
        country: PropTypes.string.isRequired,
        phone: PropTypes.string.isRequired,
      })
    ).isRequired,
  }).isRequired,
};

const ListClients = (props) => {
  const { type, query } = props.match.params;

  const [clients, setClients] = useState([]);

  const fetchMyAPI = useCallback(async () => {
    let objectQuery;

    if (type === "all") {
      objectQuery = props.firebase.db.collection("Clients").orderBy("nid");
    } else {
      objectQuery = props.firebase.db
        .collection("Clients")
        .where("type_client", "==", type);
    }

    let jsonFormatClient = {
      id: "",
      type_document: "",
      nid: "",
      name: "",
      country: "",
      city: "",
      address: "",
      email: "",
      phone: "",
      points_operation: [],
      keywords: [],
    };

    const snapshot = await objectQuery.get();

    let results = await Promise.all(
      snapshot.docs.map(async (doc) => {
        let data = doc.data();
        let id = doc.id;
        let arrayPointsOperation = [];
        let jsonFormatPointsOperation = {
          id: "",
          address: "No Asignado",
          city: "",
          country: "",
          phone: "No ",
        };

        let snapshotPointsOperationClient = {};
        if (data.points_operation !== "") {
          for (let i = 0; i < data.points_operation.length; i++) {
            snapshotPointsOperationClient = await props.firebase.db
              .collection("PointsOperation")
              .doc(data.points_operation[i])
              .get();

            let dataPointsOperationClient = snapshotPointsOperationClient.data();

            jsonFormatPointsOperation = {
              id: dataPointsOperationClient.id,
              address: dataPointsOperationClient.nid,
              city: dataPointsOperationClient.date,
              country: dataPointsOperationClient.items.length,
              phone: dataPointsOperationClient.sub_total,
            };

            arrayPointsOperation.push(jsonFormatPointsOperation);
          }
        } else {
          arrayPointsOperation.push(jsonFormatPointsOperation);
        }

        jsonFormatClient = {
          ...jsonFormatClient,
          id,
          type_document: data.type_document,
          nid: data.nid,
          name: data.business || data.contact_name,
          address: data.address,
          city: data.city,
          country: data.countri,
          phone: data.phone || data.contact_phone,
          email: data.email || data.contact_email,
          points_operation: arrayPointsOperation,
        };

        return jsonFormatClient;
      })
    );

    setClients(results);
  }, []);

  useEffect(() => {
    fetchMyAPI();
  }, [fetchMyAPI]);

  return (
    <Container component="main" maxWidth="md" justify="center">
      <Paper style={style.paper}>
        <Grid item xs={12} sm={12}>
          <Breadcrumbs aria-label="breadcrumbs">
            <Link color="inherit" style={style.link} href="/home">
              <HomeIcon />
              Principal
            </Link>
            <Typography color="textPrimary">Proveedores</Typography>
            <Typography color="textPrimary">
              {type === "all"
                ? "Todos"
                : type === "business"
                ? "Empresa"
                : "Persona Natural"}
            </Typography>
          </Breadcrumbs>
        </Grid>
      </Paper>
      <Paper style={style.form}>
        <TableContainer item xs={12} sm={12}>
          <Table aria-label="collapsible table">
            <TableHead>
              <TableRow>
                <TableCell></TableCell>
                <TableCell>Tipo Id</TableCell>
                <TableCell>Numero</TableCell>
                <TableCell>Nombre</TableCell>
                <TableCell>Dirección</TableCell>
                <TableCell>Telefono</TableCell>
                <TableCell>Correo</TableCell>
                {query === "modify" ? <TableCell /> : ""}
              </TableRow>
            </TableHead>
            <TableBody>
              {clients.map((row) => (
                <Row key={row.name} row={row} type={type} query={query} />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Container>
  );
};

export default consumerFirebase(ListClients);
