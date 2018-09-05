import axios from "axios";
function carregaUsuarios() {
  console.log("Batata1");
  axios.get('http://186.217.104.136/data/users.json', {
    params: {
      token: 'Abobrinha123'
    }
  })
    .then(function (usuarios) {
      return usuarios.data;
    })
    .catch(function (error) {
      console.log(error);
    });
    return usuarios.data;
}