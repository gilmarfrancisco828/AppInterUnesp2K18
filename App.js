import React from 'react';
import axios from "axios";
import { StyleSheet, AsyncStorage, Image } from 'react-native';
import { Font, AppLoading } from "expo";
import { Container, Header, Title, Content, List, ListItem, Left, Body, Right, Thumbnail, Text, Icon, Button } from 'native-base';
import { createStackNavigator } from 'react-navigation';
import TelaPerguntas from './pages/Perguntas.js';

class TelinhaInicial extends React.Component {
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
          //Carregar data
          // AsyncStorage.setItem('data', JSON.stringify(this.carregaDataAlteracaoUsuarios()));
          //Como arrumar isso aqui e não ficar passando this???
          this.carregaUsuarios(this)
          //Tá feio pakas isso aqui
        }
        // console.log(resultUsers);
        return resultUsers;
      } catch (error) {
        console.log(error)
      }
    }
    // AsyncStorage.clear();
    asyncUsers();

  }
  carregaUsuarios(contexto) {
    console.log("Tentando carregar.")
    axios.get('http://10.42.0.1/data/users.json', {
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
  async componentWillMount() {
    await Font.loadAsync({
      Roboto: require("native-base/Fonts/Roboto.ttf"),
      Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf")
    });
    this.setState({ loading: false, usuarios: this.state.usuarios });

  }
  static navigationOptions = { title: 'Welcome', header: null };
  render() {
    if (!this.state.loading) {
      return (
        <Container style={styles.container}>
          {/* <Header androidStatusBarColor="#573ea8" style={styles.header} hasTabs>
            <Title>InterUnesp 2018</Title>
          </Header> */}
          <Content>
            <Image resizeMode={'cover'}
              source={require('./assets/img/banner.jpg')}
              style={styles.logo} />
            <Body style={styles.logoContent}>
              <Text>Selecione o usuários:</Text>
            </Body>
            <List>
              {
                this.state.usuarios.map((l) => (
                  <ListItem avatar
                    key={l.user_cod}
                    onPress={() => {
                      AsyncStorage.setItem('@inter:selectedUser', String(l.user_cod)).then(
                        this.props.navigation.navigate('Perguntas')
                      ).catch(error => {
                        console.log(error);
                      });
                    }
                    }>
                    <Left>
                      <Thumbnail source={require('./assets/img/profile.png')} />
                    </Left>
                    <Body>
                      <Text>{l.user_nome}</Text>
                    </Body>
                  </ListItem>
                ))
              }
            </List>
          </Content >
        </Container >
      );
    }
    else {
      return (
        <Container>
          <Text>Carregando..</Text>
        </Container>
      );
    }
  }
}
const RootStack = createStackNavigator(
  {
    Home: { screen: TelinhaInicial },
    Perguntas: TelaPerguntas,
  },
  {
    initialRouteName: 'Home',
    headerMode: 'screen'
  }
);


export default class App extends React.Component {
  render() {
    return <RootStack />;
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  }
});
