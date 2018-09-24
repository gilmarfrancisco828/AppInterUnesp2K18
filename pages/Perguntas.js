import React, { Component } from 'react';
import { StyleSheet, AsyncStorage } from 'react-native';
import { Container, Content, Card, CardItem, Button, Text, Body, Icon, View, Left, Right } from 'native-base';
import Dimensions from 'Dimensions';
import axios from "axios";
let ScreenHeight = Dimensions.get("window").height;
class Perguntas extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedUser: null,
      checked: false,
      questionario: null,
      id_questionario: 1,
      pergunta_atual: 0,
      questionarios_respostas: [],
      loading: true,
      cont_resps = 0,
    };
    AsyncStorage.getItem('@inter:contRespostas').then((data) => {
      this.setState({
        cont_resps: data,
      });
      return true;
    }).catch(error => {
      console.log(error);
      return false;
    });

    AsyncStorage.getItem('@inter:selectedUser').then((data) => {
      this.setState({
        selectedUser: data,
      });
      return true;
    }).catch(error => {
      console.log(error);
      return false;
    });

    AsyncStorage.getItem('@inter:questionario${id_questionario}').then((data) => {
      if (data != null) {
        // data = JSON.parse(data);
        // this.setState({
        //   questionario: data,
        //   loading: false,
        // });
        this.carregaQuestionario(this)
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
  carregaQuestionario(contexto) {
    console.log("Tentando carregar.")
    var config = {
      headers: { 'token': 'Abobrinha123' }
    };
    axios.get('http://10.42.0.1/data/questionarios.json', {
    }, config)
      .then(function (u) {
        console.log("Requisitou questionário da WebService.")
        AsyncStorage.setItem('@inter:questionario${id_questionario}', JSON.stringify(u.data));
        contexto.setState({ questionario: u.data, loading: false, });
      })
      .catch(function (error) {
        alert(error);
        console.log(error)
      });
  }
  mudaPergunta(pass) {
    let pAtual = this.state.pergunta_atual + pass;
    if (pAtual >= 0 && pAtual < this.state.questionario.perguntas.length) {
      this.setState({
        pergunta_atual: pAtual,
      });
    }
    else {
      console.log('Terminou questionário')
      let quest_resps = {
        "data_respondeu": this.getDateTime(),
        "respostas": JSON.stringify(this.state.questionarios_respostas),
        "autor": this.state.selectedUser
      }

      console.log(JSON.stringify(quest_resps))
      //Verificar se todas as perguntas foram respondidas
      //Salvar respostas
      AsyncStorage.mergetItem('@inter:questionario${id_questionario}_resps', quest_resps).then(
        // this.props.navigation.navigate('Perguntas')
        //Setar valores inicias no async
      ).catch(error => {
        console.log(error);
      });
      //Chamar tela com pontução

      // console.log(quest_resps['data_respondeu'])
      // alert('Terminou Questionário')
    }
  }
  salvarResposta(idQuest, idPergunta, idResposta) {
    let resps = this.state.questionarios_respostas
    resps[idPergunta] = [idQuest, idPergunta, idResposta]
    this.setState({
      questionarios_respostas: resps,
    });
    console.log(this.state.questionarios_respostas);
  }
  static navigationOptions = { title: 'Questionário' };
  render() {
    if (!this.state.loading) {
      return (
        <Container>
          <Content>
            <Card style={{ minHeight: ScreenHeight * 0.8 }}>
              <CardItem header>
                <Text>{this.state.questionario.perguntas[this.state.pergunta_atual].pergunta}</Text>
              </CardItem>
              {
                this.state.questionario.perguntas[this.state.pergunta_atual].respostas.map((r) => (
                  <CardItem
                    key={r.id_resposta}
                  >
                    <Body style={styles.resposta}>
                      <Button block bordered danger={(this.state.questionarios_respostas[this.state.pergunta_atual] != undefined && this.state.questionarios_respostas[this.state.pergunta_atual][2] == Number(r.id_resposta)) ? false : true}
                        onPress={() => {
                          setTimeout(() => {
                            this.salvarResposta(this.state.id_questionario, this.state.pergunta_atual, Number(r.id_resposta))
                            this.mudaPergunta(1)
                            console.log("batata")
                          }, 800)

                        }
                        }
                      >
                        <Text style={(this.state.questionarios_respostas[this.state.pergunta_atual] != undefined && this.state.questionarios_respostas[this.state.pergunta_atual][2] == Number(r.id_resposta)) ? { textDecorationLine: 'line-through' } : {}} uppercase={false}>{r.resposta}</Text>
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
              <Text>{String(this.state.pergunta_atual + 1) + '/' + String(this.state.questionario.perguntas.length)}</Text>
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
        <Container>
          <Text>Carregando...</Text>
        </Container>
      );
    }
  }
}
const styles = StyleSheet.create({
  resposta: {
  },
});

export default Perguntas;