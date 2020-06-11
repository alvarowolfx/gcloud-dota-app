import React, { useState } from 'react'
import { useRecoilValue } from 'recoil'
import { useHistory } from 'react-router-dom'

import TextField from '@material-ui/core/TextField'
import Container from '@material-ui/core/Container'

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
    <Container style={{ paddingTop : 16 }}>
      <TextField
        label="Search"
        variant="outlined"
        value={search}
        autoFocus
        fullWidth
        style={{ marginBottom : 16 }}
        onChange={(evt) => setSearch(evt.target.value)} />
      {isLoading && <h4>Loading...</h4>}
      {!isLoading && (
        <HeroGrid>
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