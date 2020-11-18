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

const ShowElements = (props) => {
  const { title, arrayElements } = props;
  return (
    <div>
      <Typography variant="h6" gutterBottom component="div">
        {title}
      </Typography>
      <Table size="small" aria-label="purchases">
        <TableHead>
          <TableRow>
            <TableCell style={{ width: "70%" }}>Descripción</TableCell>
            <TableCell style={{ width: "30%" }} align="right">
              Cantidad
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {arrayElements.map((element) => (
            <TableRow key={`element_${element.nid}`}>
              <TableCell component="th" scope="row">
                {element.description}
              </TableCell>
              <TableCell component="th" scope="row" align="right">
                {element.quantity}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

function Row(props) {
  const { row, type, query } = props;
  const [open, setOpen] = React.useState(false);

  return type === row.type || type === "all" ? (
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
        <TableCell>{row.type === "internal" ? "Interno" : "Cliente"}</TableCell>
        <TableCell>{row.name}</TableCell>
        <TableCell>{row.phone}</TableCell>
        {query === "modify" ? (
          <TableCell allgn="center">
            <IconButton
              aria-label="edit"
              href={`/puntos_operacion/editar/${type}/${row.id}`}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </TableCell>
        ) : (
          ""
        )}
      </TableRow>
      <TableRow key="titles">
        <TableCell style={{ paddingBottom: 0, paddingTop: 0, backgroundColor:"#EAEDED" }} colSpan={12}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            {row.type === "client" ? (
              <Box margin={1}>
                <Typography variant="h6" gutterBottom component="div">
                  Datos del Cliente
                </Typography>
                <Table size="small" aria-label="purchases">
                  <TableHead>
                    <TableRow>
                      <TableCell style={{width:"35%"}}>Nombre</TableCell>
                      <TableCell style={{width:"45%"}}>Dirección</TableCell>
                      <TableCell style={{width:"20%"}}>Telefono</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {row.data_client.map((client) => (
                      <TableRow key={client.name}>
                        <TableCell component="th" scope="row">
                          {client.name}
                        </TableCell>
                        <TableCell component="th" scope="row">
                          {client.address}
                        </TableCell>
                        <TableCell component="th" scope="row">
                          {client.phone}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            ) : (
              ""
            )}
            {row.employees.length !== 0 ? (
              <Box margin={1}>
                <Typography variant="h6" gutterBottom component="div">
                  Empleados
                </Typography>
                <Table size="small" aria-label="purchases">
                  <TableHead>
                    <TableCell style={{width:"35%"}}>Nombre</TableCell>
                    <TableCell style={{width:"45%"}}>Dirección</TableCell>
                    <TableCell style={{width:"20%"}}>Telefono</TableCell>
                  </TableHead>
                  <TableBody>
                    {row.employees.map((employee) => (
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
            ) : (
              ""
            )}
            <Box margin={1}>
              {row.implements.length !== 0 ? (
                <ShowElements
                  title="Implementos"
                  arrayElements={row.implements}
                />
              ) : (
                ""
              )}
              {row.items_packaging.length !== 0 ? (
                <ShowElements
                  title="Elementos en Embalaje"
                  arrayElements={row.items_packaging}
                />
              ) : (
                ""
              )}
              {row.items_process.length !== 0 ? (
                <ShowElements
                title="Elementos en Proceso"
                arrayElements={row.items_process}
              />
              ) : (
                ""
              )}
              {row.raw_materials.length !== 0 ? (
                <ShowElements
                title="Materia Prima"
                arrayElements={row.raw_materials}
              />
              ) : (
                ""
              )}
              {row.supplies.length !== 0 ? (
                <ShowElements
                title="Insumos"
                arrayElements={row.supplies}
              />
              ) : (
                ""
              )}
              {row.tools_equipment.length !== 0 ? (
                <ShowElements
                title="Herramientas y Equipos"
                arrayElements={row.tools_equipment}
              />
              ) : (
                ""
              )}
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  ):""
  ;
}

Row.propTypes = {
  row: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    phone: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    data_client: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        phone: PropTypes.string.isRequired,
        address: PropTypes.string.isRequired,
      })
    ).isRequired,
    employees: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        phone: PropTypes.string.isRequired,
        address: PropTypes.string.isRequired,
      })
    ).isRequired,
    implements: PropTypes.arrayOf(
      PropTypes.shape({
        nid: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        quantity: PropTypes.string.isRequired,
      })
    ).isRequired,
    items_packaging: PropTypes.arrayOf(
      PropTypes.shape({
        nid: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        quantity: PropTypes.string.isRequired,
      })
    ).isRequired,
    items_process: PropTypes.arrayOf(
      PropTypes.shape({
        nid: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        quantity: PropTypes.string.isRequired,
      })
    ).isRequired,
    raw_materials: PropTypes.arrayOf(
      PropTypes.shape({
        nid: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        quantity: PropTypes.string.isRequired,
      })
    ).isRequired,
    supplies: PropTypes.arrayOf(
      PropTypes.shape({
        nid: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        quantity: PropTypes.string.isRequired,
      })
    ).isRequired,
    tools_equipment: PropTypes.arrayOf(
      PropTypes.shape({
        nid: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        quantity: PropTypes.string.isRequired,
      })
    ).isRequired,
  }).isRequired,
};

const ListPointsOperation = (props) => {
  const { type, query } = props.match.params;

  const [vehicles, setPointsOperation] = useState([]);

  const fetchMyAPI = useCallback(async () => {
    let jsonFormatPointOperation = {
      id: "",
      name: "",
      phone: "",
      type: "",
      data_client: [],
      employees: [],
      implements: [],
      items_packaging: [],
      items_process: [],
      raw_materials: [],
      supplies: [],
      tools_equipment: [],
    };

    const snapshotPointsOperation = await props.firebase.db
      .collection("PointsOperation")
      .orderBy("address")
      .get();

    let results = await Promise.all(
      snapshotPointsOperation.docs.map(async (doc) => {
        let data = doc.data();
        let id = doc.id;
        let arrayDataClient = [];
        let arrayEmployees = [];

        //generamos el arrayEmployeeResponsible
        if (data.type === "client") {
          let snapshotDataClient = await props.firebase.db
            .collection("Clients")
            .doc(data.id_client)
            .get();
          let dataClient = snapshotDataClient.data();
          arrayDataClient.push({
            name: dataClient.business || dataClient.contact_name,
            phone: dataClient.phone,
            address: `${dataClient.address}, ${dataClient.city} - ${dataClient.country}`,
          });
        }

        let snapshotEmployees = await props.firebase.db
          .collection("EmployeesPointOperation")
          .doc(data.nid_employees)
          .get();

        let dataEmployees = snapshotEmployees.data();
        if (dataEmployees.employees.length !== 0) {
          for (let i = 0; i < dataEmployees.employees.length; i++) {
            let snapshotDataEmployee = await props.firebase.db
              .collection("Employees")
              .doc(dataEmployees.employees[i])
              .get();
            let dataEmployee = snapshotDataEmployee.data();
            arrayEmployees.push({
              name: dataEmployee.name,
              phone: dataEmployee.phone,
              address: `${dataEmployee.address}, ${dataEmployee.city} - ${dataEmployee.country}`,
            });
          }
        }

        let snapshotElementsPointOperation = await props.firebase.db
          .collection("InventoriesPointOperation")
          .doc(data.nid_inventories)
          .get();

        let dataElementsPointOperation = snapshotElementsPointOperation.data();

        jsonFormatPointOperation = {
          id,
          name: `${data.address}, ${data.city} - ${data.country}`,
          phone: data.phone,
          type: data.type,
          data_client: arrayDataClient,
          employees: arrayEmployees,
          implements: dataElementsPointOperation.implements,
          items_packaging: dataElementsPointOperation.items_packaging,
          items_process: dataElementsPointOperation.items_process,
          raw_materials: dataElementsPointOperation.raw_materials,
          supplies: dataElementsPointOperation.supplies,
          tools_equipment: dataElementsPointOperation.tools_equipment,
        };

        return jsonFormatPointOperation;
      })
    );
    setPointsOperation(results);
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
            <Typography color="textPrimary">Puntos de Operación</Typography>
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
                <TableCell>Dirección</TableCell>
                <TableCell>Telefono</TableCell>
                {query === "modify" ? <TableCell /> : ""}
              </TableRow>
            </TableHead>
            <TableBody>
              {vehicles.map((row) => (
                <Row key={row.name} row={row} query={query} type={type}/>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Container>
  );
};

export default consumerFirebase(ListPointsOperation);
