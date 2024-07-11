import cron from 'node-cron';
import { Resend } from 'resend';
import { ENV } from './env';

const resend = new Resend(ENV.RESEND_API_KEY);

function sendReminderHourly() {
  cron.schedule('0 * * * *', () => {
    resend.emails.send({
      from: 'onboarding@resend.dev', // TODO: update to waterfollow or mateusjbarbosa.dev e-mail
      to: 'dev.mateusbarbosa@gmail.com', // TODO: update to dynamic as user
      subject: 'Waterfollow - Lembrete de hidratação',
      html: '<p><strong>Hora de se hidratar!</strong></p>' // TODO: improve
    });
    console.log(`${Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' }).format(Date.now())} - Reminder sent`);
  }, { timezone: "America/Sao_Paulo" });
}

sendReminderHourly();
