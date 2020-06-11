import React, { useState } from 'react'
import { useRecoilValue } from 'recoil'
import { useHistory } from 'react-router-dom'

import TextField from '@material-ui/core/TextField'
import Container from '@material-ui/core/Container'
import CircularProgress from '@material-ui/core/CircularProgress'

import HeroCard from '../components/HeroCard'
import HeroGrid from '../components/HeroGrid'

import { heroesSelector, isHeroesLoadingState } from '../atoms/heroes'

export default function Heroes(){
  const heroesList = useRecoilValue(heroesSelector)
  const isLoading = useRecoilValue(isHeroesLoadingState)
  const history = useHistory()

  const [search, setSearch] = useState("")
  const filteredHeroes = Object.values(heroesList).filter( hero => {
    return hero.name.toLowerCase().includes(search.toLowerCase())
  })

  const goToHero = (id) => {
    history.push(`/heroes/${id}`)
  }

  return (
    <Container style={{ paddingTop : 16, paddingBottom : 72, height : '100%' }}>
      <TextField
        label="Search"
        variant="outlined"
        value={search}
        fullWidth
        style={{ marginBottom : 16 }}
        onChange={(evt) => setSearch(evt.target.value)} />
      {isLoading &&
        <div style={{ display : 'flex', alignContent : 'center', alignItems : 'center'}}>
          <CircularProgress color="primary" style={{margin : '0 auto'}} />
        </div>}
      {!isLoading && (
        <HeroGrid style={{ height : '100%', overflow : 'scroll'}}>
          {filteredHeroes.map( hero => {
            return (
            <HeroCard
              key={hero.id}
              hero={hero}
              onActionClick={() => goToHero(hero.id)} />
          )
        })}
        </HeroGrid>
      )}
    </Container>
  )
}