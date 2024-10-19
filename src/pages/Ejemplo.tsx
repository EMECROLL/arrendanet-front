import { FilterMatchMode } from 'primereact/api';
import { useEffect, useState } from 'react';
import { ITableSchema } from '../interfaces/DataTable';
import { CustomerService } from '../services/CustomerService';
import checkedBodyTemplate from '../components/checked-body-template/checkedBodyTemplate';
import BasicDataTable from '../components/basic-data-table/BasicDataTable';
// import { CarrosService } from '../services/CarrosService';

function Ejemplo() {
    const [data, setData] = useState<any>()

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
  
    const filtersName: string[] = ['name', 'country.name', 'representative.name', 'status'];
    const TableSchema: ITableSchema = {
      Configuration: {
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
        { icon: 'pi-trash', class: 'p-button-danger', onClick: (rowData) => console.log('Delete action for', rowData), tooltip: 'Delete' },
        { icon: 'pi-cog', class: 'p-button-warning', onClick: (rowData) => console.log('Custom action for', rowData), tooltip: 'Custom Action' },
      ]
    }
  
  
    return (
      <div className="App">
        <BasicDataTable TableSchema={TableSchema} />
      </div>
    );
}

export default Ejemplo