import React, { Component } from 'react';
import { AsyncStorage } from 'react-native';
import { Container, Header, View, DeckSwiper, Card, CardItem, Thumbnail, Text, Left, Body, Icon, List, ListItem, CheckBox } from 'native-base';
import Dimensions from 'Dimensions';
let ScreenHeight = Dimensions.get("window").height;
class Perguntas extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedUser: null,
      checked: false,
      questionario: null,
      id_questionario: null,
      perguntas: null,
    };

    AsyncStorage.getItem('@inter:selectedUser').then((data) => {
      this.setState({
        selectedUser: data
      });
      return true;
    }).catch(error => {
      console.log(error);
      return false;
    });

    AsyncStorage.getItem('@inter:questionario${id}').then((data) => {
      data = JSON.parse(data);
      this.setState({
        perguntas: data.perguntas
      });
      return true;
    }).catch(error => {
      console.log(error);
      return false;
    });
  }
  static navigationOptions = { title: 'Questionário' };
  render() {
    return (
      <Container>
        <View>
          <Text>{this.state.selectedUser}</Text>
        </View>
      </Container>
    );
  }
}

export default Perguntas;