import React, { Component } from 'react';
import { StyleSheet, AsyncStorage, ActivityIndicator } from 'react-native';
import { Font } from "expo";
import { Container, Content, Text, Badge, H1, Card, CardItem, Body, Button } from 'native-base';
import { Col, Grid } from "react-native-easy-grid";
import axios from "axios";

class Resultados extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            acertos: this.props.navigation.state.params.acertos,
            total: this.props.navigation.state.params.total,
            color: "red",
            badge: true,
            loading: true,
            msg: null,
        };
    }
    niceTransition() {
        setTimeout(() => {
            this.setState({ loading: false, });
        }, 800);
    }
    getMenssagem() {
        let res = this.state.acertos / this.state.total;
        if (res == 1) {
            this.setState({ color: "green", badge: false});
            return "Parabéns, você gabaritou!";
        }
        if (res >= 0.5) {
            this.setState({ color: "green", badge: false});
            return "Você acertou " + String(res * 100) + "%, parabéns!";
        }
        else {
            return "Você acertou " + String(res * 100) + "%, mais sorte da próxima vez!";
        }
    }
    async componentWillMount() {
        await Font.loadAsync({
            Roboto: require("native-base/Fonts/Roboto.ttf"),
            Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf")
        });
        this.setState({ msg: this.getMenssagem() });
        this.niceTransition();
    }
    static navigationOptions = {
        title: 'Resultado',
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
                            <Card>
                                <CardItem>
                                    <Body>
                                        <H1 style={{ color: this.state.color }}>{this.state.msg}</H1>
                                    </Body>
                                </CardItem>
                                <CardItem style={{
                                    flex: 1,
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}>
                                    <Badge danger={this.state.badge} success={!this.state.badge}>
                                        <Text>{this.state.acertos}/{this.state.total}</Text>
                                    </Badge>
                                </CardItem>
                            </Card>
                            <Card>
                                <Button full block style={{ backgroundColor: "#404040" }} onPress={() => {
                                    this.props.navigation.navigate('Perguntas');
                                }}>
                                    <Text>Realizar Novamente</Text>
                                </Button>
                            </Card>
                            <Card>
                                <Button full block style={{ backgroundColor: "#404040" }} onPress={() => {
                                    this.props.navigation.navigate('Atleticas');
                                }}>
                                    <Text>Selecionar Atlética</Text>
                                </Button>
                            </Card>
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
    resposta: {
        marginTop: "5%",
        width: '100%',
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
});

export default Resultados;