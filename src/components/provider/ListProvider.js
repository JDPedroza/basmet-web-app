import React, { useEffect, useState } from "react";

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

//icons
import EditIcon from "@material-ui/icons/Edit";
import HomeIcon from "@material-ui/icons/Home";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";

//utils
import { consumerFirebase } from "../../server";
import PropTypes from "prop-types";

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
  const { row, query, type } = props;
  const [open, setOpen] = React.useState(false);

  return (
    <React.Fragment>
      <TableRow>
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
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={12}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <Typography variant="h6" gutterBottom component="div">
                Ultima Compra
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>Numero Factura</TableCell>
                    <TableCell>Fecha</TableCell>
                    <TableCell>Numero Elementos</TableCell>
                    <TableCell align="right">Sub Total</TableCell>
                    <TableCell align="right">Total</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.last_bill.map((last_bill) => (
                    <TableRow key={last_bill.date}>
                      <TableCell component="th" scope="row">
                        {last_bill.nid}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {last_bill.date}
                      </TableCell>
                      <TableCell>{last_bill.items}</TableCell>
                      <TableCell align="right">{last_bill.sub_total}</TableCell>
                      <TableCell align="right">{last_bill.total}</TableCell>
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
    nid: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    address: PropTypes.string.isRequired,
    city: PropTypes.string.isRequired,
    phone: PropTypes.number.isRequired,
    email: PropTypes.string.isRequired,
    last_bill: PropTypes.arrayOf(
      PropTypes.shape({
        date: PropTypes.string.isRequired,
        items: PropTypes.number.isRequired,
        sub_total: PropTypes.number.isRequired,
        total: PropTypes.number.isRequired,
      })
    ).isRequired,
  }).isRequired,
};

const ListProviders = (props) => {
  const { type, query } = props.match.params;

  const [providers, setProviders] = useState([]);

  useEffect(async () => {
    let objectQuery;

    if (type === "all") {
      objectQuery = props.firebase.db.collection("Providers").orderBy("nid");
    } else {
      objectQuery = props.firebase.db
        .collection("Providers")
        .where("type_provider", "==", type);
    }

    let jsonFormatProvider = {
      id: "",
      type_document: "",
      nid: 0,
      name: "",
      address: "",
      city: "",
      phone: 0,
      email: "",
      last_bill: [],
    };

    const snapshot = await objectQuery.get();

    let results = await Promise.all(
      snapshot.docs.map(async (doc) => {
        let data = doc.data();
        let id = doc.id;
        let jsonFormatLastBill = [
          { date: "2020-01-01", items: "0", sub_total: 0, total: 0 },
        ];

        let snapshotLastBill = {};
        if (data.last_bill !== "") {
          snapshotLastBill = await props.firebase.db
            .collection("BullBuy")
            .doc(data.last_bill)
            .get();

          let dataLastBill = snapshotLastBill.data();

          jsonFormatLastBill = [
            {
              nid: dataLastBill.nid,
              date: dataLastBill.date,
              items: dataLastBill.items.length,
              sub_total: dataLastBill.sub_total,
              total: dataLastBill.total,
            },
          ];
        }

        jsonFormatProvider = {
          ...jsonFormatProvider,
          id,
          type_document: data.type_document,
          nid: data.nid,
          name: data.business || data.contact_name,
          address: data.address,
          city: data.city,
          phone: data.phone || data.contact_phone,
          email: data.email || data.contact_email,
          nid_last_bill: data.last_bill,
          last_bill: jsonFormatLastBill,
        };

        return jsonFormatProvider;
      })
    );

    setProviders(results);
  }, []);

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
                <TableCell />
                <TableCell>Tipo Id</TableCell>
                <TableCell>Numero</TableCell>
                <TableCell>Nombre</TableCell>
                <TableCell>Dirección</TableCell>
                <TableCell>Telefono</TableCell>
                <TableCell>Correo</TableCell>
                {query === "modify" ? (
                  <TableCell/>
                ) : (
                  ""
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {providers.map((row) => (
                <Row key={row.name} row={row} type={type} query={query} />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Container>
  );
};

export default consumerFirebase(ListProviders);