import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import React, { useEffect, useState } from 'react';

function CreateEditModal({ formSchema, visible, setVisible, onSave, setIsEdit, isEdit, data }) {
    const [formData, setFormData] = useState({});
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const initialFormData = formSchema.fields.reduce((acc, field) => {
            let value = isEdit && data ? data[field.name] : field.value;
            
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
            style={{ width: '50vw' }}
            footer={dialogFooter}
            onHide={hideDialog}
        >
            <form className='p-5'>
                {fieldGroups.map((group, groupIndex) => (
                    <div className='grid grid-cols-2 gap-5 mb-5' key={groupIndex}>
                        {group.map((field, index) => (
                            field.showField !== false &&
                            <div className="card flex justify-content-center" style={{ width: '45%' }} key={index}>
                                <div className="flex flex-column gap-2" style={{ width: '100%' }}>
                                    <label htmlFor={field.name}>{field.label}</label>
                                    {field.type === 'file' ? (
                                        <input
                                            id={field.name}
                                            type="file"
                                            onChange={(e) => handleChange(e, field)}
                                            className={errors[field.name] ? 'p-invalid' : ''}
                                        />
                                    ) : field.isEnum ? (
                                        <Dropdown
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
                                            id={field.name}
                                            value={formData[field.name] || ''}
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
                                            id={field.name}
                                            aria-describedby={`${field.name}-help`}
                                            value={formData[field.name] || ''}
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
