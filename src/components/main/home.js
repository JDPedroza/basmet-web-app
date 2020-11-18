import React, { useState, useEffect, useCallback } from "react";
import imgGuide from "./images/Guia.jpg";
import iconInventario from "./images/icon_inventario.png";
import iconProcess from "./images/icon_process.png";
import iconClients from "./images/icon_clients.png";
import iconPuntoOperacion from "./images/icon_puntosOperacion.png";
import iconEmpleado from "./images/icon_empleado.png";
import iconTraslados from "./images/icon_translados.png";
import iconProveedores from "./images/icon_proveedores.png";
import iconUsuarios from "./images/icon_usuarios.png";
import iconVehiculos from "./images/icon_vehicles.png";

import { ItemOptions } from "./components/itemOptions";
import { NoAccess } from "./components/noAccess";
import { LoadingData } from "./components/loadingData";

import { Avatar, Grid, Fab, Tooltip } from "@material-ui/core";
import "./styles/home.scss";

//icons
import RotateLeftIcon from "@material-ui/icons/RotateLeft";

//utils
import { useStateValue } from "../../sesion/store";

const style = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  avatar: {
    width: "300px",
    height: "300px",
    visibility: "hidden",
  },
  icon: {
    margin: "15% 0 5% 23%",
    width: "50%",
    height: "50%",
  },
  link: {
    height: "33,3%",
  },
  gridContainer: {
    width: "100%",
    height: "100%",
    flexDirection: "column",
  },
  gridItem: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  optionsModules: {
    flex: 1,
    boxShadow: "inset 0 2px 0 0 black",
    color: "black",
  },
};

const Home = (props) => {
  const [{ sesion }, dispatch] = useStateValue();
  let [stateModules, changeStateModules] = useState({
    moduleI: {
      class: "hoverAllow",
      face: "front",
      option: 0,
      query: "",
    },
    modulePro: {
      class: "hoverAllow",
      face: "front",
      option: 0,
      query: "",
    },
    moduleC: {
      class: "hoverAllow",
      face: "front",
      option: 0,
      query: "",
    },
    moduleP: {
      class: "hoverAllow",
      face: "front",
      option: 0,
      query: "",
    },
    moduleE: {
      class: "hoverAllow",
      face: "front",
      option: 0,
      query: "",
    },
    moduleT: {
      class: "hoverAllow",
      face: "front",
      option: 0,
      query: "",
    },
    modulePr: {
      class: "hoverAllow",
      face: "front",
      option: 0,
      query: "",
    },
    moduleU: {
      class: "hoverAllow",
      face: "front",
      option: 0,
      query: "",
    },
    moduleV: {
      class: "hoverAllow",
      face: "front",
      option: 0,
      query: "",
    },
  });

  const moduleSelected = (id, value, face, query) => {
    let stateModulesTemp = {};

    if (id === "moduleI") {
      stateModulesTemp = stateModules.moduleI;
    } else if (id === "moduleC") {
      stateModulesTemp = stateModules.moduleC;
    } else if (id === "moduleP") {
      stateModulesTemp = stateModules.moduleP;
    } else if (id === "moduleE") {
      stateModulesTemp = stateModules.moduleE;
    } else if (id === "moduleT") {
      stateModulesTemp = stateModules.moduleT;
    } else if (id === "modulePr") {
      stateModulesTemp = stateModules.modulePr;
    } else {
      stateModulesTemp = stateModules.moduleU;
    }

    if (face === "front") {
      stateModulesTemp.class = "selectOptionBack";
      stateModulesTemp.face = "back";
      stateModulesTemp.option = value;
      stateModulesTemp.query = query;
    } else if (face === "back" && stateModulesTemp.query === "add") {
      stateModulesTemp.class = "selectOptionDown";
      stateModulesTemp.face = "down";
      stateModulesTemp.option = value;
    } else if (face === "back" && stateModulesTemp.query === "modify") {
      stateModulesTemp.class = "selectOptionDown";
      stateModulesTemp.face = "down";
      stateModulesTemp.option = value;
    } else {
    }

    console.log(stateModulesTemp);

    changeStateModules((prev) => ({
      ...prev,
      [id]: stateModulesTemp,
    }));

    resetSelected(id);
  };

  const resetSelected = (id) => {
    const namesModules = [
      "moduleI",
      "moduleC",
      "moduleP",
      "moduleE",
      "moduleT",
      "modulePr",
      "moduleU",
      "moduleV",
    ];
    let stateModulesReset = { class: "hoverAllow", face: "front", optiton: 0 };
    for (let i = 0; i < namesModules.length; i++) {
      if (id !== namesModules[i]) {
        changeStateModules((prev) => ({
          ...prev,
          [namesModules[i]]: stateModulesReset,
        }));
      }
    }
  };

  return (
    <div id="dContenedor" class="dContenedor">
      <Tooltip title="Resetear Modulos" aria-label="Resetear Modulos">
        <Fab
          aria-label="Resetear"
          style={{
            position: "fixed",
            bottom: 100,
            right: 25,
            zIndex: 1000,
            backgroundColor: "#2E3B55",
            color: "white",
          }}
          onClick={() => {
            resetSelected("");
          }}
        >
          <RotateLeftIcon />
        </Fab>
      </Tooltip>
      <Grid container spacing={0}>
        <div class="modules" id="moduleI">
          <div id="dInventarios" class={stateModules.moduleI.class}>
            <Avatar src={imgGuide} style={style.avatar} variant="square" />
            <div class="lado adelante">
              <Avatar
                src={iconInventario}
                style={style.icon}
                variant="square"
              />
              <h1>INVENTARIO</h1>
            </div>
            <div class="lado arriba">
              {sesion !== undefined ? (
                sesion.usuario.inventories ? (
                  <Grid container style={style.gridContainer}>
                    <ItemOptions
                      title="Agregar Elemento"
                      onclick={() =>
                        moduleSelected(
                          "moduleI",
                          1,
                          stateModules.moduleI.face,
                          "add"
                        )
                      }
                    />
                    <ItemOptions
                      title="Consultar Elemento"
                      onclick={() =>
                        moduleSelected(
                          "moduleI",
                          2,
                          stateModules.moduleI.face,
                          "search"
                        )
                      }
                    />
                    <ItemOptions
                      title="Modificar Elemento"
                      onclick={() =>
                        moduleSelected(
                          "moduleI",
                          3,
                          stateModules.moduleI.face,
                          "modify"
                        )
                      }
                    />
                  </Grid>
                ) : (
                  <NoAccess />
                )
              ) : (
                <LoadingData />
              )}
            </div>
            <div class="lado atras">
              {sesion !== undefined ? (
                sesion.usuario.inventories ? (
                  <Grid container style={style.gridContainer}>
                    <ItemOptions
                      title="Materia Prima"
                      onclick={
                        stateModules.moduleI.query === "add"
                          ? () =>
                              moduleSelected(
                                "moduleI",
                                1,
                                stateModules.moduleI.face
                              )
                          : ""
                      }
                      href={
                        stateModules.moduleI.query !== "add"
                          ? `/inventarios/mostrar/materia_prima/${stateModules.moduleI.query}`
                          : ""
                      }
                    />
                    <ItemOptions
                      title="Herramientas y Equipos"
                      onclick={
                        stateModules.moduleI.query === "add"
                          ? () =>
                              moduleSelected(
                                "moduleI",
                                2,
                                stateModules.moduleI.face
                              )
                          : ""
                      }
                      href={
                        stateModules.moduleI.query !== "add"
                          ? `/inventarios/mostrar/herramientas_y_equipos/${stateModules.moduleI.query}`
                          : ""
                      }
                    />
                    <ItemOptions
                      title="Insumos"
                      onclick={
                        stateModules.moduleI.query === "add"
                          ? () =>
                              moduleSelected(
                                "moduleI",
                                3,
                                stateModules.moduleI.face
                              )
                          : ""
                      }
                      href={
                        stateModules.moduleI.query !== "add"
                          ? `/inventarios/mostrar/insumos/${stateModules.moduleI.query}`
                          : ""
                      }
                    />
                    <ItemOptions
                      title="Productos en proceso"
                      href={
                        stateModules.moduleI.query !== "add"
                          ? `/inventarios/mostrar/productos_en_proceso/${stateModules.moduleI.query}`
                          : "/inventarios/agregar/productos_en_proceso"
                      }
                    />
                    {stateModules.moduleI.option !== 1 &&
                    stateModules.moduleI.face === "back" ? (
                      <ItemOptions
                        title="Productos en Embalaje"
                        href={`/inventarios/mostrar/productos_en_embalaje/${stateModules.moduleI.query}`}
                      />
                    ) : (
                      ""
                    )}
                    <ItemOptions
                      title="Implementos"
                      onclick={
                        stateModules.moduleI.query === "add"
                          ? () =>
                              moduleSelected(
                                "moduleI",
                                4,
                                stateModules.moduleI.face
                              )
                          : ""
                      }
                      href={
                        stateModules.moduleI.query !== "add"
                          ? `/inventarios/mostrar/implementos/${stateModules.moduleI.query}`
                          : ""
                      }
                    />
                  </Grid>
                ) : (
                  <NoAccess />
                )
              ) : (
                <LoadingData />
              )}
            </div>
            <div class="lado abajo">
              {sesion !== undefined ? (
                sesion.usuario.inventories ? (
                  <Grid container style={style.gridContainer}>
                    <ItemOptions
                      title="Agregar por medio de factura"
                      href={`/inventarios/agregar/${
                        stateModules.moduleI.option === 1
                          ? "materia_prima"
                          : stateModules.moduleI.option === 2
                          ? "herramientas_y_equipos"
                          : stateModules.moduleI.option === 3
                          ? "insumos"
                          : "implementos"
                      }/factura`}
                    />
                    <ItemOptions
                      title="Agregar de forma independiente"
                      href={`/inventarios/agregar/${
                        stateModules.moduleI.option === 1
                          ? "materia_prima"
                          : stateModules.moduleI.option === 2
                          ? "herramientas_y_equipos"
                          : stateModules.moduleI.option === 3
                          ? "insumos"
                          : "implementos"
                      }/independiente`}
                    />
                  </Grid>
                ) : (
                  <NoAccess />
                )
              ) : (
                <LoadingData />
              )}
            </div>
          </div>
        </div>
        <div class="modules" id="modulePro">
          <div id="dProcesos" class={stateModules.modulePro.class}>
            <Avatar src={imgGuide} style={style.avatar} variant="square" />
            <div class="lado adelante">
              <Avatar src={iconProcess} style={style.icon} variant="square" />
              <h1>PROCESOS</h1>
            </div>
            <div class="lado arriba">
              {sesion !== undefined ? (
                sesion.usuario.process ? (
                  <Grid container style={style.gridContainer}>
                    <ItemOptions
                      title="Agregar Proceso"
                      href="/procesos/agregar/new"
                    />
                    <ItemOptions
                      title="Consultar Proceso"
                      href="/procesos/mostrar/search"
                    />
                    <ItemOptions
                      title="Modificar Proceso"
                      href="/procesos/mostrar/modify"
                    />
                  </Grid>
                ) : (
                  <NoAccess />
                )
              ) : (
                <LoadingData />
              )}
            </div>
            <div class="lado atras"></div>
            <div class="lado abajo"></div>
          </div>
        </div>
        <div class="modules" id="moduleC">
          <div id="dClient" class={stateModules.moduleC.class}>
            <Avatar src={imgGuide} style={style.avatar} variant="square" />
            <div class="lado adelante">
              <Avatar src={iconClients} style={style.icon} variant="square" />
              <h1>CLIENTES</h1>
            </div>
            <div class="lado arriba">
              {sesion !== undefined ? (
                sesion.usuario.clients ? (
                  <Grid container style={style.gridContainer}>
                    <ItemOptions
                      title="Agregar Cliente"
                      onclick={() =>
                        moduleSelected(
                          "moduleC",
                          1,
                          stateModules.moduleC.face,
                          "add"
                        )
                      }
                    />
                    <ItemOptions
                      title="Consultar Cliente"
                      onclick={() =>
                        moduleSelected(
                          "moduleC",
                          2,
                          stateModules.moduleC.face,
                          "search"
                        )
                      }
                    />
                    <ItemOptions
                      title="Modificar Cliente"
                      onclick={() =>
                        moduleSelected(
                          "moduleC",
                          3,
                          stateModules.moduleC.face,
                          "modify"
                        )
                      }
                    />
                  </Grid>
                ) : (
                  <NoAccess />
                )
              ) : (
                <LoadingData />
              )}
            </div>
            <div class="lado atras">
              {sesion !== undefined ? (
                sesion.usuario.clients ? (
                  <Grid container style={style.gridContainer}>
                    <ItemOptions
                      title="Empresa"
                      href={
                        stateModules.moduleC.query === "add"
                          ? "/clientes/agregar/business"
                          : `/clientes/mostrar/business/${stateModules.moduleC.query}`
                      }
                    />
                    <ItemOptions
                      title="Persona Natural"
                      href={
                        stateModules.moduleC.query === "add"
                          ? "/clientes/agregar/people"
                          : `/clientes/mostrar/people/${stateModules.moduleC.query}`
                      }
                    />
                  </Grid>
                ) : (
                  <NoAccess />
                )
              ) : (
                <LoadingData />
              )}
            </div>
            <div class="lado abajo">
              {sesion !== undefined ? (
                sesion.usuario.clients ? (
                  <Grid container style={style.gridContainer}>
                    <ItemOptions
                      title="Agregar por medio de factura"
                      href={`/inventarios/agregar/${
                        stateModules.moduleC.option === 1
                          ? "materia_prima"
                          : stateModules.moduleC.option === 2
                          ? "herramientas_y_equipos"
                          : "insumos"
                      }/factura`}
                    />
                    <ItemOptions
                      title="Agregar de forma independiente"
                      href={`/inventarios/agregar/${
                        stateModules.moduleC.option === 1
                          ? "materia_prima"
                          : stateModules.moduleC.option === 2
                          ? "herramientas_y_equipos"
                          : "insumos"
                      }/independiente`}
                    />
                  </Grid>
                ) : (
                  <NoAccess />
                )
              ) : (
                <LoadingData />
              )}
            </div>
          </div>
        </div>
        <div class="modules" id="moduleP">
          <div id="dPuntosOperacion" class={stateModules.moduleP.class}>
            <Avatar src={imgGuide} style={style.avatar} variant="square" />
            <div class="lado adelante">
              <Avatar
                src={iconPuntoOperacion}
                style={style.icon}
                variant="square"
              />
              <h2>PUNTOS OPERACIÓN</h2>
            </div>
            <div class="lado arriba">
              {sesion !== undefined ? (
                sesion.usuario.points_operation ? (
                  <Grid container style={style.gridContainer}>
                    <ItemOptions
                      title="Agregar Punto de Operación"
                      onclick={() =>
                        moduleSelected(
                          "moduleP",
                          1,
                          stateModules.moduleP.face,
                          "add"
                        )
                      }
                    />
                    <ItemOptions
                      title="Consultar Punto de Operación"
                      onclick={() =>
                        moduleSelected(
                          "moduleP",
                          2,
                          stateModules.moduleP.face,
                          "search"
                        )
                      }
                    />
                    <ItemOptions
                      title="Modificar Punto de Operación"
                      onclick={() =>
                        moduleSelected(
                          "moduleP",
                          3,
                          stateModules.moduleP.face,
                          "modify"
                        )
                      }
                    />
                  </Grid>
                ) : (
                  <NoAccess />
                )
              ) : (
                <LoadingData />
              )}
            </div>
            <div class="lado atras">
              {sesion !== undefined ? (
                sesion.usuario.points_operation ? (
                  <Grid container style={style.gridContainer}>
                    <ItemOptions
                      title="Cliente"
                      href={
                        stateModules.moduleP.query === "add"
                          ? "/puntos_operacion/agregar/client"
                          : stateModules.moduleP.query === "search"
                          ? "/puntos_operacion/mostrar/client/search"
                          : "/puntos_operacion/mostrar/client/modify"
                      }
                    />
                    <ItemOptions
                      title="Interno"
                      href={
                        stateModules.moduleP.query === "add"
                          ? "/puntos_operacion/agregar/internal"
                          : stateModules.moduleP.query === "search"
                          ? "/puntos_operacion/mostrar/internal/search"
                          : "/puntos_operacion/mostrar/internal/modify"
                      }
                    />
                    {stateModules.moduleP.query === "search" ? (
                      <ItemOptions
                        title="Todos"
                        href="/puntos_operacion/mostrar/all/search"
                      />
                    ) : (
                      ""
                    )}
                  </Grid>
                ) : (
                  <NoAccess />
                )
              ) : (
                <LoadingData />
              )}
            </div>
            <div class="lado abajo"></div>
          </div>
        </div>
        <div class="modules" id="moduleE">
          <div id="dEmpleados" class={stateModules.moduleE.class}>
            <Avatar src={imgGuide} style={style.avatar} variant="square" />
            <div class="lado adelante">
              <Avatar src={iconEmpleado} style={style.icon} variant="square" />
              <h1>EMPLEADOS</h1>
            </div>
            <div id="mEar" class="lado arriba">
              {sesion !== undefined ? (
                sesion.usuario.employees ? (
                  <Grid container style={style.gridContainer}>
                    <ItemOptions
                      title="Agregar Empleado"
                      href="/empleados/add"
                    />
                    <ItemOptions
                      title="Consultar Empleado"
                      href="/empleados/mostrar/search"
                    />
                    <ItemOptions
                      title="Modificar Empleado"
                      onclick={() =>
                        moduleSelected(
                          "moduleE",
                          3,
                          stateModules.moduleE.face,
                          "modify"
                        )
                      }
                    />
                  </Grid>
                ) : (
                  <NoAccess />
                )
              ) : (
                <LoadingData />
              )}
            </div>
            <div id="mIat" class="lado atras">
              {sesion !== undefined ? (
                sesion.usuario.employees ? (
                  <Grid container style={style.gridContainer}>
                    <ItemOptions
                      title="Datos"
                      href="/empleados/mostrar/modify/data"
                    />
                    <ItemOptions
                      title="Asignaciones"
                      href="/empleados/mostrar/modify/assignment"
                    />
                  </Grid>
                ) : (
                  <NoAccess />
                )
              ) : (
                <LoadingData />
              )}
            </div>
            <div id="mIab" class="lado abajo"></div>
          </div>
        </div>
        <div class="modules" id="moduleT">
          <div id="dTraslados" class={stateModules.moduleT.class}>
            <Avatar src={imgGuide} style={style.avatar} variant="square" />
            <div class="lado adelante">
              <Avatar src={iconTraslados} style={style.icon} variant="square" />
              <h1>TRASLADOS</h1>
            </div>
            <div class="lado arriba">
              {sesion !== undefined ? (
                sesion.usuario.transfers ? (
                  <Grid container style={style.gridContainer}>
                    <ItemOptions
                      title="Agregar Traslado"
                      href="/traslados/agregar/"
                    />
                    <ItemOptions
                      title="Consultar Traslado"
                      href="/traslados/mostrar/search"
                    />
                  </Grid>
                ) : (
                  <NoAccess />
                )
              ) : (
                <LoadingData />
              )}
            </div>
            <div id="mIat" class="lado atras"></div>
            <div id="mIab" class="lado abajo"></div>
          </div>
        </div>
        <div class="modules" id="modulePr">
          <div id="dProveedores" class={stateModules.modulePr.class}>
            <Avatar src={imgGuide} style={style.avatar} variant="square" />
            <div class="lado adelante">
              <Avatar
                src={iconProveedores}
                style={style.icon}
                variant="square"
              />
              <h1>PROVEEDORES</h1>
            </div>
            <div class="lado arriba">
              {sesion !== undefined ? (
                sesion.usuario.transfers ? (
                  <Grid container style={style.gridContainer}>
                    <ItemOptions
                      title="Agregar Proveedor"
                      onclick={() =>
                        moduleSelected(
                          "modulePr",
                          1,
                          stateModules.modulePr.face,
                          "add"
                        )
                      }
                    />
                    <ItemOptions
                      title="Consultar Proveedor"
                      onclick={() =>
                        moduleSelected(
                          "modulePr",
                          2,
                          stateModules.modulePr.face,
                          "search"
                        )
                      }
                    />
                    <ItemOptions
                      title="Modificar Proveedor"
                      onclick={() =>
                        moduleSelected(
                          "modulePr",
                          3,
                          stateModules.modulePr.face,
                          "modify"
                        )
                      }
                    />
                  </Grid>
                ) : (
                  <NoAccess />
                )
              ) : (
                <LoadingData />
              )}
            </div>
            <div id="mIat" class="lado atras">
              {sesion !== undefined ? (
                sesion.usuario.transfers ? (
                  <div>
                    {stateModules.modulePr.query === "add" ? (
                      <Grid container style={style.gridContainer}>
                        <ItemOptions
                          title="Empresa"
                          href={`/proveedor/agregar/business`}
                        />
                        <ItemOptions
                          title="Presona Natural"
                          href={`/proveedor/agregar/people`}
                        />
                      </Grid>
                    ) : (
                      <Grid container style={style.gridContainer}>
                        <ItemOptions
                          title="Empresa"
                          href={`/proveedor/mostrar/business/${stateModules.modulePr.query}`}
                        />
                        <ItemOptions
                          title="Presona Natural"
                          href={`/proveedor/mostrar/people/${stateModules.modulePr.query}`}
                        />

                        <ItemOptions
                          title="Todos"
                          href={`/proveedor/mostrar/all/${stateModules.modulePr.query}`}
                        />
                      </Grid>
                    )}
                  </div>
                ) : (
                  <NoAccess />
                )
              ) : (
                <LoadingData />
              )}
            </div>
            <div id="mIab" class="lado abajo"></div>
          </div>
        </div>
        <div class="modules" id="moduleU">
          <div id="dUsuarios" class={stateModules.moduleU.class}>
            <Avatar src={imgGuide} style={style.avatar} variant="square" />
            <div class="lado adelante">
              <Avatar src={iconUsuarios} style={style.icon} variant="square" />
              <h1>USUARIOS</h1>
            </div>
            <div class="lado arriba">
              {sesion !== undefined ? (
                sesion.usuario.users ? (
                  <Grid container style={style.gridContainer}>
                    <ItemOptions
                      title="Agregar Usuario"
                      href={`/usuarios/agregar`}
                    />
                    <ItemOptions
                      title="Mostrar Usuarios"
                      href={`/usuarios/mostrar/search`}
                    />
                    <ItemOptions
                      title="Modificar Usuarios"
                      href={`/usuarios/mostrar/modify`}
                    />
                  </Grid>
                ) : (
                  <NoAccess />
                )
              ) : (
                <LoadingData />
              )}
            </div>
            <div id="mIat" class="lado atras"></div>
            <div id="mIab" class="lado abajo"></div>
          </div>
        </div>
        <div class="modules" id="moduleV">
          <div id="dReportes" class={stateModules.moduleV.class}>
            <Avatar src={imgGuide} style={style.avatar} variant="square" />
            <div class="lado adelante">
              <Avatar src={iconVehiculos} style={style.icon} variant="square" />
              <h1>VEHICULOS</h1>
            </div>
            <div class="lado arriba">
              {sesion !== undefined ? (
                sesion.usuario.vehicles ? (
                  <Grid container style={style.gridContainer}>
                    <ItemOptions
                      title="Agregar Vehiculo"
                      href="/vehiculos/agregar/"
                    />
                    <ItemOptions
                      title="Consultar Vehiculo"
                      href="/vehiculos/mostrar/search"
                    />
                    <ItemOptions
                      title="Modificar Vehiculo"
                      href="/vehiculos/mostrar/modify"
                    />
                  </Grid>
                ) : (
                  <NoAccess />
                )
              ) : (
                <LoadingData />
              )}
            </div>
            <div id="mIat" class="lado atras"></div>
            <div id="mIab" class="lado abajo"></div>
          </div>
        </div>
      </Grid>
    </div>
  );
};

export default Home;
