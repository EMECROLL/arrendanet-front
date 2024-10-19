import { classNames } from 'primereact/utils'

// Componente para cuando sea true o false

function checkedBodyTemplate(rowData) {
  return (
    <i className={classNames('pi', { 'true-icon pi-check-circle': rowData.verified, 'false-icon pi-times-circle': !rowData.verified })}></i>
  )
}

export default checkedBodyTemplate