import { FilterMatchMode } from "primereact/api";

export interface ITableColumn {
    header: string; // Título de la columna
    field: string; // Nombre que tiene el dato cuando llega a en tu endpoint. Ej {nombre: Kevin}, en este caso el field es nombre
    sortable?: boolean; // ¿Quieres que la columna se ordene?
    filter?: boolean;   // ¿Quieres que tenga filtro? sino pues desactivalo
    headerStyle?: React.CSSProperties; // Estilo del encabezado o nombre de la columna
    filterPlaceholder?: string; // placeholder del filtro xD
    filterField?: string; // alc aun no se para que es
    filterType?: 'text' | 'dropdown' | 'multiSelect' | 'checked';
    showFilterMenu?: boolean; // ¿Quieres que se muestre el menu de filtros? contener, empezar, etc
    filterMenuStyle?: React.CSSProperties; // Estilo del menu de filtros. 
    style?: React.CSSProperties; // Estilos de la columna completa
    bodyStyle?: React.CSSProperties; // Estilos de las celdas completas
    body?: (rowData: any) => React.ReactNode; // Cambiar el contenido, para inyectar código y meterle lógica a las celdas o con estilos segun la celda o meter componentes dentro.
    filterElement?: (options: any) => React.ReactNode; // Para cambiar el componente de un filtro, para que en lugar de que sea un filtro de texto, sea un select, o un check, etc.
}

export interface IFilter {
    value: any;
    matchMode: FilterMatchMode;
}

export interface ITableSchema {
    Configuration: {
        paginator: boolean;
        rows?: number;
        dataKey: string;
        filterDisplay?: 'row' | 'menu';
        emptyMessage?: string;
        globalFilterFields: string[]; 
    };
    Columns: ITableColumn[];
    Filters?: { [key: string]: IFilter };
    Data?: any[];
    Actions: IAction[];
}

export interface IAction {
    icon: string;
    class: string;
    onClick: (rowData: any) => void;
    tooltip: string;
    style?: React.CSSProperties;
}

