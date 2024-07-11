import cron from 'node-cron';
import { Resend } from 'resend';
import { db } from './db';
import { ENV } from './env';
import { hydrationHistory } from './schema';

const resend = new Resend(ENV.RESEND_API_KEY);

async function sendReminderHourly() {
  cron.schedule('*/30 * * * *', async () => {
    resend.emails.send({
      from: 'onboarding@resend.dev', // TODO: update to waterfollow or mateusjbarbosa.dev e-mail
      to: 'dev.mateusbarbosa@gmail.com', // TODO: update to dynamic as user
      subject: 'Waterfollow - Lembrete de hidratação',
      html: '<p><strong>Hora de se hidratar!</strong></p>' // TODO: improve
    });

    const now = Date.now();
    await db.insert(hydrationHistory).values({ hydrationAt: new Date(now), quantity: 300 }).returning();

    console.log(`${Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' }).format(now)} - Reminder sent`);
  }, { timezone: "America/Sao_Paulo" });
}

(async () => {
  await sendReminderHourly();
})()
