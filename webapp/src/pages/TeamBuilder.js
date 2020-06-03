import React, { useState } from 'react'

import { useRecoilValue  } from 'recoil'
import GridList from '@material-ui/core/GridList'
import GridListTile from '@material-ui/core/GridListTile'
import GridListTileBar from '@material-ui/core/GridListTileBar'
import Dialog from '@material-ui/core/Dialog'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import DialogTitle from '@material-ui/core/DialogTitle'
import IconButton from '@material-ui/core/IconButton'
import DeleteIcon from '@material-ui/icons/Delete'
import AddIcon from '@material-ui/icons/Add'

import { heroesSelector } from '../atoms/heroes'
import {
  useTeamBuilderActions,
  useRecommendedHeroes,
  availableHeroesIdsSelector,
  enemyHeroesSelector,
  teamHeroesSelector,
} from '../atoms/builder'

export function HeroCard({ hero, actionIcon, onActionClick }){
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

function AddHeroCard({ onClick }){
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

function HeroGrid({ style, children }){
  return (
    <GridList cellHeight={120} style={style}>
      {children}
    </GridList>
  )
}

function SelectHeroDialog({ heroes, isOpen, onHeroSelected, onClose }){
  const [search, setSearch] = useState("")
  const filteredHeroes = heroes.filter( hero => {
    return hero.name.toLowerCase().includes(search.toLowerCase())
  })

  const onDialogClose = () => {
    setSearch("")
    onClose()
  }

  const onSelected = (id) => {
    setSearch("")
    onHeroSelected(id)
  }

  return (
    <Dialog onClose={onDialogClose} open={isOpen}>
      <DialogTitle id="simple-dialog-title">Select Hero</DialogTitle>
      <TextField
        label="Search"
        variant="outlined"
        value={search}
        autoFocus
        style={{ width : '95%', margin : 16}}
        onChange={(evt) => setSearch(evt.target.value)} />
      <HeroGrid style={{ width : 480, height : 480, padding : 16 }}>
        {filteredHeroes.map( hero => {
          return (
            <HeroCard
              key={hero.id}
              hero={hero}
              onActionClick={() => onSelected(hero.id)}/>
          )
        })}
      </HeroGrid>
    </Dialog>
  )
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

  return (
    <div>
      <h2>Team Builder</h2>
      <Button
        color="primary"
        variant="contained"
        onClick={resetBuilder}>
        Reset Builder
      </Button>
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