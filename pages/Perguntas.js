import React, { Component } from 'react';
import { Font, AppLoading } from "expo";
import { StyleSheet, AsyncStorage, ActivityIndicator } from 'react-native';
import { Container, Content, Card, CardItem, Button, Text, Body, Icon, View, Left, Right } from 'native-base';
import * as consts from '../config/constants.js';
// import randSlice from '../assets/helpers/getRandomSlice.js';
import Dimensions from 'Dimensions';
import axios from "axios";
import { LinearGradient } from 'expo';
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
    AsyncStorage.getItem('@inter:forms_answers').then((data) => {
      let form_resps = {
        "datetime": this.getDateTime(),
        "form": this.state.form._id,
        "answers": this.state.form_resps,
        "atletich": this.state.selectedAtletica,
        "interviewer": this.state.selectedUser,
      }
      let resps = []
      if (data != null) {
        resps = JSON.parse(data)
      }
      resps.push(form_resps)
      AsyncStorage.setItem('@inter:forms_answers', JSON.stringify(resps)).then(() => {
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
  salvarResposta(idQuestion, idPerguntaAtual, idAnswer) {
    let resps = this.state.form_resps
    let correct = 0
    this.state.form.questions[idPerguntaAtual].answers.map((r) => {
      if (r._id == idAnswer) {
        if (r.correct) {
          correct = true
        }
      }
    });
    resps[idPerguntaAtual] = { "id_question": idQuestion, "id_answer": idAnswer, "correct": correct }
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
          <LinearGradient
            style={{ flex: 1 }}
            colors={['#00c9ff', '#92f39d']}
          >
            <Content style={{ backgroundColor: 'transparent' }}>

              <Card transparent style={{ minHeight: ScreenHeight * 0.8, backgroundColor: 'transparent' }}>

                <CardItem header
                  style={{ backgroundColor: 'transparent' }}
                >
                  <Text style={{ fontSize: 20, color: '#fff' }}>{this.state.form.questions[this.state.p_atual].description}</Text>
                </CardItem>
                {
                  this.state.form.questions[this.state.p_atual].answers.map((r) => (
                    <CardItem
                    key={r._id}
                      style={{ backgroundColor: 'transparent' }}
                    >
                      <Body >

                        <Button style={styles.resposta} block dark={(this.state.form_resps[this.state.p_atual] != undefined
                        && this.state.form_resps[this.state.p_atual][2] == r._id)
                        ? false : true}
                          onPress={() => {
                            setTimeout(() => {
                              this.salvarResposta( this.state.form.questions[this.state.p_atual]._id, this.state.p_atual, r._id)
                              this.mudaPergunta(1)
                            }, 800)
                          }
                          }
                        >
                          <Text style={(this.state.form_resps[this.state.p_atual] != undefined
                          && this.state.form_resps[this.state.p_atual]['id_answer'] == r._id)
                          ? { textDecorationLine: 'line-through', opacity: 0.3, fontSize: 17, color: '#00c9ff' } : { fontSize: 16, color: '#00c9ff' }} uppercase={false}>{r.description}</Text>

                        </Button>

                      </Body>
                    </CardItem>
                  ))
                }

              </Card>

            </Content>
            <View style={{ flexDirection: "row", backgroundColor: '#404040' }}>
              <Left>
                <Button style={{ backgroundColor: '#404040' }} light onPress={() => { this.mudaPergunta(-1) }}>
                  <Icon name='arrow-back' style={{ color: '#fff' }} />
                </Button>
              </Left>
              <Button transparent dark>
                <Text style={{ color: '#fff' }} >{String(this.state.p_atual + 1) + '/' + String(this.state.form.questions.length)}</Text>

              </Button>
              <Right>
                <Button style={{ backgroundColor: '#404040' }} light onPress={() => { this.mudaPergunta(1) }}>
                  <Icon name='arrow-forward' style={{ color: '#fff' }} />
                </Button>
              </Right>
            </View>
          </LinearGradient>
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
    borderRadius: 30,
    paddingTop: 30,
    paddingBottom: 30,
    backgroundColor: '#fff'
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