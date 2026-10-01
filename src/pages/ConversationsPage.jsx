import { useMemo, useState } from 'react'

import ChatPanel from '../components/conversations/ChatPanel.jsx'
import DialogList from '../components/conversations/DialogList.jsx'
import LeadInfoPanel from '../components/conversations/LeadInfoPanel.jsx'
import {
  DIALOGS,
  createManagerMessage,
  filterDialogs,
  getDialog,
} from '../lib/conversations.js'
import './ConversationsPage.css'

const INITIAL_FILTERS = { query: '', filter: 'all' }

function ConversationsPage() {
  const [filters, setFilters] = useState(INITIAL_FILTERS)
  const [activeLeadId, setActiveLeadId] = useState(DIALOGS[0].leadId)
  const [managerMessages, setManagerMessages] = useState({})
  const [takenLeadIds, setTakenLeadIds] = useState([])
  const [isChatOpen, setIsChatOpen] = useState(false)

  const dialogs = useMemo(() => filterDialogs(DIALOGS, filters), [filters])

  const activeDialog = getDialog(activeLeadId) ?? DIALOGS[0]
  const messages = [
    ...activeDialog.messages,
    ...(managerMessages[activeLeadId] ?? []),
  ]
  const isTaken = takenLeadIds.includes(activeLeadId)

  const handleFilterChange = (field, value) =>
    setFilters((prev) => ({ ...prev, [field]: value }))

  const handleSelect = (leadId) => {
    setActiveLeadId(leadId)
    setIsChatOpen(true)
  }

  const handleTake = () =>
    setTakenLeadIds((prev) =>
      prev.includes(activeLeadId) ? prev : [...prev, activeLeadId],
    )

  const handleSend = (text) =>
    setManagerMessages((prev) => ({
      ...prev,
      [activeLeadId]: [
        ...(prev[activeLeadId] ?? []),
        createManagerMessage(text),
      ],
    }))

  return (
    <div
      className={
        isChatOpen ? 'conversations conversations--chat-open' : 'conversations'
      }
    >
      <div className="conversations__list">
        <DialogList
          dialogs={dialogs}
          filters={filters}
          onChange={handleFilterChange}
          activeLeadId={activeLeadId}
          onSelect={handleSelect}
        />
      </div>

      <div className="conversations__chat">
        <ChatPanel
          key={activeDialog.leadId}
          dialog={activeDialog}
          messages={messages}
          isTaken={isTaken}
          onTake={handleTake}
          onSend={handleSend}
          onBack={() => setIsChatOpen(false)}
        />
      </div>

      <div className="conversations__side">
        <LeadInfoPanel lead={activeDialog.lead} />
      </div>
    </div>
  )
}

export default ConversationsPage
