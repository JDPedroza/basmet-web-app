import React, { useState } from "react";
import {
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Collapse,
  Avatar,
} from "@material-ui/core";
import { Link } from "react-router-dom";

//icons
import iconInventario from "../../main/images/icon_inventario.png";
import iconProcess from "../../main/images/icon_process.png";
import iconClient from "../../main/images/icon_clients.png";
import iconPuntoOperacion from "../../main/images/icon_puntosOperacion.png";
import iconEmployees from "../../main/images/icon_empleado.png";
import iconTransfers from "../../main/images/icon_translados.png";
import iconProviders from "../../main/images/icon_proveedores.png";
import iconUsers from "../../main/images/icon_usuarios.png";
import iconVehicles from "../../main/images/icon_vehicles.png";
import iconReports from "../../main/images/icon_reportes.png";

import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";

const style = {
  icons: {
    width: "10px",
    height: "10px",
  },
};

const MenuIzquierda = (props) => {
  const { classes, close } = props;

  const [openIntentories, setOpenIntentories] = useState(false);
  const [openInventoriesAdd, setOpenInventoriesAdd] = useState(false);
  const [openInventoriesAddInvoice, setOpenInventoriesAddInvoice] = useState(
    false
  );
  const [
    openInventoriesAddIndependent,
    setOpenInventoriesAddIndependent,
  ] = useState(false);
  const [openIntentoriesShow, setOpenIntentoriesShow] = useState(false);
  const [openIntentoriesModify, setOpenIntentoriesModify] = useState(false);

  const [openProcess, setOpenProcess] = useState(false);

  const [openClients, setOpenClients] = useState(false);
  const [openClientsAdd, setOpenClientsAdd] = useState(false);
  const [openClientsShow, setOpenClientsShow] = useState(false);
  const [openClientsModify, setOpenClientsModify] = useState(false);

  const [openPointsOperation, setOpenPointsOperation] = useState(false);
  const [openPointsOperationAdd, setOpenPointsOperationAdd] = useState(false);
  const [openPointsOperationShow, setOpenPointsOperationShow] = useState(false);
  const [openPointsOperationModify, setOpenPointsOperationModify] = useState(
    false
  );

  const [openEmployees, setOpenEmployees] = useState(false);
  const [openEmployeesModify, setOpenEmployeesModify] = useState(false);

  const [openTransfers, setOpenTransfers] = useState(false);

  const [openProviders, setOpenProviders] = useState(false);
  const [openProvidersAdd, setOpenProvidersAdd] = useState(false);
  const [openProvidersShow, setOpenProvidersShow] = useState(false);
  const [openProvidersModify, setOpenProvidersModify] = useState(false);

  const [openUsers, setOpenUsers] = useState(false);

  const [openVehicles, setOpenVehicles] = useState(false);

  const handleClickInventories = () => {
    setOpenIntentories(!openIntentories);
  };

  const handleClickInventoriesAdd = () => {
    setOpenInventoriesAdd(!openInventoriesAdd);
  };

  const handleClickInventoriesAddInvoice = () => {
    setOpenInventoriesAddInvoice(!openInventoriesAddInvoice);
  };

  const handleClickInventoriesAddIndependent = () => {
    setOpenInventoriesAddIndependent(!openInventoriesAddIndependent);
  };

  const handleClickInventoriesShow = () => {
    setOpenIntentoriesShow(!openIntentoriesShow);
  };

  const handleClickInventoriesModify = () => {
    setOpenIntentoriesModify(!openIntentoriesModify);
  };

  const handleClickProcess = () => {
    setOpenProcess(!openProcess);
  };

  const handleClickClients = () => {
    setOpenClients(!openClients);
  };
  const handleClickClientsAdd = () => {
    setOpenClientsAdd(!openClientsAdd);
  };

  const handleClickClientsShow = () => {
    setOpenClientsShow(!openClientsShow);
  };

  const handleClickClientsModify = () => {
    setOpenClientsModify(!openClientsModify);
  };

  const handleClickPointsOperation = () => {
    setOpenPointsOperation(!openPointsOperation);
  };
  const handleClickPointsOperationAdd = () => {
    setOpenPointsOperationAdd(!openPointsOperationAdd);
  };
  const handleClickPointsOperationShow = () => {
    setOpenPointsOperationShow(!openPointsOperationShow);
  };
  const handleClickPointsOperationModify = () => {
    setOpenPointsOperationModify(!openPointsOperationModify);
  };

  const handleClickEmployees = () => {
    setOpenEmployees(!openEmployees);
  };

  const handleClickEmployeesModify = () => {
    setOpenEmployeesModify(!openEmployeesModify);
  };

  const handleClickTransfers = () => {
    setOpenTransfers(!openTransfers);
  };

  const handleClickProviders = () => {
    setOpenProviders(!openProviders);
  };
  const handleClickProvidersAdd = () => {
    setOpenProvidersAdd(!openProvidersAdd);
  };

  const handleClickProvidersShow = () => {
    setOpenProvidersShow(!openProvidersShow);
  };

  const handleClickProvidersModify = () => {
    setOpenProvidersModify(!openProvidersModify);
  };

  const handleClickUsers = () => {
    setOpenUsers(!openUsers);
  };

  const handleClickVehicles = () => {
    setOpenVehicles(!openVehicles);
  };

  return (
    <div className={classes.list}>
      <List style={{ marginBottom: 40, paddingTop: 0 }}>
        <ListItem button onClick={handleClickInventories}>
          <ListItemIcon>
            <Avatar src={iconInventario} style={style.icon} variant="square" />
          </ListItemIcon>
          <ListItemText primary="Inventarios" />
          {openIntentories ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={openIntentories} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItem button onClick={handleClickInventoriesAdd}>
              <ListItemIcon>
                <i className="material-icons" style={{ marginRight: 10 }}>
                  add
                </i>
              </ListItemIcon>
              <ListItemText primary="Agregar Elementos" />
              {openInventoriesAdd ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse in={openInventoriesAdd} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItem button onClick={handleClickInventoriesAddInvoice}>
                  <ListItemText primary="Factura" />
                  {openInventoriesAddInvoice ? <ExpandLess /> : <ExpandMore />}
                </ListItem>
                <Collapse
                  in={openInventoriesAddInvoice}
                  timeout="auto"
                  unmountOnExit
                >
                  <ListItem
                    component={Link}
                    button
                    onClick={close("left", false)}
                    to="/inventarios/agregar/materia_prima/factura"
                  >
                    <ListItemText
                      classes={{ primary: classes.listItemText }}
                      primary="Materia Prima"
                    />
                  </ListItem>
                  <ListItem
                    component={Link}
                    button
                    onClick={close("left", false)}
                    to="/inventarios/agregar/herramientas_y_equipos/factura"
                  >
                    <ListItemText
                      classes={{ primary: classes.listItemText }}
                      primary="Herramientas y Equipos"
                    />
                  </ListItem>
                  <ListItem
                    component={Link}
                    button
                    onClick={close("left", false)}
                    to="/inventarios/agregar/insumos/factura"
                  >
                    <ListItemText
                      classes={{ primary: classes.listItemText }}
                      primary="Insumos"
                    />
                  </ListItem>

                  <ListItem
                    component={Link}
                    button
                    onClick={close("left", false)}
                    to="/inventarios/agregar/implementos/factura"
                  >
                    <ListItemText
                      classes={{ primary: classes.listItemText }}
                      primary="Implementos"
                    />
                  </ListItem>
                </Collapse>
                <ListItem button onClick={handleClickInventoriesAddIndependent}>
                  <ListItemText primary="Independiente" />
                  {openInventoriesAddIndependent ? (
                    <ExpandLess />
                  ) : (
                    <ExpandMore />
                  )}
                </ListItem>
                <Collapse
                  in={openInventoriesAddIndependent}
                  timeout="auto"
                  unmountOnExit
                >
                  <ListItem
                    component={Link}
                    button
                    onClick={close("left", false)}
                    to="/inventarios/agregar/materia_prima/independiente"
                  >
                    <ListItemText
                      classes={{ primary: classes.listItemText }}
                      primary="Materia Prima"
                    />
                  </ListItem>
                  <ListItem
                    component={Link}
                    button
                    onClick={close("left", false)}
                    to="/inventarios/agregar/herramientas_y_equipos/independiente"
                  >
                    <ListItemText
                      classes={{ primary: classes.listItemText }}
                      primary="Herramientas y Equipos"
                    />
                  </ListItem>
                  <ListItem
                    component={Link}
                    button
                    onClick={close("left", false)}
                    to="/inventarios/agregar/insumos/independiente"
                  >
                    <ListItemText
                      classes={{ primary: classes.listItemText }}
                      primary="Insumos"
                    />
                  </ListItem>

                  <ListItem
                    component={Link}
                    button
                    onClick={close("left", false)}
                    to="/inventarios/agregar/implementos/independiente"
                  >
                    <ListItemText
                      classes={{ primary: classes.listItemText }}
                      primary="Implementos"
                    />
                  </ListItem>
                </Collapse>
                <ListItem
                  component={Link}
                  button
                  onClick={close("left", false)}
                  to="/inventarios/agregar/productos_en_proceso"
                >
                  <ListItemText
                    classes={{ primary: classes.listItemText }}
                    primary="Productos en Proceso"
                  />
                </ListItem>
              </List>
            </Collapse>
          </List>
          <List component="div" disablePadding>
            <ListItem button onClick={handleClickInventoriesShow}>
              <ListItemIcon>
                <i className="material-icons" style={{ marginRight: 10 }}>
                  remove_red_eye
                </i>
              </ListItemIcon>
              <ListItemText primary="Ver Elementos" />
              {openIntentoriesShow ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse in={openIntentoriesShow} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItem
                  component={Link}
                  button
                  onClick={close("left", false)}
                  to="/inventarios/mostrar/materia_prima/search"
                >
                  <ListItemText
                    classes={{ primary: classes.listItemText }}
                    primary="Materia Prima"
                  />
                </ListItem>
                <ListItem
                  component={Link}
                  button
                  onClick={close("left", false)}
                  to="/inventarios/mostrar/herramientas_y_equipos/search"
                >
                  <ListItemText
                    classes={{ primary: classes.listItemText }}
                    primary="Herramientas y Equipos"
                  />
                </ListItem>
                <ListItem
                  component={Link}
                  button
                  onClick={close("left", false)}
                  to="/inventarios/mostrar/insumos/search"
                >
                  <ListItemText
                    classes={{ primary: classes.listItemText }}
                    primary="Insumos"
                  />
                </ListItem>
                <ListItem
                  component={Link}
                  button
                  onClick={close("left", false)}
                  to="/inventarios/mostrar/productos_en_proceso/search"
                >
                  <ListItemText
                    classes={{ primary: classes.listItemText }}
                    primary="Productos en Proceso"
                  />
                </ListItem>
                <ListItem
                  component={Link}
                  button
                  onClick={close("left", false)}
                  to="/inventarios/mostrar/productos_en_embalaje/search"
                >
                  <ListItemText
                    classes={{ primary: classes.listItemText }}
                    primary="Productos en Embalaje"
                  />
                </ListItem>
                <ListItem
                  component={Link}
                  button
                  onClick={close("left", false)}
                  to="/inventarios/mostrar/implementos/search"
                >
                  <ListItemText
                    classes={{ primary: classes.listItemText }}
                    primary="Implementos"
                  />
                </ListItem>
              </List>
            </Collapse>
          </List>
          <List component="div" disablePadding>
            <ListItem button onClick={handleClickInventoriesModify}>
              <ListItemIcon>
                <i className="material-icons" style={{ marginRight: 10 }}>
                  create
                </i>
              </ListItemIcon>
              <ListItemText primary="Modificar Elementos" />
              {openIntentoriesModify ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse in={openIntentoriesModify} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItem
                  component={Link}
                  button
                  onClick={close("left", false)}
                  to="/inventarios/mostrar/materia_prima/modify"
                >
                  <ListItemText
                    classes={{ primary: classes.listItemText }}
                    primary="Materia Prima"
                  />
                </ListItem>
                <ListItem
                  component={Link}
                  button
                  onClick={close("left", false)}
                  to="/inventarios/mostrar/herramientas_y_equipos/modify"
                >
                  <ListItemText
                    classes={{ primary: classes.listItemText }}
                    primary="Herramientas y Equipos"
                  />
                </ListItem>
                <ListItem
                  component={Link}
                  button
                  onClick={close("left", false)}
                  to="/inventarios/mostrar/insumos/modify"
                >
                  <ListItemText
                    classes={{ primary: classes.listItemText }}
                    primary="Insumos"
                  />
                </ListItem>
                <ListItem
                  component={Link}
                  button
                  onClick={close("left", false)}
                  to="/inventarios/mostrar/productos_en_proceso/modify"
                >
                  <ListItemText
                    classes={{ primary: classes.listItemText }}
                    primary="Productos en Proceso"
                  />
                </ListItem>
                <ListItem
                  component={Link}
                  button
                  onClick={close("left", false)}
                  to="/inventarios/mostrar/productos_en_embalaje/modify"
                >
                  <ListItemText
                    classes={{ primary: classes.listItemText }}
                    primary="Productos en Embalaje"
                  />
                </ListItem>
                <ListItem
                  component={Link}
                  button
                  onClick={close("left", false)}
                  to="/inventarios/mostrar/implementos/modify"
                >
                  <ListItemText
                    classes={{ primary: classes.listItemText }}
                    primary="Implementos"
                  />
                </ListItem>
              </List>
            </Collapse>
          </List>
        </Collapse>
        <Divider />
        <ListItem button onClick={handleClickProcess}>
          <ListItemIcon>
            <Avatar src={iconProcess} style={style.icon} variant="square" />
          </ListItemIcon>
          <ListItemText primary="Procesos" />
          {openProcess ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={openProcess} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItem
              component={Link}
              button
              onClick={close("left", false)}
              to="/procesos/agregar/new"
            >
              <ListItemIcon>
                <i className="material-icons" style={{ marginRight: 10 }}>
                  add
                </i>
              </ListItemIcon>
              <ListItemText primary="Agregar Proceso" />
            </ListItem>
            <ListItem
              component={Link}
              button
              onClick={close("left", false)}
              to="/procesos/mostrar/search"
            >
              <ListItemIcon>
                <i className="material-icons" style={{ marginRight: 10 }}>
                  remove_red_eye
                </i>
              </ListItemIcon>
              <ListItemText primary="Mostrar Proceso" />
            </ListItem>
            <ListItem
              component={Link}
              button
              onClick={close("left", false)}
              to="/procesos/mostrar/modify"
            >
              <ListItemIcon>
                <i className="material-icons" style={{ marginRight: 10 }}>
                  create
                </i>
              </ListItemIcon>
              <ListItemText primary="Modificar Proceso" />
            </ListItem>
          </List>
        </Collapse>
        <Divider />
        <ListItem button onClick={handleClickClients}>
          <ListItemIcon>
            <Avatar src={iconClient} style={style.icon} variant="square" />
          </ListItemIcon>
          <ListItemText primary="Clientes" />
          {openClients ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={openClients} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItem button onClick={handleClickClientsAdd}>
              <ListItemIcon>
                <i className="material-icons" style={{ marginRight: 10 }}>
                  add
                </i>
              </ListItemIcon>
              <ListItemText primary="Agregar Elementos" />
              {openClientsAdd ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse in={openClientsAdd} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItem
                  component={Link}
                  button
                  onClick={close("left", false)}
                  to="/clientes/agregar/business"
                >
                  <ListItemText
                    classes={{ primary: classes.listItemText }}
                    primary="Empresa"
                  />
                </ListItem>
                <ListItem
                  component={Link}
                  button
                  onClick={close("left", false)}
                  to="/clientes/agregar/people"
                >
                  <ListItemText
                    classes={{ primary: classes.listItemText }}
                    primary="Persona Natural"
                  />
                </ListItem>
              </List>
            </Collapse>
          </List>
          <List component="div" disablePadding>
            <ListItem button onClick={handleClickClientsShow}>
              <ListItemIcon>
                <i className="material-icons" style={{ marginRight: 10 }}>
                  remove_red_eye
                </i>
              </ListItemIcon>
              <ListItemText primary="Ver Elementos" />
              {openClientsShow ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse in={openClientsShow} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItem
                  component={Link}
                  button
                  onClick={close("left", false)}
                  to="/clientes/mostrar/business/search"
                >
                  <ListItemText
                    classes={{ primary: classes.listItemText }}
                    primary="Empresa"
                  />
                </ListItem>
                <ListItem
                  component={Link}
                  button
                  onClick={close("left", false)}
                  to="/clientes/mostrar/people/search"
                >
                  <ListItemText
                    classes={{ primary: classes.listItemText }}
                    primary="Persona Natural"
                  />
                </ListItem>
              </List>
            </Collapse>
          </List>
          <List component="div" disablePadding>
            <ListItem button onClick={handleClickClientsModify}>
              <ListItemIcon>
                <i className="material-icons" style={{ marginRight: 10 }}>
                  create
                </i>
              </ListItemIcon>
              <ListItemText primary="Modificar Elementos" />
              {openClientsModify ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse in={openClientsModify} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItem
                  component={Link}
                  button
                  onClick={close("left", false)}
                  to="/clientes/mostrar/business/modify"
                >
                  <ListItemText
                    classes={{ primary: classes.listItemText }}
                    primary="Empresa"
                  />
                </ListItem>
                <ListItem
                  component={Link}
                  button
                  onClick={close("left", false)}
                  to="/clientes/mostrar/people/modify"
                >
                  <ListItemText
                    classes={{ primary: classes.listItemText }}
                    primary="Persona Natural"
                  />
                </ListItem>
              </List>
            </Collapse>
          </List>
        </Collapse>
        <Divider />
        <ListItem button onClick={handleClickPointsOperation}>
          <ListItemIcon>
            <Avatar
              src={iconPuntoOperacion}
              style={style.icon}
              variant="square"
            />
          </ListItemIcon>
          <ListItemText primary="Puntos de Operacion" />
          {openPointsOperation ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={openPointsOperation} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItem button onClick={handleClickPointsOperationAdd}>
              <ListItemIcon>
                <i className="material-icons" style={{ marginRight: 10 }}>
                  add
                </i>
              </ListItemIcon>
              <ListItemText primary="Agregar Punto de Operación" />
              {openPointsOperationAdd ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse in={openPointsOperationAdd} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItem
                  component={Link}
                  button
                  onClick={close("left", false)}
                  to="/puntos_operacion/agregar/client"
                >
                  <ListItemText
                    classes={{ primary: classes.listItemText }}
                    primary="Empresa"
                  />
                </ListItem>
                <ListItem
                  component={Link}
                  button
                  onClick={close("left", false)}
                  to="/puntos_operacion/agregar/internal"
                >
                  <ListItemText
                    classes={{ primary: classes.listItemText }}
                    primary="Internos"
                  />
                </ListItem>
              </List>
            </Collapse>
          </List>
          <List component="div" disablePadding>
            <ListItem button onClick={handleClickPointsOperationShow}>
              <ListItemIcon>
                <i className="material-icons" style={{ marginRight: 10 }}>
                  remove_red_eye
                </i>
              </ListItemIcon>
              <ListItemText primary="Ver Punto de Operación" />
              {openPointsOperationShow ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse in={openPointsOperationShow} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItem
                  component={Link}
                  button
                  onClick={close("left", false)}
                  to="/puntos_operacion/mostrar/client/search"
                >
                  <ListItemText
                    classes={{ primary: classes.listItemText }}
                    primary="Empresa"
                  />
                </ListItem>
                <ListItem
                  component={Link}
                  button
                  onClick={close("left", false)}
                  to="/puntos_operacion/mostrar/internal/search"
                >
                  <ListItemText
                    classes={{ primary: classes.listItemText }}
                    primary="Internos"
                  />
                </ListItem>
              </List>
            </Collapse>
          </List>
          <List component="div" disablePadding>
            <ListItem button onClick={handleClickPointsOperationModify}>
              <ListItemIcon>
                <i className="material-icons" style={{ marginRight: 10 }}>
                  create
                </i>
              </ListItemIcon>
              <ListItemText primary="Modificar Punto de Operación" />
              {openPointsOperationModify ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse
              in={openPointsOperationModify}
              timeout="auto"
              unmountOnExit
            >
              <List component="div" disablePadding>
                <ListItem
                  component={Link}
                  button
                  onClick={close("left", false)}
                  to="/puntos_operacion/mostrar/client/modify"
                >
                  <ListItemText
                    classes={{ primary: classes.listItemText }}
                    primary="Empresa"
                  />
                </ListItem>
                <ListItem
                  component={Link}
                  button
                  onClick={close("left", false)}
                  to="/puntos_operacion/mostrar/internal/modify"
                >
                  <ListItemText
                    classes={{ primary: classes.listItemText }}
                    primary="Internos"
                  />
                </ListItem>
              </List>
            </Collapse>
          </List>
        </Collapse>
        <Divider />
        <ListItem button onClick={handleClickEmployees}>
          <ListItemIcon>
            <Avatar src={iconEmployees} style={style.icon} variant="square" />
          </ListItemIcon>
          <ListItemText primary="Empleados" />
          {openEmployees ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={openEmployees} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItem
              component={Link}
              button
              onClick={close("left", false)}
              to="/empleados/add"
            >
              <ListItemIcon>
                <i className="material-icons" style={{ marginRight: 10 }}>
                  add
                </i>
              </ListItemIcon>
              <ListItemText primary="Agregar Empleado" />
            </ListItem>
            <ListItem
              component={Link}
              button
              onClick={close("left", false)}
              to="/empleados/mostrar/search"
            >
              <ListItemIcon>
                <i className="material-icons" style={{ marginRight: 10 }}>
                  remove_red_eye
                </i>
              </ListItemIcon>
              <ListItemText primary="Mostrar Empleados" />
            </ListItem>
            <ListItem button onClick={handleClickEmployeesModify}>
              <ListItemIcon>
                <i className="material-icons" style={{ marginRight: 10 }}>
                  create
                </i>
              </ListItemIcon>
              <ListItemText primary="Modificar Empleado" />
              {openEmployeesModify ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse in={openEmployeesModify} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItem
                  component={Link}
                  button
                  onClick={close("left", false)}
                  to="/empleados/mostrar/modify/data"
                >
                  <ListItemText primary="Modificar Datos" />
                </ListItem>
                <ListItem
                  component={Link}
                  button
                  onClick={close("left", false)}
                  to="/empleados/mostrar/modify/assignment"
                >
                  <ListItemText primary="Modificar Asignaciones" />
                </ListItem>
              </List>
            </Collapse>
          </List>
        </Collapse>
        <Divider />
        <ListItem button onClick={handleClickTransfers}>
          <ListItemIcon>
            <Avatar src={iconTransfers} style={style.icon} variant="square" />
          </ListItemIcon>
          <ListItemText primary="Tralados" />
          {openTransfers ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={openTransfers} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItem
              component={Link}
              button
              onClick={close("left", false)}
              to="/traslados/agregar"
            >
              <ListItemIcon>
                <i className="material-icons" style={{ marginRight: 10 }}>
                  add
                </i>
              </ListItemIcon>
              <ListItemText primary="Agregar Traslado" />
            </ListItem>
            <ListItem
              component={Link}
              button
              onClick={close("left", false)}
              to="/traslados/mostrar/search"
            >
              <ListItemIcon>
                <i className="material-icons" style={{ marginRight: 10 }}>
                  remove_red_eye
                </i>
              </ListItemIcon>
              <ListItemText primary="Mostrar Traslado" />
            </ListItem>
          </List>
        </Collapse>
        <Divider />
        <ListItem button onClick={handleClickProviders}>
          <ListItemIcon>
            <Avatar src={iconProviders} style={style.icon} variant="square" />
          </ListItemIcon>
          <ListItemText primary="Proveedores" />
          {openProviders ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={openProviders} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItem button onClick={handleClickProvidersAdd}>
              <ListItemIcon>
                <i className="material-icons" style={{ marginRight: 10 }}>
                  add
                </i>
              </ListItemIcon>
              <ListItemText primary="Agregar Proveedor" />
              {openProvidersAdd ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse in={openProvidersAdd} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItem
                  component={Link}
                  button
                  onClick={close("left", false)}
                  to="/proveedor/agregar/business"
                >
                  <ListItemText
                    classes={{ primary: classes.listItemText }}
                    primary="Empresa"
                  />
                </ListItem>
                <ListItem
                  component={Link}
                  button
                  onClick={close("left", false)}
                  to="/proveedor/agregar/people"
                >
                  <ListItemText
                    classes={{ primary: classes.listItemText }}
                    primary="Persona Natural"
                  />
                </ListItem>
              </List>
            </Collapse>
          </List>
          <List component="div" disablePadding>
            <ListItem button onClick={handleClickProvidersShow}>
              <ListItemIcon>
                <i className="material-icons" style={{ marginRight: 10 }}>
                  remove_red_eye
                </i>
              </ListItemIcon>
              <ListItemText primary="Ver Proveedor" />
              {openProvidersShow ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse in={openProvidersShow} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItem
                  component={Link}
                  button
                  onClick={close("left", false)}
                  to="/proveedor/mostrar/business/search"
                >
                  <ListItemText
                    classes={{ primary: classes.listItemText }}
                    primary="Empresa"
                  />
                </ListItem>
                <ListItem
                  component={Link}
                  button
                  onClick={close("left", false)}
                  to="/proveedor/mostrar/people/search"
                >
                  <ListItemText
                    classes={{ primary: classes.listItemText }}
                    primary="Persona Natural"
                  />
                </ListItem>
              </List>
            </Collapse>
          </List>
          <List component="div" disablePadding>
            <ListItem button onClick={handleClickProvidersModify}>
              <ListItemIcon>
                <i className="material-icons" style={{ marginRight: 10 }}>
                  create
                </i>
              </ListItemIcon>
              <ListItemText primary="Modificar Proveedor" />
              {openProvidersModify ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse in={openProvidersModify} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItem
                  component={Link}
                  button
                  onClick={close("left", false)}
                  to="/proveedor/mostrar/business/search"
                >
                  <ListItemText
                    classes={{ primary: classes.listItemText }}
                    primary="Empresa"
                  />
                </ListItem>
                <ListItem
                  component={Link}
                  button
                  onClick={close("left", false)}
                  to="/proveedor/mostrar/people/modify"
                >
                  <ListItemText
                    classes={{ primary: classes.listItemText }}
                    primary="Persona Natural"
                  />
                </ListItem>
              </List>
            </Collapse>
          </List>
        </Collapse>
        <Divider />
        <ListItem button onClick={handleClickUsers}>
          <ListItemIcon>
            <Avatar src={iconUsers} style={style.icon} variant="square" />
          </ListItemIcon>
          <ListItemText primary="Usuarios" />
          {openUsers ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={openUsers} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItem
              component={Link}
              button
              onClick={close("left", false)}
              to="/usuarios/agregar"
            >
              <ListItemIcon>
                <i className="material-icons" style={{ marginRight: 10 }}>
                  add
                </i>
              </ListItemIcon>
              <ListItemText primary="Agregar Usuario" />
            </ListItem>
            <ListItem
              component={Link}
              button
              onClick={close("left", false)}
              to="/usuarios/mostrar/search"
            >
              <ListItemIcon>
                <i className="material-icons" style={{ marginRight: 10 }}>
                  remove_red_eye
                </i>
              </ListItemIcon>
              <ListItemText primary="Mostrar Usuarios" />
            </ListItem>
            <ListItem
              component={Link}
              button
              onClick={close("left", false)}
              to="/usuarios/mostrar/modify"
            >
              <ListItemIcon>
                <i className="material-icons" style={{ marginRight: 10 }}>
                  create
                </i>
              </ListItemIcon>
              <ListItemText primary="Modificar Usuario" />
            </ListItem>
          </List>
        </Collapse>
        <Divider />
        <ListItem button onClick={handleClickVehicles}>
          <ListItemIcon>
            <Avatar src={iconVehicles} style={style.icon} variant="square" />
          </ListItemIcon>
          <ListItemText primary="Vehiculos" />
          {openVehicles ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={openVehicles} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItem
              component={Link}
              button
              onClick={close("left", false)}
              to="/vehiculos/agregar"
            >
              <ListItemIcon>
                <i className="material-icons" style={{ marginRight: 10 }}>
                  add
                </i>
              </ListItemIcon>
              <ListItemText primary="Agregar Vehiculos" />
            </ListItem>
            <ListItem
              component={Link}
              button
              onClick={close("left", false)}
              to="/vehiculos/mostrar/search"
            >
              <ListItemIcon>
                <i className="material-icons" style={{ marginRight: 10 }}>
                  remove_red_eye
                </i>
              </ListItemIcon>
              <ListItemText primary="Mostrar Vehiculoss" />
            </ListItem>
            <ListItem
              component={Link}
              button
              onClick={close("left", false)}
              to="/vehiculos/mostrar/modify"
            >
              <ListItemIcon>
                <i className="material-icons" style={{ marginRight: 10 }}>
                  create
                </i>
              </ListItemIcon>
              <ListItemText primary="Modificar Vehiculos" />
            </ListItem>
          </List>
        </Collapse>
        <Divider />
        <ListItem component={Link} button onClick={close("left", false)} to="/">
          <ListItemIcon>
            <Avatar src={iconReports} style={style.icon} variant="square" />
          </ListItemIcon>
          <ListItemText primary="Ver Reportes" />
        </ListItem>
      </List>
      <List
        style={{
          position: "fixed",
          bottom: 0,
          width: 300,
          backgroundColor: "#2E3B55",
          color: "white",
          padding: 0,
        }}
      >
        <ListItem
          component={Link}
          button
          onClick={close("left", false)}
          style={{ width: "100%" }}
        >
          <i className="material-icons" style={{ marginRight: 10 }}>
            arrow_back
          </i>
          <ListItemText primary="CERRAR MENU" style={{ color: "white" }} />
        </ListItem>
      </List>
    </div>
  );
};
export default MenuIzquierda;