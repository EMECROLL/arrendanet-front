
import { Dialog } from 'primereact/dialog';

export default function BasicModal({title, showDataModal, setShowDataModal, data, ingnoreColumns = []}) {
    
    const hideDeleteDataDialog = () => {
        setShowDataModal(false);
    };

    const formatLabel = (label) => {
        return label
            .replace(/([a-z])([A-Z])/g, '$1 $2') 
            .replace(/^./, (str) => str.toUpperCase());
    };

    const combinedIgnoreColumns = ['esBorrado', ...ingnoreColumns];

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
                            <p>{value}</p>
                        </div>
                    )
                })
            )}
        </Dialog>
    )
}
        