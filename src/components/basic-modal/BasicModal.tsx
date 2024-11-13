import { Dialog } from 'primereact/dialog';

export default function BasicModal({title, showDataModal, setShowDataModal, data, ignoreColumns = [], pdfUrl}) {
    
    const hideDeleteDataDialog = () => {
        setShowDataModal(false);
    };

    const formatLabel = (label) => {
        return label
            .replace(/([a-z])([A-Z])/g, '$1 $2') 
            .replace(/^./, (str) => str.toUpperCase());
    };

    const combinedIgnoreColumns = ['esBorrado', 'id', ...ignoreColumns];

    const formatDate = (value: any) => {
        if (!value) return '';
        const date = new Date(value);
        return !isNaN(date.getTime()) ? new Intl.DateTimeFormat('es-MX').format(date) : value;
    };
    
    return (
        <Dialog 
        visible={showDataModal} 
        header={title} 
        style={{ width: '50vw' }} 
        onHide={hideDeleteDataDialog}>
            {pdfUrl ? (
                <div style={{ width: '100%', height: '550px' }}>
                    <embed src={pdfUrl} width="100%" height="100%" type="application/pdf" />
                </div>
            ) : (
                data && (
                    Object.entries(data).map(([key, value], index) => {
                        if(combinedIgnoreColumns.includes(key)){
                            return;
                        }
                        return (
                            <div key={index}>
                                <h5>{formatLabel(key)}</h5>
                                <p>{key.toLocaleLowerCase().includes('fecha') || key.toLocaleLowerCase().includes('date') ? formatDate(value) : value}</p>
                            </div>
                        )
                    })
                )
            )}
        </Dialog>
    )
}
