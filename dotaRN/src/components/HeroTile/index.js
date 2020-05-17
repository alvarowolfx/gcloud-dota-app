import React from 'react';

import * as Styled from './styles';

const HeroTile = ({ hero }) => {
  return (
    <Styled.Container>
      <Styled.Image source={{ uri: hero.imageUrl }}>
        <Styled.Overlay />
        <Styled.Name>{hero.name}</Styled.Name>
      </Styled.Image>
    </Styled.Container>
  );
};

export default HeroTile;
