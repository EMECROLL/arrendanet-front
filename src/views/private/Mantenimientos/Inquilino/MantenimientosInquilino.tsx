import { FilterMatchMode } from 'primereact/api';
import { useEffect, useRef, useState } from 'react';
import { Toast } from 'primereact/toast';
import { ITableSchema } from '../../../../interfaces/data-table/DataTable';
import { IFormSchema } from '../../../../interfaces/data-form-field/DataFormField';
import DeleteModal from '../../../../components/delete-modal/DeleteModal';
import BasicModal from '../../../../components/basic-modal/BasicModal';
import CreateEditModal from '../../../../components/create-edit-modal/CreateEditModal';
import iconoGirarCelular from '../../../../assets/gif/icono-girar.gif'
import { EstatusMantenimiento, Roles } from '../../../../common/enums/enums';
import { MantenimientoService } from '../../../../services/mantenimiento/MantenimientoService';
import { Button } from 'primereact/button';
import { classNames } from 'primereact/utils';
import { DataView } from 'primereact/dataview';
import { Tag } from 'primereact/tag';
import { useAuth } from '../../../../AuthContext';

function MantenimentosInquilino() {
    const [data, setData] = useState()
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [showDataModal, setShowDataModal] = useState(false)
    const [isEdit, setIsEdit] = useState(false)
    const [showCreateEditModal, setShowCreateEditModal] = useState(false)
    const [selectedData, setSelectedData] = useState()
    const toast = useRef(null);
    const mantenimientoService = new MantenimientoService(); // Los servicios de cualquier endpoint lo deben declarar primero, generan una instancia de su clase
    const [isMobile, setIsMobile] = useState(false);
    const estatusMantenimientoList = Object.values(EstatusMantenimiento);
    const { userRole, token } = useAuth();

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
              toast!.current.show({ severity: 'success', summary: 'Successful', detail: 'Mantenimiento Eliminado Exitosamente', life: 3000 });
          } catch (error) {
              toast!.current.show({ severity: 'error', summary: 'Error', detail: 'Error al eliminar el mantenimiento', life: 3000 });
              console.error('Error al eliminar a la persona:', error);
          }
      } else {
          toast!.current.show({ severity: 'warn', summary: 'Advertencia', detail: 'No se ha seleccionado ningun mantenimiento para eliminar', life: 3000 });
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
      setSelectedData(rowData)
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
        { name: 'idContrato', label: 'Contrato', type: 'select' },
        { name: 'costo', label: 'Costo', type: 'number', hiddeField: (userRole === Roles.INQUILINO), defaultValue: 0},
        { name: 'id', label: 'Id', type: 'number', hiddeField:true},

      ]
    }

    function CreateEdit(formData) {
        if (isEdit) {
            mantenimientoService.edit(formData.id, formData).then(() => {
              loadData();
              toast!.current!.show({ severity: 'success', summary: 'Successful', detail: 'Mantenimiento Editado Exitosamente', life: 3000 });
            }).catch((error) => {
                console.error('Error fetching mantenimiento:', error);
            })
        } else {
          const newFormData = { ...formData, id: 0 };

          mantenimientoService.create(newFormData).then((data) => {
              loadData();
              toast!.current.show({ severity: 'success', summary: 'Successful', detail: 'Mantenimiento Creado Exitosamente', life: 3000 });
          }).catch((error) => {
            toast!.current.show({ severity: 'error', summary: 'Error', detail: 'Error al crear el mantenimiento', life: 3000 });
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

          case 'En proceso':
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
                              <span className="flex align-items-center gap-2">
                                  <p className='text-xs md:text-base'><strong>Monto: </strong></p>
                                  <span className="text-xs md:text-base font-semibold">{data.monto ?? 0 }</span>
                              </span>
                              <span className="flex align-items-center gap-2">
                                  <p className='text-xs md:text-base'><strong>Contrato: </strong></p>
                                  <span className="text-xs md:text-base font-semibold">{data.idContrato}</span>
                              </span>
                              <strong className='text-xs md:text-base'>Estatus:</strong>
                              <Tag className='ml-2 md:m-0' value={data.estatus} severity={getSeverityEstatusMantenimiento(data)}></Tag>
                          </div>
                      </div>
                      <div className="flex md:grid grid-cols-4 md:grid-cols-1 sm:flex-column align-items-center sm:align-items-end gap-3 sm:gap-2 w-full md:w-auto">
                          <Button className='p-button-warning w-full text-xs md:text-base flex justify-center font-semibold md:font-normal' onClick={()=>showData(data)}>
                            <span className="flex">Más información</span>
                          </Button>
                          <Button className='p-button-primary w-full text-xs md:text-base flex justify-center font-semibold md:font-normal' onClick={()=>editData(data)}>
                            <i className="pi pi-pencil flex md:hidden"></i>
                            <span className="hidden md:flex">Editar</span>
                          </Button>
                          <Button className='p-button-danger w-full text-xs md:text-base flex justify-center font-semibold md:font-normal' onClick={()=>deleteData(data)}>
                            <i className="pi pi-trash flex md:hidden"></i>
                            <span className="hidden md:flex">Eliminar</span>
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
                <div className='flex justify-between items-center'>
                  <h1 className='ml-4'>Mantenimiento</h1>
                  <Button className='h-fit mr-4' label="Crear" icon="pi pi-plus" severity="success" onClick={() => setShowCreateEditModal(true)}></Button>
                </div>
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
        title="Mantenimientos"
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

export default MantenimentosInquilino