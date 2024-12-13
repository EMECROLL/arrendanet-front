import { FilterMatchMode } from 'primereact/api';
import { useEffect, useRef, useState } from 'react';
import { Toast } from 'primereact/toast';
import { ITableSchema } from '../../../../interfaces/data-table/DataTable';
import { IFormSchema } from '../../../../interfaces/data-form-field/DataFormField';
import DeleteModal from '../../../../components/delete-modal/DeleteModal';
import BasicModal from '../../../../components/basic-modal/BasicModal';
import CreateEditModal from '../../../../components/create-edit-modal/CreateEditModal';
import iconoGirarCelular from '../../../../assets/gif/icono-girar.gif'
import { EstatusContrato, EstatusMantenimiento, Roles, TipoContrato } from '../../../../common/enums/enums';
import { MantenimientoService } from '../../../../services/mantenimiento/MantenimientoService';
import { Button } from 'primereact/button';
import { classNames } from 'primereact/utils';
import { DataView } from 'primereact/dataview';
import { Tag } from 'primereact/tag';
import { useAuth } from '../../../../AuthContext';
import { ContratoService } from '../../../../services/contrato/ContratoService';

const MantenimentosInquilino: React.FC = () => {
    const [data, setData] = useState([])
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [contratos, setContratos] = useState();
    const [contratosActivos, setContratosActivos] = useState();
    const [showDataModal, setShowDataModal] = useState(false)
    const [isEdit, setIsEdit] = useState(false)
    const [showCreateEditModal, setShowCreateEditModal] = useState(false)
    const [selectedData, setSelectedData] = useState()
    const toast = useRef<Toast>(null);
    const mantenimientoService = new MantenimientoService(); // Los servicios de cualquier endpoint lo deben declarar primero, generan una instancia de su clase
    const [isMobile, setIsMobile] = useState(false);
    const estatusMantenimientoList = Object.values(EstatusMantenimiento);
    const estatusContratoList = Object.values(EstatusContrato);
    const tipoContratoList = Object.values(TipoContrato);
    const { userRole, token } = useAuth();
    const ignoreColumns = ['idContrato',"rutaContrato", "idInquilino", "idHabitacion", 'duracion', 'capacidadInquilinos', 'idEdificio', 'estatusHabitacion', 'edificio', 'tipoContrato', 'costo', 'monto', 'inquilino', ]
    const contratoService = new ContratoService(); 

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
      mantenimientoService.getAllByRol(token).then((data) => {
        const updatedData = data.data.map((element) => ({
          ...element,
          estatus: estatusMantenimientoList[element.estatus],
        }));
        setData(updatedData);
      }).catch((error) => {
          console.error('Error fetching personas:', error);
      });
    }

    async function getContratos(){
      const response = await contratoService.getAllByRol(token);
      try {        
        setContratos(response.data)
        const contratosFiltrados = response.data.filter((contrato)=>{ 
          if (contrato.estatusContrato == Object.values(EstatusContrato).indexOf(EstatusContrato.ACTIVO)){
            return contrato
          }
          })
        setContratosActivos(contratosFiltrados);
        return response.data;
      } catch (error) {
        if (toast?.current) {toast.current.show({ severity: 'error', summary: 'Error', detail: 'Error al obtener los contratos', life: 3000 });}
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
              await mantenimientoService.delete(selectedData.id);
              loadData();
              if (toast?.current) {toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Mantenimiento Eliminado Exitosamente', life: 3000 });}
          } catch (error) {
            if (toast?.current) {toast.current.show({ severity: 'error', summary: 'Error', detail: 'Error al eliminar el mantenimiento', life: 3000 });}
              console.error('Error al eliminar a la persona:', error);
          }
      } else {
        if (toast?.current) {toast.current.show({ severity: 'warn', summary: 'Advertencia', detail: 'No se ha seleccionado ningun mantenimiento para eliminar', life: 3000 });}
      }
    }

    // ? Función para abrir modal para editar
    function editData(rowData) {
      setShowCreateEditModal(true);
      setIsEdit(true);
      const rowDataModified = {
        ...rowData,
        estatus: Object.values(estatusMantenimientoList).indexOf(rowData.estatus)
      }
      setSelectedData(rowDataModified)
    }

    // ? Función para cargar modal con datos
    function showData(rowData) {
      setShowDataModal(true);
      const estatusContratoValue = rowData.contrato?.estatusContrato;
  
      const estatusContratoFinal = estatusContratoList[estatusContratoValue] 
          ? estatusContratoList[estatusContratoValue] 
          : estatusContratoList[0]; 

      const tipoContratoValue = rowData.contrato?.tipoContrato;
  
      const tipoContratoFinal = tipoContratoList[tipoContratoValue] 
          ? tipoContratoList[tipoContratoValue] 
          : tipoContratoList[0]; 
  
      const rowDataModified = {
          ...rowData,
          contrato: rowData.contrato ? {
              ...rowData.contrato,
              estatusContrato: estatusContratoFinal,
              tipoContrato: tipoContratoFinal 
          } : rowData.contrato
      };
    
      setSelectedData(rowDataModified);
  }
  
    const filtersName: string[] = ['titulo', 'descripcion', 'estatus', 'costo', 'idContrato'];
    const TableSchema: ITableSchema = {
      Configuration: {
        title:'Mantenimientos',
        paginator: true,
        dataKey: 'id', // Tomen muy en cuenta esto
        globalFilterFields: filtersName,
      },
      Columns: [
        { header: 'Título', field: 'titulo' },
        { header: 'Descripción', field: 'descripcion' },
        { header: 'Estatus', field: 'estatus' },
        { header: 'Costo', field: 'costo' },
        { header: 'Contrato', field: 'idContrato' },
      ],
      Filters: {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS},
        [filtersName[0]]: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        [filtersName[1]]: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
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

    let filteredEstatusMantenimientoList = estatusMantenimientoList;

    if (userRole === Roles.INQUILINO) {
      filteredEstatusMantenimientoList = estatusMantenimientoList.filter((item) => ![EstatusMantenimiento.EN_PROCESO, EstatusMantenimiento.FINALIZADO].includes(item));
    }

    const formSchema:IFormSchema = {
      title: TableSchema.Configuration.title,
      fields: [
        { name: 'titulo', label: 'Título', type: 'text' },
        { name: 'descripcion', label: 'Descripción', type: 'text' },
        { name: 'estatus', label: 'Estatus', type: 'text', isEnum: true, listEnum: filteredEstatusMantenimientoList },
        { name: 'idContrato', label: 'Contrato', type: 'select', isEndpoint:true, endpointData: isEdit ? contratos : contratosActivos, labelField: 'id', valueField: 'id' },
        { name: 'costo', label: 'Costo', type: 'number', hiddeField: (userRole === Roles.INQUILINO), defaultValue: 0},
        { name: 'id', label: 'Id', type: 'number', hiddeField:true},

      ]
    }

    function CreateEdit(formData) {
        if (isEdit) {
            mantenimientoService.edit(formData.id, formData).then(() => {
              loadData();
              if (toast?.current) {toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Mantenimiento Editado Exitosamente', life: 3000 });}
            }).catch((error) => {
                console.error('Error fetching mantenimiento:', error);
            })
        } else {
          const newFormData = { ...formData, id: 0 };

          mantenimientoService.create(newFormData).then((data) => {
              loadData();
              if (toast?.current) {toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Mantenimiento Creado Exitosamente', life: 3000 });}
          }).catch((error) => {
            if (toast?.current) {toast.current.show({ severity: 'error', summary: 'Error', detail: 'Error al crear el mantenimiento', life: 3000 });}
              console.error('Error al crear:', error);
          });
        }
    }

    const formatDate = (value: any) => {
      if (!value) return '';
      const date = new Date(value);
      return !isNaN(date.getTime()) ? new Intl.DateTimeFormat('es-MX').format(date) : value;
    };

    const getSeverityEstatusMantenimiento = (data) => {
     
      switch (data.estatus) {
          case 'Finalizado':
              return 'success';

          case 'En Proceso':
              return 'warning';

          case 'Pendiente':
              return 'info';
          default:
              return null;
      }
  };

    const itemTemplate = (data, index) => {
      return (
          <div className="col-12 shadow-xl rounded-xl" key={data.id}>
              <div className={classNames('flex flex-column xl:flex-row xl:align-items-start p-4 gap-4', { 'border-top-1 surface-border': index !== 0 })}>
              <div className="flex flex-column md:flex-row justify-content-between align-items-center xl:align-items-start flex-1 gap-4">
                      <div className="self-start flex flex-column align-items-start gap-1">
                        <div className="text-xs md:text-2xl font-bold text-900">
                            <span>Título: {formatDate(data.titulo)}</span>
                          </div>
                          <span className="flex align-items-center gap-2">
                                  <p className='text-xs md:text-base'><strong>Descripción: </strong></p>
                                  <span className="text-xs md:text-base font-semibold">{data.descripcion }</span>
                              </span>
                              <div className="md:flex align-items-center gap-3">
                              {/* <span className="flex align-items-center gap-2">
                                  <p className='text-xs md:text-base'><strong>Monto: </strong></p>
                                  <span className="text-xs md:text-base font-semibold">${data.costo ?? 0 }</span>
                              </span> */}
                              <span className="flex align-items-center gap-2">
                                  <p className='text-xs md:text-base'><strong>Contrato: </strong></p>
                                  <span className="text-xs md:text-base font-semibold">{data.idContrato}</span>
                              </span>
                              <strong className='text-xs md:text-base'>Estatus:</strong>
                              <Tag className='ml-2 md:m-0' value={data.estatus} severity={getSeverityEstatusMantenimiento(data)}></Tag>
                          </div>
                      </div>
                      <div className="flex flex-col md:grid grid-cols-4 md:grid-cols-1 sm:flex-column align-items-center sm:align-items-end gap-3 sm:gap-2 w-full md:w-auto">
                          <Button className='p-button-warning w-full text-xs md:text-base flex justify-center font-semibold md:font-normal' onClick={()=>showData(data)}>
                            <span className="flex">Más información</span>
                          </Button>
                          <Button className='p-button-primary w-full text-xs md:text-base flex justify-center font-semibold md:font-normal' onClick={()=>editData(data)}>
                            <span className="flex">Editar</span>
                          </Button>
                          <Button className='p-button-danger w-full text-xs md:text-base flex justify-center font-semibold md:font-normal' onClick={()=>deleteData(data)}>
                            <span className="flex">Eliminar</span>
                          </Button>
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
                <div className='flex flex-col md:flex-row justify-center md:justify-between items-center'>
                  <h1 className='md:ml-4'>Mantenimiento</h1>
                  <Button className='h-fit md:mr-4 w-10/12 md:w-fit' label="Crear" icon="pi pi-plus" severity="success" onClick={() => setShowCreateEditModal(true)}></Button>
                </div>
                <DataView value={data} listTemplate={listTemplate} paginator rows={5}/>
            </div>
        <DeleteModal 
        showDeleteModal={showDeleteModal} 
        setShowDeleteModal={setShowDeleteModal}
        data={selectedData}
        deleteFunction={deleteFunction}
        message={`el mantenimiento "${selectedData?.titulo}"`}
        ></DeleteModal>
        <BasicModal
        title="Mantenimientos"
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

export default MantenimentosInquilino