import React from 'react'
import ringsLoader from '/src/assets/Loaders/rings.svg';

const Loading: React.FC = () => {
  return (
    <div>
        <img src={ringsLoader} alt="Loading..." />
    </div>
  )
}

export default Loading