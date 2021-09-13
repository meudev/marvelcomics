import styled from 'styled-components/native';
import { Dimensions } from 'react-native';

export const Container = styled.ScrollView`
  flex: 1;
`;

export const ContainerHeader = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 40px;
  background-color: #880018;
`;

export const ContainerHeaderText = styled.Text`
  text-align: center;
  font-size: 18px;
  font-weight: bold;
  color: #ffffff;
`;

export const HeroImage = styled.Image`
  height: ${Dimensions.get('window').width - 60}px;
  width: ${Dimensions.get('window').width}px;
  margin-top: -50px;
`;

export const HeroDescription = styled.Text`
  flex: 1;
  width: 100%;
  font-size: 18px;
  line-height: 21px;
  padding: 20px;
  text-align: justify;
`;