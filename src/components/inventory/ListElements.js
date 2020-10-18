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
import React, { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import { consumerFirebase } from "../../server";

//icons
import HomeIcon from "@material-ui/icons/Home";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import VisibilityIcon from "@material-ui/icons/Visibility";
import EditIcon from '@material-ui/icons/Edit';

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
  const { row, query, table } = props;
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
        {query === "modify" ? (
          <TableCell>
            <IconButton
              aria-label="Editar Elemento"
              href={`/inventarios/editar/${table}/${row.nid}`}
            >
              <EditIcon />
            </IconButton>
          </TableCell>
        ) : (
          ""
        )}
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
                    <TableCell>Usuario</TableCell>
                    <TableCell />
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.last_modify.map((data) => (
                    <TableRow key={`${row.title}_data_last_modify`}>
                      <TableCell>{data.type}</TableCell>
                      <TableCell>{data.date}</TableCell>
                      <TableCell>{data.user}</TableCell>
                      <TableCell>
                        <IconButton
                          aria-label="Ver Reporte"
                          href={`/reportes/mostrar/${data.nid}`}
                        >
                          <VisibilityIcon />
                        </IconButton>
                      </TableCell>
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
                    <TableCell>#</TableCell>
                    <TableCell>Nombre</TableCell>
                    <TableCell>Telefono</TableCell>
                    <TableCell>Correo</TableCell>
                    <TableCell />
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.providers.map((provider) => (
                    <TableRow key={`${row.title}_data_providers`}>
                      <TableCell>{provider.nid}</TableCell>
                      <TableCell>{provider.name}</TableCell>
                      <TableCell>{provider.phone}</TableCell>
                      <TableCell>{provider.email}</TableCell>
                      <TableCell align="right">
                        <IconButton
                          aria-label="Ver proveedor"
                          href={`/proveedor/editar/${provider.id}`}
                        >
                          <VisibilityIcon />
                        </IconButton>
                      </TableCell>
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
                Distribución de elementos
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow key={`${row.title}_titles_distributions`}>
                    <TableCell style={{ width: "70%" }}>
                      Punto de operación
                    </TableCell>
                    <TableCell style={{ width: "30%" }} align="right">
                      Cantidad
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.distributions.map((distribution) => (
                    <TableRow key={`${row.title}_data_distributions`}>
                      <TableCell>{distribution.name}</TableCell>
                      <TableCell align="right">
                        {distribution.quantity}
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
    nid: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    quantity: PropTypes.string.isRequired,
    last_modify: PropTypes.arrayOf(
      PropTypes.shape({
        type: PropTypes.string.isRequired,
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
    distributions: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        quantity: PropTypes.string.isRequired,
      })
    ).isRequired,
  }).isRequired,
};

const ListElements = (props) => {
  const { table, query } = props.match.params;

  const [dataElements, setDataElements] = useState([]);

  const fetchMyAPI = useCallback(async () => {
    let doc = "";

    if (table === "materia_prima") {
      doc = "RawMaterials";
    } else if (table === "herramientas_y_equipos") {
      doc = "ToolsEquipment";
    } else if (table === "insumos") {
      doc = "Supplies";
    } else if (table === "productos_en_proceso") {
      doc = "ItemsProcess";
    } else if (table === "productos_en_embalaje") {
      doc = "ItemsPackaging";
    } else if (table === "implementos"){
      doc = "Implements"
    }

    const data = await props.firebase.db
      .collection("Inventories")
      .doc(doc)
      .get();

    let dataElements = data.data();

    let results = await Promise.all(
      dataElements.elements.map(async (element) => {
        console.log(element);

        let jsonFormatElements = {
          nid: element.nid,
          title: element.title,
          quantity: element.quantity,
          last_modify: [],
          providers: [],
          distributions: element.distributions,
        };

        //generamos el array con los datos de last_modify
        let snapshotLastModify = await props.firebase.db
          .collection("Reports")
          .doc(element.last_modify)
          .get();

        let dataLastModify = snapshotLastModify.data();

        //lo agregamos al array
        let arrayLastModify = [
          {
            nid: element.last_modify,
            type: dataLastModify.type,
            date: dataLastModify.date,
            user: `${dataLastModify.user.nombre} ${dataLastModify.user.apellido}`,
          },
        ];
        jsonFormatElements.last_modify = arrayLastModify;

        //generamos el array con los datos de los proveedores:
        if (element.providers.length !== 0) {
        }
        let arrayProviders = await Promise.all(
          element.providers.map(async (provider) => {
            let snapshotProviders = await props.firebase.db
              .collection("Providers")
              .doc(provider)
              .get();

            let dataProvider = snapshotProviders.data();

            //agregamos el json al array
            return {
              id: provider,
              nid: dataProvider.nid,
              name: dataProvider.business || dataProvider.contact_name,
              phone: dataProvider.phone || dataProvider.contact_phone,
              email: dataProvider.email || dataProvider.contact_email,
            };
          })
        );

        jsonFormatElements.providers = arrayProviders;

        return jsonFormatElements;
      })
    );

    setDataElements(results);
  }, []);

  useEffect(() => {
    fetchMyAPI();
  }, [fetchMyAPI]);

  return (
    <Container component="main" maxWidth="md" justify="center">
      <Paper style={style.paper}>
        <Grid item xs={12} sm={12}>
          <Breadcrumbs aria-label="breadcrumbs">
            <Link color="inherit" style={style.link} href="/">
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
                <TableCell style={{ width: "5%" }}></TableCell>
                <TableCell style={{ width: "70%" }} align="left">
                  Descripción
                </TableCell>
                <TableCell style={{ width: "25%" }} align="right">
                  Cantidad Stock
                </TableCell>
                {query === "modify" ? <TableCell /> : ""}
              </TableRow>
            </TableHead>
            <TableBody>
              {dataElements.map((row) => (
                <Row key={row.title} row={row} query={query} table={table} />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Container>
  );
};

export default consumerFirebase(ListElements);
