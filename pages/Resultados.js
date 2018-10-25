import React, { Component } from 'react';
import { StyleSheet, AsyncStorage, ActivityIndicator } from 'react-native';
import { Font } from "expo";
import { Container, Content, Text, Badge, H1, Card, CardItem, Body, Button } from 'native-base';
import { Col, Grid } from "react-native-easy-grid";
import axios from "axios";
import { LinearGradient } from 'expo';


class Resultados extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            acertos: this.props.navigation.state.params.acertos,
            total: this.props.navigation.state.params.total,
            color: "#fd746c",
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
            this.setState({ color: "#00c9ff", badge: false});
            return "Parabéns, você gabaritou!";
        }
        if (res >= 0.5) {
            this.setState({ color: "#00c9ff", badge: false});
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
                <Container>
                <LinearGradient
                      style={{ flex: 1}}
                      colors={['#fd746c', '#ff9068']}
                        >
                <Content scrollEnabled={true}>
                     
                    <Grid>
                       
                        
                        <Col scrollEnabled={true} size={90}>
                            <Card style={{ marginTop: 40, marginLeft: 10, marginRight: 10, paddingTop: 50, paddingBottom: 50 }}>
                                <CardItem>
                                    <Body style={{ justifyContent: 'center', alignItems: 'center'}}>
                                        <H1 style={{ color: this.state.color, textAlign: 'center', fontSize: 30 }}>{this.state.msg}</H1>
                                    </Body>
                                </CardItem>
                                <CardItem style={{
                                    flex: 1,
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}>
                                    <Badge style={{ backgroundColor: this.state.color}} danger={this.state.badge} success={!this.state.badge}>
                                        <Text >{this.state.acertos} | {this.state.total}</Text>
                                    </Badge>
                                </CardItem>
                            </Card>
                            <Card transparent >
                                <Button style={styles.resposta}  block  onPress={() => {
                                    this.props.navigation.navigate('Perguntas');
                                }}>
                                    <Text style={{ fontSize: 16, color: '#fd746c' }} >Realizar Novamente</Text>
                                </Button>
                            </Card>
                            <Card transparent >
                                <Button  block style={styles.resposta} onPress={() => {
                                    this.props.navigation.navigate('Atleticas');
                                }}>
                                    <Text  style={{ fontSize: 16, color: '#fd746c' }} >Selecionar Atlética</Text>
                                </Button>
                            </Card>
                        </Col>
                         
                    </Grid>

                </Content>
                </LinearGradient>
                </Container>
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
        paddingTop: 30,
        paddingBottom: 30,
        borderRadius: 30,
        backgroundColor: 'white',
        marginLeft: 10,
        marginRight: 10
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