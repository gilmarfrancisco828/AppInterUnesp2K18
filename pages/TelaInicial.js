import React from 'react';
import axios from "axios";
import { StyleSheet, AsyncStorage, Image, ActivityIndicator, StatusBar } from 'react-native';
import { Font, AppLoading } from "expo";
import * as consts from '../config/constants.js';
import { Container, Header, Title, Content, List, ListItem, Left, Body, Right, Thumbnail, Icon, Text, Button, H1, H3 } from 'native-base';
import { LinearGradient } from 'expo';
const logo = require('../assets/img/logolieu.png');
class TelaInicial extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      interviewers: [],
      loading: true,
      qtdRespostas: 0,
    };
    const asyncInterviewers = async () => {
      try {
        console.log('')
        let resultInterviewers = await AsyncStorage.getItem('@inter:interviewers');
        if (resultInterviewers !== null) {
          this.setState({
            interviewers: JSON.parse(resultInterviewers)
          });
          console.log('Já tinha entrevistadores salvos')
        }
        else if (resultInterviewers == null) {
          this.loadInterviewers(this)
        }
        return resultInterviewers;
      } catch (error) {
        console.log(error)
      }
    }
    const asyncResps = async () => {
      try {
        console.log('')
        let resultResps = await AsyncStorage.getItem('@inter:forms_answers');
        if (resultResps !== null) {
          this.setState({
            qtdRespostas: JSON.parse(resultResps).length
          });
        }
      } catch (error) {
        console.log(error)
      }
    }
    asyncInterviewers();
    asyncResps();

  }
  saveAnswers(contexto) {
    AsyncStorage.getItem(`@inter:forms_answers`).then((data) => {
      console.log(JSON.parse(data))
      contexto.setState({
        loading: true,
      });
      if (data != null && data.length && this.sendAnswers(data)) {
        contexto.setState({
          qtdRespostas: 0
        })
        return true;
      }
      else {
        contexto.setState({
          loading: false,
        });
        return false;
      }
    }).catch(error => {
      alert("Não foi possível enviar as respostas, verifique a conexão com a internet.")
      console.log(error);
      return false;
    });
    this.setState({
      loading: false,
    });
  }
  loadInterviewers(contexto) {
    console.log("Tentando carregar entrevistadores.")
    axios.get(consts.SERVER_API + "user", {
      params: {
        token: 'Abobrinha123'
      }
    })
      .then(function (u) {
        console.log("Requisitou entrevistadores da WebService.")
        AsyncStorage.setItem('@inter:interviewers', JSON.stringify(u.data));
        contexto.setState({ interviewers: u.data }, function () {
          // alert("Alterou!!!!");
        });
      })
      .catch(function (error) {
        alert(error);
      });
  }
  sendAnswers(data) {
    console.log("Tentando salvar respostas.")
    axios.post(consts.SERVER_API + "form/answer", {
      params: {
        answers: data,
      }
    })
      .then(function (u) {
        alert("Respostas salvas com sucesso.")
        AsyncStorage.removeItem(`@inter:forms_answers`);
        return true;
      })
      .catch(function (error) {
        alert(error);
        return false;
      });
    return false;
  }
  niceTransition() {
    setTimeout(() => {
      this.setState({ loading: false, });
    }, 1500);
  }
  async componentWillMount() {
    await Font.loadAsync({
      Roboto: require("native-base/Fonts/Roboto.ttf"),
      Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf")
    });
    this.niceTransition();
  }
  static navigationOptions = { title: 'Welcome', header: null };
  render() {
    if (!this.state.loading) {
      return (

        <Container style={styles.container}>
          <StatusBar hidden />
          <LinearGradient
            colors={['#00c6ff', '#0072ff']}
            style={styles.linearGradient}>
            <Content>
              <Image resizeMode={'contain'}
                source={logo}
                style={styles.logo} />
              <List style={styles.listUsers}>
                <ListItem itemHeader first center>
                  <Text style={{ color: '#fff', fontSize: 30 }}>Selecione o Entrevistador</Text>
                </ListItem>
                {
                  this.state.interviewers.map((l) => (

                    <ListItem avatar
                      key={l._id}

                      onPress={() => {
                        AsyncStorage.setItem('@inter:selectedInterviewer', String(l._id)).then(
                          this.props.navigation.navigate('Atleticas')
                        ).catch(error => {
                          console.log(error);
                        });
                      }
                      }>
                      <Left>
                        <Thumbnail source={require('../assets/img/profile.png')} />
                      </Left>
                      <Body>
                        <Text style={{ color: '#fff', fontSize: 18 }}>{l.name}</Text>
                      </Body>
                    </ListItem>
                  ))
                }
              </List>
              <Button block style={styles.resposta} onPress={() => {
                this.saveAnswers(this)
              }}>
                <Text style={{ fontSize: 16, color: '#404040' }} >Enviar respostas.</Text>
              </Button>
              <Button block style={styles.resposta} onPress={() => {
                this.loadInterviewers(this)
              }
              }>
                <Text style={{ fontSize: 16, color: '#404040' }} >Atualizar Entrevistadores</Text>
              </Button>
            </Content >
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
    marginTop: 30,
    borderRadius: 30,
    marginBottom: 10,
    paddingTop: 30,
    paddingBottom: 30,
    backgroundColor: '#fff'
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  linearGradient: {
    flex: 1,
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 5
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
    width: null,
    marginTop: '2%'
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
  listUsers: {
    width: '100%'
  },
  texto: {
    color: '#000'
  }
});
export default TelaInicial;