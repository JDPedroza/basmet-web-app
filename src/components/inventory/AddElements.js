import React, { useState, useEffect, useCallback } from "react";
import {
  Container,
  Paper,
  Grid,
  Breadcrumbs,
  Link,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Divider,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  IconButton,
} from "@material-ui/core";
import Autocomplete, {
  createFilterOptions,
} from "@material-ui/lab/Autocomplete";
import { consumerFirebase } from "../../server";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";

//utils
import { useStateValue } from "../../sesion/store";
import MomentUtils from "@date-io/moment";
import { v4 as uuidv4 } from "uuid";
import { openMensajePantalla } from "../../sesion/actions/snackBarAction";

//icons
import HomeIcon from "@material-ui/icons/Home";
import AddIcon from "@material-ui/icons/Add";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";

const style = {
  paper: {
    backgraundColor: "#f5f5ff",
    padding: "20px",
    minheight: 650,
  },
  paperForm: {
    backgraundColor: "#f5f5ff",
    marginTop: 2,
    padding: "20px",
    minheight: 650,
  },
  form: {
    width: "100%",
    padding: 20,
    backgraundColor: "#f5f5ff",
  },
  submit: {
    marginTop: 15,
    marginBottom: 20,
  },
  formControl: {
    margin: 1,
    minWidth: 120,
  },
};

const filter = createFilterOptions();

const AddElement = (props) => {
  const { type, table } = props.match.params;
  const [{ sesion }, dispatch] = useStateValue();
  const [lastItemsProvider, setLastItemsProvider] = useState([
    { title: "", nid: "" },
  ]);
  const [itemsProvider, setItemsProvider] = useState([{ title: "", nid: "" }]);

  let [providers, setDataProviders] = useState({
    bill: false,
    data: [],
  });

  let [pointsOperation, seDataPointsOperation] =  useState({
    data: []
  })

  let [provider, setDataProvider] = useState({
    id: 0,
    name_provider: "",
    type_document: "",
    nid: "",
    country: "",
    city: "",
    address: "",
    email: "",
    phone: "",
    type_provider: "",
    nid_elements_provider: "",
  });

  let [bill, setDataBill] = useState({
    nid: 0,
    date: "",
    sub_total: 0,
    value_iva: 0,
    value_rf: 0,
    value_ica: 0,
    total: 0,
  });

  let [selectedProvider, setSelectedProvider] = useState(null);

  let [selectedDate, setSelectedDate] = useState(new Date());

  let [items, setDataItems] = useState({
    data: [
      {
        nid: 0,
        quantity: 0,
        description: "",
        unit_value: 0,
        total_value: 0,
      },
    ],
    size: 1,
  });

  let [billExtras, setBillExtras] = useState({
    iva: false,
    rf: false,
    ica: false,
  });

  const [value, setValue] = useState([{ title: "" }]);

  const fetchMyAPI = useCallback(async () => {

    if (type === "factura") {
      let objectQuery = props.firebase.db
        .collection("Providers")
        .orderBy("nid");

      const snapshot = await objectQuery.get();

      const arrayProviders = snapshot.docs.map((doc) => {
        let data = doc.data();
        let id = doc.id;
        return { id, ...data };
      });

      setDataProviders((prev) => ({
        ...prev,
        bill: true,
        data: arrayProviders,
      }));
    } else {
      let dataInventory = {};
      let itemsInventory = [];
      if (table === "materia_prima") {
        let data = await props.firebase.db
          .collection("RawMaterial")
          .doc("6Ti3WLE0cav83i0rYozs")
          .get();
        dataInventory = data.data();
      } else if (table === "herramientas_y_equipos") {
        let data = await props.firebase.db
          .collection("ToolsEquipment")
          .doc("FV7JGTCXeZHBBNOMX7IZ")
          .get();
        dataInventory = data.data();
      } else {
        let data = await props.firebase.db
          .collection("Supplies")
          .doc("TdxeXYYQKxGxfF3dQIUe")
          .get();
        dataInventory = data.data();
      }

      for (let i = 0; i < dataInventory.elements.length; i++) {
        let jsonFormatElements = {
          title: dataInventory.elements[i].title,
          nid: dataInventory.elements[i].nid,
        };
        itemsInventory.push(jsonFormatElements);
      }
      setItemsProvider(itemsInventory);
    }


  }, []);

  useEffect(() => {
    fetchMyAPI();
  }, [fetchMyAPI]);

  const handleItemChange = (i, event) => {
    const data = items.data;
    const name = event.target.name;
    const value = event.target.value;

    if (name === "quantity") {
      data[i].quantity = value;
    } else if (name === "description") {
      data[i].description = value;
    } else {
      data[i].unit_value = value;
    }

    data[i].total_value = data[i].quantity * data[i].unit_value;

    setDataItems({ data });

    updateDataBill();
  };

  const handleItemAdd = () => {
    const tempValue = value;
    tempValue.push({ title: "" });

    setValue(tempValue);

    const data = items.data;
    let size = data.length;
    data.push({
      quantity: 0,
      description: "",
      unit_value: 0,
      total_value: 0,
    });

    setDataItems({
      data,
      size,
    });
  };

  const handleItemRemove = (i) => {
    const tempValue = value;
    tempValue.splice(i, 1);
    setValue(tempValue);

    const data = items.data;
    data.splice(i, 1);
    let size = data.length;
    setDataItems({
      data,
      size,
    });

    updateDataBill();
  };

  const updateDataProvider = async (provider) => {
    if (provider !== null) {
      setDataProvider(() => ({
        id: provider.id,
        name_provider: provider.business || provider.contact_name,
        type_document: provider.type_document,
        nid: provider.nid,
        country: provider.country,
        city: provider.city,
        address: provider.address,
        email: provider.email || provider.contact_email,
        phone: provider.phone || provider.contact_phone,
        type_provider: provider.type_provider,
        nid_elements_provider: provider.nid_elements_provider,
      }));
    }

    let data = await props.firebase.db
      .collection("ElementsProviders")
      .doc(provider.nid_elements_provider)
      .get();

    let elementsProvider = data.data();
    let itemsProvider = elementsProvider.elements;

    setLastItemsProvider(itemsProvider);
    setItemsProvider(itemsProvider);
  };

  const changeDataBill = (e) => {
    const { name, value } = e.target;

    setDataBill((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDateChange = (date) => {
    const format = date.format("DD-MM-YYYY");
    setSelectedDate(date);

    setDataBill((prev) => ({
      ...prev,
      format,
    }));
  };

  const updateDataBill = () => {
    const data = items.data;
    let tempBill = {
      sub_total: 0,
      value_iva: 0,
      value_rf: 0,
      value_ica: 0,
      total: 0,
    };

    let subTotal = 0;

    for (let i = 0; i < data.length; i++) {
      subTotal += data[i].total_value;
    }
    tempBill.sub_total = subTotal;
    tempBill.value_iva = subTotal * 0.19;

    tempBill.total =
      tempBill.sub_total +
      tempBill.value_iva +
      tempBill.value_rf +
      tempBill.value_ica;

    setDataBill({
      ...bill,
      sub_total: tempBill.sub_total,
      value_iva: tempBill.value_iva,
      value_rf: tempBill.value_rf,
      value_ica: tempBill.value_ica,
      total: tempBill.total,
    });
  };

  const handleChange = (event) => {
    setBillExtras((prev) => ({
      ...prev,
      [event.target.name]: event.target.checked,
    }));
    updateDataBill();
  };

  const saveDataFirebase = async (e) => {
    e.preventDefault();
    const { type, table } = props.match.params;

    let jsonFormatBillBuy = {};
    let jsonFormatProvider = {};
    let jsonFormatElementsProvider = {};
    let jsonFormatAddElements = {};

    if (type === "factura") {
      //add BillBuy
      jsonFormatBillBuy = {};

      let today = new Date();
      let dd = today.getDate();
      let mm = today.getMonth() + 1;
      let yyyy = today.getFullYear();
      let date = `${dd}-${mm}-${yyyy}`;

      let total = 0;
      jsonFormatBillBuy.nid_provider = provider.nid;
      jsonFormatBillBuy.nid = bill.nid;

      if (bill.date === "") {
        jsonFormatBillBuy.date = date;
      } else {
        jsonFormatBillBuy.date = bill.date;
      }
      jsonFormatBillBuy.sub_total = bill.sub_total;
      total = bill.sub_total;
      if (billExtras.iva) {
        jsonFormatBillBuy.value_iva = bill.value_iva;
        total += bill.value_iva;
      }
      if (billExtras.rf) {
        jsonFormatBillBuy.value_rf = bill.value_rf;
        total += bill.value_rf;
      }
      if (billExtras.ica) {
        jsonFormatBillBuy.value_ica = bill.value_ica;
        total += bill.value_ica;
      }
      jsonFormatBillBuy.total = total;
      jsonFormatBillBuy.items = items.data;

      let idBill = "";

      await props.firebase.db
        .collection("BullBuy")
        .add(jsonFormatBillBuy)
        .then((success) => {
          idBill = success.id;
        })
        .catch((error) => {
          console.log("error: ", error);
        });

      //update Providers
      let dataProviders = await props.firebase.db
        .collection("Providers")
        .doc(provider.id)
        .get();

      jsonFormatProvider = dataProviders.data();

      jsonFormatProvider.last_bill = idBill;

      await props.firebase.db
        .collection("Providers")
        .doc(provider.id)
        .set(jsonFormatProvider, { merge: true })
        .then((success) => {
          console.log("Actualizado: Provider");
        })
        .catch((error) => {
          console.log("error: ", error);
        });

      //update ElementsProviders
      jsonFormatElementsProvider = { elements: itemsProvider };

      await props.firebase.db
        .collection("ElementsProviders")
        .doc(provider.nid_elements_provider)
        .set(jsonFormatElementsProvider, { merge: true })
        .then((success) => {
          console.log("Actualizado: ElementsProviders");
        });
    }

    //update Inventorys
    let inventoryTemp = null;

    if (table === "materia_prima") {
      let data = await props.firebase.db
        .collection("RawMaterial")
        .doc("6Ti3WLE0cav83i0rYozs")
        .get();

      inventoryTemp = data.data();
    } else if (table === "herramientas_y_equipos") {
      let data = await props.firebase.db
        .collection("ToolsEquipment")
        .doc("FV7JGTCXeZHBBNOMX7IZ")
        .get();

      inventoryTemp = data.data();
    } else {
      let data = await props.firebase.db
        .collection("Supplies")
        .doc("TdxeXYYQKxGxfF3dQIUe")
        .get();

      inventoryTemp = data.data();
    }

    jsonFormatAddElements = { elements: [] };
    let idProvider = "";
    if (type === "factura") {
      idProvider = provider.id;
    }

    if (inventoryTemp.elements.length !== 0) {
      for (let i = 0; i < inventoryTemp.elements.length; i++) {
        let newJsonElement = {};
        for (let j = 0; j < items.data.length; j++) {
          if (inventoryTemp.elements[i].nid === items.data[j].nid) {
            let quantity =
              parseInt(inventoryTemp.elements[i].quantity) +
              parseInt(items.data[j].quantity);
            let providers = inventoryTemp.elements[i].providers;
            let title = items.data[j].description;
            const provider = providers.find(
              (element) => element === idProvider
            );
            if (provider === "undefined") {
              providers.push(idProvider);
              newJsonElement = {
                nid: inventoryTemp.elements[i].nid,
                quantity,
                providers,
                title,
              };
            } else {
              newJsonElement = {
                nid: inventoryTemp.elements[i].nid,
                quantity,
                providers,
                title,
              };
            }
          } else {
            newJsonElement = inventoryTemp.elements[i];
          }
        }
        jsonFormatAddElements.elements.push(newJsonElement);
      }
    } else {
      for (let i = 0; i < items.data.length; i++) {
        let providers = [idProvider];
        let newJsonElement = {
          nid: items.data[i].nid,
          quantity: parseInt(items.data[i].quantity),
          providers,
          title: items.data[i].description,
        };
        jsonFormatAddElements.elements.push(newJsonElement);
      }
    }

    if (table === "materia_prima") {
      await props.firebase.db
        .collection("RawMaterial")
        .doc("6Ti3WLE0cav83i0rYozs")
        .set(jsonFormatAddElements, { merge: true })
        .then((success) => {
          openMensajePantalla(dispatch, {
            open: true,
            mensaje: "Se guardaron los cambios",
          });
        })
        .catch((error) => {
          console.log("Error:", error);
        });
    } else if (table === "herramientas_y_equipos") {
      await props.firebase.db
        .collection("ToolsEquipment")
        .doc("6Ti3WLE0cav83i0rYozs")
        .set(jsonFormatAddElements, { merge: true })
        .then((success) => {
          openMensajePantalla(dispatch, {
            open: true,
            mensaje: "Se guardaron los cambios",
          });
        })
        .catch((error) => {
          console.log("Error:", error);
        });
    } else {
      await props.firebase.db
        .collection("Supplies")
        .doc("TdxeXYYQKxGxfF3dQIUe")
        .set(jsonFormatAddElements, { merge: true })
        .then((success) => {
          openMensajePantalla(dispatch, {
            open: true,
            mensaje: "Se guardaron los cambios",
          });
        })
        .catch((error) => {
          console.log("Error:", error);
        });
    }

    let jsonFormatModifyUser = {};

    let today = new Date();
    let dd = today.getDate();
    let mm = today.getMonth() + 1;
    let yyyy = today.getFullYear();
    let date = `${dd}-${mm}-${yyyy}`;

    if (type === "factura") {
      jsonFormatModifyUser = {
        user: sesion,
        table: table,
        date: date,
        add_bill: jsonFormatBillBuy,
        last_provider: provider,
        modify_provider: jsonFormatProvider,
        last_elements_provider: lastItemsProvider,
        modify_elements_provider: jsonFormatElementsProvider,
        add_elements_inventary: items,
      };
    } else {
      jsonFormatModifyUser = {
        user: sesion,
        table: table,
        date: date,
        add_elements_inventary: items,
      };
    }

    /*
    await props.firebase.db
        .collection("BullBuy")
        .add(jsonFormatBillBuy)
        .then((success) => {
          idBill = success.id;
        })
        .catch((error) => {
          console.log("error: ", error);
        });
*/

    await props.firebase.db
      .collection("ModifyUserInventory")
      .add(jsonFormatModifyUser)
      .then((success) => {
        props.history.replace(`/inventarios/mostrar/${table}/search`);
      })
      .catch((error) => {
        console.log("Error:", error);
      });
  };

  return (
    <Container component="main" maxWidth="md" justify="center">
      <Paper style={style.paper}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Breadcrumbs aria-label="breadcrumbs">
              <Link color="inherit" style={style.link} href="/home">
                <HomeIcon />
                Principal
              </Link>
              <Typography color="textPrimary">Inventario</Typography>
              <Typography color="textPrimary">Agregar</Typography>
              <Typography color="textPrimary">
                {table === "materia_prima"
                  ? "Materia Prima"
                  : table === "herramientas_y_equipos"
                  ? "Herramientas y Equipos"
                  : "Insumos"}
              </Typography>
              <Typography color="textPrimary">
                {type === "factura" ? "Factura" : "Independiente"}
              </Typography>
            </Breadcrumbs>
          </Grid>
        </Grid>
      </Paper>
      {providers.bill ? (
        <Paper style={style.paperForm}>
          <Grid container spacing={2} style={style.form}>
            <Grid item xs={12} md={12}>
              <Typography color="textPrimary">Datos Empresa</Typography>
            </Grid>
            <Grid item xs={12} md={12}>
              <Autocomplete
                id="select_provider"
                options={providers.data}
                value={selectedProvider}
                onChange={(event, newDataProvider) => {
                  updateDataProvider(newDataProvider);
                  setSelectedProvider(newDataProvider);
                }}
                getOptionLabel={(provider) =>
                  provider.business || provider.contact_name
                }
                fullWidth
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Empresa"
                    variant="outlined"
                    required
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel id="demo-controlled-open-select-label">
                  Tipo Identificación
                </InputLabel>
                <Select
                  disabled
                  name="type_document"
                  labelId="demo-controlled-open-select-label"
                  id="demo-controlled-open-select"
                  value={provider.type_document}
                  fullWidth
                >
                  <MenuItem value={"Tipo Identificación"}>
                    <em>AA</em>
                  </MenuItem>
                  <MenuItem value={"NIT"}>NIT</MenuItem>
                  <MenuItem value={"CC"}>CC</MenuItem>
                  <MenuItem value={"CE"}>CE</MenuItem>
                  <MenuItem value={"PA"}>PA</MenuItem>
                  <MenuItem value={"RC"}>RC</MenuItem>
                  <MenuItem value={"TI"}>TI</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                disabled
                name="nid"
                variant="outlined"
                fullWidth
                label={provider.type_document || "Tipo Identificación"}
                value={provider.nid}
              />
            </Grid>
            <Divider light />
            <Grid item xs={12} md={12}>
              <Typography color="textPrimary">Datos Factura</Typography>
            </Grid>
            <MuiPickersUtilsProvider utils={MomentUtils}>
              <Grid item xs={12} md={3}>
                <TextField
                  name="nid"
                  variant="outlined"
                  fullWidth
                  label="Factura de compra Nº"
                  onChange={changeDataBill}
                  value={bill.nid}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <KeyboardDatePicker
                  disableToolbar
                  fullWidth
                  variant="inline"
                  format="DD/MM/yyyy"
                  id="bill_date"
                  label="Fecha"
                  value={selectedDate}
                  onChange={handleDateChange}
                  KeyboardButtonProps={{
                    "aria-label": "change date",
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6} style={{ alignItems: "center" }}>
                <FormGroup row>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={billExtras.iva}
                        onChange={handleChange}
                        name="iva"
                        color="primary"
                      />
                    }
                    label="IVA"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={billExtras.rf}
                        onChange={handleChange}
                        name="rf"
                        color="primary"
                      />
                    }
                    label="Retefuente"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={billExtras.ica}
                        onChange={handleChange}
                        name="ica"
                        color="primary"
                      />
                    }
                    label="Rete-ICA"
                  />
                </FormGroup>
              </Grid>
            </MuiPickersUtilsProvider>
          </Grid>
        </Paper>
      ) : (
        ""
      )}
      <Paper style={style.paperForm}>
        <Grid container spacing={2} style={style.form}>
          <Grid item xs={12} md={12}>
            <Typography color="textPrimary">Datos Elementos</Typography>
          </Grid>
        </Grid>
        <TableContainer item xs={12} sm={12}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell
                  align="center"
                  style={
                    type === "factura" ? { width: "10%" } : { width: "15%" }
                  }
                >
                  Cantidad
                </TableCell>
                <TableCell
                  align="center"
                  style={
                    type === "factura" ? { width: "50%" } : { width: "80%" }
                  }
                >
                  Descripción
                </TableCell>
                {type === "factura" ? (
                  <TableCell align="center" style={{ width: "15%" }}>
                    Valor Unitario
                  </TableCell>
                ) : (
                  ""
                )}
                {type === "factura" ? (
                  <TableCell align="center" style={{ width: "15%" }}>
                    Valor Total
                  </TableCell>
                ) : (
                  ""
                )}
                <TableCell align="center" style={{ width: "10%" }}>
                  <IconButton
                    aria-label="addElement"
                    onClick={() => handleItemAdd()}
                  >
                    <AddIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.data.map((item, idx) => {
                return (
                  <TableRow key={idx}>
                    <TableCell align="center">
                      <TextField
                        fullWidth
                        name="quantity"
                        id="quantity"
                        label=""
                        type="number"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(idx, e)}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Autocomplete
                        fullWidth
                        value={value[idx].title}
                        onChange={(event, itemAutoComplet) => {
                          const data = items.data;
                          let tempValue = null;
                          if (typeof itemAutoComplet === "string") {
                            tempValue = value;
                            tempValue[idx] = {
                              title: itemAutoComplet.inputValue,
                            };
                            setValue(tempValue);
                            data[idx].description = itemAutoComplet.inputValue;
                          } else if (
                            itemAutoComplet &&
                            itemAutoComplet.inputValue
                          ) {
                            tempValue = value;
                            tempValue[idx] = {
                              title: itemAutoComplet.inputValue,
                            };
                            setValue(tempValue);
                            let nid = uuidv4();
                            itemsProvider.push({
                              title: itemAutoComplet.inputValue,
                              nid: nid,
                            });
                            data[idx].description = itemAutoComplet.inputValue;
                            data[idx].nid = nid;
                          } else {
                            if (itemAutoComplet !== null) {
                              tempValue = value;
                              tempValue[idx] = itemAutoComplet;
                              setValue(tempValue);
                              data[idx].description = itemAutoComplet.title;
                              data[idx].nid = itemAutoComplet.nid;
                            } else {
                              tempValue = value;
                              tempValue[idx] = { title: "", nid: "" };
                              setValue(tempValue);
                              data[idx].description = "";
                              data[idx].nid = "";
                            }
                          }
                          setDataItems({
                            data,
                          });
                        }}
                        filterOptions={(options, params) => {
                          const filtered = filter(options, params);

                          // Suggest the creation of a new value
                          if (params.inputValue !== "") {
                            filtered.push({
                              inputValue: params.inputValue,
                              title: `Agregar "${params.inputValue}"`,
                            });
                          }
                          return filtered;
                        }}
                        selectOnFocus
                        clearOnBlur
                        handleHomeEndKeys
                        id=""
                        options={itemsProvider}
                        getOptionLabel={(item) => {
                          // Value selected with enter, right from the input
                          if (typeof item === "string") {
                            return item;
                          }
                          // Add "xxx" item created dynamically
                          if (item.inputValue) {
                            return item.inputValue;
                          }
                          // Regular item
                          return item.title;
                        }}
                        renderOption={(option) => option.title}
                        freeSolo
                        renderInput={(params) => (
                          <TextField {...params} fullWidth label="" />
                        )}
                      />
                    </TableCell>
                    {type === "factura" ? (
                      <TableCell align="center">
                        <TextField
                          fullWidth
                          name="unit_value"
                          id="unit_value"
                          label=""
                          type="number"
                          value={item.unit_value}
                          onChange={(e) => handleItemChange(idx, e)}
                        />
                      </TableCell>
                    ) : (
                      ""
                    )}
                    {type === "factura" ? (
                      <TableCell align="center">
                        <TextField
                          fullWidth
                          disabled
                          name="total_value"
                          id="total_value"
                          label=""
                          type="number"
                          value={item.total_value}
                          onChange={(e) => handleItemChange(idx, e)}
                        />
                      </TableCell>
                    ) : (
                      ""
                    )}
                    <TableCell align="center">
                      <IconButton
                        aria-label="edit"
                        onClick={() => handleItemRemove(idx)}
                      >
                        <HighlightOffIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      {type === "factura" ? (
        <Paper style={style.paperForm}>
          <TableContainer item xs={12} sm={12}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align="center">Sub-Total</TableCell>
                  <TableCell align="center">IVA</TableCell>
                  <TableCell align="center">Retefuente</TableCell>
                  <TableCell align="center">Rete-ICA</TableCell>
                  <TableCell align="center">Total</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell align="center">{bill.sub_total}</TableCell>
                  <TableCell align="center">
                    {billExtras.iva ? bill.value_iva : "0"}
                  </TableCell>
                  <TableCell align="center">
                    {billExtras.rf ? bill.value_rf : "0"}
                  </TableCell>
                  <TableCell align="center">
                    {billExtras.rf ? bill.value_ica : "0"}
                  </TableCell>
                  <TableCell align="center">
                    {billExtras.iva
                      ? billExtras.rf
                        ? billExtras.ica
                          ? `${
                              bill.value_iva +
                              bill.value_rf +
                              bill.value_ica +
                              bill.sub_total
                            }`
                          : `${bill.value_iva + bill.value_rf + bill.sub_total}`
                        : `${bill.value_iva + bill.sub_total}`
                      : bill.sub_total}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      ) : (
        ""
      )}  
      <Paper style={style.paperForm}>
        <Grid container justify="center">
          <Grid item xs={12} sm={6}>
            <Button
              type="button"
              fullWidth
              variant="contained"
              size="large"
              color="primary"
              style={style.submit}
              onClick={saveDataFirebase}
            >
              GUARDAR
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default consumerFirebase(AddElement);
