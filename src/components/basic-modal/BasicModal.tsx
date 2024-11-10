
import { Dialog } from 'primereact/dialog';

export default function BasicModal({title, showDataModal, setShowDataModal, data, ignoreColumns = []}) {
    
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
            {data && (
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
            )}
        </Dialog>
    )
}
        