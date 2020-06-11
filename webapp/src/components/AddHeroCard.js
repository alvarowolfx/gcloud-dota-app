import React from 'react'

import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import AddIcon from '@material-ui/icons/Add'

const paperStyle = {
  height : 120
}

const innerCardStyle = {
  display : 'flex',
  backgroundColor : 'lightgray',
  alignItems : 'center',
  height : 120
}

export default function AddHeroCard({ onClick }){
  return (
    <Grid item xs={6} md={3} lg={2}
      onClick={onClick}>
      <Paper elevation={3} style={paperStyle}>
        <div style={innerCardStyle}>
          <AddIcon fontSize="large" color="primary" style={{ margin : '0 auto'}}/>
        </div>
      </Paper>
    </Grid>
  )
}