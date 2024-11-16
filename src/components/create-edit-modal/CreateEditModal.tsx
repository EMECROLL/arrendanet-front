import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import React, { useEffect, useState } from 'react';

function CreateEditModal({ formSchema, visible, setVisible, onSave, setIsEdit, isEdit, data, columns }) {
    const [formData, setFormData] = useState({});
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const initialFormData = formSchema.fields.reduce((acc, field) => {
            let value = isEdit && data ? data[field.name] : (field.defaultValue ?? field.value);
            
            if (field.isEnum && (value === undefined || value === '')) {
                value = 0;
            } else if (field.type === 'date' && value) {
                value = value.split('T')[0];
            } else if (value === undefined || value === null) {
                value = '';
            }
    
            acc[field.name] = value;
            return acc;
        }, {});
        setFormData(initialFormData);
        setErrors({});
    }, [formSchema.fields, isEdit, data]);
    
    function hideDialog() {
        setVisible(false);
        setTimeout(() => {
            setIsEdit(false);
            setFormData({});
        }, 300);
    }

    function handleChange(e, field) {
        const value = field.type === 'file' ? e.target.files[0] : e.target.value || e.value;
        setFormData({ ...formData, [field.name]: value });
        setErrors({ ...errors, [field.name]: '' });
    }

     function saveData() {
        onSave(formData).then((result) => {
            if (result.success) {
                hideDialog();
            } else {
                setErrors(result.errors);
            }
        });
    }
    
    

    const dialogFooter = (
        <React.Fragment>
            <Button label="Cancelar" icon="pi pi-times" outlined onClick={hideDialog} />
            <Button label={isEdit ? "Editar" : "Crear"} severity="success" onClick={saveData} />
        </React.Fragment>
    );

    const fieldGroups = [];
    for (let i = 0; i < formSchema.fields.length; i += 2) {
        fieldGroups.push(formSchema.fields.slice(i, i + 2));
    }

    return (
        <Dialog
            visible={visible}
            header={isEdit ? `Editar ${formSchema.title}` : `Crear ${formSchema.title}`}
            className='w-[90%] md:w-[50vw]'
            footer={dialogFooter}
            onHide={hideDialog}
        >
            <form className='p-5'>
                {fieldGroups.map((group, groupIndex) => (
                    <div className={`grid grid-cols-${columns} gap-5 mb-5`} key={groupIndex}>
                        {group.map((field, index) => (
                            <div className={`card flex justify-content-center ${columns == 2 ? 'w-[45%]' : 'w-full' }`} key={index}>
                                <div className="flex flex-column gap-2" style={{ width: '100%' }}>
                                    <label htmlFor={field.name} className={field.hiddeField ? 'hidden' :''}>{field.label}</label>
                                    {field.type === 'file' ? (
                                        <input
                                            disabled={field.disableField}
                                            defaultValue={!isEdit ? field.defaultValue : ''}
                                            id={field.name}
                                            type="file"
                                            onChange={(e) => handleChange(e, field)}
                                            className={errors[field.name] ? 'p-invalid' : ''}
                                        />
                                    ) : field.isEnum ? (
                                        <Dropdown
                                        disabled={field.disableField}
                                        id={field.name}
                                        value={formData[field.name] !== undefined ? Number(formData[field.name]) : ''}
                                        options={field.listEnum.map((item, idx) => ({
                                          label: item,    // El nombre del enum que se muestra
                                          value: idx,     // El índice que se enviará al backend
                                        }))} 
                                        onChange={(e) => handleChange(e, field)}
                                        placeholder={`Seleccione ${field.label}`}
                                        className={errors[field.name] ? 'p-invalid' : ''}
                                      />
                                      
                                      
                                    ) : field.isEndpoint && field.endpointData ? (
                                        <Dropdown
                                            disabled={field.disableField}
                                            id={field.name}
                                            value={formData[field.name] || (field.defaultValue ?? '')}
                                            options={field.endpointData.map(item => ({
                                                label: item[field.labelField],
                                                value: item[field.valueField]
                                            }))}
                                            onChange={(e) => handleChange(e, field)}
                                            placeholder={`Seleccione ${field.label}`}
                                            className={errors[field.name] ? 'p-invalid' : ''}
                                        />
                                    ) : (
                                        <InputText
                                            hidden={field.hiddeField}
                                            disabled={field.disableField}
                                            id={field.name}
                                            aria-describedby={`${field.name}-help`}
                                            value={formData[field.name] || (field.defaultValue ?? '')}
                                            onChange={(e) => handleChange(e, field)}
                                            type={field.type || 'text'}
                                            min={field.min}
                                            max={field.max}
                                            className={errors[field.name] ? 'p-invalid' : ''}
                                        />
                                    )}
                                    {errors[field.name] && (
                                        <small id={`${field.name}-help`} style={{ color: 'red' }}>
                                            {errors[field.name]}
                                        </small>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ))}
            </form>
        </Dialog>
    );
}

export default CreateEditModal;
