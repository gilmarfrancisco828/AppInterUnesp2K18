import React, { Component } from 'react';
import { Font, AppLoading } from "expo";
import { StyleSheet, AsyncStorage, ActivityIndicator } from 'react-native';
import { Container, Content, Card, CardItem, Button, Text, Body, Icon, View, Left, Right } from 'native-base';
import Dimensions from 'Dimensions';
import axios from "axios";
let ScreenHeight = Dimensions.get("window").height;
let id_questionario = 1;
class Perguntas extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedUser: null,
      selectedAtletica: null,
      checked: false,
      questionario: null,
      p_atual: 0,
      quest_resps: [],
      loading: true,
      qtdCorretas: 0,
    };
    AsyncStorage.getItem(`@inter:selectedAtletica`).then((data) => {
      this.setState({
        selectedAtletica: data,
      });
      return true;
    }).catch(error => {
      console.log(error);
      return false;
    });
    AsyncStorage.getItem(`@inter:selectedUser`).then((data) => {
      this.setState({
        selectedUser: data,
      });
      return true;
    }).catch(error => {
      console.log(error);
      return false;
    });

    AsyncStorage.getItem('@inter:questionario1').then((data) => {

      if (data != null) {
        data = JSON.parse(data);
        this.setState({
          questionario: data,
          loading: false,
        });
      }
      else {
        this.carregaQuestionario(this)
      }
      return true;
    }).catch(error => {
      console.log(error);
      return false;
    });
    this.getDateTime()
  }

  getDateTime = () => {
    let date = new Date();
    return date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate() + " " + date.toLocaleTimeString()
  }
  niceTransition() {
    setTimeout(() => {
      this.setState({ loading: false, });
    }, 1500);
  }
  carregaQuestionario(contexto) {
    console.log("Tentando carregar.")
    var config = {
      headers: { 'token': 'Abobrinha123' }
    };
    axios.get('http://172.16.36.16/data/questionarios.json', {
    }, config)
      .then(function (u) {
        console.log("Requisitou questionário da WebService.")
        AsyncStorage.setItem('@inter:questionario' + id_questionario, JSON.stringify(u.data));
        contexto.setState({ questionario: u.data });
        this.niceTransition();
      })
      .catch(function (error) {
        alert(error);
        console.log(error)
      });
  }
  mudaPergunta(pass) {
    let pAtual = this.state.p_atual + pass;
    if (pAtual >= 0 && pAtual < this.state.questionario.perguntas.length) {
      this.setState({
        p_atual: pAtual,
      });
    }
    else {
      if (this.state.quest_resps.length == this.state.questionario.perguntas.length) {
        console.log('Terminou questionário')
        this.serializeRespostas()
      }
    }
  }
  serializeRespostas() {
    AsyncStorage.getItem('@inter:questionario' + id_questionario + '_resps').then((data) => {
      let quest_resps = {
        "data_respondeu": this.getDateTime(),
        "respostas": this.state.quest_resps,
        "atletica": this.state.selectedAtletica,
        "entrevistador": this.state.selectedUser,
      }
      let resps = []
      if(data != null){
        resps = JSON.parse(data)
      }
      resps.push(quest_resps)
      AsyncStorage.setItem('@inter:questionario' + id_questionario + '_resps', JSON.stringify(resps)).then(() => {
        this.props.navigation.navigate('Resultado', {
          acertos: this.calculaAcertos(),
          total: this.state.questionario.perguntas.length,
        });
      });
    });
  }
  calculaAcertos() {
    let soma = 0
    this.state.quest_resps.map((c) => {
      soma += c['correta']
    });
    return soma;
  }
  salvarResposta(idQuest, idPergunta, idResposta) {
    let resps = this.state.quest_resps
    let correta = 0
    this.state.questionario.perguntas[idPergunta].respostas.map((r) => {
      if (r.id_resposta == idResposta) {
        if (r.correta == "1") {
          correta = 1
        }
      }
    });
    resps[idPergunta] = {"id_quest" : idQuest, "id_pergunta": idPergunta, "id_resposta" : idResposta, "correta": correta}
    this.setState({
      quest_resps: resps,
    });
    console.log(this.state.quest_resps);
  }
  static navigationOptions = {
    title: 'Questionário:',
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
          <Content>
            <Card style={{ minHeight: ScreenHeight * 0.8 }}>
              <CardItem header>
                <Text>{this.state.questionario.perguntas[this.state.p_atual].pergunta}</Text>
              </CardItem>
              {
                this.state.questionario.perguntas[this.state.p_atual].respostas.map((r) => (
                  <CardItem
                    key={r.id_resposta}
                  >
                    <Body style={styles.resposta}>
                      <Button block bordered dark={(this.state.quest_resps[this.state.p_atual] != undefined
                        && this.state.quest_resps[this.state.p_atual][2] == Number(r.id_resposta))
                        ? false : true}
                        onPress={() => {
                          setTimeout(() => {
                            this.salvarResposta(id_questionario, this.state.p_atual, Number(r.id_resposta))
                            this.mudaPergunta(1)
                          }, 800)
                        }
                        }
                      >
                        <Text style={(this.state.quest_resps[this.state.p_atual] != undefined
                          && this.state.quest_resps[this.state.p_atual]['id_resposta'] == Number(r.id_resposta))
                          ? { textDecorationLine: 'line-through' } : {}} uppercase={false}>{r.resposta}</Text>
                      </Button>
                    </Body>
                  </CardItem>
                ))
              }
            </Card>
          </Content>
          <View style={{ flexDirection: "row" }}>
            <Left>
              <Button light onPress={() => { this.mudaPergunta(-1) }}>
                <Icon name='arrow-back' />
              </Button>
            </Left>
            <Button transparent dark>
              <Text>{String(this.state.p_atual + 1) + '/' + String(this.state.questionario.perguntas.length)}</Text>
            </Button>
            <Right>
              <Button light onPress={() => { this.mudaPergunta(1) }}>
                <Icon name='arrow-forward' />
              </Button>
            </Right>
          </View>
        </Container >
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

export default Perguntas;