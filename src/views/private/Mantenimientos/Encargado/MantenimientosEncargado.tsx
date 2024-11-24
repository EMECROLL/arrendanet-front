import { FilterMatchMode } from 'primereact/api';
import { useEffect, useRef, useState } from 'react';
import { Toast } from 'primereact/toast';
import { EdificioService } from '../../../../services/edificio/EdificioService';
import { ITableSchema } from '../../../../interfaces/data-table/DataTable';
import { IFormSchema } from '../../../../interfaces/data-form-field/DataFormField';
import BasicDataTable from '../../../../components/basic-data-table/BasicDataTable';
import DeleteModal from '../../../../components/delete-modal/DeleteModal';
import BasicModal from '../../../../components/basic-modal/BasicModal';
import CreateEditModal from '../../../../components/create-edit-modal/CreateEditModal';
import iconoGirarCelular from '../../../../assets/gif/icono-girar.gif'
import { EstatusContrato, EstatusMantenimiento, Roles, TipoContrato } from '../../../../common/enums/enums';
import { MantenimientoService } from '../../../../services/mantenimiento/MantenimientoService';
import { useAuth } from '../../../../AuthContext';
import { ContratoService } from '../../../../services/contrato/ContratoService';

function MantenimentosEncargado() {
    const [data, setData] = useState()
    const [contratos, setContratos] = useState();
    const [contratosActivos, setContratosActivos] = useState();
    const contratoService = new ContratoService(); 
    const [showDeleteModal, setShowDeleteModal] = useState(false)
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
    const ignoreColumns = ['idContrato',"rutaContrato", "idInquilino", "idHabitacion", 'duracion', 'capacidadInquilinos', 'idEdificio', 'estatusHabitacion', 'edificio']
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
              console.error('Error al eliminar a el mantenimiento:', error);
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
        { header: 'Costo', field: 'costo', body: ((rowData) => <div>${rowData.costo}</div>)  },
        { header: 'Contrato', field: 'idContrato' },
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
        { icon: 'pi-pencil', class: 'p-button-primary', onClick: (rowData) => editData(rowData), tooltip: 'Edit' },
        { icon: 'pi-trash', class: 'p-button-danger', onClick: (rowData) => deleteData(rowData), tooltip: 'Delete' },
        { icon: 'pi-info-circle', class: 'p-button-warning', onClick: (rowData) => showData(rowData), tooltip: 'Ver Más' },
      ],
      Services:{
        CreateOrEdit: () => setShowCreateEditModal(true),
      }
    }

    // let filteredEstatusMantenimientoList = estatusMantenimientoList;

    // if (userRole === Roles.INQUILINO) {
    //   filteredEstatusMantenimientoList = estatusMantenimientoList.filter((item) => ![EstatusMantenimiento.EN_PROCESO, EstatusMantenimiento.FINALIZADO].includes(item));
    // }

    const formSchema:IFormSchema = {
      title: TableSchema.Configuration.title,
      fields: [
        { name: 'titulo', label: 'Título', type: 'text' },
        { name: 'descripcion', label: 'Descripción', type: 'text' },
        { name: 'estatus', label: 'Estatus', type: 'text', isEnum: true, listEnum: estatusMantenimientoList },
        { name: 'costo', label: 'Costo', type: 'number', defaultValue: 0, min: 0},
        { name: 'idContrato', label: 'Contrato', type: 'select', isEndpoint:true, endpointData: isEdit ? contratos : contratosActivos , labelField: 'id', valueField: 'id' },
        { name: 'id', label: 'Id', type: 'number', hiddeField: true},


      ]
    }

    function CreateEdit(formData) {

      const errors = {};
      const fieldsToValidate = [
        { name: 'titulo', label: 'Título'},
        { name: 'descripcion', label: 'Descripción'},
        { name: 'estatus', label: 'Estatus', isEnum: true},
        { name: 'idContrato', label: 'Contrato', isId:true },
      ];

      fieldsToValidate.forEach(field => {
        if (field.isEnum || field.isId) {
            if (formData[field.name] === undefined || formData[field.name] === null || formData[field.name] === '') {
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
            return mantenimientoService.edit(formData.id, formData).then(() => {
              loadData();
              if (toast?.current) { toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Mantenimiento Editado Exitosamente', life: 3000 });}
              return { success: true };
            }).catch((error) => {
                console.error('Error fetching edificios:', error);
                return { success: false, errors: { general: 'Error al editar el mantenimiento.' } };
            })
        } else {
          const newFormData = { ...formData, id: 0 };
          return mantenimientoService.create(newFormData).then((data) => {
              loadData();
              if (toast?.current) {toast.current.show({severity: 'success', summary: 'Successful', detail: 'Mantenimiento Creado Exitosamente', life: 3000, });}            
              return { success: true };
          }).catch((error) => {
            if (toast?.current) {toast.current.show({ severity: 'error', summary: 'Error', detail: 'Error al crear el mantenimiento', life: 3000 });} 
              console.error('Error al crear:', error);
              return { success: false, errors: { general: 'Error al crear el mantenimiento.' } };
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

export default MantenimentosEncargado