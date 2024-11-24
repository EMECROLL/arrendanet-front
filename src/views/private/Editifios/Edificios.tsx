import { FilterMatchMode } from 'primereact/api';
import { useEffect, useRef, useState } from 'react';
import { Toast } from 'primereact/toast';
import { ITableSchema } from '../../../interfaces/data-table/DataTable';
import BasicDataTable from '../../../components/basic-data-table/BasicDataTable';
import DeleteModal from '../../../components/delete-modal/DeleteModal';
// import checkedBodyTemplate from '../../../components/checked-body-template/checkedBodyTemplate';
import { EdificioService } from '../../../services/edificio/EdificioService';
import BasicModal from '../../../components/basic-modal/BasicModal';
import { IFormSchema } from '../../../interfaces/data-form-field/DataFormField';
import CreateEditModal from '../../../components/create-edit-modal/CreateEditModal';
import iconoGirarCelular from '../../../assets/gif/icono-girar.gif'
import { IEdificio } from '../../../interfaces/edificio/Edificio';
import { useAuth } from '../../../AuthContext';

const Edificios: React.FC = () => {
    const [data, setData] = useState()
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [showDataModal, setShowDataModal] = useState(false)
    const [isEdit, setIsEdit] = useState(false)
    const [showCreateEditModal, setShowCreateEditModal] = useState(false)
    const [selectedData, setSelectedData] = useState<IEdificio>()
    const toast = useRef<Toast>(null);
    const edificioService = new EdificioService(); // Los servicios de cualquier endpoint lo deben declarar primero, generan una instancia de su clase
    const [isMobile, setIsMobile] = useState(false);
    const { token } = useAuth();

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
      edificioService.getAllByRol(token).then((data) => {
        setData(data.data);
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
              await edificioService.delete(selectedData.id);
              loadData();
              if (toast?.current) {toast.current.show({ severity: 'success', summary: 'Éxito', detail: 'Edificio Eliminado Exitosamente', life: 3000 });}
          } catch (error) {
            if (toast?.current) {toast.current.show({ severity: 'error', summary: 'Error', detail: 'Error al eliminar el edificio', life: 3000 });}
              console.error('Error al eliminar a la persona:', error);
          }
      } else {
        if (toast?.current) {toast.current.show({ severity: 'warn', summary: 'Advertencia', detail: 'No se ha seleccionado ningun edificio para eliminar', life: 3000 });}
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
  
  
    const filtersName: string[] = ['direccion', 'contacto', 'apellidoMaterno'];
    const TableSchema: ITableSchema = {
      Configuration: {
        title:'Edificios',
        paginator: true,
        dataKey: 'id', // Tomen muy en cuenta esto
        globalFilterFields: filtersName,
      },
      Columns: [
        { header: 'Direccion', field: 'direccion'},
        { header: 'contacto', field: 'contacto'},
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

    const formSchema:IFormSchema = {
      title: TableSchema.Configuration.title,
      fields: [
        { name: 'id', label: 'Id', type: 'number', hiddeField: true},
        { name: 'direccion', label: 'Dirección', type: 'text' },
        { name: 'contacto', label: 'Contacto (Telefóno o Correo electrónico)', type: 'text' },
      ]
    }
    

    function CreateEdit(formData) {
      const errors = {};
      const fieldsToValidate = [
        { name: 'direccion', label: 'Dirección' },
        { name: 'contacto', label: 'Contacto' }
      ];

      fieldsToValidate.forEach(field => {
        if (field.isEnum) {
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
          return edificioService.edit(formData.id, formData)
              .then(() => {
                  loadData();
                  if (toast?.current) {toast.current.show({ severity: 'success', summary: 'Éxito', detail: 'Edificio Editado Exitosamente', life: 3000 });}
                  return { success: true };
              })
              .catch((error) => {
                  console.error('Error fetching edificios:', error);
                  return { success: false, errors: { general: 'Error al editar el edificio.' } };
              });
      } else {
          const newFormData = { ...formData, id: 0 };
          return edificioService.create(newFormData)
              .then(() => {
                  loadData();
                  if (toast?.current) {toast.current.show({ severity: 'success', summary: 'Éxito', detail: 'Edificio Creado Exitosamente', life: 3000 });}
                  return { success: true };
              })
              .catch((error) => {
                  console.error('Error al crear:', error);
                  return { success: false, errors: { general: 'Error al crear el edificio.' } };
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
        message={selectedData?.direccion}
        ></DeleteModal>
        <BasicModal
        title="Edificio"
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
            columns={1}
        />
      </div>
    );
}

export default Edificios