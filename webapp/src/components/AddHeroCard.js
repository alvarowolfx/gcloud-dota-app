import React from 'react'

import GridListTile from '@material-ui/core/GridListTile'
import AddIcon from '@material-ui/icons/Add'

export default function AddHeroCard({ onClick }){
  return (
    <GridListTile
      onClick={onClick}
      style={{ height : 120, width: 180, margin : 16 }}>
      <div style={{
        display : 'flex',
        backgroundColor : 'lightgray',
        alignItems : 'center',
        height : 120
      }}>
        <AddIcon fontSize="large" style={{ margin : '0 auto'}}/>
      </div>
    </GridListTile>
  )
}