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

function Contratos() {
    const [data, setData] = useState()
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [showDataModal, setShowDataModal] = useState(false)
    const [selectedData, setSelectedData] = useState<IPersona>()
    const toast = useRef(null);
    const contratoService = new ContratoService(); // Los servicios de cualquier endpoint lo deben declarar primero, generan una instancia de su clase
    const estatusContratoList = Object.values(EstatusContrato);
    const tipoContratoList = Object.values(TipoContrato);

    useEffect(() => {  
        loadData();
    }, []);
    
    function loadData(){
      // ? Aqui hago el cambio de un digito a un enum
      contratoService.getAll().then((data) => {
        const updatedData = data.map((element) => ({
          ...element,
          estatusContrato: estatusContratoList[element.estatusContrato],
          tipoContrato: tipoContratoList[element.tipoContrato],
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
  
  
    const filtersName: string[] = ['fechaInicio', 'fechaFin', 'estatusContrato', 'duracion', 'idInquilino'];
    const TableSchema: ITableSchema = {
      Configuration: {
        title:'Contratos',
        paginator: true,
        dataKey: 'id', // Tomen muy en cuenta esto
        globalFilterFields: filtersName,
      },
      Columns: [
        { header: 'Fecha Inicio', field: 'fechaInicio'},
        { header: 'Fecha Fin', field: 'fechaFin'},
        { header: 'Estatus Contrato', field: 'estatusContrato', filterType:'dropdown'},
        // { header: 'Tipo Contrato', field: 'tipoContrato'},
        { header: 'Duracion', field: 'duracion'},
        // { header: 'Monto', field: 'monto'},
        // { header: 'Ruta Contrato', field: 'rutaContrato'},
        { header: 'Inquilino', field: 'idInquilino'},
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
        title="Contrato"
        showDataModal={showDataModal} 
        setShowDataModal={setShowDataModal}
        data={selectedData}
        >
          
        </BasicModal>
      </div>
    );
}

export default Contratos