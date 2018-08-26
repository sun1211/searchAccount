/*eslint-disable no-unused-vars */
import React from 'react'

const TestForm = props =>{
  const{
    handleAccountName,

  } = props;

  return(
    <div>
    <button onClick={handleAccountName}>
      Test Function
    </button>

  </div>
  )
}

export default TestForm