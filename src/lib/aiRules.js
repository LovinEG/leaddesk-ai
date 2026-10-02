export const TONES = [
  {
    id: 'friendly',
    label: 'Дружелюбный',
    hint: 'Тёплый тон и простой язык',
  },
  {
    id: 'professional',
    label: 'Профессиональный',
    hint: 'Деловой и спокойный стиль',
  },
  {
    id: 'short',
    label: 'Короткий',
    hint: 'Только суть, без лишних слов',
  },
  {
    id: 'expert',
    label: 'Экспертный',
    hint: 'Термины и точные формулировки',
  },
]

export const QUALIFY_FIELDS = [
  { id: 'orderType', label: 'Тип заказа' },
  { id: 'dimensions', label: 'Размеры' },
  { id: 'budget', label: 'Бюджет' },
  { id: 'city', label: 'Город' },
  { id: 'deadline', label: 'Срок' },
  { id: 'contact', label: 'Контакт' },
  { id: 'photo', label: 'Фото / референс' },
]

export const HANDOFF_RULES = [
  { id: 'askHuman', label: 'Клиент просит человека' },
  { id: 'readyToOrder', label: 'Клиент готов оформить заказ' },
  { id: 'unknown', label: 'AI не знает ответа' },
  { id: 'unhappy', label: 'Клиент недоволен' },
  { id: 'budgetAbove', label: 'Бюджет выше заданного значения' },
]

export const DEFAULT_INSTRUCTIONS = `Ты AI-менеджер компании по изготовлению мебели на заказ.
Общайся вежливо и кратко.
Не придумывай цены.
Если точная стоимость неизвестна, менеджер сделает расчёт после уточнения параметров.
Не обещай сроки, которых нет в настройках компании.`

export const PREVIEW_DIALOG = {
  client: 'Сколько стоит кухня?',
  replies: {
    friendly:
      'Здравствуйте! Помогу сориентироваться. Подскажите, пожалуйста, примерную длину кухни и её форму.',
    professional:
      'Здравствуйте! Для расчёта уточните, пожалуйста, длину и форму кухни — после этого менеджер подготовит стоимость.',
    short:
      'Нужны длина и форма кухни. Расчёт — после уточнения параметров.',
    expert:
      'Расчёт зависит от габаритов и комплектации. Уточните длину, форму и желаемые фасады — точную стоимость подготовит менеджер.',
  },
}

function enabledMap(items) {
  return Object.fromEntries(items.map((item) => [item.id, true]))
}

export function createDefaultAiRules() {
  return {
    active: true,
    tone: 'friendly',
    qualify: enabledMap(QUALIFY_FIELDS),
    handoff: enabledMap(HANDOFF_RULES),
    budgetThreshold: '8000',
    instructions: DEFAULT_INSTRUCTIONS,
  }
}
