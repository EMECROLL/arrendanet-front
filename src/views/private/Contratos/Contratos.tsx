import { FilterMatchMode } from 'primereact/api';
import { useEffect, useRef, useState } from 'react';
import { Toast } from 'primereact/toast';
import { ITableSchema } from '../../../interfaces/data-table/DataTable';
import BasicDataTable from '../../../components/basic-data-table/BasicDataTable';
import DeleteModal from '../../../components/delete-modal/DeleteModal';
// import checkedBodyTemplate from '../../../components/checked-body-template/checkedBodyTemplate';
import { ContratoService } from '../../../services/contrato/ContratoService';
import BasicModal from '../../../components/basic-modal/BasicModal';
import { EstatusContrato, TipoContrato } from '../../../common/enums/enums';
import { IFormSchema } from '../../../interfaces/data-form-field/DataFormField';
import CreateEditModal from '../../../components/create-edit-modal/CreateEditModal';
import { HabitacionService } from '../../../services/habitacion/HabitacionService';
import { PersonaService } from '../../../services/persona/PersonaService';
import iconoGirarCelular from '../../../assets/gif/icono-girar.gif'
import { IContrato } from '../../../interfaces/contrato/Contrato';
import { useAuth } from '../../../AuthContext';

function Contratos() {
    const url = import.meta.env.VITE_BACKEND_URL;
    const [data, setData] = useState()
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [showDataModal, setShowDataModal] = useState(false)
    const [showContratoPDFModal, setShowContratoPDFModal] = useState(false)
    const [isEdit, setIsEdit] = useState(false)
    const [showCreateEditModal, setShowCreateEditModal] = useState(false)
    const [selectedData, setSelectedData] = useState<IContrato>()
    const toast = useRef(null);
    const estatusContratoList = Object.values(EstatusContrato);
    const tipoContratoList = Object.values(TipoContrato);
    const [inquilinos, setInquilinos] = useState()
    const [habitaciones, setHabitaciones] = useState()

    const contratoService = new ContratoService(); // Los servicios de cualquier endpoint lo deben declarar primero, generan una instancia de su clase
    const personaService = new PersonaService(); // Los servicios de cualquier endpoint lo deben declarar primero, generan una instancia de su clase
    const habitacionService = new HabitacionService(); // Los servicios de cualquier endpoint lo deben declarar primero, generan una instancia de su clase
    const ignoreColumns = ['idInquilino', 'idHabitacion', 'idInquilino', 'rutaContrato', 'duracion']
    const [isMobile, setIsMobile] = useState(false);
    const { token } = useAuth();

    useEffect(() => {  
      loadData();
      handleResize();
      window.addEventListener('resize', handleResize);
      return () => {
          window.removeEventListener('resize', handleResize);
      };
      }, []);

    const handleResize = () => {
        setIsMobile(window.innerWidth <= 768);
    };
    
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
      contratoService.getAllByRol(token).then((data) => {
        const updatedData = data.data.map((element) => ({
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
              toast!.current.show({ severity: 'success', summary: 'Éxito', detail: 'Contrato Eliminado', life: 3000 });
          } catch (error) {
              toast!.current.show({ severity: 'error', summary: 'Error', detail: 'Error al eliminar el contrato', life: 3000 });
              console.error('Error al eliminar el contrato:', error);
          }
      } else {
          toast!.current.show({ severity: 'warn', summary: 'Advertencia', detail: 'No se ha seleccionado ningun contrato para eliminar', life: 3000 });
      }
    }

    // ? Función para abrir modal para editar
    function editData(rowData) {
      console.log(rowData);
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

    // ? Función para cargar modal con el PDF del contrato
    function showContratoPDF(rowData) {
      setShowContratoPDFModal(true);
      setSelectedData(rowData)
    }


  
    const filtersName: string[] = ['id', 'fechaInicio', 'fechaFin', 'estatusContrato', 
      // 'duracion', 
      'inquilino'];
    const TableSchema: ITableSchema = {
      Configuration: {
        title:'Contratos',
        paginator: true,
        dataKey: 'id', // Tomen muy en cuenta esto
        globalFilterFields: filtersName,
      },
      Columns: [
        { header: 'Contrato', field: 'id'},
        { header: 'Fecha Inicio', field: 'fechaInicio', isDate: true},
        { header: 'Fecha Fin', field: 'fechaFin', isDate: true},
        { header: 'Estatus Contrato', field: 'estatusContrato', filterType:'dropdown', showFilterMenu: false},
        // { header: 'Duración', field: 'duracion'},
        { header: 'Inquilino', field: 'inquilino'},
      ],
      Filters: {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS},
        [filtersName[0]]: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        [filtersName[1]]: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        [filtersName[2]]: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        [filtersName[3]]: { value: null, matchMode: FilterMatchMode.EQUALS },
        [filtersName[4]]: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        // [filtersName[5]]: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
      },
      Data: data,
      Actions:[
        { icon: 'pi-pencil', class: 'p-button-primary', onClick: (rowData) => editData(rowData), tooltip: 'Edit' },
        { icon: 'pi-trash', class: 'p-button-danger', onClick: (rowData) => deleteData(rowData), tooltip: 'Delete' },
        { icon: 'pi-info-circle', class: 'p-button-warning', onClick: (rowData) => showData(rowData), tooltip: 'Ver Más' },
        { icon: 'pi-file', class: 'p-button-primary', onClick: (rowData) => showContratoPDF(rowData), tooltip: 'Ver Contrato', 
          style: {background: "rgb(0, 31, 100)", border: "1px solid rgb(0, 31, 100)"} },
      ],
      Services:{
        CreateOrEdit: () => setShowCreateEditModal(true),
      }
    }


    function CreateEdit(formData) {  
      const errors = {};
      const fieldsToValidate = [
        { name: 'fechaInicio', label: 'Fecha Inicio'},
        { name: 'fechaFin', label: 'Fecha Fin'},
        { name: 'estatusContrato', label: 'Estatus Contrato', isEnum: true},
        { name: 'tipoContrato', label: 'Tipo Contrato', isEnum: true}
      ];

      fieldsToValidate.forEach(field => {
        if (field.isEnum) {
            if (formData[field.name] === undefined || formData[field.name] === null) {
                errors[field.name] = `${field.label} es obligatorio.`;
            }
        } else {
            if (!formData[field.name] || !formData[field.name].trim()) {
                errors[field.name] = `${field.label} es obligatorio.`;
            }
        }
      });

      if (Object.keys(errors).length > 0) {
          return Promise.resolve({ success: false, errors });
      }
          
      if (isEdit) {
        return contratoService.updateContrato(formData.id, formData).then((data) => {
          console.log(data);
          
          loadData();
          toast!.current.show({ severity: 'success', summary: 'Éxito', detail: 'Contrato Editado Exitosamente', life: 3000 });
          return { success: true };
        }).catch((error) => {
            console.error('Error fetching contratos:', error);
            return { success: false, errors: { general: 'Error al editar el contrato.' } };
        })
      } else {
        const newFormData = { ...formData, id: 0 };
        return contratoService.createContrato(newFormData).then((data) => {
          console.log(data);

            loadData();
            toast!.current.show({ severity: 'success', summary: 'Éxito', detail: 'Contrato Creado Exitosamente', life: 3000 });
            return { success: true };
        }).catch((error) => {
          toast!.current.show({ severity: 'error', summary: 'Error', detail: 'Error al crear el contrato', life: 3000 });
            console.error('Error al crear:', error);
            return { success: false, errors: { general: 'Error al crear el contrato.' } };
        });
      }
    }

    async function getInquilinos(){
      const response = await personaService.getAllByRol(token);
      try {
        setInquilinos(response.data)
        return response.data;
      } catch (error) {
        toast!.current.show({ severity: 'error', summary: 'Error', detail: 'Error al obtener las habitaciones', life: 3000 });
      }
    }

    async function getHabitaciones(){
      const response = await habitacionService.getAllByRol(token);
      try {
        setHabitaciones(response.data)
        return response.data;
      } catch (error) {
        toast!.current.show({ severity: 'error', summary: 'Error', detail: 'Error al obtener las habitaciones', life: 3000 });
      }
    }

    const formSchema:IFormSchema = {
      title: TableSchema.Configuration.title,
      fields: [
        { name: 'fechaInicio', label: 'Fecha Inicio', type: 'date'},
        { name: 'fechaFin', label: 'Fecha Fin', type: 'date'},
        { name: 'estatusContrato', label: 'Estatus Contrato', type: 'select', isEnum: true, listEnum: estatusContratoList },
        { name: 'tipoContrato', label: 'Tipo Contrato', type: 'select', isEnum: true, listEnum: tipoContratoList },
        { name: 'monto', label: 'Monto', type: 'number' },
        { name: 'contratoPDF', label: 'Contrato', type: 'file' },
        { name: 'idInquilino', label: 'Inquilino', type: 'select', isEndpoint: true, endpointData: inquilinos, valueField:'id', labelField:'nombre'},
        { name: 'idHabitacion', label: 'Habitación', type: 'select', isEndpoint: true, endpointData: habitaciones, valueField:'id', labelField:'numeroHabitacion'},
        { name: 'id', label: 'id', type: 'number', hiddeField: true},
        { name: 'duracion', label: 'Duración', type: 'number', min: 0, defaultValue:0, hiddeField: true},


      ]
    }
    
    return (
      <div className="App p-10">
            <Toast ref={toast} />
            {isMobile ? (
                <div className="flex justify-center">
                    <div className="flex flex-col p-button p-button-rounded p-button-primary">
                        <img src={iconoGirarCelular} alt="Rotate Phone" />
                        Rota tu teléfono para una mejor experiencia
                    </div>
                </div>
            ) : (
                <BasicDataTable TableSchema={TableSchema} />
            )}
        <DeleteModal 
        showDeleteModal={showDeleteModal} 
        setShowDeleteModal={setShowDeleteModal}
        data={selectedData}
        deleteFunction={deleteFunction}
        message={'este contrato'}
        ></DeleteModal>
        <BasicModal
        title="Contrato"
        showDataModal={showDataModal} 
        setShowDataModal={setShowDataModal}
        data={selectedData}
        ignoreColumns={ignoreColumns}
        ></BasicModal>
        <BasicModal
        title="Contrato"
        showDataModal={showContratoPDFModal} 
        setShowDataModal={setShowContratoPDFModal}
        ignoreColumns={ignoreColumns}
        pdfUrl={`${url}${selectedData?.rutaContrato}`}
        ></BasicModal>

        <CreateEditModal
            visible={showCreateEditModal}
            setVisible={setShowCreateEditModal}
            formSchema={formSchema}
            onSave={CreateEdit}
            data={selectedData}
            setIsEdit={setIsEdit}
            isEdit={isEdit}
            columns={2}
        />
      </div>
    );
}

export default Contratos