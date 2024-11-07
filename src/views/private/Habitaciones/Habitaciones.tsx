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

function Habitaciones() {
    const [data, setData] = useState()
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [showDataModal, setShowDataModal] = useState(false)
    const [selectedData, setSelectedData] = useState<IPersona>()
    const toast = useRef(null);
    const habitacionService = new HabitacionService(); // Los servicios de cualquier endpoint lo deben declarar primero, generan una instancia de su clase
    const estatusHabitacionList = Object.values(EstatusHabitacion)
    useEffect(() => {  
        loadData();
    }, []);
    
    function loadData(){
      habitacionService.getAll().then((data) => {
        const updatedData = data.map((element) => ({
          ...element,
          estatusHabitacion: estatusHabitacionList[element.estatusHabitacion],
        }));
        setData(updatedData);
      }).catch((error) => {
          console.error('Error fetching personas:', error);
      });
    }

    // ? Función para eliminar
    function deleteData(rowData) {
      setShowDeleteModal(true);
      setSelectedData(rowData)
    }

     // ? Función para cargar modal con datos
     function showData(rowData) {
      setShowDataModal(true);
      setSelectedData(rowData)
    }

    async function deleteFunction() {
      if (selectedDeleteData && selectedDeleteData.id) {
          try {
              await habitacionService.delete(selectedDeleteData.id);
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
        { header: 'Edificio', field: 'idEdificio'},
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
        { icon: 'pi-pencil', class: 'p-button-primary', onClick: (rowData) => console.log('Edit action for', rowData), tooltip: 'Edit' },
        { icon: 'pi-trash', class: 'p-button-danger', onClick: (rowData) => deleteData(rowData), tooltip: 'Delete' },
        { icon: 'pi-info-circle', class: 'p-button-warning', onClick: (rowData) => showData(rowData), tooltip: 'Ver Más' },
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
        title="Habticación"
        showDataModal={showDataModal} 
        setShowDataModal={setShowDataModal}
        data={selectedData}
        ></BasicModal>
      </div>
    );
}

export default Habitaciones