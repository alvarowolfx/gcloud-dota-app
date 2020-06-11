import React from 'react'

import GridList from '@material-ui/core/GridList'

export default function HeroGrid({ style, children }){
  return (
    <GridList cellHeight={120} style={style}>
      {children}
    </GridList>
  )
}