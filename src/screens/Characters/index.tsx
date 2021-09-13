import React, { useCallback, useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { SharedElement } from 'react-navigation-shared-element';
import Icon from 'react-native-vector-icons/Feather';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    TouchableNativeFeedback,
    View,
} from 'react-native';
import apiKey from '../../config/api-key';
import api from '../../services/api';
import {
    ComicsAvailableText,
    Content,
    HeroAvatarBorder,
    HeroAvatarImage,
    HeroInformation,
    HeroItem,
    HeroItemSeparator,
    HeroNameText,
    HeroSearch,
    HeroSearchInput,
} from './styles';
import colors from '../../config/style-colors';
import { Character } from '../../models/Characters';

const Characters: React.FC = () => {
    const navigator = useNavigation();

    const [characters, setCharacters] = useState<Character[]>([]);
    const [searchName, setSearchName] = useState<string>('');
    const [searchCharacters, setSearchCharacters] = useState<Character[]>([]);
    const [loading, setLoading] = useState(false);

    const loadNextCharacters = useCallback(() => {
        setLoading(true);

        api
            .get('/v1/public/characters', {
                params: {
                    ...apiKey,
                    limit: 30,
                    offset: characters.length,
                },
            })
            .then((response) => {
                setCharacters([...characters, ...response.data.data.results]);
            })
            .catch(() => {
                Alert.alert('Erro ao carregar novos personagens.');
            })
            .finally(() => {
                setLoading(false);
            });
    }, [characters]);

    const clearSearch = useCallback(() => {
        setSearchName('');
    }, []);

    const loadSearchCharacters = useCallback(() => {
        if (searchName.trim()) {
            setLoading(true);

            api
                .get('/v1/public/characters', {
                    params: {
                        ...apiKey,
                        limit: 30,
                        offset: 0,
                        nameStartsWith: searchName,
                    },
                })
                .then((response) => {
                    setSearchCharacters([...response.data.data.results]);
                })
                .catch(() => {
                    Alert.alert('Erro ao carregar o personagem procurado.');
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    }, [searchName, setLoading]);

    useEffect(() => {
        loadSearchCharacters();
    }, [searchName]);

    useEffect(() => {
        loadNextCharacters();
    }, []);

    const renderItem = useCallback(
        ({ item }) => {
            return (
                <TouchableNativeFeedback
                    key={item.id}
                    onPress={() => {
                        navigator.navigate('CharacterBio', { character: item });
                    }}
                >
                    <HeroItem>
                        <HeroItemSeparator />
                        <HeroAvatarBorder style={{ borderColor: colors.gray }}>
                            <SharedElement id={`item.${item.id}.photo`}>
                                <HeroAvatarImage
                                    source={{
                                        uri: `${item.thumbnail.path}.${item.thumbnail.extension}`,
                                    }}
                                />
                            </SharedElement>
                        </HeroAvatarBorder>
                        <HeroInformation>
                            <HeroNameText style={{ color: colors.red }}>
                                {item.name}
                            </HeroNameText>
                            {!!item.description && (
                                <ComicsAvailableText style={{ color: colors.red }}>
                                    Descrição disponível
                                </ComicsAvailableText>
                            )}
                            {!item.description && (
                                <ComicsAvailableText style={{ color: colors.red }}>
                                    Descrição não disponível
                                </ComicsAvailableText>
                            )}
                            <ComicsAvailableText style={{ color: colors.red }}>
                                {`Histórias em quadrinhos: ${item.comics.available}`}
                            </ComicsAvailableText>
                        </HeroInformation>
                    </HeroItem>
                </TouchableNativeFeedback>
            );
        },
        [colors, navigator],
    );

    const renderSeparator = useCallback(() => {
        return <HeroItemSeparator />;
    }, []);

    const renderLoadingFooter = useCallback(() => {
        if (!loading) {
            return <View />;
        }

        return (
            <ActivityIndicator
                color={colors.red}
                style={{ marginBottom: 20, marginTop: 20 }}
            />
        );
    }, [loading]);

    return (
        <Content>
            <HeroSearch>
                <View
                    style={{
                        flex: 1,
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <Icon name="search" color={colors.gray} size={20} />
                    <HeroSearchInput
                        placeholder="Digite o nome do personagem"
                        placeholderTextColor={colors.gray}
                        onChangeText={(name: string) => setSearchName(name)}
                        value={searchName}
                        style={{ color: colors.red }}
                    />
                    {!!searchName && (
                        <Icon name="x" color={colors.red} size={20} onPress={clearSearch} />
                    )}
                </View>
            </HeroSearch>

            {!!searchName.trim() && (
                <FlatList<Character>
                    style={{ flex: 0.91 }}
                    data={searchCharacters}
                    ItemSeparatorComponent={renderSeparator}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id.toString()}
                    ListFooterComponent={renderLoadingFooter}
                />
            )}

            {!searchName.trim() && (
                <FlatList<Character>
                    style={{ flex: 0.93 }}
                    data={characters}
                    ItemSeparatorComponent={renderSeparator}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id.toString()}
                    ListFooterComponent={renderLoadingFooter}
                    onEndReached={loadNextCharacters}
                    onEndReachedThreshold={0.3}
                />
            )}
        </Content>
    );
};


export default Characters;