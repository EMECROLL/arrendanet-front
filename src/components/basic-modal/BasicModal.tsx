import { Dialog } from 'primereact/dialog';

export default function BasicModal({ title, showDataModal, setShowDataModal, data, ignoreColumns = [], pdfUrl }) {

    const hideDeleteDataDialog = () => {
        setShowDataModal(false);
    };

    const formatLabel = (label) => {
        return label
            .replace(/([a-z])([A-Z])/g, '$1 $2')
            .replace(/^./, (str) => str.toUpperCase());
    };

    const combinedIgnoreColumns = ['esBorrado', 'id', ...ignoreColumns];

    const formatDate = (value) => {
        if (!value) return '';
        const date = new Date(value);
        return !isNaN(date.getTime()) ? new Intl.DateTimeFormat('es-MX').format(date) : value;
    };

    const renderNestedData = (data, index = 0, isNested = false) => {
        return Object.entries(data).map(([key, value], currentIndex) => {
            if (combinedIgnoreColumns.includes(key)) {
                return null;
            }

            const subtitleStyle = typeof value === "object" && value !== null && !Array.isArray(value)
                ? { color: 'rgb(0,31,63,1)', fontSize: '16px' }
                : {};

            const renderValue = (val) => {
                if (typeof val === "object" && val !== null) {
                    return (
                        <div style={{ marginLeft: "10px" }}>
                            {renderNestedData(val, `${index}-${currentIndex}`, true)} 
                        </div>
                    );
                } else {
                    if (
                        key.toLocaleLowerCase().includes('fecha') || 
                        key.toLocaleLowerCase().includes('date')
                    ) {
                        return formatDate(val);
                    } else if (
                        (key.toLocaleLowerCase().includes('costo') && !key.toLowerCase().includes('estatus')) || 
                        (key.toLocaleLowerCase().includes('monto') && !key.toLowerCase().includes('estatus')) || 
                        (key.toLocaleLowerCase().includes('pago') && !key.toLowerCase().includes('estatus'))
                    ) {
                        return `$${val}`;
                    }
                    return val;
                }
            };

            return (
                <div key={`${index}-${currentIndex}`} style={{ marginBottom: "" }}>
                    <h5 style={subtitleStyle}>{formatLabel(key)}</h5>
                    {typeof value === "object" && value !== null ? (
                        <div style={{ marginLeft: "10px" }}>
                            {renderNestedData(value, `${index}-${currentIndex}`, true)} 
                        </div>
                    ) : (
                        <p>{renderValue(value)}</p>
                    )}
                </div>
            );
        });
    };

    return (
        <Dialog
            visible={showDataModal}
            header={title}
            className='w-[90%] md:w-[50vw]'
            onHide={hideDeleteDataDialog}
        >
            {pdfUrl ? (
                <div className="flex flex-col items-center">
                    <div className="w-full h-[550px] md:h-[700px]">
                        <iframe
                            src={pdfUrl}
                            width="100%"
                            height="100%"
                            type="application/pdf"
                            title="PDF Viewer"
                        />
                    </div>
                </div>
            ) : (
                data && renderNestedData(data)
            )}
        </Dialog>
    );
}
