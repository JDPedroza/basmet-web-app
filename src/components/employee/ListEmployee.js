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
  const { row, query, type} = props;
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
        {query === "modify" ? (
          <TableCell allgn="center">
            <IconButton aria-label="edit" href={type==="data"?`/empleado/edit/${row.id}`:`/empleados/edit/modify/assignment/${row.id}`}>
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
                Punto de Operación
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>Dirección</TableCell>
                    <TableCell>Telefóno</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.point_operation.map((point_operation) => (
                    <TableRow key={point_operation.date}>
                      <TableCell component="th" scope="row">
                        {`${point_operation.address}, ${point_operation.city} - ${point_operation.country}`}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {point_operation.phone}
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
    point_operation: PropTypes.arrayOf(
      PropTypes.shape({
        address: PropTypes.string.isRequired,
        city: PropTypes.number.isRequired,
        country: PropTypes.number.isRequired,
        phone: PropTypes.number.isRequired,
      })
    ).isRequired,
    inventories_employee: PropTypes.arrayOf(
      PropTypes.shape({
        implements: PropTypes.array.isRequired,
        tools_equipment: PropTypes.array.isRequired,
      })
    ).isRequired,
  }).isRequired,
};

const ListEmployee = (props) => {
  const { query, type } = props.match.params;
  const [employees, setEmployees] = useState([]);

  const fetchMyAPI = useCallback(async () => {
    let snapshotEmployee = await props.firebase.db
      .collection("Employees")
      .orderBy("nid")
      .get();

    let jsonFormatEmployee = {
      id: "",
      type_document: "",
      nid: "",
      name: "",
      address: "",
      city: "",
      phone: "",
      point_operation: [],
      inventories_employee: [],
    };

    let results = await Promise.all(
      snapshotEmployee.docs.map(async (doc) => {
        let data = doc.data();
        let id = doc.id;
        let jsonFormatInventoriesEmployee = [
          {
            implements: [],
            tools_equipment: [],
          },
        ];
        let snapshotInventoriesEmployee = {};
        if (data.inventories_employee !== "") {
          snapshotInventoriesEmployee = await props.firebase.db
            .collection("InventoriesEmployee")
            .doc(data.inventories_employee)
            .get();

          let dataInventoriesEmployee = snapshotInventoriesEmployee.data();

          jsonFormatInventoriesEmployee = [
            {
              implements: dataInventoriesEmployee.implements,
              tools_equipment: dataInventoriesEmployee.tools_equipment,
            },
          ];
        }

        let jsonFormatPointOperation = [
          {
            address: "",
            city: "",
            country: "",
            phone: "",
          },
        ];
        let snapshotPointOperation = {};
        if (data.points_operation !== "") {
          snapshotPointOperation = await props.firebase.db
            .collection("PointsOperation")
            .doc(data.points_operation)
            .get();

          let dataPointOperation = snapshotPointOperation.data();

          jsonFormatPointOperation = [
            {
              address: dataPointOperation.address,
              city: dataPointOperation.city,
              country: dataPointOperation.country,
              phone: dataPointOperation.phone,
            },
          ];
        }

        jsonFormatEmployee = {
          ...jsonFormatEmployee,
          id,
          type_document: data.type_document,
          nid: data.nid,
          name: `${data.name} ${data.lastname}`,
          address: data.address,
          city: data.city,
          phone: data.phone,
          point_operation: jsonFormatPointOperation,
          inventories_employee: jsonFormatInventoriesEmployee,
        };

        return jsonFormatEmployee;
      })
    );

    setEmployees(results);
    console.log(results)
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
            <Typography color="textPrimary">Empleados</Typography>
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
                <TableCell>Tipo Id</TableCell>
                <TableCell>Numero</TableCell>
                <TableCell>Nombre</TableCell>
                <TableCell>Dirección</TableCell>
                <TableCell>Telefono</TableCell>
                {query === "modify" ? <TableCell /> : ""}
              </TableRow>
            </TableHead>
            <TableBody>
              {employees.map((row) => (
                <Row key={row.name} row={row} query={query} type={type}/>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Container>
  );
};

export default consumerFirebase(ListEmployee);
