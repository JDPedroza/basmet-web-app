import React, { useState, useEffect, useCallback } from "react";

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
import PropTypes from "prop-types";
import { consumerFirebase } from "../../server";

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
          {row.standardization_name}
        </TableCell>
        <TableCell>{row.quantity}</TableCell>
        <TableCell>{row.step===1?"EN PROCESO":"FINALIZADO"}</TableCell>
        <TableCell>{row.start_date}</TableCell>
        <TableCell>{row.finish_date || "NA"}</TableCell>
        {query === "modify" ? (
          <TableCell allgn="center">
            <IconButton
              disabled={row.step===2?true:false}
              aria-label="Actualizar"
              href={`/inventarios/editar/productos_en_proceso/${row.id}`}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </TableCell>
        ) : (
          ""
        )}
      </TableRow>
      <TableRow key="titles_point_operation">
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={12}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <Typography variant="h6" gutterBottom component="div">
                Datos extras:
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>Ubicación de proceso</TableCell>
                    <TableCell>Persona a cargo</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.extra_data.map((extra_data) => (
                    <TableRow key={extra_data.date}>
                      <TableCell component="th" scope="row">
                        {extra_data.point_operation}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {extra_data.employee_responsable}
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
    standardization_name: PropTypes.string.isRequired,
    quantity: PropTypes.string.isRequired,
    step: PropTypes.string.isRequired,
    start_date: PropTypes.string.isRequired,
    finish_date: PropTypes.string.isRequired,
    extra_data: PropTypes.arrayOf(
      PropTypes.shape({
        point_operation: PropTypes.string.isRequired,
        employee_responsable: PropTypes.number.isRequired,
      })
    ).isRequired,
  }).isRequired,
};

const ListElementsStandardized = (props) => {
  const { query } = props.match.params;
  const [processes, setProcesses] = useState([]);

  const fetchMyAPI = useCallback(async () => {
    let snapshotProcesses = await props.firebase.db
      .collection("Processes")
      .orderBy("standardization")
      .get();

    let results = await Promise.all(
      snapshotProcesses.docs.map(async (doc) => {
        let data = doc.data();
        let id = doc.id;

        let arrayFormatExtraData = [
          {
            point_operation: data.point_operation,
            employee_responsable: data.employee_responsable,
          },
        ];

        let jsonFormatProcess = {
          id,
          standardization_name: data.standardization_name,
          quantity: data.quantity,
          step: data.step,
          start_date: data.start_date,
          finish_date: data.finish_date,
          extra_data: arrayFormatExtraData,
        };

        return jsonFormatProcess;
      })
    );

    setProcesses(results);
    console.log(results);
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
            <Typography color="textPrimary">Procesos</Typography>
            <Typography color="textPrimary">Mostrar</Typography>
          </Breadcrumbs>
        </Grid>
      </Paper>
      <Paper style={style.form}>
        <TableContainer item xs={12} sm={12}>
          <Table aria-label="collapsible table">
            <TableHead>
              <TableRow>
                <TableCell></TableCell>
                <TableCell>Producto</TableCell>
                <TableCell>Cantidad</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell>Inicio</TableCell>
                <TableCell>Culminación</TableCell>
                {query === "modify" ? <TableCell /> : ""}
              </TableRow>
            </TableHead>
            <TableBody>
              {processes.map((row) => (
                <Row key={row.name} row={row} query={query} />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Container>
  );
};

export default consumerFirebase(ListElementsStandardized);
