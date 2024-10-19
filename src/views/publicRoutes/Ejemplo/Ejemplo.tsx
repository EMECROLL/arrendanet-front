import { FilterMatchMode } from 'primereact/api';
import { useEffect, useRef, useState } from 'react';
import { Toast } from 'primereact/toast';
import { CustomerService } from '../../../services/CustomerService';
import { ITableSchema } from '../../../interfaces/DataTable';
import BasicDataTable from '../../../components/basic-data-table/BasicDataTable';
import DeleteModal from '../../../components/delete-modal/DeleteModal';
import checkedBodyTemplate from '../../../components/checked-body-template/checkedBodyTemplate';
// import { CarrosService } from '../services/CarrosService';

function Ejemplo() {
    const [data, setData] = useState<any>()
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [selectedDeleteData, setSelectedDeleteData] = useState()
    const toast = useRef(null);

    useEffect(() => {  

        // const carrosService = new CarrosService();
        // carrosService.getAll().then((data) => {
        //     setData(data);
        // }).catch((error) => {
        //     console.error('Error fetching carros:', error);
        // });

        CustomerService.getCustomersMedium().then((data) => {
          setData(data);
        });
    }, []); 

    // ? Función para eliminar
    function deleteData(rowData) {
      setShowDeleteModal(true);
      setSelectedDeleteData(rowData)
    }

    function deleteFunction(){
      // Aqui metanle la lógica segun el endpoint, alc no tengo endpoints para hacer ejemplos, pero usen los servicios
      toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Products Deleted', life: 3000 });

    }
  
    const filtersName: string[] = ['name', 'country.name', 'representative.name', 'status'];
    const TableSchema: ITableSchema = {
      Configuration: {
        title:'Ejemplo',
        paginator: true,
        dataKey: 'id',
        globalFilterFields: filtersName,
      },
      Columns: [
        { header: 'Name', field: 'name'},
        { header: 'Country', field: 'country.name', filterType: 'dropdown'},      
        { header: 'Representative', field: 'representative.name', filterPlaceholder: 'Search by representative', filterType: 'multiSelect'}, // si es multiselect - en filtro debe ser  FilterMatchMode.IN
        { header: 'Status', field: 'status', filterPlaceholder: 'Search by status', filterType: 'dropdown'}, // si es dropdown - en filtro debe ser  FilterMatchMode.EQUALS
        { header: 'verified', field: 'verified', filterType: 'checked', body: checkedBodyTemplate}// si es checked - en filtro debe ser  FilterMatchMode.EQUALS
      ],
      Filters: {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS},
        [filtersName[0]]: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        [filtersName[1]]: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        [filtersName[2]]: { value: null, matchMode: FilterMatchMode.IN },
        [filtersName[3]]: { value: null, matchMode: FilterMatchMode.EQUALS },
        verified: { value: null, matchMode: FilterMatchMode.EQUALS }
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
        message={selectedDeleteData?.name}
        ></DeleteModal>
      </div>
    );
}

export default Ejemplo