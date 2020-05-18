import React, { memo } from 'react';
import * as Styled from './styles';

const normalizeHero = ({
  id,
  imageUrl,
  name,
  rank,
  winRate,
  bestHeroes,
  worstHeroes,
}) => {
  const bestHeroesList = [];
  const worstHeroesList = [];

  for (const hero in bestHeroes) {
    bestHeroesList.push(bestHeroes[hero]);
  }

  for (const hero in worstHeroes) {
    worstHeroesList.push(worstHeroes[hero]);
  }

  return {
    id,
    imageUrl,
    name,
    rank,
    winRate,
    list: [
      {
        title: 'Best Heroes',
        data: bestHeroesList.sort((a, b) => b.winRate - a.winRate),
      },
      {
        title: 'Worst Heroes',
        data: worstHeroesList.sort((a, b) => b.winRate - a.winRate),
      },
    ],
  };
};

const hero = (props) => {
  const hero = normalizeHero(props.route.params.hero);

  console.log(hero.list);

  return (
    <Styled.Container>
      <Styled.TileContainer>
        <Styled.Image source={{ uri: hero.imageUrl }}>
          <Styled.Overlay />
          <Styled.Name>{hero.name}</Styled.Name>
        </Styled.Image>
      </Styled.TileContainer>
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
      <Styled.List
        sections={hero.list}
        keyExtractor={({ id }) => String(id)}
        renderItem={({ item }) => (
          <Styled.Item>
            <Styled.ItemStat>
              <Styled.Text color="#585858" size="16">{item.name}</Styled.Text>
              <Styled.Text color="#999999" size="14">{item.matches} Matches</Styled.Text>
            </Styled.ItemStat>
            <Styled.Text color="#585858">{item.winRate}%</Styled.Text>
          </Styled.Item>
        )}
        renderSectionHeader={({ section: { title } }) => (
          <Styled.SectionTitle>
            <Styled.Strong>{title}</Styled.Strong>
          </Styled.SectionTitle>
        )}
        stickySectionHeadersEnabled
      />
    </Styled.Container>
  );
};

export default memo(hero);
