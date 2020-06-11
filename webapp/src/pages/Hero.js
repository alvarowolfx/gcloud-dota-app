
import React, { useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'

import Typography from '@material-ui/core/Typography'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import Container from '@material-ui/core/Container'

import { useRecoilValue } from 'recoil'

import { heroesSelector } from '../atoms/heroes'

import HeroCard from '../components/HeroCard'
import HeroGrid from '../components/HeroGrid'

const imgStyle = {
  width : '100%',
  maxHeight : 240,
  objectFit : 'cover'
}

const titlebarStyle = {
  display:'flex',
  flexDirection : 'row',
  position : 'absolute',
  left : 0,
  bottom : 4,
  right : 0,
  height : 90,
  backgroundColor : 'rgba(0,0,0,0.5)',
  justifyContent : 'space-between',
  padding : 16,
  paddingBottom : 0,
}

const whiteBoldTextStyle = {
  fontWeight : 'bold',
  color : 'white'
}

const whiteTextStyle = {
  color : 'white'
}

function RecommendedHeroGrid({ heroes, onClick }){
  return (
    <HeroGrid>
      {heroes.map( hero => {
        return (
        <HeroCard
          key={hero.id}
          hero={hero}
          onActionClick={() => onClick(hero.id)}/>
      )
    })}
    </HeroGrid>
  )
}

export default function Hero(){
  let { heroId } = useParams()
  const history = useHistory()
  const heroesList = useRecoilValue(heroesSelector)
  const [currentTab, setCurrentTab] = useState('bestHeroes')
  const hero = heroesList[heroId] || {}

  const bestHeroesIds = Object.keys(hero.bestHeroes || {})
  const worstHeroesIds = Object.keys(hero.worstHeroes || {})

  const goToHero = (id) => {
    setCurrentTab('bestHeroes')
    history.push(`/heroes/${id}`)
  }

  return (
    <div>
      <div style={{position : 'relative', display : 'block'}}>
        <img src={hero.imageUrl} alt={hero.name} style={imgStyle} />
        <div style={titlebarStyle}>
          <div style={{display:'flex', flexDirection : 'column', width : '100%'}}>
            <Typography variant="h6" style={whiteBoldTextStyle}>{hero.name}</Typography>
            <div style={{display:'flex', flexDirection : 'row', justifyContent : 'space-between'}}>
              <Typography variant="body1" style={whiteTextStyle}>
                Rank: {hero.rank}
              </Typography>
              <Typography variant="body1" style={whiteTextStyle}>Win Rate: {hero.winRate}%</Typography>
            </div>
          </div>
        </div>
      </div>
      <Tabs value={currentTab} onChange={(e, tab) => setCurrentTab(tab)} style={{ marginTop : -4}}
        indicatorColor="primary" variant="fullWidth" textColor="primary">
        <Tab label="Best Heroes" value="bestHeroes" textColor="primary"/>
        <Tab label="Worst Heroes" value="worstHeroes" textColor="primary"/>
      </Tabs>
      <Container style={{ paddingTop : 16 }}>
        { currentTab === 'bestHeroes' &&
          <RecommendedHeroGrid heroes={bestHeroesIds.map( id => heroesList[id])} onClick={goToHero}/>}
        { currentTab === 'worstHeroes' &&
          <RecommendedHeroGrid heroes={worstHeroesIds.map( id => heroesList[id])} onClick={goToHero}/>}
      </Container>
    </div>
  )
}