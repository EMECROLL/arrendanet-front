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

function MantenimentosEncargado() {
    const [data, setData] = useState()
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [showDataModal, setShowDataModal] = useState(false)
    const [isEdit, setIsEdit] = useState(false)
    const [showCreateEditModal, setShowCreateEditModal] = useState(false)
    const [selectedData, setSelectedData] = useState()
    const toast = useRef(null);
    const edificioService = new EdificioService(); // Los servicios de cualquier endpoint lo deben declarar primero, generan una instancia de su clase
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
      edificioService.getAll().then((data) => {
        setData(data);
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
              toast!.current.show({ severity: 'success', summary: 'Successful', detail: 'Edificio Eliminado Exitosamente', life: 3000 });
          } catch (error) {
              toast!.current.show({ severity: 'error', summary: 'Error', detail: 'Error al eliminar el edificio', life: 3000 });
              console.error('Error al eliminar a la persona:', error);
          }
      } else {
          toast!.current.show({ severity: 'warn', summary: 'Advertencia', detail: 'No se ha seleccionado ningun edificio para eliminar', life: 3000 });
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
        title:'Mantenimientos',
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
        { name: 'id', label: 'Id', type: 'number', showField:false},
        { name: 'direccion', label: 'Dirección', type: 'text' },
        { name: 'contacto', label: 'Contacto', type: 'text' },
      ]
    }

    function CreateEdit(formData) {
        if (isEdit) {
            edificioService.edit(formData.id, formData).then(() => {
              loadData();
              toast!.current.show({ severity: 'success', summary: 'Successful', detail: 'Edificio Editado Exitosamente', life: 3000 });
            }).catch((error) => {
                console.error('Error fetching edificios:', error);
            })
        } else {
          const newFormData = { ...formData, id: 0 };
          edificioService.create(newFormData).then((data) => {
              loadData();
              toast!.current.show({ severity: 'success', summary: 'Successful', detail: 'Edificio Creado Exitosamente', life: 3000 });
          }).catch((error) => {
            toast!.current.show({ severity: 'error', summary: 'Error', detail: 'Error al crear el edificio', life: 3000 });
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

export default MantenimentosEncargado