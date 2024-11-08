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
    isEnum?:boolean, 
    listEnum?: string[]
}