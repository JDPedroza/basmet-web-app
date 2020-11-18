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
        <TableCell>{row.type}</TableCell>
        <TableCell>{row.plate}</TableCell>
        <TableCell>{row.model}</TableCell>
        <TableCell>{row.brand}</TableCell>
        <TableCell>{row.date_safe}</TableCell>
        <TableCell>{row.date_technomechanical}</TableCell>
        {query === "modify" ? (
          <TableCell allgn="center">
            <IconButton
              aria-label="edit"
              href={`/vehiculos/editar/${row.id}`}
            >
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
                Persona responsable
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>Nombre</TableCell>
                    <TableCell>Dirección</TableCell>
                    <TableCell>Telefono</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.data_employee_responsible.map((employee) => (
                    <TableRow key={employee.name}>
                      <TableCell component="th" scope="row">
                        {employee.name}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {employee.address}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {employee.phone}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
            <Box margin={1}>
              <Typography variant="h6" gutterBottom component="div">
                Traslados con el vehiculo
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.transfers_vehicle.map((transfers) => (
                    <TableRow key="1">
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
    id: PropTypes.string.isRequired,
    brand: PropTypes.string.isRequired,
    date_safe: PropTypes.string.isRequired,
    data_employee_responsible: PropTypes.arrayOf(
      PropTypes.shape({
          name: PropTypes.string.isRequired,
          phone: PropTypes.string.isRequired,
          address: PropTypes.string.isRequired,
        })
      ).isRequired,
    model: PropTypes.string.isRequired,
    plate: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    data_transfers_vehicle: PropTypes.arrayOf(
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

const ListVehicles = (props) => {
  const { query } = props.match.params;

  const [vehicles, setVehicles] = useState([]);

  const fetchMyAPI = useCallback(async () => {
    let jsonFormatVehicle = {
      id: "",
      brand: "",
      date_safe: "",
      date_technomechanical: "",
      data_data_: "",
      model: "",
      plate: "",
      type: "",
      data_transfers_vehicle: [],
    };

    const snapshotVehicles = await props.firebase.db
      .collection("Vehicles")
      .orderBy("plate")
      .get();

    let results = await Promise.all(
      snapshotVehicles.docs.map(async (doc) => {
        let data = doc.data();
        let id = doc.id;
        let arrayEmployeeResponsible = [];
        let arrayTrasfersVehicle = [];
        let jsonFormatTransfer = {
          id: "",
          address: "No Asignado",
          city: "",
          country: "",
          phone: "No",
        };

        let snapshotTransfer = {};
        if (data.transfers_vehicle.length !== 0) {
          for (let i = 0; i < data.transfers_vehicle.lengt.length; i++) {
            snapshotTransfer = await props.firebase.db
              .collection("Transfer")
              .doc(data.transfers_vehicle[i])
              .get();

            let dataTransfer = snapshotTransfer.data();

            jsonFormatTransfer = {
              id: dataTransfer.id,
              address: dataTransfer.address,
              city: dataTransfer.city,
              country: dataTransfer.country,
              phone: dataTransfer.phone,
            };

            arrayTrasfersVehicle.push(jsonFormatTransfer);
          }
        } else {
          arrayTrasfersVehicle.push(jsonFormatTransfer);
        }

        //generamos el arrayEmployeeResponsible
        let snapshotEmployee = await props.firebase.db.collection("Employees").doc(data.employee_responsible).get()
        let dataEmployee = snapshotEmployee.data()

        let jsonDataEmployee = {
          name: dataEmployee.name,
          phone: dataEmployee.phone,
          address: `${dataEmployee.address}, ${dataEmployee.city} - ${dataEmployee.country}`,
        }

        arrayEmployeeResponsible.push(jsonDataEmployee)

        jsonFormatVehicle = {
          ...jsonFormatVehicle,
          id,
          brand: data.brand,
          date_safe: data.date_safe,
          date_technomechanical: data.date_technomechanical,
          data_employee_responsible: arrayEmployeeResponsible,
          model: data.model,
          plate: data.plate,
          transfers_vehicle: data.transfers_vehicle,
          type: data.type,
          data_transfers_vehicle: arrayTrasfersVehicle,
        };

        return jsonFormatVehicle;
      })
    );
    setVehicles(results);
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
            <Typography color="textPrimary">Mostrar</Typography>
            <Typography color="textPrimary">Vehiculos</Typography>
          </Breadcrumbs>
        </Grid>
      </Paper>
      <Paper style={style.form}>
        <TableContainer item xs={12} sm={12}>
          <Table aria-label="collapsible table">
            <TableHead>
              <TableRow>
                <TableCell></TableCell>
                <TableCell>Tipo</TableCell>
                <TableCell>Placa</TableCell>
                <TableCell>Marca</TableCell>
                <TableCell>Modelo</TableCell>
                <TableCell>Seguro</TableCell>
                <TableCell>Tecnomecanica</TableCell>
                {query === "modify" ? <TableCell /> : ""}
              </TableRow>
            </TableHead>
            <TableBody>
              {vehicles.map((row) => (
                <Row key={row.name} row={row} query={query} />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Container>
  );
};

export default consumerFirebase(ListVehicles);
