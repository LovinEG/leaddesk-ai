import { MOCK_LEADS } from './leads.js'

export const DIALOG_FILTERS = [
  { id: 'all', label: 'Все' },
  { id: 'new', label: 'Новые' },
  { id: 'takeover', label: 'Требуют менеджера' },
]

export const MESSAGE_AUTHORS = {
  client: 'Клиент',
  ai: 'AI-ассистент',
  manager: 'Менеджер',
}

const DIALOG_META = {
  andrey: {
    preview: 'Здравствуйте! Сколько стоит кухня на заказ?',
    messages: [
      {
        id: 'andrey-m1',
        author: 'client',
        text: 'Здравствуйте! Сколько стоит кухня на заказ?',
        time: '10:24',
      },
      {
        id: 'andrey-m2',
        author: 'ai',
        text: 'Здравствуйте! Помогу сориентироваться. Подскажите, пожалуйста, примерную длину кухни и её форму.',
        time: '10:24',
      },
      {
        id: 'andrey-m3',
        author: 'client',
        text: 'Примерно 3.2 метра, угловая.',
        time: '10:26',
      },
      {
        id: 'andrey-m4',
        author: 'ai',
        text: 'Спасибо. Подскажите ориентировочный бюджет и город.',
        time: '10:26',
      },
      {
        id: 'andrey-m5',
        author: 'client',
        text: 'До 7000 BYN, Минск.',
        time: '10:27',
      },
      {
        id: 'andrey-m6',
        author: 'ai',
        text: 'Отлично. В какие сроки планируете заказ?',
        time: '10:27',
      },
      {
        id: 'andrey-m7',
        author: 'client',
        text: 'В течение месяца.',
        time: '10:28',
      },
    ],
  },
  maria: {
    preview: 'Да, размеры примерно 240×180',
    messages: [
      {
        id: 'maria-m1',
        author: 'client',
        text: 'Здравствуйте! Интересует шкаф-купе.',
        time: '11:02',
      },
      {
        id: 'maria-m2',
        author: 'ai',
        text: 'Здравствуйте! Подскажите, пожалуйста, примерные размеры ниши.',
        time: '11:02',
      },
      {
        id: 'maria-m3',
        author: 'client',
        text: 'Да, размеры примерно 240×180',
        time: '11:06',
      },
    ],
  },
  igor: {
    preview: 'Отправил размеры',
    messages: [
      {
        id: 'igor-m1',
        author: 'client',
        text: 'Добрый день, нужна кухня.',
        time: '11:40',
      },
      {
        id: 'igor-m2',
        author: 'ai',
        text: 'Добрый день! Отправьте, пожалуйста, размеры помещения и укажите бюджет.',
        time: '11:40',
      },
      {
        id: 'igor-m3',
        author: 'client',
        text: 'Отправил размеры',
        time: '11:42',
      },
    ],
  },
  anna: {
    preview: 'Рассмотрю несколько вариантов',
    messages: [
      {
        id: 'anna-m1',
        author: 'client',
        text: 'Здравствуйте, хочу гардеробную.',
        time: '12:05',
      },
      {
        id: 'anna-m2',
        author: 'ai',
        text: 'Здравствуйте! Какой длины планируется гардеробная и на какой бюджет ориентируетесь?',
        time: '12:05',
      },
      {
        id: 'anna-m3',
        author: 'client',
        text: 'Около 4 метров, до 6000 BYN.',
        time: '12:08',
      },
      {
        id: 'anna-m4',
        author: 'ai',
        text: 'Спасибо! Подготовлю несколько планировок с разным наполнением.',
        time: '12:09',
      },
      {
        id: 'anna-m5',
        author: 'client',
        text: 'Рассмотрю несколько вариантов',
        time: '12:10',
      },
    ],
  },
  sergey: {
    preview: 'Можно созвониться сегодня?',
    messages: [
      {
        id: 'sergey-m1',
        author: 'client',
        text: 'Здравствуйте! Нужна кухня под заказ.',
        time: '12:20',
      },
      {
        id: 'sergey-m2',
        author: 'ai',
        text: 'Здравствуйте! Подскажите бюджет и желаемые сроки.',
        time: '12:20',
      },
      {
        id: 'sergey-m3',
        author: 'client',
        text: 'До 9000 BYN, хотелось бы за 2 недели.',
        time: '12:22',
      },
      {
        id: 'sergey-m4',
        author: 'ai',
        text: 'Понял. Передам диалог менеджеру — он поможет с материалами и датой замера.',
        time: '12:24',
      },
      {
        id: 'sergey-m5',
        author: 'client',
        text: 'Можно созвониться сегодня?',
        time: '12:26',
      },
    ],
  },
}

export const DIALOGS = MOCK_LEADS.map((lead) => ({
  leadId: lead.id,
  lead,
  preview: DIALOG_META[lead.id]?.preview ?? '',
  time: lead.activity,
  messages: DIALOG_META[lead.id]?.messages ?? [],
}))

export function getDialog(leadId) {
  return DIALOGS.find((dialog) => dialog.leadId === leadId)
}

export function filterDialogs(dialogs, filters) {
  const query = filters.query.trim().toLowerCase()

  return dialogs.filter(({ lead, preview }) => {
    const matchesQuery =
      query === '' ||
      lead.name.toLowerCase().includes(query) ||
      lead.request.toLowerCase().includes(query) ||
      preview.toLowerCase().includes(query)

    const matchesFilter =
      filters.filter === 'all' ||
      (filters.filter === 'new' && lead.status === 'NEW') ||
      (filters.filter === 'takeover' && lead.status === 'HUMAN_TAKEOVER')

    return matchesQuery && matchesFilter
  })
}

let messageCounter = 0

export function createManagerMessage(text) {
  const now = new Date()
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')

  messageCounter += 1

  return {
    id: `manager-${now.getTime()}-${messageCounter}`,
    author: 'manager',
    text,
    time: `${hours}:${minutes}`,
  }
}