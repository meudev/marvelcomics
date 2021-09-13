import React, { useMemo } from 'react';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { SharedElement } from 'react-navigation-shared-element';

import { Container, HeroDescription, HeroImage, ContainerHeader, ContainerHeaderText } from './styles';
import colors from '../../config/style-colors';
import { Character } from '../../models/Characters';
import CharacterComics from '../../components/Comics';
import { TouchableOpacity, Text } from 'react-native';

type RootStackParamList = {
  Home: undefined;
  Profile: {
    character: Character;
    screen: React.FC;
  };
  Feed: { sort: 'latest' | 'top' } | undefined;
};

type ProfileScreenRouteProp = RouteProp<RootStackParamList, 'Profile'>;

type ProfileScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Profile'
>;

type Props = {
  route: ProfileScreenRouteProp;
  navigation: ProfileScreenNavigationProp;
};

const CharacterBio: React.FC<Props> = ({ route }: Props) => {
  const navigator = useNavigation();
  const { character } = route.params;

  const imageUri = useMemo(() => {
    const { path, extension } = character.thumbnail;

    return `${path}.${extension}`;
  }, []);

  return (
    <Container>
      <TouchableOpacity
        onPress={() => { navigator.goBack() }}
        style={{ zIndex: 99, height: 50 }}
      >
        <Text style={{ color: colors.red, fontSize: 15, padding: 10 }}>
          {'VOLTAR'}
        </Text>
      </TouchableOpacity >
      <SharedElement id={`item.${character.id}.photo`}>
        <HeroImage source={{ uri: imageUri }} />
      </SharedElement>
      <ContainerHeader>
        <ContainerHeaderText>
          {`DESCRIÇÃO`}
        </ContainerHeaderText>
      </ContainerHeader>
      <HeroDescription style={{ color: colors.red }}>
        {character.description || 'Sem descrição disponível'}
      </HeroDescription>
      <ContainerHeader>
        <ContainerHeaderText>
          {`QUADRINHOS`}
        </ContainerHeaderText>
      </ContainerHeader>
      <CharacterComics route={route} />
    </Container>
  );
};

export default CharacterBio;