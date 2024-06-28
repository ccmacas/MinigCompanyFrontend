import React,  {useContext, useState,useEffect, useCallback} from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Text, View, TouchableOpacity, Image, Modal,FlatList } from 'react-native';
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import styles from '../styles/stylesInventory';
import { Dropdown } from 'react-native-element-dropdown';
import {allMaterials,deleteMaterial,allMaterialsCategoria} from "../services/materialServices";
import { Icon } from 'react-native-elements';
import {dataCategoriesDro} from "../services/categoryServices";
let materialAux=null;
const Inventory = ({route}) => {
    const navigation = useNavigation();
    const [time, setTime] = useState([]);
    const [materials, setMaterials] = useState([]);
    const [nombreUser, setNombreUser] = useState();
    const [ApellidoUser, setApellidoUser] = useState();
    const [modalVisible, setModalVisible] = useState(false);
    const [allCategorias, setAllCategorias] = useState([]);
    //
    const [value, setValue] = useState(null);
    const [isFocus, setIsFocus] = useState(false);
    
    useFocusEffect(
        useCallback(() => {
            fetchMaterials();
            fetchCategorias();
            getUser();
        }, [])
    );
    const fetchCategorias = async () => {
        const data = await dataCategoriesDro();
        if(data){
          setAllCategorias(data);
        }
      };
    const fetchMaterials = async () => {
        const data = await allMaterials();
        if (data) {
          setMaterials(data.Material);
        }
    };
    const fetchMaterialCategory = async (categoria) => {
        setMaterials([]);
        const data = await allMaterialsCategoria(categoria);
        if(data){
            setMaterials(data.Material);
        }
      };
    const getUser = async () =>{   
        try {
          const userData = await AsyncStorage.getItem('userData');
          if (userData) {
            const aux =  JSON.parse(userData);
            //console.log("Usuario autenticado: "+ aux.usuario.nombre);
            setNombreUser(aux.usuario.nombre);
            setApellidoUser(aux.usuario.apellido)
          } 
        } catch (error) {
            console.error('Error al obtener:', error);
        }     
    }
    const refreshList=()=>{
        setTime(new Date().getTime());
    }    
    const ItemMaterials=({material})=>{
        const borderColor = material.saldo < 5 ? 'red' : 'green';
        return (
            <View  style={[styles.VistaMateriales,{borderColor}]}>
                <View style={[styles.Separador,{flex: 1,alignItems:"flex-start", justifyContent:"center" }]}>
                    <Text style={styles.txtFiltro}>$ {material.precio.$numberDecimal}</Text> 
                    <Icon name="paperclip"  type="antdesign" size={25} color="#FF8400" />
                </View>
                <View style={[styles.Separador,{flex: 4 }]}>
                    <Text style={styles.tituloMaterial}>{material.nombreMaterial}</Text>
                    <Text style={styles.subtitulo}>{material.categoria}</Text>
                    <View style={styles.VistaCodigo}>
                        <View style={styles.VistaCodigo}>
                            <Text style={styles.subtitulo}>Codigo: </Text>
                            <Text style={styles.subtitulo}>{material._id.substring(0, 5)}</Text>
                        </View>
                        <View style={[styles.VistaCodigo,{marginHorizontal:20}]}>
                            <Text style={styles.subtitulo}>Cant.</Text>
                            <Text style={styles.subtitulo}>{material.saldo}</Text>
                        </View>
                    </View>                    
                </View >
                <View style={[styles.Separador,{flex: 1 }]}>
                    <TouchableOpacity onPress={() => {
                        setModalVisible(true);
                        materialAux = material;
                        //console.log(materialAux);
                    }}
                    style={[styles.colorBtn,{backgroundColor:"#FFFFFF",borderRadius:5,borderWidth:1,padding:2,borderColor:"#A81C1C"}]}>
                        <Icon name="delete" type="antdesign" size={25} color="red"/>
                    </TouchableOpacity> 
                </View>
            </View>
        );
    }
    return(
        <View style={styles.container}>
            <View style={[styles.mainContainer,{flex: 1 }]}>
                <Text style={styles.txtInfoUser}>Hola, {nombreUser} {ApellidoUser}</Text>
                <Text style={styles.txtBien}>Bienvenida a Mining Company</Text>
                <View style={styles.VistaInventario}>
                        <Text style={styles.txtInventario}>Inventario</Text>
                        
                    </View>
                    <View style={styles.VistaCodigo}>
                        <TouchableOpacity style={[styles.VistaNewmaterial,{marginRight:50}]} onPress={() => navigation.navigate('NewMaterial')}>
                            <View style={styles.contenedorTexto}>
                                <Text style={styles.txtNewMaterial}>Nuevo Material</Text>
                            </View>
                            <View style={styles.contenedorImagen}>
                                <Image style={styles.image} source={require('../../assets/category.png')} />
                            </View>
                        </TouchableOpacity>
                    </View>
                    
                    <Text style={styles.txtFiltro}>Filtros</Text>
                    <View style={styles.VistaInventario}>
                        <Dropdown
                        style={[styles.dropdown, isFocus && { borderColor: 'blue' }]}
                        placeholderStyle={styles.placeholderStyle}
                        selectedTextStyle={styles.selectedTextStyle}
                        inputSearchStyle={styles.inputSearchStyle}
                        iconStyle={styles.iconStyle}
                        data={allCategorias}
                        search
                        maxHeight={300}
                        labelField="label"
                        valueField="value"
                        placeholder={!isFocus ? 'Categoria' : '...'}
                        searchPlaceholder="Buscar..."
                        value={value}
                        onFocus={() => setIsFocus(true)}
                        onBlur={() => setIsFocus(false)}
                        onChange={item => {
                            setValue(item.value);
                            setIsFocus(false);
                            fetchMaterialCategory(item.value);                            
                        }}
                        />
                    </View>
                    
                    <View  style={{ flex: 1 }}>
                        <Text style={styles.txtFiltro}>Materiales</Text>
                        <FlatList
                            data={materials}
                            renderItem={({item})=>{
                                return <ItemMaterials material={item}/>
                            }}
                            keyExtractor={(item)=>{return item._id}}
                            extraData={time}
                        />
                    </View>
            </View>
            <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
                Alert.alert('Modal se cerro.');
                setModalVisible(!modalVisible);
            }}>
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <Text style={[styles.modalText,{color:"red",}]}>Eliminar Material</Text>
                    <Icon  name='delete' color ="#FC2323" style={styles.circleIconCheck}/>
                    <Text style={styles.textoSecundario}>Esta seguro que desea eliminar el material </Text>
                    <View style={[{flexDirection:"row",}]}>
                        <TouchableOpacity
                            style={[styles.button, styles.buttonClose,{backgroundColor:"#FC2323",marginTop:10}]}
                            onPress={() => {
                                setModalVisible(!modalVisible);
                                deleteMaterial(materialAux._id);
                                fetchMaterials();
                            }}>
                            <Text style={styles.colorTxtBtn}>Eliminar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.button, styles.buttonClose,{marginLeft:5,marginTop:10}]}
                            onPress={() => {
                            setModalVisible(!modalVisible)}}>
                            <Text style={styles.colorTxtBtn}>Cancelar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
            </Modal>   
        </View>
    )
}
export default Inventory;