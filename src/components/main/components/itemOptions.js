import React, { Component } from "react";
import {Grid, Button} from '@material-ui/core'

const style = {
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


export class ItemOptions extends Component {
  render() {
    return (
      <Grid item style={style.gridItem}>
        <Button
          type="button"
          fullWidth
          size="large"
          color="primary"
          style={style.optionsModules}
          onClick={this.props.onclick || ""}
          href={this.props.href || ""}
        >
          {this.props.title}
        </Button>
      </Grid>
    );
  }
}

