import React, {
    useCallback,
    useEffect,
    useState
} from 'react';
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    FlatList,
    Text,
} from 'react-native';
import { RouteProp } from '@react-navigation/native';
import apiKey from '../../config/api-key';
import api from '../../services/api';
import {
    ActivityIndicatorColumn,
    ComicContent,
    ComicImage,
    ComicPagesText,
    ComicTitleText,
    Container,
} from './styles';
import { Character } from '../../models/Characters';
import colors from '../../config/style-colors';

interface Comic {
    id: number;
    title: string;
    pageCount: number;
    thumbnail: {
        path: string;
        extension: string;
    };
}

type RootStackParamList = {
    Home: undefined;
    Profile: {
        character: Character;
        screen: React.FC;
    };
    Feed: { sort: 'latest' | 'top' } | undefined;
};

type ProfileScreenRouteProp = RouteProp<RootStackParamList, 'Profile'>;

type Props = {
    route: ProfileScreenRouteProp;
};

const CharacterComics: React.FC<Props> = ({ route }: Props) => {
    const [totalItems, setTotalItems] = useState(null);
    const [comics, setComics] = useState<Comic[]>([]);
    const [loading, setLoading] = useState(false);
    const { character } = route.params;

    const loadNextComics = useCallback(() => {
        if (character.comics.available > 0 && totalItems === comics.length) {
            return;
        }

        setLoading(true);

        api
            .get(`/v1/public/characters/${character.id}/comics`, {
                params: {
                    ...apiKey,
                    limit: 10,
                    offset: comics.length,
                },
            })
            .then((response) => {
                setComics([...comics, ...response.data.data.results]);
                setTotalItems(response.data.data.total);
            })
            .catch(() => {
                Alert.alert('Erro ao carregar quadrinhos.');
            })
            .finally(() => {
                setLoading(false);
            });
    }, [comics]);

    const renderItem = useCallback(
        ({ item }) => {
            return (
                <ComicContent>
                    <ComicImage
                        style={{ resizeMode: 'stretch' }}
                        source={{
                            uri: `${item.thumbnail.path}.${item.thumbnail.extension}`,
                        }}
                    />
                    <ComicTitleText style={{ color: colors.red }}>
                        {item.title}
                    </ComicTitleText>
                    <ComicPagesText style={{ color: colors.red }}>
                        {item.pageCount} página(s)
                    </ComicPagesText>
                </ComicContent>
            );
        },
        [comics],
    );

    const renderLoadingFooter = useCallback(() => {
        if (!loading) {
            return null;
        }

        return (
            <ActivityIndicatorColumn>
                <ActivityIndicator color={colors.red} />
            </ActivityIndicatorColumn>
        );
    }, [loading]);

    useEffect(() => {
        loadNextComics();
    }, []);

    return (
        <Container>
            {!!character.comics.available && (
                <FlatList<Comic>
                    style={{ maxHeight: Dimensions.get('window').height * 1.00, margin: 20 }}
                    horizontal={!!1}
                    data={comics}
                    renderItem={renderItem}
                    keyExtractor={(item, index) => item.id.toString()}
                    ListFooterComponent={renderLoadingFooter}
                    onEndReached={loadNextComics}
                    onEndReachedThreshold={0.5}
                />
            )}

            {!character.comics.available && (
                <Text style={{ color: colors.red, fontSize: 18, padding: 20}}>
                    {`${character.name} não tem quadrinhos.`}
                </Text>
            )}
        </Container>
    );
};

export default CharacterComics;