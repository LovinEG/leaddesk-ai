import {
  ArrowLeft,
  Check,
  Paperclip,
  Send,
  SendHorizontal,
  Smile,
  UserCheck,
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

import { MESSAGE_AUTHORS } from '../../lib/conversations.js'
import { getStatusMeta } from '../../lib/leads.js'
import Badge from '../ui/Badge.jsx'
import Card from '../ui/Card.jsx'
import './ChatPanel.css'

function getInitials(name) {
  return name.trim().charAt(0).toUpperCase()
}

function ChatPanel({ dialog, messages, isTaken, onTake, onSend, onBack }) {
  const [draft, setDraft] = useState('')
  const listRef = useRef(null)

  const status = getStatusMeta(dialog.lead.status)
  const isDraftEmpty = draft.trim() === ''

  // Прокрутка к последнему сообщению
  useEffect(() => {
    const list = listRef.current

    if (list) {
      list.scrollTop = list.scrollHeight
    }
  }, [messages.length])

  const handleSubmit = (event) => {
    event.preventDefault()

    const text = draft.trim()

    if (text === '') {
      return
    }

    onSend(text)
    setDraft('')
  }

  return (
    <Card className="chat">
      <header className="chat__header">
        <button
          type="button"
          className="chat__back"
          onClick={onBack}
          aria-label="К списку диалогов"
        >
          <ArrowLeft size={16} strokeWidth={2} aria-hidden="true" />
        </button>

        <span className="chat__avatar" aria-hidden="true">
          {getInitials(dialog.lead.name)}
        </span>

        <div className="chat__identity">
          <h2 className="chat__name">{dialog.lead.fullName}</h2>

          <div className="chat__meta">
            <span className="chat__request">{dialog.lead.request}</span>
            <span className="chat__dot" aria-hidden="true" />
            <span className="chat__source">
              <Send size={13} strokeWidth={1.9} aria-hidden="true" />
              {dialog.lead.source}
            </span>
          </div>
        </div>

        <div className="chat__header-right">
          <Badge tone={status.tone}>{status.label}</Badge>

          <button
            type="button"
            className={isTaken ? 'chat__take chat__take--taken' : 'chat__take'}
            onClick={onTake}
            disabled={isTaken}
          >
            {isTaken ? (
              <Check size={15} strokeWidth={2.2} aria-hidden="true" />
            ) : (
              <UserCheck size={15} strokeWidth={1.9} aria-hidden="true" />
            )}
            {isTaken ? 'Диалог у вас' : 'Забрать диалог'}
          </button>
        </div>
      </header>

      <ul className="chat__messages" ref={listRef}>
        {messages.map((message) => (
          <li
            className={`chat-message chat-message--${message.author}`}
            key={message.id}
          >
            <span className="chat-message__author">
              {MESSAGE_AUTHORS[message.author]}
            </span>
            <span className="chat-message__bubble">{message.text}</span>
            <span className="chat-message__time">{message.time}</span>
          </li>
        ))}
      </ul>

      <form className="chat__composer" onSubmit={handleSubmit}>
        <button type="button" className="chat__tool" aria-label="Прикрепить файл">
          <Paperclip size={16} strokeWidth={1.9} aria-hidden="true" />
        </button>

        <button
          type="button"
          className="chat__tool"
          aria-label="Вставить эмодзи"
        >
          <Smile size={16} strokeWidth={1.9} aria-hidden="true" />
        </button>

        <input
          type="text"
          className="chat__input"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="Напишите сообщение..."
          aria-label="Сообщение"
        />

        <button
          type="submit"
          className="chat__send"
          disabled={isDraftEmpty}
          aria-label="Отправить сообщение"
        >
          <SendHorizontal size={16} strokeWidth={2} aria-hidden="true" />
        </button>
      </form>
    </Card>
  )
}

export default ChatPanel