import React, { useState, useEffect, useCallback } from 'react';
import database from '@react-native-firebase/database';
import * as Styled from './styles';

import HeroTile from '../../components/HeroTile';

const reference = database().ref('/heroes');

const Heroes = (props) => {
  const [heroes, setHeroes] = useState([]);
  const [order, setOrder] = useState('name');

  const orderHeroes = (heroesArray, orderBy) => {
    if (orderBy === 'rank') {
      const heroesSorted = heroesArray.sort((a, b) => {
        return a.rank - b.rank;
      });

      setHeroes(heroesSorted);
    } else {
      const heroesSorted = heroesArray.sort((a, b) => {
        return a.name.localeCompare(b.name);
      });

      setHeroes(heroesSorted);
    }
  };

  const handleOrder = (heroesArray, orderBy) => {
    setOrder(orderBy);
    orderHeroes(heroesArray, orderBy);
  };

  useEffect(() => {
    const subscriber = reference.on('value', (snapshot) => {
      const heroesData = snapshot.toJSON();
      const heroesArray = [];
      for (let hero in heroesData) {
        heroesArray.push(heroesData[hero]);
      }

      if (heroesArray.length) {
        console.log(heroesArray.length);
        orderHeroes(heroesArray, order);
      }
    });
    return () => subscriber();
  }, []);

  useEffect(() => {
    props.navigation.setOptions({
      headerRight: () => (
        <Styled.OrderHeroes
          onPress={() => {
            handleOrder(heroes, order === 'name' ? 'rank' : 'name');
          }}>
          <Styled.Icon name={order === 'name' ? 'sort-by-alpha' : 'sort'} />
        </Styled.OrderHeroes>
      ),
    });
  }, [order, heroes]);

  return (
    <Styled.Container>
      <Styled.List
        data={heroes}
        keyExtractor={({ id }) => String(id)}
        renderItem={({ item }) => <HeroTile hero={item} {...props} />}
      />
    </Styled.Container>
  );
};

export default Heroes;
