export interface IFormSchema{
    title:string,
    fields:IDataFormField[]
}

export interface IDataFormField {
    name: string, 
    label: string,
    type: 'date' | 'text' | 'password' | 'number' | 'select' | 'file',
    typeFile?: string, 
    showField?: boolean,
    helperText?: string,
    required?: boolean,
    isEndpoint?:boolean, 
    endpointData?: any[], // El JSON con los datos que recibi del endpoint
    labelField?: string,   // Nombre que se vera en el dropdonw
    valueField?: string,   // Dato que se enviara
    isEnum?:boolean, 
    listEnum?: string[],
    min?: number,
    max?: number,
}