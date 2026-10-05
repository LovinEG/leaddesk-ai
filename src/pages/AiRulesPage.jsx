import {
  Bot,
  Check,
  CircleHelp,
  ClipboardList,
  Eye,
  FileText,
  Handshake,
  MessageSquareText,
  RotateCcw,
  Save,
  Sparkles,
  Wallet,
} from 'lucide-react'
import { useEffect, useState } from 'react'

import Card from '../components/ui/Card.jsx'
import { getCurrentBusiness } from '../lib/business.js'
import {
  DEFAULT_INSTRUCTIONS,
  HANDOFF_RULES,
  PREVIEW_DIALOG,
  QUALIFY_FIELDS,
  TONES,
  createDefaultAiRules,
} from '../lib/aiRules.js'
import { supabase } from '../lib/supabase.js'
import './AiRulesPage.css'

function flagsFromStoredValue(items, value) {
  return Object.fromEntries(
    items.map(({ id }) => [
      id,
      Array.isArray(value)
        ? value.includes(id)
        : value?.[id] === true,
    ]),
  )
}

function copySettings(settings) {
  return {
    ...settings,
    qualify: { ...settings.qualify },
    handoff: { ...settings.handoff },
  }
}

function Switch({ checked, onChange, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      className={checked ? 'ai-switch ai-switch--on' : 'ai-switch'}
      onClick={onChange}
    >
      <span className="ai-switch__thumb" />
    </button>
  )
}

function SectionHeader({ icon: Icon, title, hint, accent = 'violet' }) {
  return (
    <header className="ai-rules__section-head">
      <span
        className={`ai-rules__section-icon ai-rules__section-icon--${accent}`}
        aria-hidden="true"
      >
        <Icon size={15} strokeWidth={1.9} />
      </span>
      <div className="ai-rules__section-copy">
        <h2 className="ai-rules__section-title">{title}</h2>
        {hint ? <p className="ai-rules__section-hint">{hint}</p> : null}
      </div>
    </header>
  )
}

function AiRulesPage() {
  const [settings, setSettings] = useState(createDefaultAiRules)
  const [loadedSettings, setLoadedSettings] = useState(null)
  const [businessId, setBusinessId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [loadingError, setLoadingError] = useState('')
  const [loadAttempt, setLoadAttempt] = useState(0)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')
  const [savedFlash, setSavedFlash] = useState(false)

  useEffect(() => {
    let active = true

    async function loadSettings() {
      setLoading(true)
      setLoadingError('')
      setSaveError('')

      try {
        const business = await getCurrentBusiness()
        const { data, error } = await supabase
          .from('ai_rules')
          .select(
            'business_id, active, tone, qualification_fields, handoff_rules, handoff_budget, instructions',
          )
          .eq('business_id', business.id)
          .maybeSingle()

        if (error) {
          throw error
        }

        if (!data) {
          throw new Error(
            'Для текущего business_id не найдена строка ai_rules. Проверьте наличие настроек и политику RLS SELECT.',
          )
        }

        const loaded = {
          active: data.active ?? true,
          tone: data.tone ?? 'friendly',
          qualify: flagsFromStoredValue(
            QUALIFY_FIELDS,
            data.qualification_fields,
          ),
          handoff: flagsFromStoredValue(HANDOFF_RULES, data.handoff_rules),
          budgetThreshold: String(data.handoff_budget ?? 8000),
          instructions: data.instructions ?? DEFAULT_INSTRUCTIONS,
        }

        if (active) {
          setBusinessId(business.id)
          setSettings(copySettings(loaded))
          setLoadedSettings(copySettings(loaded))
          setSavedFlash(false)
        }
      } catch (error) {
        if (active) {
          setLoadingError(
            error.message || 'Не удалось загрузить настройки AI.',
          )
        }
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    loadSettings()

    return () => {
      active = false
    }
  }, [loadAttempt])

  useEffect(() => {
    if (!savedFlash) {
      return undefined
    }

    const timer = window.setTimeout(() => setSavedFlash(false), 2800)
    return () => window.clearTimeout(timer)
  }, [savedFlash])

  const updateSettings = (updater) => {
    setSettings((previous) => updater(previous))
    setSavedFlash(false)
    setSaveError('')
  }

  const setTone = (tone) =>
    updateSettings((previous) => ({ ...previous, tone }))

  const toggleQualify = (id) =>
    updateSettings((previous) => ({
      ...previous,
      qualify: { ...previous.qualify, [id]: !previous.qualify[id] },
    }))

  const toggleHandoff = (id) =>
    updateSettings((previous) => ({
      ...previous,
      handoff: { ...previous.handoff, [id]: !previous.handoff[id] },
    }))

  const handleReset = () => {
    if (!loadedSettings) {
      return
    }

    setSettings(copySettings(loadedSettings))
    setSavedFlash(false)
    setSaveError('')
  }

  const handleSave = async (event) => {
    event.preventDefault()
    if (!businessId || !loadedSettings || saving) {
      return
    }

    const budget = Number(settings.budgetThreshold)
    if (!Number.isFinite(budget) || budget < 0) {
      setSaveError('Порог бюджета должен быть числом не меньше нуля.')
      setSavedFlash(false)
      return
    }

    const payload = {
      active: settings.active,
      tone: settings.tone,
      qualification_fields: QUALIFY_FIELDS.filter(
        ({ id }) => settings.qualify[id],
      ).map(({ id }) => id),
      handoff_rules: Object.fromEntries(
        HANDOFF_RULES.map(({ id }) => [id, settings.handoff[id] === true]),
      ),
      handoff_budget: budget,
      instructions: settings.instructions,
    }

    setSaving(true)
    setSaveError('')
    setSavedFlash(false)

    try {
      const { data, error } = await supabase
        .from('ai_rules')
        .update(payload)
        .eq('business_id', businessId)
        .select(
          'business_id, active, tone, qualification_fields, handoff_rules, handoff_budget, instructions',
        )
        .maybeSingle()

      if (error) {
        throw error
      }

      if (!data) {
        throw new Error(
          'Supabase обновил 0 строк. Проверьте, что строка ai_rules существует для этого business_id и что RLS разрешает пользователю SELECT и UPDATE этой строки.',
        )
      }

      const saved = {
        active: data.active ?? true,
        tone: data.tone ?? 'friendly',
        qualify: flagsFromStoredValue(
          QUALIFY_FIELDS,
          data.qualification_fields,
        ),
        handoff: flagsFromStoredValue(HANDOFF_RULES, data.handoff_rules),
        budgetThreshold: String(data.handoff_budget ?? 8000),
        instructions: data.instructions ?? DEFAULT_INSTRUCTIONS,
      }

      setSettings(copySettings(saved))
      setLoadedSettings(copySettings(saved))
      setSavedFlash(true)
    } catch (error) {
      setSaveError(error.message || 'Не удалось сохранить настройки AI.')
    } finally {
      setSaving(false)
    }
  }

  const hasChanges =
    loadedSettings !== null &&
    JSON.stringify(settings) !== JSON.stringify(loadedSettings)
  const previewReply = PREVIEW_DIALOG.replies[settings.tone]
  const toneLabel = TONES.find((tone) => tone.id === settings.tone)?.label

  if (loading) {
    return (
      <div className="ai-rules__state" role="status">
        <span className="ai-rules__spinner" aria-hidden="true" />
        Загружаем настройки AI…
      </div>
    )
  }

  if (loadingError || !loadedSettings) {
    return (
      <div className="ai-rules__state ai-rules__state--error" role="alert">
        <p>{loadingError || 'Настройки AI недоступны.'}</p>
        <button
          type="button"
          className="ai-rules__reset"
          onClick={() => setLoadAttempt((attempt) => attempt + 1)}
        >
          Повторить загрузку
        </button>
      </div>
    )
  }

  return (
    <form className="ai-rules" onSubmit={handleSave}>
      <div className="ai-rules__grid">
        <div className="ai-rules__main">
          <Card className="ai-rules__card ai-rules__card--active">
            <div className="ai-rules__active">
              <div className="ai-rules__active-copy">
                <span className="ai-rules__chip">
                  <Sparkles size={13} strokeWidth={1.9} aria-hidden="true" />
                  {settings.active ? 'Онлайн' : 'Выключен'}
                </span>
                <h2 className="ai-rules__active-title">AI-ассистент активен</h2>
                <p className="ai-rules__active-text">
                  Когда переключатель включён, ассистент отвечает клиентам в
                  Telegram по правилам ниже.
                </p>
              </div>

              <Switch
                checked={settings.active}
                label="AI-ассистент активен"
                onChange={() =>
                  updateSettings((previous) => ({
                    ...previous,
                    active: !previous.active,
                  }))
                }
              />
            </div>
          </Card>

          <Card className="ai-rules__card">
            <SectionHeader
              icon={MessageSquareText}
              title="Тон общения"
              hint="Выберите один вариант — так ассистент будет отвечать клиентам."
            />

            <div className="ai-rules__tones" role="radiogroup" aria-label="Тон общения">
              {TONES.map((tone) => {
                const selected = settings.tone === tone.id

                return (
                  <button
                    key={tone.id}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    className={
                      selected
                        ? 'ai-rules__tone ai-rules__tone--selected'
                        : 'ai-rules__tone'
                    }
                    onClick={() => setTone(tone.id)}
                  >
                    <span className="ai-rules__radio" aria-hidden="true" />
                    <span className="ai-rules__tone-copy">
                      <span className="ai-rules__tone-label">{tone.label}</span>
                      <span className="ai-rules__tone-hint">{tone.hint}</span>
                    </span>
                  </button>
                )
              })}
            </div>
          </Card>

          <Card className="ai-rules__card">
            <SectionHeader
              icon={ClipboardList}
              accent="blue"
              title="Что должен узнать AI"
              hint="Поля, которые ассистент собирает до передачи менеджеру."
            />

            <div className="ai-rules__qualify">
              {QUALIFY_FIELDS.map((field) => {
                const enabled = settings.qualify[field.id]

                return (
                  <label
                    key={field.id}
                    className={
                      enabled
                        ? 'ai-rules__check ai-rules__check--on'
                        : 'ai-rules__check'
                    }
                  >
                    <input
                      type="checkbox"
                      className="ai-rules__native"
                      checked={enabled}
                      onChange={() => toggleQualify(field.id)}
                    />
                    <span className="ai-rules__box" aria-hidden="true">
                      {enabled ? <Check size={12} strokeWidth={2.6} /> : null}
                    </span>
                    <span>{field.label}</span>
                  </label>
                )
              })}
            </div>
          </Card>

          <Card className="ai-rules__card">
            <SectionHeader
              icon={Handshake}
              accent="cyan"
              title="Правила передачи менеджеру"
              hint="Когда ассистент останавливает диалог и вызывает человека."
            />

            <ul className="ai-rules__handoff">
              {HANDOFF_RULES.map((rule) => {
                const enabled = settings.handoff[rule.id]
                const isBudget = rule.id === 'budgetAbove'

                return (
                  <li key={rule.id} className="ai-rules__handoff-row">
                    <div className="ai-rules__handoff-main">
                      <span className="ai-rules__handoff-label">{rule.label}</span>
                      <Switch
                        checked={enabled}
                        label={rule.label}
                        onChange={() => toggleHandoff(rule.id)}
                      />
                    </div>

                    {isBudget ? (
                      <label className="ai-rules__budget">
                        <Wallet size={14} strokeWidth={1.9} aria-hidden="true" />
                        <span className="ai-rules__budget-caption">Порог бюджета</span>
                        <input
                          type="number"
                          min="0"
                          step="100"
                          className="ai-rules__budget-input"
                          value={settings.budgetThreshold}
                          disabled={!enabled}
                          onChange={(event) =>
                            updateSettings((previous) => ({
                              ...previous,
                              budgetThreshold: event.target.value,
                            }))
                          }
                          aria-label="Порог бюджета в BYN"
                        />
                        <span className="ai-rules__budget-unit">BYN</span>
                      </label>
                    ) : null}
                  </li>
                )
              })}
            </ul>
          </Card>

          <Card className="ai-rules__card">
            <SectionHeader
              icon={FileText}
              title="Инструкции для AI"
              hint="Системный промпт. Ассистент следует этим правилам в каждом диалоге."
            />

            <textarea
              className="ai-rules__textarea"
              value={settings.instructions}
              onChange={(event) =>
                updateSettings((previous) => ({
                  ...previous,
                  instructions: event.target.value,
                }))
              }
              rows={8}
              aria-label="Инструкции для AI"
            />
          </Card>

        </div>

        <aside className="ai-rules__aside">
          <Card className="ai-rules__card ai-rules__preview">
            <SectionHeader
              icon={Eye}
              accent="blue"
              title="Предпросмотр"
              hint="Пример ответа при текущем тоне общения."
            />

            <div
              className={
                settings.active
                  ? 'ai-rules__preview-stage'
                  : 'ai-rules__preview-stage ai-rules__preview-stage--off'
              }
            >
              <div className="ai-rules__preview-meta">
                <span className="ai-rules__preview-badge">
                  <Bot size={13} strokeWidth={1.9} aria-hidden="true" />
                  {settings.active ? `Тон: ${toneLabel}` : 'Ассистент выключен'}
                </span>
              </div>

              <div className="ai-preview-msg ai-preview-msg--client">
                <span className="ai-preview-msg__author">Клиент</span>
                <span className="ai-preview-msg__bubble">{PREVIEW_DIALOG.client}</span>
              </div>

              <div className="ai-preview-msg ai-preview-msg--ai">
                <span className="ai-preview-msg__author">AI</span>
                <span className="ai-preview-msg__bubble">
                  {settings.active
                    ? previewReply
                    : 'Ассистент выключен. Сообщения ждут ответа менеджера.'}
                </span>
              </div>
            </div>

            <p className="ai-rules__preview-note">
              <CircleHelp size={13} strokeWidth={1.9} aria-hidden="true" />
              Это демонстрационный диалог. Реальные ответы зависят от инструкций
              и собранных полей.
            </p>
          </Card>
        </aside>
      </div>

      {saveError ? (
        <p className="ai-rules__error" role="alert">
          {saveError}
        </p>
      ) : null}

      <div className="ai-rules__actions">
        <span
          className={
            hasChanges
              ? 'ai-rules__save-state ai-rules__save-state--dirty'
              : 'ai-rules__save-state'
          }
          role="status"
          aria-live="polite"
        >
          {hasChanges
            ? 'Есть несохранённые изменения'
            : 'Все изменения сохранены'}
        </span>

        <div className="ai-rules__action-buttons">
          <button
            type="button"
            className="ai-rules__reset"
            onClick={handleReset}
            disabled={!hasChanges || saving}
          >
            <RotateCcw size={15} strokeWidth={1.9} aria-hidden="true" />
            Сбросить
          </button>

          <button
            type="submit"
            className="ai-rules__save"
            disabled={!hasChanges || saving}
          >
            {saving ? (
              <span className="ai-rules__button-spinner" aria-hidden="true" />
            ) : (
              <Save size={15} strokeWidth={1.9} aria-hidden="true" />
            )}
            {saving
              ? 'Сохраняем…'
              : savedFlash
                ? 'Настройки сохранены'
                : 'Сохранить настройки'}
          </button>
        </div>
      </div>
    </form>
  )
}

export default AiRulesPage
