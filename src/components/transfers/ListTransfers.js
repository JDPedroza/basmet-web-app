import React, { useEffect, useState, useCallback } from "react";

//icons
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
  const { row } = props;
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
        <TableCell style={{width:"15%"}}>{row.date}</TableCell>
        <TableCell>{row.point_operation_output}</TableCell>
        <TableCell>{row.point_operation_input}</TableCell>
      </TableRow>
      <TableRow key="titles">
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={12}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            {row.implements.length !== 0 ? (
              <Box margin={1}>
                <Typography variant="h6" gutterBottom component="div">
                  Implementos
                </Typography>
                <Table size="small" aria-label="purchases">
                  <TableHead>
                    <TableRow>
                      <TableCell>Descripción</TableCell>
                      <TableCell align="right">Cantidad</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {row.implements.map((element) => (
                      <TableRow key={element.description}>
                        <TableCell component="th" scope="row">
                          {element.description}
                        </TableCell>
                        <TableCell component="th" scope="row" style={{width:"20%"}} align="right">
                          {element.quantity}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            ) : (
              ""
            )}
            {row.items_packaging.length !== 0 ? (
              <Box margin={1}>
                <Typography variant="h6" gutterBottom component="div">
                  Productos en Embalaje
                </Typography>
                <Table size="small" aria-label="purchases">
                  <TableHead>
                    <TableRow>
                      <TableCell>Descripción</TableCell>
                      <TableCell align="right">Cantidad</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {row.items_packaging.map((element) => (
                      <TableRow key={element.description}>
                        <TableCell component="th" scope="row">
                          {element.description}
                        </TableCell>
                        <TableCell component="th" scope="row" style={{width:"20%"}} align="right">
                          {element.quantity}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            ) : (
              ""
            )}
            {row.items_process.length !== 0 ? (
              <Box margin={1}>
                <Typography variant="h6" gutterBottom component="div">
                  Productos en Proceso
                </Typography>
                <Table size="small" aria-label="purchases">
                  <TableHead>
                    <TableRow>
                      <TableCell>Descripción</TableCell>
                      <TableCell align="right">Cantidad</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {row.items_process.map((element) => (
                      <TableRow key={element.description}>
                        <TableCell component="th" scope="row">
                          {element.description}
                        </TableCell>
                        <TableCell component="th" scope="row" style={{width:"20%"}} align="right">
                          {element.quantity}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            ) : (
              ""
            )}
            {row.raw_materials.length !== 0 ? (
              <Box margin={1}>
                <Typography variant="h6" gutterBottom component="div">
                  Materia Prima
                </Typography>
                <Table size="small" aria-label="purchases">
                  <TableHead>
                    <TableRow>
                      <TableCell>Descripción</TableCell>
                      <TableCell align="right">Cantidad</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {row.raw_materials.map((element) => (
                      <TableRow key={element.description}>
                        <TableCell component="th" scope="row">
                          {element.description}
                        </TableCell>
                        <TableCell component="th" scope="row" style={{width:"20%"}} align="right">
                          {element.quantity}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            ) : (
              ""
            )}
            {row.supplies.length !== 0 ? (
              <Box margin={1}>
                <Typography variant="h6" gutterBottom component="div">
                  Insumos
                </Typography>
                <Table size="small" aria-label="purchases">
                  <TableHead>
                    <TableRow>
                      <TableCell>Descripción</TableCell>
                      <TableCell align="right">Cantidad</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {row.supplies.map((element) => (
                      <TableRow key={element.description}>
                        <TableCell component="th" scope="row">
                          {element.description}
                        </TableCell>
                        <TableCell component="th" scope="row" style={{width:"20%"}} align="right">
                          {element.quantity}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            ) : (
              ""
            )}
            {row.tools_equipment.length !== 0 ? (
              <Box margin={1}>
                <Typography variant="h6" gutterBottom component="div">
                  Herramientas y Equipos
                </Typography>
                <Table size="small" aria-label="purchases">
                  <TableHead>
                    <TableRow>
                      <TableCell>Descripción</TableCell>
                      <TableCell align="right">Cantidad</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {row.tools_equipment.map((element) => (
                      <TableRow key={element.description}>
                        <TableCell component="th" scope="row">
                          {element.description}
                        </TableCell>
                        <TableCell component="th" scope="row" style={{width:"20%"}} align="right">
                          {element.quantity}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            ) : (
              ""
            )}
            <Box margin={1}>
              <Typography variant="h6" gutterBottom component="div">
                Personal Responsable
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>Persona a cargo (Salida)</TableCell>
                    <TableCell>Persona a cargo (Entrada)</TableCell>
                    <TableCell>Vehiculo</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.extra_data.map((extra) => (
                    <TableRow key={extra.description}>
                      <TableCell component="th" scope="row">
                        {extra.employee_responsible_output}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {extra.employee_responsible_input}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {extra.vehicle}
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
    point_operation_input: PropTypes.string.isRequired,
    point_operation_output: PropTypes.string.isRequired,
    implements: PropTypes.arrayOf(
      PropTypes.shape({
        description: PropTypes.string.isRequired,
        quantity: PropTypes.string.isRequired,
      })
    ).isRequired,
    items_packaging: PropTypes.arrayOf(
      PropTypes.shape({
        description: PropTypes.string.isRequired,
        quantity: PropTypes.string.isRequired,
      })
    ).isRequired,
    items_process: PropTypes.arrayOf(
      PropTypes.shape({
        description: PropTypes.string.isRequired,
        quantity: PropTypes.string.isRequired,
      })
    ).isRequired,
    raw_materials: PropTypes.arrayOf(
      PropTypes.shape({
        description: PropTypes.string.isRequired,
        quantity: PropTypes.string.isRequired,
      })
    ).isRequired,
    supplies: PropTypes.arrayOf(
      PropTypes.shape({
        description: PropTypes.string.isRequired,
        quantity: PropTypes.string.isRequired,
      })
    ).isRequired,
    tools_equipment: PropTypes.arrayOf(
      PropTypes.shape({
        description: PropTypes.string.isRequired,
        quantity: PropTypes.string.isRequired,
      })
    ).isRequired,
    extra_data: PropTypes.arrayOf(
      PropTypes.shape({
        employee_responsible_output: PropTypes.string.isRequired,
        employee_responsible_output: PropTypes.string.isRequired,
        vehicle: PropTypes.string.isRequired,
      })
    ).isRequired,
  }).isRequired,
};

const ListTransfers = (props) => {
  const [transfers, setTransfers] = useState([]);

  const fetchMyAPI = useCallback(async () => {
    let jsonFormatTransfer = {
      point_operation_output: "",
      point_operation_input: "",
      implements: [],
      items_packaging: [],
      items_process: [],
      raw_materials: [],
      supplies: [],
      tools_equipment: [],
      extra_data: [],
      date:"",
    };

    const snapshotTransfer = await props.firebase.db
      .collection("Transfers")
      .orderBy("date")
      .get();

    let results = await Promise.all(
      snapshotTransfer.docs.map(async (doc) => {
        let data = doc.data();
        let id = doc.id;

        let arrayJsonExtraData = [
          {
            employee_responsible_output: data.employee_responsible_output,
            employee_responsible_input: data.employee_responsible_input,
            vehicle: data.vehicle,
          },
        ];

        jsonFormatTransfer = {
          id,
          point_operation_output: data.point_operation_output,
          point_operation_input: data.point_operation_input,
          implements: data.transfer_elements.implements,
          items_packaging: data.transfer_elements.items_packaging,
          items_process: data.transfer_elements.items_process,
          raw_materials: data.transfer_elements.raw_materials,
          supplies: data.transfer_elements.supplies,
          tools_equipment: data.transfer_elements.tools_equipment,
          extra_data: arrayJsonExtraData,
          date:  data.date,
        };

        return jsonFormatTransfer;
      })
    );
    setTransfers(results);
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
            <Typography color="textPrimary">Traslados</Typography>
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
                <TableCell>Fecha</TableCell>
                <TableCell>Punto de operación (Salida)</TableCell>
                <TableCell>Punto de operación (Entrada)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {transfers.map((row) => (
                <Row key={row.id} row={row} />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Container>
  );
};

export default consumerFirebase(ListTransfers);