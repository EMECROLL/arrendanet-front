import { FilterMatchMode } from 'primereact/api';
import { useEffect, useRef, useState } from 'react';
import { Toast } from 'primereact/toast';
import { ITableSchema } from '../../../interfaces/data-table/DataTable';
import BasicDataTable from '../../../components/basic-data-table/BasicDataTable';
import DeleteModal from '../../../components/delete-modal/DeleteModal';
// import checkedBodyTemplate from '../../../components/checked-body-template/checkedBodyTemplate';
import { ContratoService } from '../../../services/contrato/ContratoService';
import { IPersona } from '../../../interfaces/persona/Persona';
import BasicModal from '../../../components/basic-modal/BasicModal';
import { EstatusContrato, TipoContrato } from '../../../common/enums/enums';
import { IFormSchema } from '../../../interfaces/data-form-field/DataFormField';
import CreateEditModal from '../../../components/create-edit-modal/CreateEditModal';
import { HabitacionService } from '../../../services/habitacion/HabitacionService';
import { PersonaService } from '../../../services/persona/PersonaService';

function Contratos() {
    const [data, setData] = useState()
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [showDataModal, setShowDataModal] = useState(false)
    const [isEdit, setIsEdit] = useState(false)
    const [showCreateEditModal, setShowCreateEditModal] = useState(false)
    const [selectedData, setSelectedData] = useState<IPersona>()
    const toast = useRef(null);
    const estatusContratoList = Object.values(EstatusContrato);
    const tipoContratoList = Object.values(TipoContrato);
    const [inquilinos, setInquilinos] = useState()
    const [habitaciones, setHabitaciones] = useState()

    const contratoService = new ContratoService(); // Los servicios de cualquier endpoint lo deben declarar primero, generan una instancia de su clase
    const personaService = new PersonaService(); // Los servicios de cualquier endpoint lo deben declarar primero, generan una instancia de su clase
    const habitacionService = new HabitacionService(); // Los servicios de cualquier endpoint lo deben declarar primero, generan una instancia de su clase
    const ignoreColumns = ['idInquilino', 'idHabitacion', 'idInquilino', 'rutaContrato']


    useEffect(() => {  
        loadData();
    }, []);
    
    async function loadData(){
      const inquilinosResponse = await getInquilinos();
      const habitacionesResponse = await getHabitaciones();

      const inquilinosMap = await inquilinosResponse.reduce((acc, edificio) => {
        acc[edificio.id] = edificio;
        return acc;
      }, {});

      const habitacionesMap = await habitacionesResponse.reduce((acc, edificio) => {
        acc[edificio.id] = edificio;
        return acc;
      }, {});

      // ? Aqui hago el cambio de un digito a un enum
      contratoService.getAll().then((data) => {
        const updatedData = data.map((element) => ({
          ...element,
          inquilino: inquilinosMap[element.idInquilino].nombre,
          habitacion: habitacionesMap[element.idHabitacion].numeroHabitacion,
          estatusContrato: estatusContratoList[element.estatusContrato],
          tipoContrato: tipoContratoList[element.tipoContrato],
        }));
        setData(updatedData);
        
      }).catch((error) => {
          console.error('Error fetching personas:', error);
      });
    }

    // ? Función para abrir modal de eliminar
    function deleteData(rowData) {
      setShowDeleteModal(true);
      setSelectedData(rowData)
    }

    // ? Función para eliminar el elemento seleccionado
    async function deleteFunction() {
      if (selectedData && selectedData.id) {
          try {
              await contratoService.delete(selectedData.id);
              loadData();
              toast!.current.show({ severity: 'success', summary: 'Successful', detail: 'Persona Eliminada', life: 3000 });
          } catch (error) {
              toast!.current.show({ severity: 'error', summary: 'Error', detail: 'Error al eliminar a la persona', life: 3000 });
              console.error('Error al eliminar a la persona:', error);
          }
      } else {
          toast!.current.show({ severity: 'warn', summary: 'Advertencia', detail: 'No se ha seleccionado ninguna persona para eliminar', life: 3000 });
      }
    }

    // ? Función para abrir modal para editar
    function editData(rowData) {
      getHabitaciones();
      setShowCreateEditModal(true);
      setIsEdit(true);
      const rowDataModified = {
        ...rowData,
        tipoContrato: Object.values(tipoContratoList).indexOf(rowData.tipoContrato),
        estatusContrato: Object.values(estatusContratoList).indexOf(rowData.estatusContrato)
      }
      setSelectedData(rowDataModified)
    }

    // ? Función para cargar modal con datos
    function showData(rowData) {
      setShowDataModal(true);
      setSelectedData(rowData)
    }


  
    const filtersName: string[] = ['fechaInicio', 'fechaFin', 'estatusContrato', 'duracion', 'inquilino'];
    const TableSchema: ITableSchema = {
      Configuration: {
        title:'Contratos',
        paginator: true,
        dataKey: 'id', // Tomen muy en cuenta esto
        globalFilterFields: filtersName,
      },
      Columns: [
        { header: 'Fecha Inicio', field: 'fechaInicio', isDate: true},
        { header: 'Fecha Fin', field: 'fechaFin', isDate: true},
        { header: 'Estatus Contrato', field: 'estatusContrato', filterType:'dropdown'},
        // { header: 'Tipo Contrato', field: 'tipoContrato'},
        { header: 'Duracion', field: 'duracion'},
        // { header: 'Monto', field: 'monto'},
        // { header: 'Ruta Contrato', field: 'rutaContrato'},
        { header: 'Inquilino', field: 'inquilino'},
        // { header: 'Habitación', field: 'idHabitacion'},
      ],
      Filters: {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS},
        [filtersName[0]]: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        [filtersName[1]]: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        [filtersName[2]]: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        [filtersName[3]]: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        [filtersName[4]]: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
      },
      Data: data,
      Actions:[
        { icon: 'pi-pencil', class: 'p-button-primary', onClick: (rowData) => editData(rowData), tooltip: 'Edit' },
        { icon: 'pi-trash', class: 'p-button-danger', onClick: (rowData) => deleteData(rowData), tooltip: 'Delete' },
        { icon: 'pi-info-circle', class: 'p-button-warning', onClick: (rowData) => showData(rowData), tooltip: 'Ver Más' },
        { icon: 'pi-file', class: 'p-button-primary', onClick: (rowData) => showData(rowData), tooltip: 'Ver Contrato', 
          style: {background: "rgb(0, 31, 100)", border: "1px solid rgb(0, 31, 100)"} },
      ],
      Services:{
        CreateOrEdit: () => setShowCreateEditModal(true),
      }
    }


    function CreateEdit(formData) {
      if (isEdit) {
          // Lógica de edición
          console.log(formData);
      } else {
          // Lógica de creación
          console.log(formData);
      }
    }

    async function getInquilinos(){
      const response = await personaService.getAll();
      try {
        setInquilinos(response)
        return response;
      } catch (error) {
        toast!.current.show({ severity: 'error', summary: 'Error', detail: 'Error al obtener las habitaciones', life: 3000 });
      }
    }

    async function getHabitaciones(){
      const response = await habitacionService.getAll();
      try {
        setHabitaciones(response)
        return response;
      } catch (error) {
        toast!.current.show({ severity: 'error', summary: 'Error', detail: 'Error al obtener las habitaciones', life: 3000 });
      }
    }

    const formSchema:IFormSchema = {
      title: TableSchema.Configuration.title,
      fields: [
        { name: 'fechaInicio', label: 'Fecha Inicio', type: 'date', isEnum: false, listEnum: []},
        { name: 'fechaFin', label: 'Fecha Fin', type: 'date', isEnum: false, listEnum: [] },
        { name: 'estatusContrato', label: 'Estatus Contrato', type: 'select', isEnum: true, listEnum: estatusContratoList },
        { name: 'tipoContrato', label: 'Tipo Contrato', type: 'select', isEnum: true, listEnum: tipoContratoList },
        { name: 'duracion', label: 'Duración', type: 'number', min: 0},
        { name: 'monto', label: 'Monto', type: 'number' },
        { name: 'rutaContrato', label: 'Contrato', type: 'file' },
        { name: 'idInquilino', label: 'Inquilino', type: 'select', isEndpoint: true, endpointData: inquilinos, valueField:'id', labelField:'nombre'},
        { name: 'idHabitacion', label: 'Habitación', type: 'select', isEndpoint: true, endpointData: habitaciones, valueField:'id', labelField:'numeroHabitacion'},
      ]
    }

    
    return (
      <div className="App p-10">
        <Toast ref={toast} />
        <BasicDataTable TableSchema={TableSchema} />
        <DeleteModal 
        showDeleteModal={showDeleteModal} 
        setShowDeleteModal={setShowDeleteModal}
        data={selectedData}
        deleteFunction={deleteFunction}
        message={selectedData?.nombre}
        ></DeleteModal>
        <BasicModal
        title="Contrato"
        showDataModal={showDataModal} 
        setShowDataModal={setShowDataModal}
        data={selectedData}
        ignoreColumns={ignoreColumns}
        ></BasicModal>
        <CreateEditModal
            visible={showCreateEditModal}
            setVisible={setShowCreateEditModal}
            formSchema={formSchema}
            onSave={CreateEdit}
            data={selectedData}
            setIsEdit={setIsEdit}
            isEdit={isEdit}
        />
      </div>
    );
}

export default Contratos