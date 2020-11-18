import React, { Component } from "react";
import { Grid, Avatar } from "@material-ui/core";

//impor icon
import iconNoAccess from "../images/icon_no_access-.png";

const style = {
  gridItem: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  icon: {
    margin: "15% 0 5% 23%",
    width: "50%",
    height: "50%",
  },
};

export class NoAccess extends Component {
  render() {
    return (
      <Grid item style={style.gridItem}>
        <Avatar src={iconNoAccess} style={style.icon} variant="square" />
        NO TIENES ACCESO A ESTE MODULO. CONTACTA AL ADMINISTRADOR
      </Grid>
    );
  }
}
