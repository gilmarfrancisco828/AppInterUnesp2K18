import React from 'react';
import axios from "axios";
import { StyleSheet, AsyncStorage, ActivityIndicator } from 'react-native';
import { Font } from "expo";
import * as consts from '../config/constants.js';
import { Container, Content, List, ListItem, Left, Body, Thumbnail, Text} from 'native-base';
import { Col, Grid } from "react-native-easy-grid";
class TelaAtleticas extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      atleticas: [],
      loading: true
    };
    const asyncAtletics = async () => {
      try {
        let resultAtletics = await AsyncStorage.getItem('@inter:atleticas');
        if (resultAtletics !== null) {
          this.setState({
            atleticas: JSON.parse(resultAtletics)
          });
          console.log('Já tinha atléticas salvos')
        }
        else if (resultAtletics == null) {
          this.carregaAtleticas(this)
        };
        return resultAtletics;
      } catch (error) {
        console.log(error)
      }
    }
    asyncAtletics();

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
        AsyncStorage.setItem('@inter:atleticas', JSON.stringify(u.data));
        contexto.setState({ atleticas: u.data }, function () {
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
    this.setState({ atleticas: this.state.atleticas });
    this.niceTransition();
  }
  static navigationOptions = {
    title: 'Selecione a Atlética:',
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
              <List scrollEnabled={true} style={styles.listAtletics}>
                {
                  this.state.atleticas.map((l) => (
                    <ListItem avatar
                      key={l.atle_cod}
                      onPress={() => {
                        AsyncStorage.setItem('@inter:selectedAtletica', String(l.atle_cod)).then(
                          this.props.navigation.navigate('Perguntas')
                        ).catch(error => {
                          console.log(error);
                        });
                      }
                      }>
                      <Left>
                        <Thumbnail source={{ uri: l.atle_img }} />
                      </Left>
                      <Body>
                        <Text>{l.atle_nome}</Text>
                      </Body>
                    </ListItem>
                  ))
                }
              </List>
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
  listAtletics: {
    width: '100%',
  }
});
export default TelaAtleticas;