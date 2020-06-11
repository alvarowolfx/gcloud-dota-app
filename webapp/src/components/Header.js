import React from 'react'

import { useRecoilValue } from 'recoil'
import { useHistory, useRouteMatch } from 'react-router-dom'

import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'

import BackIcon from '@material-ui/icons/ArrowBack'

import { heroesSelector } from '../atoms/heroes'
import { navigationStateSelector } from '../atoms/navigation'

export default function Header(){
  const history = useHistory()
  const match = useRouteMatch("/heroes/:heroId")
  const navigation = useRecoilValue(navigationStateSelector)
  const heroesList = useRecoilValue(heroesSelector)
  const heroId = match && match.params && match.params.heroId

  const hasHistory = navigation.length > 1
  const canGoBack = hasHistory || !!heroId
  let title = 'Dota App'
  if(canGoBack){
    const hero = heroesList[heroId] || {}
    if(hero){
      title = hero.name
    }
  }

  const goBack = () => {
    if(hasHistory){
      history.goBack()
    } else if(!!heroId){
      history.replace('/heroes')
    }
  }

  return (
    <AppBar position="fixed">
      <Toolbar>
        {canGoBack && <IconButton edge="start" color="inherit" aria-label="back"
          onClick={goBack}>
          <BackIcon />
        </IconButton>}
        <Typography variant="h6">
          {title}
        </Typography>
      </Toolbar>
    </AppBar>
  )
}