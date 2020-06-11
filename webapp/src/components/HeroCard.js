import React from 'react'

import GridListTile from '@material-ui/core/GridListTile'
import GridListTileBar from '@material-ui/core/GridListTileBar'
import IconButton from '@material-ui/core/IconButton'

export default function HeroCard({ hero, actionIcon, onActionClick }){
  return (
    <GridListTile key={hero.id} style={{ height : 120, width: 180, margin : 16 }}
      onClick={!actionIcon ? onActionClick : undefined}>
      <img src={hero.imageUrl} alt={hero.name} />
      <GridListTileBar
        title={hero.name}
        subtitle={<span>Rank: {hero.rank}</span>}
        actionIcon={
          actionIcon && <IconButton color="primary"
            onClick={() => onActionClick(hero.id)}>
            {actionIcon}
          </IconButton>
        }
      />
    </GridListTile>
  )
}