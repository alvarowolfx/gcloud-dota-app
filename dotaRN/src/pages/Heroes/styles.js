import styled from 'styled-components/native';
import Icons from 'react-native-vector-icons/MaterialIcons';

export const Container = styled.View`
  flex: 1;
`;

export const List = styled.FlatList.attrs({
  numColumns: 2,
})``;

export const OrderHeroes = styled.TouchableOpacity`
  padding: 5px;
`;

export const Icon = styled(Icons).attrs({
  color: '#fff',
  size: 30,
})``;
