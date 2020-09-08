export const crearKeyword = (text) => {
  const arregloKeywords = [];
  const arregloPalabras = text.split(" ");
  arregloPalabras.forEach((palabra) => {
    let palabraResumida = "";
    palabra.split("").forEach((letra) => {
      palabraResumida += letra;
      arregloKeywords.push(palabraResumida.toLowerCase());
    });
  });

  let letraResumida = "";
  text.split("").forEach((letra) => {
    letraResumida += letra;
    arregloKeywords.push(letraResumida);
  });

  return arregloKeywords;
};
