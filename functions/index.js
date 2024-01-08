/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */
/*
const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
*/

const functions = require('firebase-functions');
//acesso a recursos: ler/gravar dados no realtime db, gerar/verificar tokens de auth, acesso ao firestore...
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');

//instancia de admin
admin.initializeApp();

//definir credenciais de uma conta que usaremos para envio de emails
//se atentar a questões de permissões etc...
let mailTransport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'email@gmail.com',
      pass: 'senha'
    }
});

//funcao que escuta um evento no banco de dados e capturar os dados
exports.createUser = functions.firestore
//ativar o evento onCreate para qualquer documento
  .document('/funcionarios/{documentId}').onCreate((snap, context) => {
    const funcionario = snap.data();
    const email = funcionario.email;
    const nome = funcionario.nome;

    //criar o usuario do firebase
    return admin.auth().createUser({
      uid: `${email}`,
      email: `${email}`,
      emailVerified: false,
      password: `123456`, //todas as senhas serão 123456
      displayName: `${nome}`,
      disabled: false
    }).then((userRecord) => {
      console.log('Usuário registrado com sucesso')
      return userRecord;
    })
      .catch((error) => {
        console.log("Não foi possível criar o usuário:", error);
      });
})

//disparar emial toda vez que uma requisicao receber uma nova atualização
exports.notifyUser = functions.firestore
  .document('/requisicoes/{documentId}').onUpdate((snap) => {
    const requisicao = snap.after.data();
    const solicitante = requisicao.solicitante;
    const email = solicitante.email;
    const movimentacoes = requisicao.movimentacoes;

    if (movimentacoes.length > 0) {
      const movimentacao = movimentacoes[movimentacoes.length - 1];

      //desenvolvimento do corpo do email
      const texto = `<h2> Sua requisição recebeu uma atualização! </h2>
                     <h3> Descricao:   ${movimentacao.descricao} </h3>
                     <h4> Status:  ${movimentacao.status}  <br> `
      const mailOptions = {
        from: `<noreply@firebase.com>`,
        to: email,
        subject : `Sistema de Requisições | Processamento de Requisições`,
        html : `${texto}`
      };
      return mailTransport.sendMail(mailOptions).then(() => {
        console.log('Email enviado para:', email);
        return null;
      }).catch((error) => {
        console.log("Não foi possível notificar  o usuário:", error);
      });
    }
})

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
