import { FilterMatchMode } from 'primereact/api';
import { useEffect, useRef, useState } from 'react';
import { Toast } from 'primereact/toast';
import { ITableSchema } from '../../../interfaces/data-table/DataTable';
import BasicDataTable from '../../../components/basic-data-table/BasicDataTable';
import DeleteModal from '../../../components/delete-modal/DeleteModal';
// import checkedBodyTemplate from '../../../components/checked-body-template/checkedBodyTemplate';
import { PersonaService } from '../../../services/persona/PersonaService';
import { IPersona } from '../../../interfaces/persona/Persona';

function Ejemplo() {
    const [data, setData] = useState()
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [selectedDeleteData, setSelectedDeleteData] = useState<IPersona>()
    const toast = useRef<Toast>(null);
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

    // ? Función para eliminar
    function deleteData(rowData) {
      setShowDeleteModal(true);
      setSelectedDeleteData(rowData)
    }

    async function deleteFunction() {
      if (selectedDeleteData && selectedDeleteData.id) {
          try {
              await personaService.delete(selectedDeleteData.id);
              loadData();
              if (toast?.current) {toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Persona Eliminada', life: 3000 });}
          } catch (error) {
            if (toast?.current) {toast.current.show({ severity: 'error', summary: 'Error', detail: 'Error al eliminar a la persona', life: 3000 });}
              console.error('Error al eliminar a la persona:', error);
          }
      } else {
        if (toast?.current) {toast.current.show({ severity: 'warn', summary: 'Advertencia', detail: 'No se ha seleccionado ninguna persona para eliminar', life: 3000 });}
      }
  }
  
  
    const filtersName: string[] = ['nombre', 'apellidoPaterno', 'apellidoMaterno'];
    const TableSchema: ITableSchema = {
      Configuration: {
        title:'Ejemplo',
        paginator: true,
        dataKey: 'id', // Tomen muy en cuenta esto
        globalFilterFields: filtersName,
      },
      Columns: [
        { header: 'Nombre', field: 'nombre'},
        { header: 'Apellido Paterno', field: 'apellidoPaterno', filterType: 'dropdown'},      
        { header: 'Apellido Materno', field: 'apellidoMaterno', filterPlaceholder: 'Search by representative', filterType: 'multiSelect', showFilterMenu: false}, // si es multiselect - en filtro debe ser  FilterMatchMode.IN, además que debe tener como showFilterMenu en false
        // { header: 'Status', field: 'status', filterPlaceholder: 'Search by status', filterType: 'dropdown'}, // si es dropdown - en filtro debe ser  FilterMatchMode.EQUALS
        // { header: 'verified', field: 'verified', filterType: 'checked', body: checkedBodyTemplate}// si es checked - en filtro debe ser  FilterMatchMode.EQUALS
      ],
      Filters: {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS},
        [filtersName[0]]: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        [filtersName[1]]: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        [filtersName[2]]: { value: null, matchMode: FilterMatchMode.IN },
        // [filtersName[3]]: { value: null, matchMode: FilterMatchMode.EQUALS },
        // verified: { value: null, matchMode: FilterMatchMode.EQUALS }
      },
      Data: data,
      Actions:[
        { icon: 'pi-pencil', class: 'p-button-primary', onClick: (rowData) => console.log('Edit action for', rowData), tooltip: 'Edit' },
        { icon: 'pi-trash', class: 'p-button-danger', onClick: (rowData) => deleteData(rowData), tooltip: 'Delete' },
        { icon: 'pi-cog', class: 'p-button-warning', onClick: (rowData) => console.log('Custom action for', rowData), tooltip: 'Custom Action' },
      ]
    }
  
    return (
      <div className="App">
        <Toast ref={toast} />
        <BasicDataTable TableSchema={TableSchema} />
        <DeleteModal 
        showDeleteModal={showDeleteModal} 
        setShowDeleteModal={setShowDeleteModal}
        data={selectedDeleteData}
        deleteFunction={deleteFunction}
        message={selectedDeleteData?.nombre}
        ></DeleteModal>
      </div>
    );
}

export default Ejemplo


// ? la estructura de la petición es la siguiente
// {
//   "nombre": "Kevin Alexis",
//   "apellidoPaterno": "Bello",
//   "apellidoMaterno": "Maldonado",
//   "id": 1,
//   "esBorrado": false
// }