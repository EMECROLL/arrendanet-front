import { FilterMatchMode } from 'primereact/api';
import { useEffect, useRef, useState } from 'react';
import { Toast } from 'primereact/toast';
import { ITableSchema } from '../../../../interfaces/data-table/DataTable';
import BasicDataTable from '../../../../components/basic-data-table/BasicDataTable';
import DeleteModal from '../../../../components/delete-modal/DeleteModal';
// import checkedBodyTemplate from '../../../components/checked-body-template/checkedBodyTemplate';
import { PagoService } from '../../../../services/pago/PagoService';
import { IPersona } from '../../../../interfaces/persona/Persona';
import BasicModal from '../../../../components/basic-modal/BasicModal';
import { EstatusPago } from '../../../../common/enums/enums';
import { IFormSchema } from '../../../../interfaces/data-form-field/DataFormField';
import CreateEditModal from '../../../../components/create-edit-modal/CreateEditModal';
import { ContratoService } from '../../../../services/contrato/ContratoService';
import iconoGirarCelular from '../../../../assets/gif/icono-girar.gif'
import { Button } from 'primereact/button';
import { classNames } from 'primereact/utils';
import { DataView } from 'primereact/dataview';
import { Tag } from 'primereact/tag';

function PagosInquilino() {
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
    const ignoreColumns = ['idContrato']


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
      const rowDataModified = {
        ...rowData,
        estatusPago: Object.values(estatusPagoList).indexOf(rowData.estatusPago),
      }
      setSelectedData(rowDataModified)
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
        { name: 'estatusPago', label: 'Estatus Pago', type: 'select', isEnum: true, listEnum: estatusPagoList }, // ? Me funciona cuando esta en enum false, eso no deberia ser
        { name: 'idContrato', label: 'Contrato', type: 'select', isEndpoint:true, endpointData: contratos, labelField: 'id', valueField: 'id'  },
        { name: 'id', label: 'id', type: 'number', showField: false},
      ]
    }
  
    function CreateEdit(formData) {
      
      const errors = {};
      const fieldsToValidate = [
        { name: 'fecha', label: 'Fecha' },
        { name: 'monto', label: 'Monto' },
        { name: 'estatusPago', label: 'Estatus Pago', isEnum: true }, // ? Me funciona cuando esta en enum false, eso no deberia ser
        { name: 'idContrato', label: 'Contrato' },
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
        return pagoService.edit(formData.id, formData).then(() => {
          loadData();
          toast!.current.show({ severity: 'success', summary: 'Successful', detail: 'Pago Editado Exitosamente', life: 3000 });
          return { success: true };

        }).catch((error) => {
            console.error('Error fetching habitaciones:', error);
            return { success: false, errors: { general: 'Error al editar el pago.' } };

        })
      } else {
        const newFormData = { ...formData, id: 0 };
        return pagoService.create(newFormData).then((data) => {
            loadData();
            toast!.current.show({ severity: 'success', summary: 'Successful', detail: 'Pago Creado Exitosamente', life: 3000 });
            return { success: true };

        }).catch((error) => {
          toast!.current.show({ severity: 'error', summary: 'Error', detail: 'Error al crear el pago', life: 3000 });
            console.error('Error al crear:', error);
            return { success: false, errors: { general: 'Error al crear el pago.' } };
        });
      }
    }

    const formatDate = (value: any) => {
      if (!value) return '';
      const date = new Date(value);
      return !isNaN(date.getTime()) ? new Intl.DateTimeFormat('es-MX').format(date) : value;
    };

    const getSeverityEstatusPago = (data) => {
      console.log(data);
      
      switch (data.estatusPago) {
          case 'Aprobado':
              return 'success';

          case 'En proceso':
              return 'warning';

          case 'Rechazado':
              return 'danger';

          default:
              return null;
      }
  };


    const itemTemplate = (data, index) => {
      console.log(data)
      return (
          <div className="col-12 shadow-xl rounded-xl" key={data.id}>
              <div className={classNames('flex flex-column xl:flex-row xl:align-items-start p-4 gap-4', { 'border-top-1 surface-border': index !== 0 })}>
                  <div className="flex flex-column md:flex-row justify-content-between align-items-center xl:align-items-start flex-1 gap-4">
                      <div className="self-start flex flex-column align-items-start gap-3">
                        <div className="text-xs md:text-2xl font-bold text-900">
                            <span>Fecha: {formatDate(data.fecha)}</span>
                          </div>
                          {/* <Rating value={product.rating} readOnly cancel={false}></Rating> */}
                          <div className="md:flex align-items-center gap-3">
                              <span className="flex align-items-center gap-2">
                                  <p className='text-xs md:text-base'><strong>Monto: </strong></p>
                                  <span className="text-xs md:text-base font-semibold">{data.monto}</span>
                              </span>
                              <span className="flex align-items-center gap-2">
                                  <p className='text-xs md:text-base'><strong>Contrato: </strong></p>
                                  <span className="text-xs md:text-base font-semibold">{data.idContrato}</span>
                              </span>
                              <strong className="text-xs md:text-base font-semibold">Estatus:</strong>
                              <Tag className='ml-2 md:m-0' value={data.estatusPago} severity={getSeverityEstatusPago(data)}></Tag>
                          </div>
                      </div>
                      <div className="flex md:grid grid-cols-4 md:grid-cols-1 sm:flex-column align-items-center sm:align-items-end gap-3 sm:gap-2 w-full md:w-auto">
                          <Button className='p-button-warning w-full text-xs md:text-base flex justify-center font-semibold md:font-normal' onClick={()=>showData(data)}>
                            <span className="flex">Más información</span>
                          </Button>
                          {/* <Button className='p-button-primary w-full text-xs md:text-base' onClick={()=>editData(data)}>
                            <i className="pi pi-pencil flex md:hidden"></i>
                            <span className="hidden md:flex">Editar</span>
                          </Button>
                          <Button className='p-button-danger w-full text-xs md:text-base' onClick={()=>deleteData(data)}>
                            <i className="pi pi-trash flex md:hidden"></i>
                            <span className="hidden md:flex">Eliminar</span>
                          </Button> */}
                      </div>
                  </div>
              </div>
          </div>
      );
  };

    const listTemplate = (items) => {
      if (!items || items.length === 0) return null;

      let list = items.map((product, index) => {
          return itemTemplate(product, index);
      });

      return <div className="grid grid-nogutter">{list}</div>;
  };
    
  
    return (
      <div className="App p-10">
            <Toast ref={toast} />
              <div className="card">
                {/* <DataView value={data} listTemplate={listTemplate} paginator rows={5} /> */}
                <h1 className='ml-4'>Pagos</h1>
                <DataView value={data} listTemplate={listTemplate} />
              </div>
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

export default PagosInquilino