import { FilterMatchMode } from 'primereact/api';
import { useEffect, useRef, useState } from 'react';
import { Toast } from 'primereact/toast';
import { ITableSchema } from '../../../interfaces/data-table/DataTable';
import BasicDataTable from '../../../components/basic-data-table/BasicDataTable';
import DeleteModal from '../../../components/delete-modal/DeleteModal';
// import checkedBodyTemplate from '../../../components/checked-body-template/checkedBodyTemplate';
import { PersonaService } from '../../../services/persona/PersonaService';
import { IPersona } from '../../../interfaces/persona/Persona';
import BasicModal from '../../../components/basic-modal/BasicModal';
import { IFormSchema } from '../../../interfaces/data-form-field/DataFormField';
import CreateEditModal from '../../../components/create-edit-modal/CreateEditModal';

function Usuarios() {
    const [data, setData] = useState()
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [showDataModal, setShowDataModal] = useState(false)
    const [isEdit, setIsEdit] = useState(false)
    const [showCreateEditModal, setShowCreateEditModal] = useState(false)
    const [selectedData, setSelectedData] = useState<IPersona>()
    const toast = useRef(null);
    const personaService = new PersonaService(); // Los servicios de cualquier endpoint lo deben declarar primero, generan una instancia de su clase

    useEffect(() => {  
        loadData();
    }, []);
    
    function loadData(){
      personaService.getAll().then((data) => {
        setData(data);
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
              await personaService.delete(selectedData.id);
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
      setShowCreateEditModal(true);
      setIsEdit(true);
      setSelectedData(rowData)
    }

    // ? Función para cargar modal con datos
    function showData(rowData) {
      setShowDataModal(true);
      setSelectedData(rowData)
    }
  
  
    const filtersName: string[] = ['nombre', 'apellidoPaterno', 'apellidoMaterno', 'idUsuario'];
    const TableSchema: ITableSchema = {
      Configuration: {
        title:'Usuarios',
        paginator: true,
        dataKey: 'id', // Tomen muy en cuenta esto
        globalFilterFields: filtersName,
      },
      Columns: [
        { header: 'Nombre', field: 'nombre'},
        { header: 'Apellido Paterno', field: 'apellidoPaterno'},      
        { header: 'Apellido Materno', field: 'apellidoMaterno'},
        { header: 'Usuario', field: 'idUsuario'},
      ],
      Filters: {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS},
        [filtersName[0]]: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        [filtersName[1]]: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        [filtersName[2]]: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        [filtersName[3]]: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
      },
      Data: data,
      Actions:[
        { icon: 'pi-pencil', class: 'p-button-primary', onClick: (rowData) => editData(rowData), tooltip: 'Edit' },
        { icon: 'pi-trash', class: 'p-button-danger', onClick: (rowData) => deleteData(rowData), tooltip: 'Delete' },
        { icon: 'pi-info-circle', class: 'p-button-warning', onClick: (rowData) => showData(rowData), tooltip: 'Ver Más' },
      ],
      Services:{
        CreateOrEdit: () => setShowCreateEditModal(true),
      }
    }

    const formSchema:IFormSchema = {
      title: TableSchema.Configuration.title,
      fields: [
        { name: 'fechaInicio', label: 'Fecha Inicio', type: 'date', isEnum: false, listEnum: [] },
        { name: 'fechaFin', label: 'Fecha Fin', type: 'date', isEnum: false, listEnum: [] },
        { name: 'estatusContrato', label: 'Estatus Contrato', type: 'select', isEnum: true, listEnum: ['Activo', 'Inactivo', 'Pendiente'] },
        { name: 'tipoContrato', label: 'Tipo Contrato', type: 'select', isEnum: true, listEnum: ['Temporal', 'Permanente', 'Por Proyecto'] },
        { name: 'duracion', label: 'Duración', type: 'text' },
        { name: 'monto', label: 'Monto', type: 'text' },
        { name: 'rutaContrato', label: 'Contrato', type: 'select' },
        { name: 'idInquilino', label: 'Inquilino', type: 'select' },
        { name: 'idHabitación', label: 'Habitación', type: 'select' },
      ]
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
        title="Pago"
        showDataModal={showDataModal} 
        setShowDataModal={setShowDataModal}
        data={selectedData}
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

export default Usuarios