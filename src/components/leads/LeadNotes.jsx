import { Plus, StickyNote } from 'lucide-react'
import { useState } from 'react'

import Card from '../ui/Card.jsx'
import './LeadNotes.css'

function LeadNotes({ initialNotes }) {
  const [notes, setNotes] = useState(initialNotes)
  const [draft, setDraft] = useState('')

  const isDraftEmpty = draft.trim() === ''

  const handleSubmit = (event) => {
    event.preventDefault()

    const text = draft.trim()

    if (text === '') {
      return
    }

    setNotes((prev) => [...prev, text])
    setDraft('')
  }

  return (
    <Card className="lead-notes">
      <header className="lead-notes__header">
        <span className="lead-notes__icon" aria-hidden="true">
          <StickyNote size={15} strokeWidth={1.9} />
        </span>
        <h2 className="lead-notes__title">Заметки</h2>
      </header>

      {notes.length === 0 ? (
        <p className="lead-notes__empty">
          Заметок пока нет — добавьте первую заметку по клиенту.
        </p>
      ) : (
        <ul className="lead-notes__list">
          {notes.map((note, index) => (
            <li className="lead-notes__item" key={`${index}-${note}`}>
              <span className="lead-notes__dot" aria-hidden="true" />
              <span className="lead-notes__text">{note}</span>
            </li>
          ))}
        </ul>
      )}

      <form className="lead-notes__form" onSubmit={handleSubmit}>
        <input
          type="text"
          className="lead-notes__input"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="Новая заметка по клиенту"
          aria-label="Новая заметка"
        />

        <button
          type="submit"
          className="lead-notes__submit"
          disabled={isDraftEmpty}
        >
          <Plus size={15} strokeWidth={2} aria-hidden="true" />
          Добавить заметку
        </button>
      </form>
    </Card>
  )
}

export default LeadNotes