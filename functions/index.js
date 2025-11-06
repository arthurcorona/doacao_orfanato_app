const {onDocumentCreated} = require("firebase-functions/v2/firestore");
const admin = require("firebase-admin");
const sgMail = require("@sendgrid/mail");

admin.initializeApp();

const SENDGRID_KEY = process.env.SENDGRID_KEY;
sgMail.setApiKey(SENDGRID_KEY);

exports.onNewVolunteer = onDocumentCreated(
    "voluntarios/{voluntarioId}",
    async (event) => {
      const snapshot = event.data;
      if (!snapshot) {
        console.log("Nenhum dado associado ao evento.");
        return;
      }
      const novoVoluntario = snapshot.data();
      const nomeVoluntario = novoVoluntario.nome;
      const emailVoluntario = novoVoluntario.email;

      console.log(`Novo voluntário: ${nomeVoluntario}. Enviando e-mail...`);

      const msg = {
        to: "emailreceptor@email.com",
        from: "emailsender@email.com", // email verificado do SendGrid
        subject: "🔔 Novo Voluntário Inscrito - Rede ALSA",
        html: `
      <p>Olá Admin,</p>
      <p>Um novo voluntário acabou de se inscrever no portal!</p>
      <hr>
      <p><strong>Nome:</strong> ${nomeVoluntario}</p>
      <p><strong>Email:</strong> ${emailVoluntario}</p>
      <hr>
      <p>Acesse o dashboard para aprovar o cadastro.</p>
            `,
      };

      try {
        await sgMail.send(msg);
        console.log("E-mail de notificação enviado com sucesso!");
      } catch (error) {
        console.error("Erro ao enviar e-mail:", error);
        if (error.response) {
          console.error(error.response.body);
        }
      }
    });
