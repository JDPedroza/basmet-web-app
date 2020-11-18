import React, { Component } from "react";
import { Grid, Avatar } from "@material-ui/core";

//impor icon
import iconLoandigData from "../images/icon_loading.png";

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

export class LoadingData extends Component {
  render() {
    return (
      <Grid item style={style.gridItem}>
        <Avatar src={iconLoandigData} style={style.icon} variant="square" />
        OBTENIENDO INFORMACIÓN DE ACCESO
      </Grid>
    );
  }
}