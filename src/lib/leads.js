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
    request: 'Кухня',
    source: 'Telegram',
    budget: 'до 7000 BYN',
    status: 'HOT',
    activity: '2 мин назад',
  },
  {
    id: 'maria',
    name: 'Мария',
    request: 'Шкаф',
    source: 'Telegram',
    budget: 'до 4500 BYN',
    status: 'AI_CHATTING',
    activity: '5 мин назад',
  },
  {
    id: 'igor',
    name: 'Игорь',
    request: 'Кухня',
    source: 'Telegram',
    budget: null,
    status: 'NEW',
    activity: '12 мин назад',
  },
  {
    id: 'anna',
    name: 'Анна',
    request: 'Гардеробная',
    source: 'Telegram',
    budget: 'до 6000 BYN',
    status: 'QUALIFIED',
    activity: '18 мин назад',
  },
  {
    id: 'sergey',
    name: 'Сергей',
    request: 'Кухня',
    source: 'Telegram',
    budget: 'до 9000 BYN',
    status: 'HUMAN_TAKEOVER',
    activity: '25 мин назад',
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