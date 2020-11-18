import React, { useEffect, useState, useCallback } from "react";

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
        <TableCell>{row.type}</TableCell>
        <TableCell>{row.user}</TableCell>
        <TableCell>{row.date}</TableCell>
      </TableRow>
      <TableRow key="titles">
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={12}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <Typography variant="h6" gutterBottom component="div">
                Elementos Modificados
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>Descripción</TableCell>
                    <TableCell>Cantida</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.items.map((item) => (
                    <TableRow key={`item_${item.nid}`}>
                      <TableCell component="th" scope="row">
                        {item.description}
                      </TableCell>
                      <TableCell align="right">{item.quantity}</TableCell>
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
    type: PropTypes.string.isRequired,
    user: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    items: PropTypes.arrayOf(
      PropTypes.shape({
        nid: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        quantity: PropTypes.number.isRequired,
      })
    ).isRequired,
  }).isRequired,
};

const ListReports = (props) => {
  const [reports, setReports] = useState([]);

  const fetchMyAPI = useCallback(async () => {
    let snapshotReports = await props.firebase.db
      .collection("Reports")
      .orderBy("date")
      .get();

    let results = await Promise.all(
      snapshotReports.docs.map(async (doc) => {
        let dataReport = doc.data();
        let id = doc.id;

        let jsonFormatReport = {
          id,
          type: dataReport.type,
          user: `${dataReport.user.nombre} ${dataReport.user.apellido}`,
          date: dataReport.date,
          items: [],
        };

        return jsonFormatReport;
      })
    );

    setReports(results);
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
            <Typography color="textPrimary">Reportes</Typography>
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
                <TableCell>Tipo</TableCell>
                <TableCell>Usuario Reponsable</TableCell>
                <TableCell>Fecha</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reports.map((row) => (
                <Row key={row.name} row={row} />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Container>
  );
};

export default consumerFirebase(ListReports);
