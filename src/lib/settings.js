export const COMPANY_DEFAULTS = {
  name: 'LeadDesk Demo',
  city: 'Минск',
  phone: '+375 29 000-00-00',
  telegram: '@leaddesk_demo',
  hours: 'Пн–Пт, 09:00–18:00',
}

export const COMPANY_FIELDS = [
  { key: 'name', label: 'Название компании' },
  { key: 'city', label: 'Город' },
  { key: 'phone', label: 'Телефон', type: 'tel' },
  { key: 'telegram', label: 'Telegram username' },
  { key: 'hours', label: 'Рабочие часы', span: true },
]

export const NOTIFICATION_ITEMS = [
  { id: 'newLead', label: 'Новый лид' },
  { id: 'hotLead', label: 'Горячий лид' },
  { id: 'needManager', label: 'Требуется менеджер' },
  { id: 'noReply', label: 'Клиент не отвечает' },
  { id: 'newDialog', label: 'Новый диалог' },
]

export const FOLLOWUP_PREVIEW =
  'Подскажите, вопрос ещё актуален? Я могу помочь с предварительным расчётом.'

export const TELEGRAM_DEFAULTS = {
  connected: true,
  username: '@leaddesk_demo',
}

export function createDefaultSettings() {
  return {
    company: { ...COMPANY_DEFAULTS },
    notifications: Object.fromEntries(
      NOTIFICATION_ITEMS.map((item) => [item.id, true]),
    ),
    followUp: {
      enabled: true,
      minutes: 30,
      attempts: 2,
    },
  }
}