import {
  Bot,
  LayoutDashboard,
  MessagesSquare,
  Settings,
  Users,
} from 'lucide-react'

export const NAV_ITEMS = [
  {
    to: '/dashboard',
    label: 'Dashboard',
    description: 'Обзор входящих диалогов и лидов',
    icon: LayoutDashboard,
  },
  {
    to: '/leads',
    label: 'Leads',
    pageTitle: 'Лиды',
    description: 'Все входящие заявки и их текущий статус',
    icon: Users,
  },
  {
    to: '/conversations',
    label: 'Conversations',
    description: 'Диалоги с клиентами',
    icon: MessagesSquare,
  },
  {
    to: '/ai-rules',
    label: 'AI Rules',
    description: 'Правила квалификации лидов',
    icon: Bot,
  },
  {
    to: '/settings',
    label: 'Settings',
    description: 'Настройки рабочего пространства',
    icon: Settings,
  },
]

const DEFAULT_PAGE = {
  label: 'LeadDesk AI',
  description: '',
}

export function getPageMeta(pathname) {
  const leadId = pathname.startsWith('/leads/')
    ? pathname.slice('/leads/'.length)
    : ''

  if (leadId !== '') {
    return {
      label: 'Lead',
      description: `Лид #${leadId}`,
    }
  }

  const item = NAV_ITEMS.find(
    ({ to }) => pathname === to || pathname.startsWith(`${to}/`),
  )

  if (!item) {
    return DEFAULT_PAGE
  }

  return { label: item.pageTitle ?? item.label, description: item.description }
}