import React from 'react'

import Grid from '@material-ui/core/Grid'

export default function HeroGrid({ style, children }){
  return (
    <Grid container style={style} spacing={2}>
      {children}
    </Grid>
  )
}