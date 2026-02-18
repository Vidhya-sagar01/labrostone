import React from 'react'
import instance from '../api/AxiosConfig'

const TermConditions = () => {
  try {
    instance.get('/api/pages/termconditions')
    .then(response => {
      console.log(response.data)
    })
    
  } catch (error) {
    console.error('Error fetching term conditions:', error)
  }
  return (
    <div>
      <h1>Term Conditions</h1>
    </div>
  )
}

export default TermConditions