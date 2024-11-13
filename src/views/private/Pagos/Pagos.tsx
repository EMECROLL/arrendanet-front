import { FilterMatchMode } from 'primereact/api';
import { useEffect, useRef, useState } from 'react';
import { Toast } from 'primereact/toast';
import { ITableSchema } from '../../../interfaces/data-table/DataTable';
import BasicDataTable from '../../../components/basic-data-table/BasicDataTable';
import DeleteModal from '../../../components/delete-modal/DeleteModal';
// import checkedBodyTemplate from '../../../components/checked-body-template/checkedBodyTemplate';
import { PagoService } from '../../../services/pago/PagoService';
import { IPersona } from '../../../interfaces/persona/Persona';
import BasicModal from '../../../components/basic-modal/BasicModal';
import { EstatusPago } from '../../../common/enums/enums';
import { IFormSchema } from '../../../interfaces/data-form-field/DataFormField';
import CreateEditModal from '../../../components/create-edit-modal/CreateEditModal';
import { ContratoService } from '../../../services/contrato/ContratoService';
import iconoGirarCelular from '../../../assets/gif/icono-girar.gif'

function Pagos() {
    const [data, setData] = useState()
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [showDataModal, setShowDataModal] = useState(false)
    const [isEdit, setIsEdit] = useState(false)
    const [contratos, setContratos] = useState()
    const [showCreateEditModal, setShowCreateEditModal] = useState(false)
    const [selectedData, setSelectedData] = useState<IPersona>()
    const toast = useRef(null);
    const pagoService = new PagoService(); // Los servicios de cualquier endpoint lo deben declarar primero, generan una instancia de su clase
    const contratoService = new ContratoService(); // Los servicios de cualquier endpoint lo deben declarar primero, generan una instancia de su clase
    const estatusPagoList = Object.values(EstatusPago);
    const [isMobile, setIsMobile] = useState(false);

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
    
    function loadData(){
      getContratos();
      pagoService.getAll().then((data) => {
        const updatedData = data.map((element) => ({
          ...element,
          estatusPago: estatusPagoList[element.estatusPago],
        }));
        setData(updatedData);
      }).catch((error) => {
          console.error('Error fetching personas:', error);
      });
    }

    async function getContratos(){
      const response = await contratoService.getAll();
      try {
        console.log(response);
        
        setContratos(response)
        return response;
      } catch (error) {
        toast!.current.show({ severity: 'error', summary: 'Error', detail: 'Error al obtener las habitaciones', life: 3000 });
      }
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
              await pagoService.delete(selectedData.id);
              loadData();
              toast!.current.show({ severity: 'success', summary: 'Successful', detail: 'Pago Eliminado exitosamente', life: 3000 });
          } catch (error) {
              toast!.current.show({ severity: 'error', summary: 'Error', detail: 'Error al eliminar a el pago', life: 3000 });
              console.error('Error al eliminar a el pago:', error);
          }
      } else {
          toast!.current.show({ severity: 'warn', summary: 'Advertencia', detail: 'No se ha seleccionado ningun pago para eliminar', life: 3000 });
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
  
    const filtersName: string[] = ['fecha', 'monto', 'estatusPago', 'idContrato'];
    const TableSchema: ITableSchema = {
      Configuration: {
        title:'Pagos',
        paginator: true,
        dataKey: 'id', // Tomen muy en cuenta esto
        globalFilterFields: filtersName,
      },
      Columns: [
        { header: 'Fecha', field: 'fecha', isDate: true},
        { header: 'Monto', field: 'monto'},
        { header: 'Estatus Pago', field: 'estatusPago', filterType: 'multiSelect'},
        { header: 'Contrato', field: 'idContrato'},
      ],
      Filters: {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS},
        [filtersName[0]]: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        [filtersName[1]]: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        [filtersName[2]]: { value: null, matchMode: FilterMatchMode.IN },
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
        { name: 'fecha', label: 'Fecha', type: 'date' },
        { name: 'monto', label: 'Monto', type: 'number' },
        { name: 'estatusPago', label: 'Estatus Pago', type: 'select', isEnum: true, listEnum: estatusPagoList },
        { name: 'idContrato', label: 'Contrato', type: 'select', isEndpoint:true, endpointData: contratos, labelField: 'id', valueField: 'id'  },
        { name: 'id', label: 'id', type: 'number', showField: false},
      ]
    }
  
    function CreateEdit(formData) {
      if (isEdit) {
        pagoService.edit(formData.id, formData).then(() => {
          loadData();
          toast!.current.show({ severity: 'success', summary: 'Successful', detail: 'Pago Editado Exitosamente', life: 3000 });
        }).catch((error) => {
            console.error('Error fetching habitaciones:', error);
        })
      } else {
        const newFormData = { ...formData, id: 0 };
        pagoService.create(newFormData).then((data) => {
            loadData();
            toast!.current.show({ severity: 'success', summary: 'Successful', detail: 'Pago Creado Exitosamente', life: 3000 });
        }).catch((error) => {
          toast!.current.show({ severity: 'error', summary: 'Error', detail: 'Error al crear el pago', life: 3000 });
            console.error('Error al crear:', error);
        });
      }
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

export default Pagos