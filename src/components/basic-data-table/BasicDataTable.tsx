
import React, { useState, ChangeEvent, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column, ColumnFilterElementTemplateOptions } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { Dropdown } from 'primereact/dropdown';
import { MultiSelect } from 'primereact/multiselect';
import { TriStateCheckbox } from 'primereact/tristatecheckbox';
import { ITableSchema } from '../../interfaces/data-table/DataTable';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';

interface BasicDataTableProps {
    TableSchema: ITableSchema;
}

const BasicDataTable: React.FC<BasicDataTableProps> = ({ TableSchema }) => {
    const [filters, setFilters] = useState(TableSchema.Filters);
    const [selectedData, setSelectedData] = useState(null);
    const [deleteDatasDialog, setDeleteDatasDialog] = useState(false);
    const [loading] = useState(false);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const dt = useRef(null);
    const exportColumns = TableSchema.Columns.map((col) => ({ title: col.header, dataKey: col.field }));

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

    const exportCSV = (selectionOnly:boolean) => {  
        if(dt.current != null){
            dt.current.exportCSV({ selectionOnly });
        }      
    };

    const exportPdf = () => {
        import('jspdf').then((jsPDF) => {
            import('jspdf-autotable').then(() => {
                const doc = new jsPDF.default();

                doc.autoTable(exportColumns, TableSchema.Data);
                doc.save(`${TableSchema.Configuration.title.toLocaleLowerCase()}.pdf`);
            });
        });
    };

    const exportExcel = () => {
        import('xlsx').then((xlsx) => {
            const worksheet = xlsx.utils.json_to_sheet(TableSchema.Data);
            const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
            const excelBuffer = xlsx.write(workbook, {
                bookType: 'xlsx',
                type: 'array'
            });

            saveAsExcelFile(excelBuffer, TableSchema.Configuration.title.toLocaleLowerCase());
        });
    };

    const saveAsExcelFile = (buffer:ArrayBuffer, fileName:string) => {
        
        import('file-saver').then((module) => {
            if (module && module.default) {
                let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
                let EXCEL_EXTENSION = '.xlsx';
                const data = new Blob([buffer], {
                    type: EXCEL_TYPE
                });

                module.default.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
            }
        });
    };

    const confirmDeleteSelected = () => {
        setDeleteDatasDialog(true);
    };

    const hideDeleteDatasDialog = () => {
        setDeleteDatasDialog(false);
    };

    const deleteSelectedDatas = () => {
        console.log(val);
        
        setDeleteDatasDialog(false);
        setSelectedData(null);
        // toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Products Deleted', life: 3000 });
    };

    const deleteDatasDialogFooter = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" outlined onClick={hideDeleteDatasDialog} />
            <Button label="Yes" icon="pi pi-check" severity="danger" onClick={deleteSelectedDatas} />
        </React.Fragment>
    );

    
    const header = (
        <div className='flex justify-content-between'>
            <div className="flex align-items-center justify-content-end gap-2">
                <Button type="button" icon="pi pi-file" rounded onClick={() => exportCSV(false)} data-pr-tooltip="CSV" />
                <Button type="button" icon="pi pi-file-excel" severity="success" rounded onClick={exportExcel} data-pr-tooltip="XLS" />
                <Button type="button" icon="pi pi-file-pdf" severity="warning" rounded onClick={exportPdf} data-pr-tooltip="PDF" />
            </div>
            <div className="flex flex-wrap gap-2">
                {renderHeader()}
                {/* <Button label="New" icon="pi pi-plus" severity="success" onClick={openNew} /> */}
                {
                    TableSchema.Configuration?.checked && 
                    <Button label="Delete" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected}  disabled={!selectedData || !selectedData.length}/>
                }
            </div>
        </div>
        
    );

    return (
        <div className="card">
            <DataTable 
            ref={dt}
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
            emptyMessage={TableSchema.Configuration?.emptyMessage ?? "No data found."}
            selection={selectedData} 
            onSelectionChange={(e) => setSelectedData(e.value)}
            >
                {
                    TableSchema.Configuration?.checked && 
                    <Column selectionMode="multiple" exportable={false}></Column>
                }
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
            {
                TableSchema.Configuration?.checked &&
                <Dialog visible={deleteDatasDialog} style={{ width: '32rem' }} 
                breakpoints={{ '960px': '75vw', '641px': '90vw' }} 
                header="Confirm" modal footer={deleteDatasDialogFooter} 
                onHide={hideDeleteDatasDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {selectedData && <span>Are you sure you want to delete the selected data?</span>}
                    </div>
                </Dialog>
            }
            
        </div>
    );
}
        

export default BasicDataTable