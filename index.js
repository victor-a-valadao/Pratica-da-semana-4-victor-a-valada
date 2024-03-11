const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const path = require("path");
const nodemailer = require("nodemailer");
const app = express();
const porta = 443;

app.use(express.static(__dirname));
app.use(session({ secret: "1234567890" }));
app.use(bodyParser.urlencoded({ extended: true }));

var login = "admin";
var senha = "1234";

app.engine("html", require("ejs").renderFile);
app.set("view engine", "html");
app.set("views", path.join(__dirname, "./"));

app.get("/", (req, res) => {
  if (req.session.login) {
    res.render("logado");
    console.log("Usuário logado: " + req.session.login);
  } else {
    res.render("home");
  }
});

app.post("/", (req, res) => {
  if (req.body.password == senha && req.body.login == login) {
    req.session.login = login;
    res.render("logado");
  } else {
    res.render("home");
  }
});

app.get("/email", (req, res) => {
  if (req.session.login) {
    res.render("email");
  } else {
    res.render("home");
  }
});

app.post("/sendemail", async (req, res) => {
  var transport = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "ec72ed5aa55a05",
      pass: "0fea7fab35e7b0"
    }
  });

  var message = {
    from: "victor.valadao@hotmal.com",
    to: "victor.valadao@sender.com",
    subject: "Atividade Prática 4 - Victor Valadão",
    text: "Atividade Prática 4 - Victor Valadão - Teste de envio de e-mail",
    html: "<p>E-mail para avaliação da Prática da Semana 4 </p><br><br> Victor Valadão",
  };

  transport.sendMail(message, function(err) {
    if (err)
      return res.status(400).json({
        erro: true,
        mensagem: "Erro: E-mail não enviado!",
      });
    else
      return res.json({
        erro: false,
        mensagem: "E-mail enviado com sucesso!",
      });
  });
});

app.listen(porta, () => {
  console.log("Servidor rodando");
});
