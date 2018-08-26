/*eslint-disable no-unused-vars */
import React from 'react'

const showForm = props =>{
  const{account } = props;

  return(
    <div>


    <hr />
    <div> data: {JSON.stringify(account, null, 2)}
    </div>
  </div>
  )
}



export default showForm