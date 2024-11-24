import { FilterMatchMode } from 'primereact/api';
import { useEffect, useRef, useState } from 'react';
import { Toast } from 'primereact/toast';
import { ITableSchema } from '../../../interfaces/data-table/DataTable';
import BasicDataTable from '../../../components/basic-data-table/BasicDataTable';
import DeleteModal from '../../../components/delete-modal/DeleteModal';
import BasicModal from '../../../components/basic-modal/BasicModal';
import { IFormSchema } from '../../../interfaces/data-form-field/DataFormField';
import CreateEditModal from '../../../components/create-edit-modal/CreateEditModal';
import { EdificioService } from '../../../services/edificio/EdificioService';
import { AccountService } from '../../../services/account/AccountService';
import iconoGirarCelular from '../../../assets/gif/icono-girar.gif'
import { IPersona } from '../../../interfaces/persona/Persona';
import { useAuth } from '../../../AuthContext';
import { Roles } from '../../../common/enums/enums';

const Usuarios: React.FC = () => {
    const [data, setData] = useState()
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [showDataModal, setShowDataModal] = useState(false)
    const [edificios, setEdificios] = useState()
    const [isEdit, setIsEdit] = useState(false)
    const [roles, setRoles] = useState()
    const [showCreateEditModal, setShowCreateEditModal] = useState(false)
    const [selectedData, setSelectedData] = useState<IPersona>()
    const toast = useRef<Toast>(null);
    const edificioService = new EdificioService(); // Los servicios de cualquier endpoint lo deben declarar primero, generan una instancia de su clase
    const accountService = new AccountService(); // Los servicios de cualquier endpoint lo deben declarar primero, generan una instancia de su clase
    const ignoreColumns = ['idPersona', 'idUsuario', 'idEdificio', 'idRol', 'contacto']
    const [isMobile, setIsMobile] = useState(false);
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
      getEdificios();

      accountService.getAllRoles()
        .then((data) => {
          let filteredRoles = data;
    
          if (userRole === Roles.DUEÑO) {
            filteredRoles = data.filter((item) => ![Roles.ADMINISTRADOR, Roles.DUEÑO].includes(item.name));
          } else if (userRole === Roles.ENCARGADO) {
            filteredRoles = data.filter((item) => ![Roles.ADMINISTRADOR, Roles.DUEÑO, Roles.ENCARGADO].includes(item.name));
          }
    
          setRoles(filteredRoles);
        })
        .catch((error) => {
          console.error('Error fetching roles:', error);
        });

      accountService.getAllAccounts(token).then((data) => {
        if(data.success){
          setData(data.data);
        }else{
          if (toast?.current) {toast.current.show({ severity: 'error', summary: 'Error', detail: 'Error al obtener a los usuarios', life: 3000 });}
        }
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
      
      if (selectedData && selectedData.idPersona) {
          try {
              await accountService.delete(selectedData.idPersona);
              loadData();
              if (toast?.current) {toast.current.show({ severity: 'success', summary: 'Éxito', detail: 'Usuario Eliminado Exitosamente', life: 3000 });}
          } catch (error) {
            if (toast?.current) {toast.current.show({ severity: 'error', summary: 'Error', detail: 'Error al eliminar el usuario', life: 3000 });}
              console.error('Error al eliminar el usuario:', error);
          }
      } else {
        if (toast?.current) {toast.current.show({ severity: 'warn', summary: 'Advertencia', detail: 'No se ha seleccionado ningun Usuario para eliminar', life: 3000 });}
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
  
  
    const filtersName: string[] = ['nombre', 'apellidoPaterno', 'apellidoMaterno', 'rol', 'email'];
    const TableSchema: ITableSchema = {
      Configuration: {
        title:'Usuarios',
        paginator: true,
        dataKey: 'id', // Tomen muy en cuenta esto
        globalFilterFields: filtersName,
      },
      Columns: [
        { header: 'Nombre', field: 'nombre'},
        { header: 'Apellido Paterno', field: 'apellidoPaterno'},      
        { header: 'Apellido Materno', field: 'apellidoMaterno'},
        { header: 'Rol', field: 'rol'},
        { header: 'Correo Electrónico', field: 'email'},
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

    async function getEdificios(){
      const response = await edificioService.getAllByRol(token);
      try {
        setEdificios(response.data)
        return response.data;
      } catch (error) {
        if (toast?.current) {toast.current.show({ severity: 'error', summary: 'Error', detail: 'Error al obtener los edificios', life: 3000 });}
      }
    }

    const formSchema:IFormSchema = {
      title: TableSchema.Configuration.title,
      fields: [
        { name: 'nombre', label: 'Nombre', type: 'text'},
        { name: 'apellidoPaterno', label: 'Apellido Paterno', type: 'text'},
        { name: 'apellidoMaterno', label: 'Apellido Materno', type: 'text'},
        { name: 'email', label: 'Correo Electrónico', type: 'text'},
        { name: 'password', label: 'Contraseña', type: 'password'},
        { name: 'confirmPassword', label: 'Confirmar Contraseña', type: 'password'},
        { name: 'numeroDeTelefono', label: 'Número de Teléfono', type: 'text'},
        { name: 'idEdificio', label: 'Edificio', type: 'select', isEndpoint: true, endpointData: edificios, labelField: 'direccion', valueField: 'id'},
        { name: 'idRol', label: 'Rol', type: 'select', isEndpoint: true, endpointData: roles, labelField: 'name', valueField: 'id'},
        { name: 'idPersona', label: 'idPersona', type: 'number', hiddeField: true},

      ]
    }

    function CreateEdit(formData) {
      const errors = {};
      const fieldsToValidate = [
        { name: 'nombre', label: 'Nombre' },
        { name: 'apellidoPaterno', label: 'Apellido Paterno' },
        { name: 'apellidoMaterno', label: 'Apellido Materno' },
        { name: 'email', label: 'Correo Electrónico' },
        { name: 'numeroDeTelefono', label: 'Número de Teléfono' },
        { name: 'idEdificio', label: 'Edificio' },
        { name: 'idRol', label: 'Rol' },
      ];

      if(!isEdit){
        fieldsToValidate.push(
          { name: 'password', label: 'Password' },
          { name: 'confirmPassword', label: 'Confirmar Password' }
        )
      }

      fieldsToValidate.forEach(field => {
        if (field.isEnum) {
            if (formData[field.name] === undefined || formData[field.name] === null || formData[field.name] === '') {
                errors[field.name] = `${field.label} es obligatorio.`;
            }
        } else {
            if (!formData[field.name] || (typeof (formData[field.name]) == 'string' ? (!formData[field.name].trim()) : null)) {
                errors[field.name] = `${field.label} es obligatorio.`;
            }
        }
      });

      const password = formData['password'];
      if (password) {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+[\]{}|;:'",.<>?/\\-])[A-Za-z\d!@#$%^&*()_+[\]{}|;:'",.<>?/\\-]{7,}$/;
        if (!passwordRegex.test(password)) {
          errors['password'] = 'La contraseña debe tener al menos una mayúscula, una minúscula, un número, un carácter especial y una longitud mínima de 7 caracteres.';
        }
      }
      
      if (formData['password'] !== formData['confirmPassword']) {
        errors['confirmPassword'] = 'Las contraseñas no coinciden.';
      }


      if (Object.keys(errors).length > 0) {
        return Promise.resolve({ success: false, errors });
      }

        if (isEdit) {
            return accountService.edit(formData.idPersona, formData).then((data) => {
              if(data.success){
                loadData();
                if (toast?.current) {toast.current.show({ severity: 'success', summary: 'Éxito', detail: 'Usuario Editado Exitosamente', life: 3000 });}
                return { success: true };  
              }else{
                if (toast?.current) {toast.current.show({ severity: 'error', summary: 'Error', detail: data.message, life: 3000 });}
                console.error('Error al crear:', error);
                return { success: false, errors: { general: data.message } };
              }
            }).catch((error) => {
              console.error('Error al crear:', error);
              return { success: false, errors: { general: data.message } };
            });
        } else {
          const newFormData = { ...formData, id: 0 };
          return accountService.create(newFormData).then((data) => {
              if(data.success){
                loadData();
                if (toast?.current) {toast.current.show({ severity: 'success', summary: 'Éxito', detail: 'Usuario Creado Exitosamente', life: 3000 });}
                return { success: true };  
              }else{
                if (toast?.current) {toast.current.show({ severity: 'error', summary: 'Error', detail: data.message, life: 3000 });}
                console.error('Error al crear:', error);
                return { success: false, errors: { general: data.message } };
              }
          }).catch((error) => {
              console.error('Error al crear:', error);
              return { success: false, errors: { general: data.message } };
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
        title="Usuario"
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
            columns={2}
        />

      </div>
    );
}

export default Usuarios