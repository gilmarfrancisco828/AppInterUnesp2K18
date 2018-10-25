import React, { Component } from 'react';
import { Font, AppLoading } from "expo";
import { StyleSheet, AsyncStorage, ActivityIndicator } from 'react-native';
import { Container, Content, Card, CardItem, Button, Text, Body, Icon, View, Left, Right } from 'native-base';
import * as consts from '../config/constants.js';
// import randSlice from '../assets/helpers/getRandomSlice.js';
import Dimensions from 'Dimensions';
import axios from "axios";
let ScreenHeight = Dimensions.get("window").height;
class questions extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedUser: null,
      selectedAtletica: null,
      selectedForm: this.props.navigation.state.params.selectedForm,
      checked: false,
      questionario: null,
      p_atual: 0,
      form_resps: [],
      loading: true,
      qtdcorrects: 0,
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

    AsyncStorage.getItem('@inter:forms').then((data) => {
      if (data != null) {
        data = JSON.parse(data);
        // console.log(data[this.state.selectedForm].questions.length);
        if (data[this.state.selectedForm].questions.length > 0) {
          let qtd = Math.floor(data[this.state.selectedForm].questions.length * 0.8);
          if (qtd == 0) qtd = 1;
          data[this.state.selectedForm].questions = this.getRandomSlice(data[this.state.selectedForm].questions, qtd);
          this.setState({
            form: data[this.state.selectedForm],
            loading: false,
          });
        }
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
  mudaPergunta(pass) {
    let pAtual = this.state.p_atual + pass;
    if (pAtual >= 0 && pAtual < this.state.form.questions.length) {
      this.setState({
        p_atual: pAtual,
      });
    }
    else {
      if (this.state.form_resps.length == this.state.form.questions.length) {
        console.log('Terminou questionário')
        this.serializeRespostas()
      }
    }
  }
  getRandomSlice(arr, n) {
    if (n > len || n <= 0)
      return [];
    var result = new Array(n),
      len = arr.length,
      taken = new Array(len);
    while (n--) {
      var x = Math.floor(Math.random() * len);
      result[n] = arr[x in taken ? taken[x] : x];
      taken[x] = --len in taken ? taken[len] : len;
    }
    return result;
  }
  serializeRespostas() {
    AsyncStorage.getItem('@inter:form' + this.state.selectedForm + '_resps').then((data) => {
      let form_resps = {
        "data_respondeu": this.getDateTime(),
        "respostas": this.state.form_resps,
        "atletica": this.state.selectedAtletica,
        "entrevistador": this.state.selectedUser,
      }
      let resps = []
      if (data != null) {
        resps = JSON.parse(data)
      }
      resps.push(form_resps)
      AsyncStorage.setItem('@inter:questionario' + this.state.selectedForm + '_resps', JSON.stringify(resps)).then(() => {
        this.props.navigation.navigate('Resultado', {
          acertos: this.calculaAcertos(),
          total: this.state.form.questions.length,
        });
      });
    });
  }
  calculaAcertos() {
    let soma = 0
    this.state.form_resps.map((c) => {
      if (c['correct']) {
        soma++
      }
    });
    return soma;
  }
  salvarResposta(idForm, idQuestion, idPerguntaAtual, idAnswer) {
    let resps = this.state.form_resps
    let correct = 0
    this.state.form.questions[idPerguntaAtual].answers.map((r) => {
      if (r._id == idAnswer) {
        if (r.correct) {
          correct = true
        }
      }
    });
    resps[idPerguntaAtual] = { "id_form": idForm, "id_question": idQuestion, "id_answer": idAnswer, "correct": correct }
    this.setState({
      form_resps: resps,
    });
    console.log(this.state.form_resps);
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
                <Text>{this.state.form.questions[this.state.p_atual].description}</Text>
              </CardItem>
              {
                this.state.form.questions[this.state.p_atual].answers.map((r) => (
                  <CardItem
                    key={r._id}
                  >
                    <Body style={styles.resposta}>
                      <Button block bordered dark={(this.state.form_resps[this.state.p_atual] != undefined
                        && this.state.form_resps[this.state.p_atual][2] == r._id)
                        ? false : true}
                        onPress={() => {
                          setTimeout(() => {
                            this.salvarResposta(this.state.form._id, this.state.form.questions[this.state.p_atual]._id, this.state.p_atual, r._id)
                            this.mudaPergunta(1)
                          }, 800)
                        }
                        }
                      >
                        <Text style={(this.state.form_resps[this.state.p_atual] != undefined
                          && this.state.form_resps[this.state.p_atual]['id_answer'] == r._id)
                          ? { textDecorationLine: 'line-through' } : {}} uppercase={false}>{r.description}</Text>
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
              <Text>{String(this.state.p_atual + 1) + '/' + String(this.state.form.questions.length)}</Text>
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

export default questions;