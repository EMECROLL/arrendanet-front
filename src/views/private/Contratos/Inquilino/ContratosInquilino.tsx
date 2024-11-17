import { FilterMatchMode } from 'primereact/api';
import { useEffect, useRef, useState } from 'react';
import { Toast } from 'primereact/toast';
import { ITableSchema } from '../../../../interfaces/data-table/DataTable';
import BasicDataTable from '../../../../components/basic-data-table/BasicDataTable';
import DeleteModal from '../../../../components/delete-modal/DeleteModal';
// import checkedBodyTemplate from '../../../../components/checked-body-template/checkedBodyTemplate';
import { ContratoService } from '../../../../services/contrato/ContratoService';
import { IPersona } from '../../../../interfaces/persona/Persona';
import BasicModal from '../../../../components/basic-modal/BasicModal';
import { EstatusContrato, TipoContrato } from '../../../../common/enums/enums';
import { IFormSchema } from '../../../../interfaces/data-form-field/DataFormField';
import CreateEditModal from '../../../../components/create-edit-modal/CreateEditModal';
import { HabitacionService } from '../../../../services/habitacion/HabitacionService';
import { PersonaService } from '../../../../services/persona/PersonaService';
import iconoGirarCelular from '../../../../assets/gif/icono-girar.gif'
import { DataView } from 'primereact/dataview';
import { Button } from 'primereact/button';
import { classNames } from 'primereact/utils';
import { Tag } from 'primereact/tag';
import { useAuth } from '../../../../AuthContext';

function ContratosInquilino() {
    const url = import.meta.env.VITE_BACKEND_URL;
    const [data, setData] = useState([])
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [showDataModal, setShowDataModal] = useState(false)
    const [showContratoPDFModal, setShowContratoPDFModal] = useState(false)
    const [isEdit, setIsEdit] = useState(false)
    const [showCreateEditModal, setShowCreateEditModal] = useState(false)
    const [selectedData, setSelectedData] = useState<IPersona>()
    const toast = useRef(null);
    const estatusContratoList = Object.values(EstatusContrato);
    const tipoContratoList = Object.values(TipoContrato);
    const [inquilinos, setInquilinos] = useState()
    const [habitaciones, setHabitaciones] = useState()

    const contratoService = new ContratoService(); // Los servicios de cualquier endpoint lo deben declarar primero, generan una instancia de su clase
    const personaService = new PersonaService(); // Los servicios de cualquier endpoint lo deben declarar primero, generan una instancia de su clase
    const habitacionService = new HabitacionService(); // Los servicios de cualquier endpoint lo deben declarar primero, generan una instancia de su clase
    const ignoreColumns = ['idInquilino', 'idHabitacion', 'idInquilino', 'rutaContrato', 'duracion']
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
      const inquilinosResponse = await getInquilinos();
      const habitacionesResponse = await getHabitaciones();

      const inquilinosMap = await inquilinosResponse.reduce((acc, edificio) => {
        acc[edificio.id] = edificio;
        return acc;
      }, {});

      const habitacionesMap = await habitacionesResponse.reduce((acc, edificio) => {
        acc[edificio.id] = edificio;
        return acc;
      }, {});

      // ? Aqui hago el cambio de un digito a un enum
      contratoService.getAllByRol(token).then((data) => {
        const updatedData = data.data.map((element) => ({
          ...element,
          inquilino: inquilinosMap[element.idInquilino].nombre,
          habitacion: habitacionesMap[element.idHabitacion].numeroHabitacion,
          estatusContrato: estatusContratoList[element.estatusContrato],
          tipoContrato: tipoContratoList[element.tipoContrato],
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
              await contratoService.delete(selectedData.id);
              loadData();
              toast!.current.show({ severity: 'success', summary: 'Successful', detail: 'Persona Eliminada', life: 3000 });
          } catch (error) {
              toast!.current.show({ severity: 'error', summary: 'Error', detail: 'Error al eliminar a la persona', life: 3000 });
              console.error('Error al eliminar a la persona:', error);
          }
      } else {
          toast!.current.show({ severity: 'warn', summary: 'Advertencia', detail: 'No se ha seleccionado ninguna persona para eliminar', life: 3000 });
      }
    }

    // ? Función para abrir modal para editar
    function editData(rowData) {
      getHabitaciones();
      setShowCreateEditModal(true);
      setIsEdit(true);
      const rowDataModified = {
        ...rowData,
        tipoContrato: Object.values(tipoContratoList).indexOf(rowData.tipoContrato),
        estatusContrato: Object.values(estatusContratoList).indexOf(rowData.estatusContrato)
      }
      setSelectedData(rowDataModified)
    }

    // ? Función para cargar modal con datos
    function showData(rowData) {
      setShowDataModal(true);
      setSelectedData(rowData)
    }

    // ? Función para cargar modal con el PDF del contrato
    function showContratoPDF(rowData) {
      setShowContratoPDFModal(true);
      setSelectedData(rowData)
    }


  
    const filtersName: string[] = ['fechaInicio', 'fechaFin', 'estatusContrato', 'duracion', 'inquilino'];
    const TableSchema: ITableSchema = {
      Configuration: {
        title:'Contratos',
        paginator: true,
        dataKey: 'id', // Tomen muy en cuenta esto
        globalFilterFields: filtersName,
      },
      Columns: [
        { header: 'Fecha Inicio', field: 'fechaInicio', isDate: true},
        { header: 'Fecha Fin', field: 'fechaFin', isDate: true},
        { header: 'Estatus Contrato', field: 'estatusContrato', filterType:'dropdown'},
        { header: 'Duración', field: 'duracion'},
        { header: 'Inquilino', field: 'inquilino'},
      ],
      Filters: {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS},
        [filtersName[0]]: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        [filtersName[1]]: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        [filtersName[2]]: { value: null, matchMode: FilterMatchMode.EQUALS },
        [filtersName[3]]: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        [filtersName[4]]: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
      },
      Data: data,
      Actions:[
        { icon: 'pi-pencil', class: 'p-button-primary', onClick: (rowData) => editData(rowData), tooltip: 'Edit' },
        { icon: 'pi-trash', class: 'p-button-danger', onClick: (rowData) => deleteData(rowData), tooltip: 'Delete' },
        { icon: 'pi-info-circle', class: 'p-button-warning', onClick: (rowData) => showData(rowData), tooltip: 'Ver Más' },
        { icon: 'pi-file', class: 'p-button-primary', onClick: (rowData) => showContratoPDF(rowData), tooltip: 'Ver Contrato', 
          style: {background: "rgb(0, 31, 100)", border: "1px solid rgb(0, 31, 100)"} },
      ],
      Services:{
        CreateOrEdit: () => setShowCreateEditModal(true),
      }
    }


    function CreateEdit(formData) {  
      const errors = {};
      const fieldsToValidate = [
        { name: 'fechaInicio', label: 'Fecha Inicio'},
        { name: 'fechaFin', label: 'Fecha Fin'},
        { name: 'estatusContrato', label: 'Estatus Contrato', isEnum: true},
        { name: 'tipoContrato', label: 'Tipo Contrato', isEnum: true},

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
        return contratoService.updateContrato(formData.id, formData).then((data) => {
          
          loadData();
          toast!.current.show({ severity: 'success', summary: 'Successful', detail: 'Contrato Editado Exitosamente', life: 3000 });
          return { success: true };
        }).catch((error) => {
            console.error('Error fetching contratos:', error);
            return { success: false, errors: { general: 'Error al editar el contrato.' } };
        })
      } else {
        const newFormData = { ...formData, id: 0 };
        return contratoService.createContrato(newFormData).then((data) => {

            loadData();
            toast!.current.show({ severity: 'success', summary: 'Successful', detail: 'Contrato Creado Exitosamente', life: 3000 });
            return { success: true };
        }).catch((error) => {
          toast!.current.show({ severity: 'error', summary: 'Error', detail: 'Error al crear el contrato', life: 3000 });
            console.error('Error al crear:', error);
            return { success: false, errors: { general: 'Error al crear el contrato.' } };
        });
      }
    }

    async function getInquilinos(){
      const response = await personaService.getAll();
      try {
        setInquilinos(response)
        return response;
      } catch (error) {
        toast!.current.show({ severity: 'error', summary: 'Error', detail: 'Error al obtener las habitaciones', life: 3000 });
      }
    }

    async function getHabitaciones(){
      const response = await habitacionService.getAll();
      try {
        setHabitaciones(response)
        return response;
      } catch (error) {
        toast!.current.show({ severity: 'error', summary: 'Error', detail: 'Error al obtener las habitaciones', life: 3000 });
      }
    }

    const formSchema:IFormSchema = {
      title: TableSchema.Configuration.title,
      fields: [
        { name: 'fechaInicio', label: 'Fecha Inicio', type: 'date'},
        { name: 'fechaFin', label: 'Fecha Fin', type: 'date'},
        { name: 'estatusContrato', label: 'Estatus Contrato', type: 'select', isEnum: true, listEnum: estatusContratoList },
        { name: 'tipoContrato', label: 'Tipo Contrato', type: 'select', isEnum: true, listEnum: tipoContratoList },
        { name: 'duracion', label: 'Duración', type: 'number', min: 0},
        { name: 'monto', label: 'Monto', type: 'number' },
        { name: 'contratoPDF', label: 'Contrato', type: 'file' },
        { name: 'idInquilino', label: 'Inquilino', type: 'select', isEndpoint: true, endpointData: inquilinos, valueField:'id', labelField:'nombre'},
        { name: 'idHabitacion', label: 'Habitación', type: 'select', isEndpoint: true, endpointData: habitaciones, valueField:'id', labelField:'numeroHabitacion'},
        { name: 'id', label: 'id', type: 'number', hiddeField: true},

      ]
    }

    const formatDate = (value: any) => {
      if (!value) return '';
      const date = new Date(value);
      return !isNaN(date.getTime()) ? new Intl.DateTimeFormat('es-MX').format(date) : value;
    };

    const getSeverityEstatusContrato = (data) => {

      switch (data.estatusContrato) {
          case 'Activo':
              return 'success';

          case 'Inactivo':
              return 'warning';

          case 'Vencido':
              return 'danger';

          default:
              return null;
      }
  };


    const itemTemplate = (data, index) => {

      return (
          <div className="col-12 shadow-xl rounded-xl" key={data.id}>
              <div className={classNames('flex flex-column xl:flex-row xl:align-items-start p-4 gap-4', { 'border-top-1 surface-border': index !== 0 })}>
              <div className="flex flex-column md:flex-row justify-content-between align-items-center xl:align-items-start flex-1 gap-4">
                      <div className="self-start flex flex-column align-items-start gap-3">
                        <div className="text-xs md:text-2xl font-bold text-900">
                            <span>Fecha Inicio: {formatDate(data.fechaInicio)}</span> - Fecha Fin: <span>{formatDate(data.fechaFin)}</span>
                          </div>
                          <div className="md:flex align-items-center gap-3">
                              <span className="flex align-items-center gap-2">
                                  <p className='text-xs md:text-base'><strong>Habitación: </strong></p>
                                  <span className="text-xs md:text-base font-semibold">{data.habitacion}</span>
                              </span>
                              <span className="flex align-items-center gap-2">
                                  <p className='text-xs md:text-base'><strong>Monto: </strong></p>
                                  <span className="text-xs md:text-base font-semibold">{data.monto}</span>
                              </span>
                              <span className="flex align-items-center gap-2">
                                  <p className='text-xs md:text-base'><strong>Tipo Contrato: </strong></p>
                                  <span className="text-xs md:text-base font-semibold">{data.tipoContrato}</span>
                              </span>
                              <strong className='text-xs md:text-base'>Estatus:</strong>
                              <Tag className='ml-2 md:m-0' value={data.estatusContrato} severity={getSeverityEstatusContrato(data)}></Tag>
                          </div>
                      </div>
                      <div className="flex flex-col md:grid grid-cols-4 md:grid-cols-1 sm:flex-column align-items-center sm:align-items-end gap-3 sm:gap-2 w-full md:w-auto">
                          <Button className='p-button-info w-full text-xs md:text-base flex justify-center font-semibold md:font-normal' onClick={()=>showContratoPDF(data)}>
                            <span className="flex">Ver PDF</span>
                            </Button>
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
                <h1 className='ml-4'>Contratos</h1>
                <DataView value={data} listTemplate={listTemplate} paginator rows={5}/>
            </div>
        <DeleteModal 
        showDeleteModal={showDeleteModal} 
        setShowDeleteModal={setShowDeleteModal}
        data={selectedData}
        deleteFunction={deleteFunction}
        message={selectedData?.nombre}
        ></DeleteModal>
        <BasicModal
        title="Contrato"
        showDataModal={showDataModal} 
        setShowDataModal={setShowDataModal}
        data={selectedData}
        ignoreColumns={ignoreColumns}
        ></BasicModal>
        <BasicModal
        title="Contrato"
        showDataModal={showContratoPDFModal} 
        setShowDataModal={setShowContratoPDFModal}
        ignoreColumns={ignoreColumns}
        pdfUrl={`${url}${selectedData?.rutaContrato}`}
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

export default ContratosInquilino