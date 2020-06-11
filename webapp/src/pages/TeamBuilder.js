import React, { useState } from 'react'

import { useRecoilValue  } from 'recoil'

import Fab from '@material-ui/core/Fab'
import Button from '@material-ui/core/Button'
import ResetIcon from '@material-ui/icons/Refresh'
import DeleteIcon from '@material-ui/icons/Delete'
import AddIcon from '@material-ui/icons/Add'

import { useTheme } from '@material-ui/core/styles'
import useMediaQuery from '@material-ui/core/useMediaQuery'

import { heroesSelector } from '../atoms/heroes'
import {
  useTeamBuilderActions,
  useRecommendedHeroes,
  availableHeroesIdsSelector,
  enemyHeroesSelector,
  teamHeroesSelector,
} from '../atoms/builder'

import HeroCard from '../components/HeroCard'
import AddHeroCard from '../components/AddHeroCard'
import HeroGrid from '../components/HeroGrid'
import SelectHeroDialog from '../components/SelectHeroDialog'

const fabStyle = {
  position : 'fixed',
  bottom : 80,
  right : 16,
  zIndex : 999
}

export default function TeamBuilder(){
  const {
    addEnemyHero,
    removeEnemyHero,
    addTeamHero,
    removeTeamHero,
    resetBuilder
  } = useTeamBuilderActions()

  const heroesList = useRecoilValue(heroesSelector)
  const availableHeroesIds = useRecoilValue(availableHeroesIdsSelector)
  const enemies = useRecoilValue(enemyHeroesSelector)
  const team = useRecoilValue(teamHeroesSelector)

  const [isRecommendedHeroesLoading, recommendedHeroes] = useRecommendedHeroes()
  const hasRecommendedHeroes = recommendedHeroes.length > 0

  const [isHeroDialogOpen, setHeroDialogOpen] = useState(false)
  const [dialogAction, setDialogAction] = useState('addEnemy')

  const actionMap = {
    'addEnemy' : addEnemyHero,
    'addTeam' : addTeamHero
  }

  const onHeroSelected = actionMap[dialogAction]

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'))

  return (
    <div>
      {isMobile && <Fab color="primary" aria-label="reset"
        style={fabStyle}
        onClick={resetBuilder}>
        <ResetIcon />
      </Fab>}
      {!isMobile && <Button
        color="primary"
        variant="contained"
        onClick={resetBuilder}>
        Reset Builder
      </Button>}
      <h3>Enemies </h3>
      <HeroGrid>
        {enemies.map( enemyId => {
          const hero = heroesList[enemyId]
          return (
            <HeroCard
              key={hero.id}
              hero={hero}
              actionIcon={<DeleteIcon/>}
              onActionClick={removeEnemyHero}/>
          )
        })}
        {enemies.length < 5 && <AddHeroCard onClick={() => {
          setHeroDialogOpen(true)
          setDialogAction('addEnemy')
        }}/>}
      </HeroGrid>
      <br/>
      <h3>My Team </h3>
      <HeroGrid>
        {team.map( heroId => {
          const hero = heroesList[heroId]
          return (
            <HeroCard
              key={hero.id}
              hero={hero}
              actionIcon={<DeleteIcon/>}
              onActionClick={removeTeamHero}/>
          )
        })}
        {team.length < 5 && <AddHeroCard onClick={() => {
          setHeroDialogOpen(true)
          setDialogAction('addTeam')
        }}/>}
      </HeroGrid>
      <br/>
      <h3>Recommended Heroes </h3>
      {isRecommendedHeroesLoading && <h5>Loading Recommendations</h5>}
      {!isRecommendedHeroesLoading && !hasRecommendedHeroes && <h5>No Recommendations</h5>}
      <HeroGrid>
        {recommendedHeroes.map( heroId => {
          const hero = heroesList[heroId]
          return (
            <HeroCard
              key={hero.id}
              hero={hero}
              actionIcon={<AddIcon/>}
              onActionClick={addTeamHero}/>
          )
        })}
      </HeroGrid>
      <br/>
      <SelectHeroDialog
        heroes={availableHeroesIds.map( id => heroesList[id])}
        isOpen={isHeroDialogOpen}
        onHeroSelected={(id) => {
          onHeroSelected(id)
          setHeroDialogOpen(false)
        }}
        onClose={() => {
          setHeroDialogOpen(false)
        }} />
    </div>
  )
}