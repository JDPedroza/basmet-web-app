import React from "react";
import { List, ListItem, ListItemText, Divider } from "@material-ui/core";
import {Link} from 'react-router-dom'

export const MenuIzquierda = ({ classes }) => (
  <div className={classes.list}>
    <List>
      <ListItem component={Link} button to="/perfil/modify">
        <i className="material-icons">account_box</i>
        <ListItemText
          classes={{ primary: classes.listItemText }}
          primary="Perfil"
        />
      </ListItem>
    </List>
    <Divider />
    <List>
      <ListItem component={Link} button to="/perfil/mensajes/see">
        <i className="material-icons">mail_outline</i>
        <ListItemText
          classes={{ primary: classes.listItemText }}
          primary="Mensajes"
        />
      </ListItem>
    </List>
  </div>
);
