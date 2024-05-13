import react,  {useContext, useState,useEffect, useCallback} from "react";
import { Text, View, TextInput, TouchableOpacity, Image, Modal, Alert } from 'react-native';
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import {Icon} from 'react-native-vector-icons/FontAwesome';
import styles from '../styles/stylesFormularios';
import { Dropdown } from 'react-native-element-dropdown';
import {dataMaterialDro} from "../services/materialServices";
import {saveSalida} from "../services/InputServices";
let esNuevo=true;
const SalidaMaterial = () => {
  const navigation = useNavigation();
  const [cantidad, setCantidad] = useState(null);
  const [nombres, setNombres] = useState(null);
  const [observacion, setObservacion] = useState(null);
  const [materials, setMaterials] = useState([]);
  //variables de estado para el Dropdown
  const [value, setValue] = useState(null);
  const [isFocus, setIsFocus] = useState(false);
  //almacenar fecha
  const [textFechaIn, setTextIn] = useState(new Date);
  //Seleccionar Fecha
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    useFocusEffect(
      useCallback(() => {
          fetchMaterial();
      }, [])
  );
  const fetchMaterial = async () => {
    const data = await dataMaterialDro();
    if(data){
        setMaterials(data);
    }
  };
  let validar=()=>{
    if(esNuevo){
      if(value!= null){
        if(cantidad==null || nombres==null || observacion==null || textFechaIn== null){
          Alert.alert("INFO.","Los campos que desea ingresar estan en blanco");
          return;
        }else{
          let salida = {
            idmaterial:value,
            nombreTrabajador:nombres,
            cantidad:parseInt(cantidad),
            observacion:observacion,
            fecha:textFechaIn
          }
          saveSalida(salida);
          navigation.navigate('Inventario');
        }
      }else{
        Alert.alert("Info.","Debe de elegir al menos un material");
      }
    }
  }

  const showDatePicker = () => {
        setDatePickerVisibility(true);
      };
   const hideDatePicker = () => {
        setDatePickerVisibility(false);
      };
      const handleConfirm = (date) => {
        console.warn(date);
        setTextIn(date);
        hideDatePicker();
      };
      const valor1 = textFechaIn.toLocaleDateString();
  return(
    <View style={styles.container}>
        <Text style={styles.textoBien} >Registrar Salida de Material</Text>
        <Text style={styles.textoSecundario}>Ingrese los datos para la salida del material a los trabajadores</Text>
        <View >
            <Dropdown
            style={[styles.dropdown, isFocus && { borderColor: 'blue' }]}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            inputSearchStyle={styles.inputSearchStyle}
            iconStyle={styles.iconStyle}
            data={materials}
            search
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder={!isFocus ? 'Seleccionar Material' : '...'}
            searchPlaceholder="Buscar..."
            value={value}
            onFocus={() => setIsFocus(true)}
            onBlur={() => setIsFocus(false)}
            onChange={item => {
                setValue(item.value);
                setIsFocus(false);
            }}
            />
        </View>
        <Text style={styles.textoSecundario} >Detalles de la salida</Text>
        <TouchableOpacity style={styles.txtInputFecha} title="Fecha Ingreso" onPress={showDatePicker}>
                <View style={styles.VistaBtnSeguidos}>
                <Icon  name='home' style={styles.circleIcon}/>
              <Text style={styles.textFecha}>Fecha: {valor1} </Text>
                </View>
        </TouchableOpacity> 
        <DateTimePickerModal
              isVisible={isDatePickerVisible}
              mode="date"
              onConfirm={handleConfirm}
              onCancel={hideDatePicker}
            />
        <TextInput style={styles.txtInput} 
                value={nombres}
                placeholder="Nombre del trabajador"
                onChangeText={text => setNombres(text)}
                />
        <TextInput style={styles.txtInput} 
                value={cantidad}
                placeholder="Cantidad"
                keyboardType='number-pad'
                onChangeText={text => setCantidad(text)}
                />
        <TextInput style={styles.txtInput} 
                value={observacion}
                placeholder="Observación"
                onChangeText={text => setObservacion(text)}
                />
        <View  style={[styles.VistaBtnSeguidos,{marginTop:30}]}>
          <TouchableOpacity onPress={() => navigation.navigate('Registros')}
              style={styles.BotonCancelar}>
              <Text style={[styles.colorTxtBtn,{color:"#000000"}]}>Cancelar</Text>
          </TouchableOpacity> 
          <TouchableOpacity
              style={styles.BotonGuardar} onPress={validar}>
              <Text style={styles.colorTxtBtn}>Guardar</Text>
          </TouchableOpacity>
        </View>     
  </View>
  )
}
export default SalidaMaterial;