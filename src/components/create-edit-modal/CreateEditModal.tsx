import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import React, { useEffect, useState } from 'react';

function CreateEditModal({ formSchema, visible, setVisible, onSave, setIsEdit, isEdit, data }) {
    const [formData, setFormData] = useState({});

    useEffect(() => {
        const initialFormData = formSchema.fields.reduce((acc, field) => {
            let value = isEdit && data ? data[field.name] || '' : field.value || '';
            if (field.type === 'date' && value) {
                value = value.split('T')[0];
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
    }

    function saveData() {
        onSave(formData);
        hideDialog();
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
                                        />
                                    ) : field.isEnum ? (
                                        <Dropdown
                                            id={field.name}
                                            value={formData[field.name] || ''}
                                            options={field.listEnum.map((item, idx) => ({ label: item, value: idx }))}
                                            onChange={(e) => handleChange(e, field)}
                                            placeholder={`Seleccione ${field.label}`}
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
                                        />
                                    ) : (
                                        <InputText
                                            id={field.name}
                                            aria-describedby={`${field.name}-help`}
                                            value={formData[field.name] || ''}
                                            onChange={(e) => handleChange(e, field)}
                                            type={field.type || 'text'}
                                        />
                                    )}
                                    {field.helperText && (
                                        <small id={`${field.name}-help`}>
                                            {field.helperText}
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
