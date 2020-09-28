import {
  Breadcrumbs,
  Container,
  Grid,
  Link,
  Paper,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
  IconButton,
  Box,
  Collapse,
} from "@material-ui/core";

//utils
import React, { useState, useCallback } from "react";
import PropTypes from "prop-types";

//icons
import HomeIcon from "@material-ui/icons/Home";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";

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
  submit: {
    marginTop: 15,
    marginBottom: 20,
  },
  formControl: {
    margin: 1,
    minWidth: 120,
  },
};

function Row(props) {
  const { row, query } = props;
  const [open, setOpen] = React.useState(false);

  return (
    <React.Fragment>
      <TableRow key={row.title}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell align="left">{row.title}</TableCell>
        <TableCell align="right">{row.quantity}</TableCell>
      </TableRow>
      <TableRow key={`${row.title}_last_modify`}>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={12}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <Typography variant="h6" gutterBottom component="div">
                Ultima Modificación
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow key={`${row.title}_titles_last_modify`}>
                    <TableCell>Tipo</TableCell>
                    <TableCell>Fecha</TableCell>
                    <TableCell>Cantidad</TableCell>
                    <TableCell>Reporte</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.last_modify.map((data) => (
                    <TableRow key={`${row.title}_data_last_modify`}>
                      <TableCell>{data.type}</TableCell>
                      <TableCell>{data.quantity}</TableCell>
                      <TableCell>{data.report}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
      <TableRow key={`${row.title}_providers`}>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={12}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <Typography variant="h6" gutterBottom component="div">
                Proveedor(es)
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow key={`${row.title}_titles_providers`}>
                    <TableCell>Numero de Identificacion</TableCell>
                    <TableCell>Nombre</TableCell>
                    <TableCell>Numero de Contacto</TableCell>
                    <TableCell>Correo</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.providers.map((provider) => (
                    <TableRow key={`${row.title}_data_providers`}>
                      <TableCell>{provider.nid}</TableCell>
                      <TableCell>{provider.name}</TableCell>
                      <TableCell>{provider.phone}</TableCell>
                      <TableCell>{provider.email}</TableCell>
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
    title: PropTypes.string.isRequired,
    quantity: PropTypes.string.isRequired,
    last_modify: PropTypes.arrayOf(
      PropTypes.shape({
        type: PropTypes.string.isRequired,
        quantity: PropTypes.number.isRequired,
        date: PropTypes.string.isRequired,
        report: PropTypes.string.isRequired,
      })
    ).isRequired,
    providers: PropTypes.arrayOf(
      PropTypes.shape({
        nid: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        phone: PropTypes.string.isRequired,
        email: PropTypes.string.isRequired,
      })
    ).isRequired,
  }).isRequired,
};

const ListElements = (props) => {
  const { table, query } = props.match.params;
  let jsonFormatLastModify = [
    {
      type: "Agregar - Compra",
      quantity: 100,
      date: "01-01-2020",
      report: "0",
    },
  ];
  let jsonFormatProviders = [
    {
      nid: "4080408-8",
      name: "Ingacoples",
      phone: "3133413120",
      email: "ingacoples@gmail.com",
    },
  ];
  const [elements, setElements] = useState([
    {
      title: "Prueba Interna",
      quantity: "1000",
      last_modify: jsonFormatLastModify,
      providers: jsonFormatProviders,
    },
  ]);

  const fetchMyAPI = useCallback(async () => {
    let objectQuery;

    if (table === "materia_prima") {
      objectQuery = props.firebase.db
        .collection("RawMaterials")
        .doc("6Ti3WLE0cav83i0rYozs");
    } else if (table === "herramientas_y_equipos") {
      objectQuery = props.firebase.db
        .collection("ToolsEquipment")
        .doc("FV7JGTCXeZHBBNOMX7IZ");
    } else if (table === "insumos") {
      objectQuery = props.firebase.db
        .collection("Supplies")
        .doc("TdxeXYYQKxGxfF3dQIUe");
    } else if (table === "productos_en_proceso") {
      objectQuery = props.firebase.db
        .collection("ItemsProcess")
        .doc("dgjOVvXSWgYFDFtam24b");
    } else if (table === "productos_en_embalaje") {
      objectQuery = props.firebase.db
        .collection("ItemsPackaging")
        .doc("oEIoAzurdqPFJviRJBlx");
    }

    let jsonFormatElements = [];

    const snapshot = await objectQuery.get();

    let results = await Promise.all(
      snapshot.docs.map(async (doc) => {
        let data = doc.data();
        let id = doc.id;
        let jsonFormatLastBill = [
          {
            nid: "No disponible",
            date: "01-01-2020",
            items: "0",
            sub_total: 0,
            total: 0,
          },
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

        jsonFormatElements = {
          ...jsonFormatElements,
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

        return jsonFormatElements;
      })
    );

    //setProviders(results);
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
            <Typography color="textPrimary">Inventario</Typography>
            <Typography color="textPrimary">Mostrar</Typography>
            <Typography color="textPrimary">
              {table === "materia_prima"
                ? "Materia Prima"
                : table === "herramientas_y_equipos"
                ? "Herramientas y Equipos"
                : "Insumos"}
            </Typography>
          </Breadcrumbs>
        </Grid>
      </Paper>
      <Paper style={style.paperForm}>
        <TableContainer item xs={12} sm={12}>
          <Table aria-label="collapsible table">
            <TableHead>
              <TableRow>
                <TableCell style={{width:"5%"}}></TableCell>
                <TableCell style={{width:"70%"}} align="left">Descripción</TableCell>
                <TableCell style={{width:"25%"}} align="right">Cantidad Stock</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {elements.map((row) => (
                <Row key={row.title} row={row} query={query} />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Container>
  );
};

export default ListElements;
