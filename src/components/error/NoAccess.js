import React from "react";
import Cube from "react-3d-cube";

import "./Page404.scss";
import iconNoAccess from "./images/icon_no_access.jpg";
import { useStateValue } from "../../sesion/store";

import { Container, Avatar, Link, Typography } from "@material-ui/core";

const style = {
  icon: {
    width: "100%",
    height: "100%",
  },
};

function NoAccess() {
  const [{ sesion }, dispatch] = useStateValue();

  return (
    <Container component="main" maxWidth="md" justify="center">
      <div className="App" style={{ marginTop: "100px", marginBottom:"100px" }}>
        <div
          style={{
            width: 300,
            height: 300,
            margin: "auto",
          }}
        >
          <Cube size={300}>
            <Avatar
              src={iconNoAccess}
              style={style.icon}
              variant="square"
              alt="front"
            />
            <Avatar
              src={iconNoAccess}
              style={style.icon}
              variant="square"
              alt="right"
            />
            <Avatar
              src={iconNoAccess}
              style={style.icon}
              variant="square"
              alt="back"
            />
            <Avatar
              src={iconNoAccess}
              style={style.icon}
              variant="square"
              alt="left"
            />
            <Avatar
              src={iconNoAccess}
              style={style.icon}
              variant="square"
              alt="top"
            />
            <Avatar
              src={iconNoAccess}
              style={style.icon}
              variant="square"
              alt="bottom"
            />
          </Cube>
        </div>
      </div>
      <Typography align="center">
          <Link href={sesion === undefined ? "/iniciar_sesion" : "/"}>{sesion === undefined ? "VE A INICIAR SESIÓN" : "VE A PRINCIPAL"}</Link>
        </Typography>
    </Container>
  );
}

export default NoAccess;