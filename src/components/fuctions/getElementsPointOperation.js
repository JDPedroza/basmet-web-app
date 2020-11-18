const GetElementsPointOperation = (data, pointOperation) => {
  let elementsPointOperation = [];
  for (let i=0; i < data.length; i++) {
    //validamos que tenga distribuciones
    if (data[i].distributions.length !== 0) {
      //recorremos las distribuciones
      for (let j=0; j < data[i].distributions.length; j++) {
        //validamos que si este asignado al punto de operacion
        if (data[i].distributions[j].nid_point_operation === pointOperation) {
          //agregamos el elemento
          elementsPointOperation.push({
            description: data[i].title,
            nid: data[i].nid,
            quantity: data[i].distributions[j].quantity,
          });
        }
      }
    }
  }
  return elementsPointOperation;
};
export default GetElementsPointOperation;
