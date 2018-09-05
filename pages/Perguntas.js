import React, { Component } from 'react';
import { Image } from 'react-native';
import { Container, Header, View, DeckSwiper, Card, CardItem, Thumbnail, Text, Left, Body, Icon, List, ListItem, CheckBox } from 'native-base';
import Dimensions from 'Dimensions';
let ScreenHeight = Dimensions.get("window").height;
const cards = [
  {
    text: '1: O que é uma batata?',
    name: 'p1',
  },
  {
    text: '2: Quando nasceu o arroz doce?',
    name: 'p2',
  },
  {
    text: '3: Bolacha ou Biscoito?',
    name: 'p3',
  }
];
class Perguntas extends React.Component {
  constructor(props) {
    super(props);
    this.state = { checked: false };
  }
  static navigationOptions = { title: 'Questionário'};
  render() {
    return (
      <Container>
        <Header/>
        <View>
          <DeckSwiper
            dataSource={cards}
            style={{bottom: 20, borderTopLeftRadius: 8, borderTopRightRadius: 8}}
            renderItem={item =>
              <Card style={{ elevation: 3, borderTopLeftRadius: 38, borderTopRightRadius: 38, backgroundColor: '#696969', marginTop: 40, marginLeft: '2%', marginRight: '2%', marginLeft: '2%', height: 70*(ScreenHeight/100), bottom: 20}}>
                <CardItem>
                  <Left>
                    {/* <Thumbnail source={{ uri: item.uri }} resizeMode="contain" fadeDuration={0} /> */}
                    <Body>
                      <Text>{item.text}</Text>
                      {/* <Text note>{item.name}</Text> */}
                    </Body>
                  </Left>
                </CardItem>
                <CardItem cardBody style={{marginTop: 12}}>
                  <Text style={{marginLeft: 12}} onPress={() => this.setState({ checked: !this.state.checked })}>Resposta 1: Abobrinha é bom para a saúde.</Text>
                </CardItem>
                <CardItem cardBody style={{marginTop: 12}}>
                  <Text style={{marginLeft: 12}}>Resposta 2: Parafuso é usado para parafusa as coisas, seus putos.</Text>
                </CardItem>
                <CardItem cardBody style={{marginTop: 12}}>
                  <Text style={{marginLeft: 12}}>Resposta 3: Eu gosto muito de abobrinha doce no feijão.</Text>
                </CardItem>
                <CardItem cardBody style={{marginTop: 12}}>
                  <Text style={{marginLeft: 12}}>Resposta 4: A resposta que é ammelhor de todas.</Text>
                </CardItem>
              </Card>
            }
          />
        </View>
      </Container>
    );
  }
}

export default Perguntas;