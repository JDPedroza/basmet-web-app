import React, { useEffect, useState, useCallback } from "react";

//icons
import EditIcon from "@material-ui/icons/Edit";
import HomeIcon from "@material-ui/icons/Home";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import CancelIcon from "@material-ui/icons/Cancel";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";

import iconInventario from "../main/images/icon_inventario.png";
import iconProcess from "../main/images/icon_process.png";
import iconClient from "../main/images/icon_clients.png";
import iconPuntoOperacion from "../main/images/icon_puntosOperacion.png";
import iconEmployees from "../main/images/icon_empleado.png";
import iconTransfers from "../main/images/icon_translados.png";
import iconProviders from "../main/images/icon_proveedores.png";
import iconUsers from "../main/images/icon_usuarios.png";
import iconVehicles from "../main/images/icon_vehicles.png";

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
  Avatar,
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
  icons: {
    width: "10px",
    height: "10px",
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
        <TableCell>{row.name}</TableCell>
        <TableCell>{row.phone}</TableCell>
        <TableCell>{row.email}</TableCell>
        {query === "modify" ? (
          <TableCell allgn="center">
            <IconButton aria-label="edit" href={`/usuarios/editar/${row.id}`}>
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
                Acceso a Modulos
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <Avatar
                        src={iconInventario}
                        style={style.icon}
                        variant="square"
                      />
                    </TableCell>
                    <TableCell>
                      <Avatar
                        src={iconProcess}
                        style={style.icon}
                        variant="square"
                      />
                    </TableCell>
                    <TableCell>
                      <Avatar
                        src={iconClient}
                        style={style.icon}
                        variant="square"
                      />
                    </TableCell>
                    <TableCell>
                      <Avatar
                        src={iconPuntoOperacion}
                        style={style.icon}
                        variant="square"
                      />
                    </TableCell>
                    <TableCell>
                      <Avatar
                        src={iconEmployees}
                        style={style.icon}
                        variant="square"
                      />
                    </TableCell>
                    <TableCell>
                      <Avatar
                        src={iconTransfers}
                        style={style.icon}
                        variant="square"
                      />
                    </TableCell>
                    <TableCell>
                      <Avatar
                        src={iconProviders}
                        style={style.icon}
                        variant="square"
                      />
                    </TableCell>
                    <TableCell>
                      <Avatar
                        src={iconUsers}
                        style={style.icon}
                        variant="square"
                      />
                    </TableCell>
                    <TableCell>
                      <Avatar
                        src={iconVehicles}
                        style={style.icon}
                        variant="square"
                      />
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell component="th" scope="row" style={{alignContent:"center"}}>
                      {row.modules.inventories ? (
                        <CheckCircleIcon style={{ color: "#89ff89" }} />
                      ) : (
                        <CancelIcon style={{ color: "#ff8989" }} />
                      )}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {row.modules.process ? (
                        <CheckCircleIcon style={{ color: "#89ff89" }} />
                      ) : (
                        <CancelIcon style={{ color: "#ff8989" }} />
                      )}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {row.modules.clients ? (
                        <CheckCircleIcon style={{ color: "#89ff89" }} />
                      ) : (
                        <CancelIcon style={{ color: "#ff8989" }} />
                      )}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {row.modules.points_operation ? (
                        <CheckCircleIcon style={{ color: "#89ff89" }} />
                      ) : (
                        <CancelIcon style={{ color: "#ff8989" }} />
                      )}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {row.modules.employees ? (
                        <CheckCircleIcon style={{ color: "#89ff89" }} />
                      ) : (
                        <CancelIcon style={{ color: "#ff8989" }} />
                      )}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {row.modules.transfers ? (
                        <CheckCircleIcon style={{ color: "#89ff89" }} />
                      ) : (
                        <CancelIcon style={{ color: "#ff8989" }} />
                      )}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {row.modules.providers ? (
                        <CheckCircleIcon style={{ color: "#89ff89" }} />
                      ) : (
                        <CancelIcon style={{ color: "#ff8989" }} />
                      )}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {row.modules.users ? (
                        <CheckCircleIcon style={{ color: "#89ff89" }} />
                      ) : (
                        <CancelIcon style={{ color: "#ff8989" }} />
                      )}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {row.modules.vehicles ? (
                        <CheckCircleIcon style={{ color: "#89ff89" }} />
                      ) : (
                        <CancelIcon style={{ color: "#ff8989" }} />
                      )}
                    </TableCell>
                  </TableRow>
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
    name: PropTypes.string.isRequired,
    phone: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    modules: PropTypes.shape({
      inventories: PropTypes.bool.isRequired,
      process: PropTypes.bool.isRequired,
      clients: PropTypes.bool.isRequired,
      points_operation: PropTypes.bool.isRequired,
      employees: PropTypes.bool.isRequired,
      transfers: PropTypes.bool.isRequired,
      providers: PropTypes.bool.isRequired,
      users: PropTypes.bool.isRequired,
      vehicles: PropTypes.bool.isRequired,
    }),
  }).isRequired,
};

const ListUsers = (props) => {
  const { query } = props.match.params;

  const [users, setUsers] = useState([]);

  const fetchMyAPI = useCallback(async () => {
    const snapshotUsers = await props.firebase.db
      .collection("Users")
      .orderBy("nombre")
      .get();

    let results = await Promise.all(
      snapshotUsers.docs.map(async (doc) => {
        let data = doc.data();
        let id = doc.id;

        let snapshotEmployee = await props.firebase.db
          .collection("Employees")
          .doc(data.nid_employee)
          .get();

        let dataEmployee = snapshotEmployee.data();

        let jsonModules = {
          inventories: data.inventories,
          process: data.process,
          clients: data.clients,
          points_operation: data.points_operation,
          employees: data.employees,
          transfers: data.transfers,
          providers: data.providers,
          users: data.users,
          vehicles: data.vehicles,
        };
        return {
          id,
          name: `${dataEmployee.name} ${dataEmployee.lastname}`,
          email: dataEmployee.email,
          phone: dataEmployee.phone,
          modules: jsonModules,
        };
      })
    );

    console.log("result:", results)

    setUsers(results);
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
            <Typography color="textPrimary">Usuarios</Typography>
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
                <TableCell>Nombre</TableCell>
                <TableCell>Telefono</TableCell>
                <TableCell>Correo</TableCell>
                {query === "modify" ? <TableCell /> : ""}
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((row) => (
                <Row key={row.name} row={row} query={query}/>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Container>
  );
};

export default consumerFirebase(ListUsers);
