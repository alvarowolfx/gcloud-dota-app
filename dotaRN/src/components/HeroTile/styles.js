import styled from 'styled-components/native';
import LinearGradient from 'react-native-linear-gradient';

export const Container = styled.View`
  background-color: #f44542;
  margin-vertical: 4px;
  margin-horizontal: 4px;
  flex-grow: 1;
  flex-basis: 0;
  height: 100px;
`;

export const Overlay = styled(LinearGradient).attrs({
  start: { x: 0.0, y: 0.4 },
  end: { x: 0.0, y: 1 },
  locations: [0, 0.6],
  colors: ['rgba(255,255,255,0)', 'rgba(0,0,0,.8)'],
})`
  flex: 1;
`;

export const Name = styled.Text`
  font-size: 19px;
  position: absolute;
  color: #fff;
  bottom: 0;
  right: 0;
  margin-right: 15px;
  margin-bottom: 5px;
`;

export const Image = styled.ImageBackground`
  height: 100%;
  width: 100%;
`;
