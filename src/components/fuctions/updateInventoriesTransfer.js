const UpdateInventoriesTransfer = (
  arrayDB,
  arrayData,
  idReport,
  pointOperationOutput,
  pointOperationInput
) => {
  //generamos las variables necesarias para el proceso
  let newArrayElements = [];
  //validamos los datos antiguos con los nuevos
  if (arrayDB.elements.length !== 0) {
    //recorremos la data de la base de datos
    for (let i = 0; i < arrayDB.elements.length; i++) {
      //generamos las variables necesarias para el proceso
      let jsonFormatElement = null;
      let foundElement = false;
      //recorremos la data de los nuevos datos
      for (let j = 0; j < arrayData.length; j++) {
        //buscamos elementos anteriormente ingresados en la base de datos
        if (arrayDB.elements[i].nid === arrayData[j].nid) {
          //generamos las variable necesarias para el proceso
          let distributions = arrayDB.elements[i].distributions;
          //DISTRIBUTIONS validamos los datos antiguos con los nuevos
          if (arrayDB.elements[i].distributions.length !== 0) {
            //recorremos las distribuciones para hacer los cambios necesarios
            //generamos las variables necesarias para el proceso
            let foundPointOperationOutput=false;
            let foundPointOperationInput=false;
            let tempDistributionLength = arrayDB.elements[i].distributions.length;
            for (let k = 0; k < tempDistributionLength; k++) {
              //buscamos la distribucion para el punto de operacion referente a restar
              if (
                arrayDB.elements[i].distributions[k].nid_point_operation ===
                pointOperationOutput.id
              ) {
                //validamos si debemos sumar o restar los elementos
                //metodo para restar
                distributions[k].quantity =
                  parseInt(arrayDB.elements[i].distributions[k].quantity) -
                  parseInt(arrayData[j].quantity);
                  foundPointOperationOutput = true;
              }
              //buscamos la distribucion para el punto de operacion referente a sumar
              if (
                arrayDB.elements[i].distributions[k].nid_point_operation ===
                pointOperationInput.id
              ) {
                distributions[k].quantity =
                  parseInt(arrayDB.elements[i].distributions[k].quantity) +
                  parseInt(arrayData[j].quantity);
                foundPointOperationInput = true;
              }
              //validamos que se hallan asignado a algun punto
              if (
                !foundPointOperationInput &&
                k === tempDistributionLength - 1
              ) {
                //no encontro en la distribucion el elemento
                //generamos la nueva distribucion
                distributions.push({
                  assignments: [],
                  name: pointOperationInput.name,
                  nid_point_operation: pointOperationInput.id,
                  quantity: parseInt(arrayData[j].quantity),
                });
              }
            }
          }
          //generamos el resto de datos necesarios en el proceso
          jsonFormatElement = {
            distributions,
            last_modify: idReport,
            nid: arrayDB.elements[i].nid,
            providers: arrayDB.elements[i].providers,
            title: arrayDB.elements[i].title,
            quantity: arrayDB.elements[i].quantity,
          };
          foundElement = true;
        } else {
          //agregar el elemento que ya existia en la db
          if (j === arrayData.length - 1 && !foundElement) {
            jsonFormatElement = {
              nid: arrayDB.elements[i].nid,
              quantity: arrayDB.elements[i].quantity,
              providers: arrayDB.elements[i].providers,
              title: arrayDB.elements[i].title,
              distributions: arrayDB.elements[i].distributions,
              last_modify: idReport,
            };
          }
        }
      }
      if (jsonFormatElement !== null) {
        newArrayElements.push(jsonFormatElement);
      }
    }
  }
  return newArrayElements;
};

export default UpdateInventoriesTransfer;
