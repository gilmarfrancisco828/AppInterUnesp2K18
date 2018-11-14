import React from 'react';
import axios from "axios";
import { StyleSheet, AsyncStorage, ActivityIndicator } from 'react-native';
import { Font } from "expo";
import * as consts from '../config/constants.js';
import { Container, Content, List, ListItem, Left, Body, Button, Thumbnail, Text } from 'native-base';
import { Col, Grid } from "react-native-easy-grid";
import { LinearGradient } from 'expo';
class TelaAtleticas extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      athletics: [],
      loading: true,
      selectedForm: 0,
    };
    const asyncAthletics = async () => {
      try {
        let resultAthletics = await AsyncStorage.getItem('@inter:athletics');
        if (resultAthletics !== null) {
          this.setState({
            athletics: JSON.parse(resultAthletics)
          });
          console.log('Já tinha atléticas salvos')
        }
        else if (resultAthletics == null) {
          this.carregaAtleticas(this)
        };
        return resultAthletics;
      } catch (error) {
        console.log(error)
      }
    }
    const asyncSelectedForm = async () => {
      try {
        let sForm = await AsyncStorage.getItem('@inter:selectedForm');
        this.setState({
          selectedForm: parseInt(sForm)
        })
        console.log('Pegou id do form do async');
      } catch (error) {
        console.log(error)
      }
    }
    asyncAthletics();
    asyncSelectedForm();

  }
  niceTransition() {
    setTimeout(() => {
      this.setState({ loading: false, });
    }, 1500);
  }
  carregaAtleticas(contexto) {
    console.log("Tentando carregar.")
    contexto.setState({ loading: true, });
    axios.get(consts.SERVER_API + 'atletics', {
      params: {
        token: 'Abobrinha123'
      }
    })
      .then(function (u) {
        console.log("Requisitou atléticas da WebService.")
        AsyncStorage.setItem('@inter:athletics', JSON.stringify(u.data));
        contexto.setState({ athletics: u.data }, function () {
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
    this.setState({ athletics: this.state.athletics });
    this.niceTransition();
  }
  static navigationOptions = {
    title: 'Selecione a Atlética',
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
              colors={['#ff4e50', '#f9d423']}
           >
          <Content>
           
          <Grid style={{ flex: 1}}>
            
            <Col size={5}></Col>
            <Col scrollEnabled={true} size={90}>
              <List scrollEnabled={true} style={styles.listAthletics}>
                {
                  this.state.athletics.map((l) => (
                    <ListItem avatar
                      key={l._id}
                      onPress={() => {
                        AsyncStorage.setItem('@inter:selectedAthletic', String(l._id)).then(
                          this.props.navigation.navigate('Perguntas', {
                            selectedForm: this.state.selectedForm
                        })
                        ).catch(error => {
                          console.log(error);
                        });
                      }
                      }>
                      <Left>
                        <Thumbnail source={{ uri: l.img }} />
                      </Left>
                      <Body>
                        <Text style={{ color:'#fff', fontSize: 18 }}>{l.name}</Text>
                      </Body>
                    </ListItem>

                  ))
                }                
              </List>
               <Button block style={styles.resposta} onPress={() => {
                    this.carregaAtleticas(this)
                  }
                  }>
                    <Text  style={{ fontSize: 16, color: '#ff4e50' }} >Atualizar Atléticas</Text>
                  </Button>
              
            </Col>
            <Col size={5}></Col>
             
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
    marginTop: 30,
    borderRadius: 30,
    marginBottom: 20,
    paddingTop: 30,
    paddingBottom: 30,
    backgroundColor: '#fff'
  },
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
  listAthletics: {
    width: '100%',
  }
});
export default TelaAtleticas;