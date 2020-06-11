import React from 'react'

import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'

const paperStyle = {
  height : 120,
  cursor : 'pointer',
  position : 'relative',
  display : 'block'
}

const imgStyle = {
  width : '100%',
  height : '100%',
  objectFit : 'cover'
}

const titlebarStyle = {
  display:'flex',
  flexDirection : 'row',
  position : 'absolute',
  left : 0,
  bottom : 0,
  right : 0,
  height : 50,
  backgroundColor : 'rgba(0,0,0,0.5)',
  justifyContent : 'space-between',
  padding : 8,
}

const whiteBoldTextStyle = {
  fontWeight : 'bold',
  color : 'white'
}

const whiteTextStyle = {
  color : 'white'
}

export default function HeroCard({ hero, actionIcon, onActionClick, ...rest }){
  return (
    <Grid item xs={6} md={3} lg={2} {...rest} onClick={!actionIcon ? onActionClick : undefined}>
      <Paper elevation={3} style={paperStyle}>
        <img src={hero.imageUrl} alt={hero.name} style={imgStyle} />
        <div style={titlebarStyle}>
          <div style={{display:'flex', flexDirection : 'column'}}>
            <Typography variant="caption" style={whiteBoldTextStyle}>{hero.name}</Typography>
            <Typography variant="caption" style={whiteTextStyle}>Rank: {hero.rank}</Typography>
          </div>
          {actionIcon && <IconButton color="secondary"
              onClick={() => onActionClick(hero.id)}>
              {actionIcon}
          </IconButton>}
        </div>
      </Paper>
    </Grid>
  )
}