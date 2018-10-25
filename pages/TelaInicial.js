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
      usuarios: [],
      loading: true
    };
    const asyncUsers = async () => {
      try {
        console.log('Oi')
        let resultUsers = await AsyncStorage.getItem('users');
        if (resultUsers !== null) {
          this.setState({
            usuarios: JSON.parse(resultUsers)
          });
          console.log('Já tinha usuários salvos')
        }
        else if (resultUsers == null) {
          this.carregaUsuarios(this)
        }
        return resultUsers;
      } catch (error) {
        console.log(error)
      }
    }
    asyncUsers();

  }
  carregaUsuarios(contexto) {
    console.log("Tentando carregar.")
    axios.get(consts.SERVER_API + "user", {
      params: {
        token: 'Abobrinha123'
      }
    })
      .then(function (u) {
        console.log("Requisitou usuários da WebService.")
        AsyncStorage.setItem('users', JSON.stringify(u.data));
        contexto.setState({ usuarios: u.data }, function () {
          // alert("Alterou!!!!");
        });
      })
      .catch(function (error) {
        alert(error);
      });
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
    this.setState({ usuarios: this.state.usuarios });
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
            {/* <Header androidStatusBarColor="#573ea8" style={styles.header} hasTabs>
              <Title>InterUnesp 2018</Title>
            </Header> */}
            <Content>
              <Image resizeMode={'contain'}
                source={logo}
                style={styles.logo} />

              <List style={styles.listUsers}>
                <ListItem itemHeader first center>
                  <Text style={{ color:'#fff', fontSize: 30 }}>Selecione o usuário</Text>
                </ListItem>
                {
                  this.state.usuarios.map((l) => (

                    <ListItem avatar
                      key={l.user_cod}
                     
                      onPress={() => {
                        AsyncStorage.setItem('@inter:selectedUser', String(l.user_cod)).then(
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
                        <Text style={{ color:'#fff', fontSize: 18 }}>{l.user_nome}</Text>
                      </Body>
                      
                    </ListItem>
                  ))
                }
              </List>
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