import React from 'react';
import * as Styled from './styles';

import HeroTile from '../../components/HeroTile';

const Heroes = () => {
  return (
    <Styled.Container>
      <Styled.List
        data={[
          {
            id: 1,
            name: 'Sniper',
            imageUrl:
              'https://ot.dotabuff.com/assets/heroes/sniper-a61d181a901744790171f6c73346f4051a3411d82b4a62a8f6ce272ae16c7dcd.jpg',
          },
          {
            id: 2,
            name: 'Axe',
            imageUrl:
              'https://ot.dotabuff.com/assets/heroes/axe-7611ab64404e0b1f6d798baa713a76ab94ac4df59273e2586b9dec447a85e0c7.jpg',
          },
          {
            id: 3,
            name: 'Riki',
            imageUrl:
              'https://ot.dotabuff.com/assets/heroes/riki-a4acbf9efccf572585947a2a1ab7b3ff1449cca6eda05d58fec21afb4f713896.jpg',
          },
        ]}
        keyExtractor={({ id }) => String(id)}
        renderItem={({ item }) => <HeroTile hero={item} />}
      />
    </Styled.Container>
  );
};

export default Heroes;
