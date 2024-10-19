
import React, { useState, ChangeEvent } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column, ColumnFilterElementTemplateOptions } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { Dropdown } from 'primereact/dropdown';
import { MultiSelect } from 'primereact/multiselect';
import { TriStateCheckbox } from 'primereact/tristatecheckbox';
import { ITableSchema } from '../../interfaces/DataTable';

interface BasicDataTableProps {
    TableSchema: ITableSchema;
}

const BasicDataTable: React.FC<BasicDataTableProps> = ({ TableSchema }) => {
    const [filters, setFilters] = useState(TableSchema.Filters);
    const [loading] = useState(false);
    const [globalFilterValue, setGlobalFilterValue] = useState('');

    const onGlobalFilterChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        let _filters = { ...filters };

        _filters['global'].value = value;

        setFilters(_filters);
        setGlobalFilterValue(value);
    };

    const renderHeader = () => {
        return (
            <div className="flex justify-content-end">
                <IconField iconPosition="left">
                    <InputIcon className="pi pi-search" />
                    <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Keyword Search" />
                </IconField>
            </div>
        );
    };

    const getUniqueValues = (field:string) => {
        const uniqueValues = new Set();
    
        if (!TableSchema || !TableSchema.Data) {
            console.error('TableSchema or TableSchema.Data is undefined');
            return [];
        }
        
        TableSchema.Data.forEach(item => {
            const keys = field.split('.');
            const value = keys.reduce((acc, key) => (acc && acc[key] !== undefined) ? acc[key] : undefined, item);
    
            if (value) {
                uniqueValues.add(value);
            }
        });
    
        return Array.from(uniqueValues).map(name => (name));
    };
    
    const dynamicDropdownFilterTemplate = (options:ColumnFilterElementTemplateOptions, field:string) => {                
        const uniqueOptions = getUniqueValues(field); 
        
        return (
            <Dropdown
                value={options.value}
                options={uniqueOptions}
                onChange={(e) => {options.filterApplyCallback(e.value)}}
                placeholder="Select One"
                optionLabel="name"
                className="p-column-filter"
                showClear
                style={{ minWidth: '12rem' }}
            />
        );
    };

    const representativeRowFilterTemplate = (options:ColumnFilterElementTemplateOptions, field:string) => {        
        const uniqueOptions = getUniqueValues(field);

        return (
            <MultiSelect
                value={options.value}
                options={uniqueOptions}
                onChange={(e) => options.filterApplyCallback(e.value)}
                placeholder="Any"
                className="p-column-filter"
                maxSelectedLabels={1}
                style={{ minWidth: '14rem' }}
            />
        );
    };

    const verifiedRowFilterTemplate = (options:ColumnFilterElementTemplateOptions) => {
        return <TriStateCheckbox value={options.value} onChange={(e) => options.filterApplyCallback(e.value)} />;
    };

    const header = renderHeader();

    return (
        <div className="card">

            <DataTable 
            rowsPerPageOptions={[10, 15, 25, 50]}
            value={TableSchema.Data} 
            paginator={TableSchema.Configuration?.paginator ?? true} 
            rows={TableSchema.Configuration.rows ?? 10} 
            dataKey={TableSchema.Configuration.dataKey} 
            filters={filters} 
            filterDisplay={TableSchema.Configuration?.filterDisplay ?? 'row'} 
            loading={loading}
            globalFilterFields={TableSchema.Configuration.globalFilterFields} 
            header={header} 
            emptyMessage={TableSchema.Configuration?.emptyMessage ?? "No data found."}>
                {
                    TableSchema.Columns.map((column, index) => (
                        <Column
                            sortable={column.sortable ?? true}
                            filterField={column.filterField}
                            headerStyle={column.headerStyle}
                            key={index}
                            bodyStyle={column.bodyStyle}
                            field={column.field}
                            header={column.header}
                            filter={column.filter ?? true}
                            showFilterMenu={column.showFilterMenu ?? true}
                            filterMenuStyle={column.filterMenuStyle}
                            filterPlaceholder={column.filterPlaceholder ?? `Search by ${column.header.toLowerCase()}`}
                            style={column.style}
                            body={column.body}
                            filterElement={column.filterElement 
                                ?? column.filterType == 'dropdown' 
                                ? (options) => dynamicDropdownFilterTemplate(options, column.field) : 
                                column.filterType == 'multiSelect'
                                ? (options) => representativeRowFilterTemplate(options, column.field) : 
                                column.filterType == 'checked' ?
                                verifiedRowFilterTemplate : null
                            }
                        />
                    ))
                }
                {
                        <Column
                            header={'Actions'}
                            body={(rowData) => (
                                <div className="flex gap-2 justify-content-center">
                                    {TableSchema.Actions.map((action, actionIndex) => (
                                        <button
                                            key={actionIndex}
                                            className={`p-button p-button-sm ${action.class}`}
                                            style={action.style}
                                            onClick={() => action.onClick(rowData)}
                                            title={action.tooltip}
                                        >
                                            <i className={`pi ${action.icon}`}></i>
                                        </button>
                                    ))}
                                </div>
                            )}
                            style={{ textAlign: 'center', width: '10rem' }}
                        />
                    
                }


            </DataTable>
            
        </div>
    );
}
        

export default BasicDataTable