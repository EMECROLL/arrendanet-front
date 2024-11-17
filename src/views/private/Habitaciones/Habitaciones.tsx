import { FilterMatchMode } from 'primereact/api';
import { useEffect, useRef, useState } from 'react';
import { Toast } from 'primereact/toast';
import { ITableSchema } from '../../../interfaces/data-table/DataTable';
import BasicDataTable from '../../../components/basic-data-table/BasicDataTable';
import DeleteModal from '../../../components/delete-modal/DeleteModal';
import { HabitacionService } from '../../../services/habitacion/HabitacionService';
import BasicModal from '../../../components/basic-modal/BasicModal';
import { EstatusHabitacion } from '../../../common/enums/enums';
import { IFormSchema } from '../../../interfaces/data-form-field/DataFormField';
import CreateEditModal from '../../../components/create-edit-modal/CreateEditModal';
import { EdificioService } from '../../../services/edificio/EdificioService';
import iconoGirarCelular from '../../../assets/gif/icono-girar.gif'
import { IHabitacion } from '../../../interfaces/habitacion/Habitacion';
import { useAuth } from '../../../AuthContext';

function Habitaciones() {
    const [data, setData] = useState()
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [showDataModal, setShowDataModal] = useState(false)
    const [isEdit, setIsEdit] = useState(false)
    const [showCreateEditModal, setShowCreateEditModal] = useState(false)
    const [selectedData, setSelectedData] = useState<IHabitacion>()
    const [edificios, setEdificios] = useState()
    const toast = useRef(null);
    const habitacionService = new HabitacionService(); // Los servicios de cualquier endpoint lo deben declarar primero, generan una instancia de su clase
    const edificioService = new EdificioService(); // Los servicios de cualquier endpoint lo deben declarar primero, generan una instancia de su clase
    const estatusHabitacionList = Object.values(EstatusHabitacion)
    const ignoreColumns = ['idHabitacion', 'idEdificio']
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
    
    async function loadData(){
      const edificiosResponse = await getEdificios();

      const edificiosMap = await edificiosResponse.reduce((acc, edificio) => {
        acc[edificio.id] = edificio;
        return acc;
      }, {});

      habitacionService.getAllByRol(token).then((data) => {
        const updatedData = data.data.map((element) => ({
          ...element,
          edificio: edificiosMap[element.idEdificio].direccion,
          estatusHabitacion: estatusHabitacionList[element.estatusHabitacion],
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
              await habitacionService.delete(selectedData.id);
              loadData();
              toast!.current.show({ severity: 'success', summary: 'Éxito', detail: 'Habitación Eliminada', life: 3000 });
          } catch (error) {
              toast!.current.show({ severity: 'error', summary: 'Error', detail: 'Error al eliminar la habitación', life: 3000 });
              console.error('Error al eliminar la habitación:', error);
          }
      } else {
          toast!.current.show({ severity: 'warn', summary: 'Advertencia', detail: 'No se ha seleccionado ninguna habitación para eliminar', life: 3000 });
      }
    }

    // ? Función para abrir modal para editar
    function editData(rowData) {
      setShowCreateEditModal(true);
      setIsEdit(true);
      const rowDataModified = {
        ...rowData,
        estatusHabitacion: Object.values(estatusHabitacionList).indexOf(rowData.estatusHabitacion),
      }
      setSelectedData(rowDataModified)
    }

    // ? Función para cargar modal con datos
    function showData(rowData) {
      setShowDataModal(true);
      setSelectedData(rowData)
    }
  
    const filtersName: string[] = ['numeroHabitacion', 'capacidadInquilinos', 'estatusHabitacion', 'edificio'];
    const TableSchema: ITableSchema = {
      Configuration: {
        title:'Habitaciones',
        paginator: true,
        dataKey: 'id', // Tomen muy en cuenta esto
        globalFilterFields: filtersName,
      },
      Columns: [
        { header: 'Número de habitación', field: 'numeroHabitacion'},
        { header: 'Capacidad Inquilinos', field: 'capacidadInquilinos'},
        { header: 'Estado de la habitación', field: 'estatusHabitacion', filterType: 'dropdown'},
        { header: 'Edificio', field: 'edificio'},
      ],
      Filters: {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS},
        [filtersName[0]]: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        [filtersName[1]]: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        [filtersName[2]]: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
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

    async function getEdificios(){
      const response = await edificioService.getAllByRol(token);
      try {
        setEdificios(response.data)
        return response.data;
      } catch (error) {
        toast!.current.show({ severity: 'error', summary: 'Error', detail: 'Error al obtener las habitaciones', life: 3000 });
      }
    }

    const formSchema:IFormSchema = {
      title: TableSchema.Configuration.title,
      fields: [
        { name: 'numeroHabitacion', label: 'Número de habitación', type: 'number' },
        { name: 'capacidadInquilinos', label: 'Capacidad de inquilinos', type: 'number' },
        { name: 'estatusHabitacion', label: 'Estado de la habitación', type: 'select', isEnum: true, listEnum: estatusHabitacionList },
        { name: 'idEdificio', label: 'Edificio', type: 'select', isEndpoint: true, endpointData: edificios, valueField:'id', labelField: 'direccion'  },
        { name: 'id', label: 'id', type: 'number', hiddeField: true},
      ]
    }

    function CreateEdit(formData) {
      const errors = {};
      const fieldsToValidate = [
        { name: 'numeroHabitacion', label: 'Número de habitación'},
        { name: 'capacidadInquilinos', label: 'Capacidad de inquilinos'},
        { name: 'estatusHabitacion', label: 'Estado de la habitación', isEnum: true},
        { name: 'idEdificio', label: 'Edificio'},
      ];

      fieldsToValidate.forEach(field => {
        if (field.isEnum) {
            if (formData[field.name] === undefined || formData[field.name] === null) {
                errors[field.name] = `${field.label} es obligatorio.`;
            }
        } else {
            if (!formData[field.name] || (typeof (formData[field.name]) == 'string' ? (!formData[field.name].trim()) : null)) {
                errors[field.name] = `${field.label} es obligatorio.`;
            }
        }
      });

      if (Object.keys(errors).length > 0) {
          return Promise.resolve({ success: false, errors });
      }

      if (isEdit) {
        return habitacionService.edit(formData.id, formData).then(() => {
          loadData();
          toast!.current.show({ severity: 'success', summary: 'Éxito', detail: 'Habitación Editada Exitosamente', life: 3000 });
          return { success: true };
        }).catch((error) => {
            console.error('Error fetching habitaciones:', error);
            return { success: false, errors: { general: 'Error al editar la habitación.' } };
        })
      } else {
        const newFormData = { ...formData, id: 0 };
        return habitacionService.create(newFormData).then((data) => {
            loadData();
            toast!.current.show({ severity: 'success', summary: 'Éxito', detail: 'Habitación Creada Exitosamente', life: 3000 });
            return { success: true };
        }).catch((error) => {
          toast!.current.show({ severity: 'error', summary: 'Error', detail: 'Error al crear la habitación', life: 3000 });
            console.error('Error al crear:', error);
            return { success: false, errors: { general: 'Error al crear la habitación.' } };
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
        message={`habitación número ${selectedData?.numeroHabitacion}`}
        ></DeleteModal>
         <BasicModal
        title="Habitación"
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

export default Habitaciones