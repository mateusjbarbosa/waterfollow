import cron from 'node-cron';

function sendReminderHourly() {
  cron.schedule('30 * * * *', () => {
    console.log(`${Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' }).format(Date.now())} - Reminder sent`);
  }, { timezone: "America/Sao_Paulo" });
}

sendReminderHourly();
