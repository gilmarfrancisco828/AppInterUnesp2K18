import React from 'react';
import axios from "axios";
import { StyleSheet, AsyncStorage, ActivityIndicator } from 'react-native';
import { Font } from "expo";
import * as consts from '../config/constants.js';
import { Container, Content, List, ListItem, Left, Button, Body, Thumbnail, Text } from 'native-base';
import { Col, Grid } from "react-native-easy-grid";
class TelaForms extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            forms: [],
            loading: true
        };
        const asyncForms = async () => {
            try {
                let resultForms = await AsyncStorage.getItem('@inter:forms');
                if (resultForms !== null) {
                    this.setState({
                        forms: JSON.parse(resultForms)
                    });
                    console.log('Já tinha form salvos')
                }
                else if (resultForms == null) {
                    this.carregaForms(this)
                };
                return resultForms;
            } catch (error) {
                console.log(error)
            }
        }
        asyncForms();

    }
    niceTransition() {
        setTimeout(() => {
            this.setState({ loading: false, });
        }, 1500);
    }
    carregaForms(contexto) {
        console.log("Tentando carregar.")
        contexto.setState({ loading: true, });
        axios.get(consts.SERVER_API + 'form', {
            params: {
                token: 'Abobrinha123'
            }
        })
            .then(function (u) {
                console.log("Requisitou form da WebService.")
                AsyncStorage.setItem('@inter:forms', JSON.stringify(u.data));
                contexto.setState({ forms: u.data }, function () {
                    console.log(u.data);
                });
            })
            .catch(function (error) {
                alert(error);
            });
        this.niceTransition();
    }
    async componentWillMount() {
        await Font.loadAsync({
            Roboto: require("native-base/Fonts/Roboto.ttf"),
            Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf")
        });
        this.setState({ forms: this.state.forms });
        this.niceTransition();
    }
    static navigationOptions = {
        title: 'Selecione o Questionário:',
        headerTintColor: 'white',
        headerStyle: {
            backgroundColor: '#404040',
        },
        headerTitleStyle: {
            color: 'white'
        },
    };
    render() {
        if (!this.state.loading) {
            return (
                <Content scrollEnabled={true}>
                    <Grid>
                        <Col size={5}></Col>
                        <Col scrollEnabled={true} size={90}>
                            <List scrollEnabled={true} style={styles.listForms}>
                                {
                                    this.state.forms.map((f, index) => (
                                        <ListItem avatar
                                            key={f._id}
                                            onPress={() => {
                                                this.props.navigation.navigate('Perguntas', {
                                                    selectedForm: index
                                                })
                                            }
                                            }>
                                            <Body>
                                                <Text>{f.title}</Text>
                                            </Body>
                                        </ListItem>
                                    ))
                                }
                            </List>
                            <ListItem last center>
                                <Button block bordered dark onPress={() => {
                                    this.carregaForms(this)
                                }
                                }>
                                    <Text>Atualizar Questionários</Text>
                                </Button>
                            </ListItem>
                        </Col>
                        <Col size={5}></Col>
                    </Grid>

                </Content>
            );
        }
        else {
            return (
                <Container style={[styles.loadingContainer, styles.loadingHorizontal]}>
                    <ActivityIndicator size="large" color="#00A4F2" />
                </Container>
            );
        }
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#fff",
    },
    header: {
        backgroundColor: "#7159C1",
    },
    logoContent: {
        marginTop: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        height: 300,
        flex: 1,
        width: null
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#000000',
        opacity: 0.8,
    },
    loadingHorizontal: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 10
    },
    listForms: {
        width: '100%',
    }
});
export default TelaForms;