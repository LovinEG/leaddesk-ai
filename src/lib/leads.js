export const FILTER_ALL = 'all'

export const LEAD_STATUSES = [
  { value: 'HOT', label: 'HOT', tone: 'hot' },
  { value: 'AI_CHATTING', label: 'AI общается', tone: 'ai' },
  { value: 'NEW', label: 'NEW', tone: 'new' },
  { value: 'QUALIFIED', label: 'QUALIFIED', tone: 'qualified' },
  { value: 'HUMAN_TAKEOVER', label: 'Требует менеджера', tone: 'takeover' },
]

const STATUS_BY_VALUE = new Map(
  LEAD_STATUSES.map((status) => [status.value, status]),
)

export function getStatusMeta(value) {
  return STATUS_BY_VALUE.get(value) ?? { value, label: value, tone: 'new' }
}

export const MOCK_LEADS = [
  {
    id: 'andrey',
    name: 'Андрей',
    fullName: 'Андрей Кузнецов',
    username: '@andrey_kuznetsov',
    phone: '+375 (29) 123-45-67',
    city: 'Минск',
    request: 'Кухня',
    requestType: 'Угловая кухня, ~3.2 м',
    source: 'Telegram',
    budget: 'до 7000 BYN',
    deadline: 'в течение месяца',
    status: 'HOT',
    activity: '2 мин назад',
    score: 82,
    scoreLabel: 'Высокая вероятность сделки',
    aiUpdated: 'Обновлено AI несколько минут назад',
    aiSummary:
      'Клиент интересуется угловой кухней длиной около 3.2 м. Бюджет до 7000 BYN. Находится в Минске. Планирует заказ в течение ближайшего месяца. Прислал референс и готов перейти к замеру.',
    notes: ['Клиенту важно уложиться в бюджет. Уточнить материал фасадов.'],
    activityHistory: [
      { id: 'andrey-1', title: 'Клиент написал в Telegram', time: '10:24' },
      { id: 'andrey-2', title: 'AI начал диалог', time: '10:24' },
      { id: 'andrey-3', title: 'Получен бюджет', time: '10:26' },
      { id: 'andrey-4', title: 'Лид квалифицирован', time: '10:28' },
      { id: 'andrey-5', title: 'Добавлен статус HOT', time: '10:29' },
    ],
  },
  {
    id: 'maria',
    name: 'Мария',
    fullName: 'Мария Соколова',
    username: '@maria_sokolova',
    phone: '+375 (29) 234-56-78',
    city: 'Гомель',
    request: 'Шкаф',
    requestType: 'Шкаф-купе, 2.4 м',
    source: 'Telegram',
    budget: 'до 4500 BYN',
    deadline: 'в течение 2 недель',
    status: 'AI_CHATTING',
    activity: '5 мин назад',
    score: 64,
    scoreLabel: 'Средняя вероятность сделки',
    aiUpdated: 'Обновлено AI несколько минут назад',
    aiSummary:
      'AI уточняет параметры шкафа-купе: ширина 2.4 м, глубина 0.6 м. Бюджет до 4500 BYN. Клиент из Гомеля, планирует заказ в течение двух недель. Ждёт варианты внутреннего наполнения.',
    notes: ['Нужны варианты наполнения: штанга, полки, ящики. Уточнить цвет.'],
    activityHistory: [
      { id: 'maria-1', title: 'Клиент написала в Telegram', time: '11:02' },
      { id: 'maria-2', title: 'AI начал диалог', time: '11:02' },
      { id: 'maria-3', title: 'Уточнены размеры', time: '11:06' },
      { id: 'maria-4', title: 'Отправлены варианты наполнения', time: '11:09' },
    ],
  },
  {
    id: 'igor',
    name: 'Игорь',
    fullName: 'Игорь Петров',
    username: '@igor_petrov',
    phone: '+375 (33) 345-67-89',
    city: 'Брест',
    request: 'Кухня',
    requestType: 'Кухня, размеры уточняются',
    source: 'Telegram',
    budget: null,
    deadline: 'не указан',
    status: 'NEW',
    activity: '12 мин назад',
    score: 38,
    scoreLabel: 'Нужно уточнить бюджет',
    aiUpdated: 'Обновлено AI несколько минут назад',
    aiSummary:
      'Новое обращение из Telegram. Клиент интересуется кухней, точные размеры и бюджет пока не назвал. AI уточняет планировку помещения и сроки.',
    notes: [],
    activityHistory: [
      { id: 'igor-1', title: 'Клиент написал в Telegram', time: '11:40' },
      { id: 'igor-2', title: 'AI начал диалог', time: '11:40' },
      { id: 'igor-3', title: 'Запрошены размеры помещения', time: '11:42' },
    ],
  },
  {
    id: 'anna',
    name: 'Анна',
    username: '@anna_lebed',
    fullName: 'Анна Лебедева',
    phone: '+375 (25) 456-78-90',
    city: 'Минск',
    request: 'Гардеробная',
    requestType: 'Гардеробная, 4 м',
    source: 'Telegram',
    budget: 'до 6000 BYN',
    deadline: 'в течение месяца',
    status: 'QUALIFIED',
    activity: '18 мин назад',
    score: 76,
    scoreLabel: 'Хорошая вероятность сделки',
    aiUpdated: 'Обновлено AI несколько минут назад',
    aiSummary:
      'Клиент планирует гардеробную длиной около 4 м. Бюджет до 6000 BYN. Находится в Минске. Срок — в течение месяца. Согласна на замер на следующей неделе.',
    notes: ['Согласовать время замера на следующей неделе.'],
    activityHistory: [
      { id: 'anna-1', title: 'Клиент написала в Telegram', time: '12:05' },
      { id: 'anna-2', title: 'AI начал диалог', time: '12:05' },
      { id: 'anna-3', title: 'Получен бюджет', time: '12:08' },
      { id: 'anna-4', title: 'Лид квалифицирован', time: '12:10' },
      { id: 'anna-5', title: 'Добавлен статус QUALIFIED', time: '12:11' },
    ],
  },
  {
    id: 'sergey',
    name: 'Сергей',
    fullName: 'Сергей Морозов',
    username: '@sergey_morozov',
    phone: '+375 (44) 567-89-01',
    city: 'Могилёв',
    request: 'Кухня',
    requestType: 'Кухня под заказ, 3.6 м',
    source: 'Telegram',
    activity: '25 мин назад',
    budget: 'до 9000 BYN',
    deadline: '2 недели',
    status: 'HUMAN_TAKEOVER',
    score: 91,
    scoreLabel: 'Очень высокая вероятность сделки',
    aiUpdated: 'Обновлено AI несколько минут назад',
    aiSummary:
      'Клиент готов к сделке: кухня 3.6 м под заказ, бюджет до 9000 BYN. Город — Могилёв. Срок — 2 недели. Просит связаться с менеджером, чтобы обсудить материалы и дату замера.',
    notes: ['Клиент ждёт звонка менеджера. Обсудить материалы и график замера.'],
    activityHistory: [
      { id: 'sergey-1', title: 'Клиент написал в Telegram', time: '12:20' },
      { id: 'sergey-2', title: 'AI начал диалог', time: '12:20' },
      { id: 'sergey-3', title: 'Получен бюджет', time: '12:22' },
      { id: 'sergey-4', title: 'Лид квалифицирован', time: '12:24' },
      { id: 'sergey-5', title: 'Требуется менеджер', time: '12:26' },
    ],
  },
]

export const LEAD_SOURCES = [
  ...new Set(MOCK_LEADS.map((lead) => lead.source)),
].sort()

export function filterLeads(leads, filters) {
  const query = filters.query.trim().toLowerCase()

  return leads.filter((lead) => {
    const matchesQuery =
      query === '' ||
      lead.name.toLowerCase().includes(query) ||
      lead.request.toLowerCase().includes(query)

    const matchesStatus =
      filters.status === FILTER_ALL || lead.status === filters.status

    const matchesSource =
      filters.source === FILTER_ALL || lead.source === filters.source

    return matchesQuery && matchesStatus && matchesSource
  })
}

export function getLeadById(id) {
  return MOCK_LEADS.find((lead) => lead.id === id)
}