import { FilterMatchMode } from 'primereact/api';
import { useEffect, useRef, useState } from 'react';
import { Toast } from 'primereact/toast';
import { ITableSchema } from '../../../interfaces/data-table/DataTable';
import BasicDataTable from '../../../components/basic-data-table/BasicDataTable';
import DeleteModal from '../../../components/delete-modal/DeleteModal';
// import checkedBodyTemplate from '../../../components/checked-body-template/checkedBodyTemplate';
import { HabitacionService } from '../../../services/habitacion/HabitacionService';
import { IPersona } from '../../../interfaces/persona/Persona';
import BasicModal from '../../../components/basic-modal/BasicModal';
import { EstatusHabitacion } from '../../../common/enums/enums';
import { IFormSchema } from '../../../interfaces/data-form-field/DataFormField';
import CreateEditModal from '../../../components/create-edit-modal/CreateEditModal';
import { EdificioService } from '../../../services/edificio/EdificioService';

function Habitaciones() {
    const [data, setData] = useState()
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [showDataModal, setShowDataModal] = useState(false)
    const [isEdit, setIsEdit] = useState(false)
    const [showCreateEditModal, setShowCreateEditModal] = useState(false)
    const [selectedData, setSelectedData] = useState<IPersona>()
    const [edificios, setEdificios] = useState()
    const toast = useRef(null);
    const habitacionService = new HabitacionService(); // Los servicios de cualquier endpoint lo deben declarar primero, generan una instancia de su clase
    const edificioService = new EdificioService(); // Los servicios de cualquier endpoint lo deben declarar primero, generan una instancia de su clase
    const estatusHabitacionList = Object.values(EstatusHabitacion)
    useEffect(() => {  
        loadData();
    }, []);
    
    async function loadData(){
      const edificiosResponse = await getEdificios();

      const edificiosMap = await edificiosResponse.reduce((acc, edificio) => {
        acc[edificio.id] = edificio;
        return acc;
      }, {});

      habitacionService.getAll().then((data) => {
        const updatedData = data.map((element) => ({
          ...element,
          edificio: edificiosMap[element.idEdificio].direccion,
          estatusHabitacion: estatusHabitacionList[element.estatusHabitacion],
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
              await habitacionService.delete(selectedData.id);
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
  
  
    const filtersName: string[] = ['numeroHabitacion', 'capacidadInquilinos', 'estatusHabitacion', 'idEdificio'];
    const TableSchema: ITableSchema = {
      Configuration: {
        title:'Habitaciones',
        paginator: true,
        dataKey: 'id', // Tomen muy en cuenta esto
        globalFilterFields: filtersName,
      },
      Columns: [
        { header: 'Número de habitación', field: 'numeroHabitacion'},
        { header: 'Capacidad Inquilinos', field: 'capacidadInquilinos'},
        { header: 'Estatus Habitación', field: 'estatusHabitacion', filterType: 'dropdown'},
        { header: 'Edificio', field: 'edificio'},
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

    async function getEdificios(){
      const response = await edificioService.getAll();
      try {
        setEdificios(response)
        return response;
      } catch (error) {
        toast!.current.show({ severity: 'error', summary: 'Error', detail: 'Error al obtener las habitaciones', life: 3000 });
      }
    }

    const formSchema:IFormSchema = {
      title: TableSchema.Configuration.title,
      fields: [
        { name: 'numeroHabitacion', label: 'Número de habitación', type: 'number' },
        { name: 'capacidadInquilinos', label: 'Capacidad de inquilinos', type: 'number' },
        { name: 'estatusHabitacion', label: 'Estatus Habitación', type: 'select', isEnum: true, listEnum: estatusHabitacionList },
        { name: 'idEdificio', label: 'Edificio', type: 'select', isEndpoint: true, endpointData: edificios, valueField:'id', labelField: 'direccion'  },
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
        title="Habticación"
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

export default Habitaciones