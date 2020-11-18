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
          {row.name}
        </TableCell>
        {query === "modify" ? (
          <TableCell allgn="center">
            <IconButton
              disabled={row.step === 2 ? true : false}
              aria-label="Actualizar"
              href={`/procesos/update/${row.id}`}
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
                Materia prima requerida:
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell style={{width:"80%"}}>Elemento</TableCell>
                    <TableCell style={{width:"20%"}}>Cantidad</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.raw_materials.map((raw_material) => (
                    <TableRow key={raw_material.description}>
                      <TableCell component="th" scope="row">
                        {raw_material.description}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {raw_material.quantity}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
            <Box margin={1}>
              <Typography variant="h6" gutterBottom component="div">
                Insumos requeridos:
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell style={{width:"80%"}}>Elemento</TableCell>
                    <TableCell style={{width:"20%"}}>Cantidad</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.supplies.map((supplie) => (
                    <TableRow key={supplie.description}>
                      <TableCell component="th" scope="row">
                        {supplie.description}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {supplie.quantity}
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
    name: PropTypes.string.isRequired,
    raw_materials: PropTypes.arrayOf(
      PropTypes.shape({
        description: PropTypes.string.isRequired,
        quantity: PropTypes.number.isRequired,
      })
    ).isRequired,
    supplies: PropTypes.arrayOf(
      PropTypes.shape({
        description: PropTypes.string.isRequired,
        quantity: PropTypes.number.isRequired,
      })
    ).isRequired,
  }).isRequired,
};

const ListProcesses = (props) => {
  const { query } = props.match.params;
  const [processes, setProcesses] = useState([]);

  const fetchMyAPI = useCallback(async () => {
    let snapshotProcesses = await props.firebase.db
      .collection("Standardizations")
      .doc("3qPO90cfep2Xhg89rvnu")
      .get();

    let dataProcesses = snapshotProcesses.data();

    let results = [];

    for (let i = 0; i < dataProcesses.elements.length; i++) {
      results.push({
        id: dataProcesses.elements[i].nid,
        name: dataProcesses.elements[i].name,
        raw_materials: dataProcesses.elements[i].raw_materials,
        supplies: dataProcesses.elements[i].supplies,
      });
    }

    /*
    let results = await Promise.all(
      snapshotProcesses.docs.map(async (doc) => {
        let data = doc.data();

        let jsonFormatProcess = {
          id: data.nid,
          name: data.name,
          raw_materials: data.raw_materials,
          supplies: data.supplies,
        };

        return jsonFormatProcess;
      })
    );
    */

    console.log(results);
    setProcesses(results);
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
                <TableCell style={{width:"10%"}}></TableCell>
                <TableCell style={{width:"90%"}}>Producto</TableCell>
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

export default consumerFirebase(ListProcesses);
