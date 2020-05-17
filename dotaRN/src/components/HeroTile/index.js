import React from 'react';
import FastImage from 'react-native-fast-image';
import * as Styled from './styles';

const HeroTile = ({ hero, ...props }) => {
  return (
    <Styled.Container
      onPress={() =>
        props.navigation.navigate('Hero', { hero, name: hero.name })
      }>
      <Styled.Image source={{ uri: hero.imageUrl }}>
        <Styled.Overlay />
        <Styled.Name>{hero.name}</Styled.Name>
      </Styled.Image>
    </Styled.Container>
  );
};

export default HeroTile;
