import { createStackNavigator } from 'react-navigation';
import Home from './TelaInicial';
import TelaPerguntas from './Perguntas';
import TelaResultados from './Resultados';
import TelaAtleticas from './Atleticas';
import TelaForms from './Questionarios';

const AppNavigator = createStackNavigator({
  Home: { screen: Home},
  Perguntas: { screen: TelaPerguntas},
  Resultado: { screen: TelaResultados},
  Atleticas: {screen: TelaAtleticas},
  Questionarios: {screen: TelaForms},
});

export default AppNavigator;