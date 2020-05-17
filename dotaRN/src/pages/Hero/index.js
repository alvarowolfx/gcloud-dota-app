import React, { memo } from 'react';
import * as Styled from './styles';

const normalizeHero = (objectHero) => {
  const bestHeroes = [];
  const worstHeroes = [];

  for (const hero in objectHero.bestHeroes) {
    bestHeroes.push(objectHero.bestHeroes[hero]);
  }

  for (const hero in objectHero.worstHeroes) {
    worstHeroes.push(objectHero.worstHeroes[hero]);
  }

  return {
    ...objectHero,
    bestHeroes: bestHeroes.sort((a, b) => b.winRate - a.winRate),
    worstHeroes: worstHeroes.sort((a, b) => b.winRate - a.winRate),
  };
};

const hero = (props) => {
  const hero = normalizeHero(props.route.params.hero);

  return (
    <Styled.Container>
      <Styled.TileContainer>
        <Styled.Image source={{ uri: hero.imageUrl }}>
          <Styled.Overlay />
          <Styled.Name>{hero.name}</Styled.Name>
        </Styled.Image>
        <Styled.Stats>
          <Styled.BaseContainer>
            <Styled.Strong>Rank:</Styled.Strong>
            <Styled.Text>{`${hero.rank}º`}</Styled.Text>
          </Styled.BaseContainer>
          <Styled.BaseContainer>
            <Styled.Strong>WinRate:</Styled.Strong>
            <Styled.Text>{`${hero.winRate}%`}</Styled.Text>
          </Styled.BaseContainer>
        </Styled.Stats>
      </Styled.TileContainer>
      {/* <Styled.List 
      data={hero}
    /> */}
    </Styled.Container>
  );
};

export default memo(hero);
