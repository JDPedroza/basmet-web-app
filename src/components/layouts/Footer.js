import React from "react";

const styles = {
  footer: {
    backgroundColor: "#2E3B55",
    position: "absolute",
    left: 0,
    width: "100%",
    height: "50px",
    color: "white",
    textAlign: "center",
  },
};

const Footer = () => {
  return (
    <footer style={styles.footer}>
      <p>
        © {new Date().getFullYear()} Copyright: BASCULAS Y METALMECANICAS S.A.S
      </p>
    </footer>
  );
};

export default Footer;
