import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog'
import React from 'react'

function DeleteModal({showDeleteModal, setShowDeleteModal, data, deleteFunction, message}) {

    const hideDeleteDataDialog = () => {
        setShowDeleteModal(false);
    };

    const deleteData = () => {        
        setShowDeleteModal(false);
        deleteFunction();
    };

    const deleteDataDialogFooter = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" outlined onClick={hideDeleteDataDialog} />
            <Button label="Si" icon="pi pi-check" severity="danger" onClick={deleteData} />
        </React.Fragment>
    );

  return (
    <Dialog 
    visible={showDeleteModal} 
    style={{ width: '32rem' }} 
    breakpoints={{ '960px': '75vw', '641px': '90vw' }} 
    header="Confirmar" 
    modal 
    footer={deleteDataDialogFooter} 
    onHide={hideDeleteDataDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {data && (
                        <span>
                            Estas seguro que quieres eliminar <b>{message}</b>?
                        </span>
                    )}
                </div>
            </Dialog>
  )
}

export default DeleteModal