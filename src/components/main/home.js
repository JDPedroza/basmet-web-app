import React, { useState } from "react";
import imgGuide from "./images/Guia.jpg";
import iconInventario from "./images/icon_inventario.png";
import iconPuntoOperacion from "./images/icon_puntosOperacion.png";
import iconEmpleado from "./images/icon_empleado.png";
import iconTraslados from "./images/icon_translados.png";
import iconProveedores from "./images/icon_proveedores.png";
import iconUsuarios from "./images/icon_usuarios.png";

import { ItemOptions } from "./components/itemOptions";

import { Avatar, Grid } from "@material-ui/core";
import "./styles/home.scss";
import "./styles/moduleI.scss";

const style = {
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
  gridContainerExtras: {
    width: "100%",
    height: "40%",
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
  let [stateModules, changeStateModules] = useState({
    moduleI: {
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
  });

  const moduleSelected = (id, value, face, query) => {
    let stateModulesTemp = {};

    if (id === "moduleI") {
      stateModulesTemp = stateModules.moduleI;
    } else if (id === "moduleP") {
      stateModulesTemp = stateModules.moduleP;
    } else if (id === "moduleE") {
      stateModulesTemp = stateModules.moduleE;
    } else if (id === "moduleE") {
      stateModulesTemp = stateModules.moduleT;
    } else if (id === "modulePr") {
      stateModulesTemp = stateModules.modulePr;
    } else {
      stateModulesTemp = stateModules.moduleU;
    }

    console.log(stateModulesTemp.query);

    if (face === "front") {
      stateModulesTemp.class = "selectOptionBack";
      stateModulesTemp.face = "back";
      stateModulesTemp.option = value;
      stateModulesTemp.query = query;
    } else if (face === "back" && stateModulesTemp.query === "add") {
      stateModulesTemp.class = "selectOptionDown";
      stateModulesTemp.face = "down";
      stateModulesTemp.option = value;
    } else {
      props.history.push("/");
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
      "moduleP",
      "moduleE",
      "moduleE",
      "modulePr",
      "moduleU",
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
      <div class="modules" id="moduleI">
        <div id="dInventarios" class={stateModules.moduleI.class}>
          <Avatar src={imgGuide} style={style.avatar} variant="square" />
          <div class="lado adelante">
            <Avatar src={iconInventario} style={style.icon} variant="square" />
            <h1>INVENTARIO</h1>
          </div>
          <div class="lado arriba">
            <Grid container style={style.gridContainer}>
              <ItemOptions
                title="Agregar Elemento"
                onclick={() =>
                  moduleSelected("moduleI", 1, stateModules.moduleI.face, "add")
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
          </div>
          <div class="lado atras">
            <Grid container style={style.gridContainer}>
              <ItemOptions
                title="Materia Prima"
                onclick={
                  stateModules.moduleI.query === "add"
                    ? () =>
                        moduleSelected("moduleI", 1, stateModules.moduleI.face)
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
                        moduleSelected("moduleI", 2, stateModules.moduleI.face)
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
                        moduleSelected("moduleI", 3, stateModules.moduleI.face)
                    : ""
                }
                href={
                  stateModules.moduleI.query !== "add"
                    ? `/inventarios/mostrar/insumos/${stateModules.moduleI.query}`
                    : ""
                }
              />
              {stateModules.moduleI.option === 1 &&
              stateModules.moduleI.face === "back" ? (
                ""
              ) : (
                <Grid container style={style.gridContainerExtras}>
                  <ItemOptions
                    title="Productos en Proceso"
                    href={`/inventarios/mostrar/productos_en_proceso/${stateModules.moduleI.query}`}
                  />
                  <ItemOptions
                    title="Productos en Embalaje"
                    href={`/inventarios/mostrar/productos_en_embalaje/${stateModules.moduleI.query}`}
                  />
                </Grid>
              )}
            </Grid>
          </div>
          <div class="lado abajo">
            <Grid container style={style.gridContainer}>
              <ItemOptions
                title="Agregar por medio de factura"
                href={`/inventarios/agregar/${
                  stateModules.moduleI.option === 1
                    ? "materia_prima"
                    : stateModules.moduleI.option === 2
                    ? "herramientas_y_equipos"
                    :"insumos"
                }/factura`}
              />
              <ItemOptions
                title="Agregar de forma independiente"
                href={`/inventarios/agregar/${
                  stateModules.moduleI.option === 1
                    ? "materia_prima"
                    : stateModules.moduleI.option === 2
                    ? "herramientas_y_equipos"
                    : "insumos"
                }/independiente`}
              />
            </Grid>
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
            <Grid container style={style.gridContainer}>
              <ItemOptions
                title="Agregar Punto de Operación"
                href="/puntoOperacion/agregar"
              />
              <ItemOptions
                title="Consultar Punto de Operación"
                onclick={() =>
                  moduleSelected("moduleP", 2, stateModules.moduleP.face)
                }
              />
              <ItemOptions
                title="Modificar Punto de Operación"
                onclick={() =>
                  moduleSelected("moduleP", 3, stateModules.moduleP.face)
                }
              />
            </Grid>
          </div>
          <div class="lado atras">
            <Grid container style={style.gridContainer}>
              <ItemOptions
                title="Modificar Punto de Operación"
                onclick={() =>
                  moduleSelected("moduleP", 3, stateModules.moduleP.face)
                }
              />
            </Grid>
          </div>
          <div class="lado abajo">
            <div class="optionsP optionsPLab" id="pQueryEmpleados">
              <p>Empleados</p>
            </div>
            <div class="optionsP optionsPLab" id="pQueryHerramientas">
              <p>Herramientas</p>
            </div>
            <div class="optionsP optionsPLab" id="pQueryProductos">
              <p>Productos</p>
            </div>
            <div class="optionsP optionsPLab" id="pQueryTraslados">
              <p>Traslados</p>
            </div>
            <div class="optionsP optionsPLab" id="pQueryPersonalizada">
              <p>Consulta Personalizada</p>
            </div>
          </div>
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
            <div class="optionsE optionsELar" id="eEmpleado">
              <p>Empleado</p>
            </div>
            <div class="optionsE optionsELar" id="eInsumos">
              <p>Insumos</p>
            </div>
          </div>
          <div id="mIat" class="lado atras"></div>
          <div id="mIab" class="lado abajo"></div>
        </div>
      </div>
      <div class="modules" id="moduleT">
        <div id="dTraslados" class={stateModules.moduleT.class}>
          <Avatar src={imgGuide} style={style.avatar} variant="square" />
          <div class="lado adelante">
            <Avatar src={iconTraslados} style={style.icon} variant="square" />
            <h1>TRANSLADOS</h1>
          </div>
          <div class="lado arriba">
            <div class="optionsT optionsTLar" id="tTranslados">
              <p>Traslados</p>
            </div>
            <div class="optionsT optionsTLar" id="tVehiculos">
              <p>Vehiculos</p>
            </div>
          </div>
          <div id="mIat" class="lado atras"></div>
          <div id="mIab" class="lado abajo"></div>
        </div>
      </div>
      <div class="modules" id="modulePr">
        <div id="dProveedores" class={stateModules.modulePr.class}>
          <Avatar src={imgGuide} style={style.avatar} variant="square" />
          <div class="lado adelante">
            <Avatar src={iconProveedores} style={style.icon} variant="square" />
            <h1>PROVEEDORES</h1>
          </div>
          <div class="lado arriba">
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
          </div>
          <div id="mIat" class="lado atras">
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
            <div class="optionsU optionsULar" id="queryItems">
              <p>Agregar Usuario</p>
            </div>
            <div class="optionsU optionsULar" id="queryItems">
              <p>Consultar Usuario</p>
            </div>
            <div class="optionsU optionsULar" id="queryItems">
              <p>Modificar Usuario</p>
            </div>
          </div>
          <div id="mIat" class="lado atras"></div>
          <div id="mIab" class="lado abajo"></div>
        </div>
      </div>
    </div>
  );
};

export default Home;
