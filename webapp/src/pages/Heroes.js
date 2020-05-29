import React from 'react'

import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import Avatar from '@material-ui/core/Avatar'
import ListItemText from '@material-ui/core/ListItemText'
import Container from '@material-ui/core/Container'

import { useRecoilValue } from 'recoil'

import { heroesState, isHeroesLoadingState } from '../atoms/heroes'

export default function Heroes(){
  const heroesList = useRecoilValue(heroesState)
  const isLoading = useRecoilValue(isHeroesLoadingState)

  return (
    <Container>
      <h2>Heroes</h2>

      {isLoading && <h4>Loading...</h4>}
      {!isLoading && (
        <List>
          {Object.values(heroesList).map( hero => {
            return (
            <ListItem key={hero.id}>
              <ListItemAvatar>
                <Avatar alt={hero.name} src={hero.imageUrl} />
              </ListItemAvatar>
              <ListItemText primary={hero.name} secondary={`Rank ${hero.rank}`} />
            </ListItem>
          )
        })}
      </List>
      )}
    </Container>
  )
}