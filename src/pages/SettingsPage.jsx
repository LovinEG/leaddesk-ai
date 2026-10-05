import {
  Bell,
  Bot,
  Building2,
  Check,
  Clock,
  Database,
  History,
  Link2,
  Quote,
  RefreshCw,
  RotateCcw,
  Save,
  Send,
  ShieldCheck,
  Trash2,
  Unplug,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import Card from '../components/ui/Card.jsx'
import {
  COMPANY_FIELDS,
  FOLLOWUP_PREVIEW,
  NOTIFICATION_ITEMS,
  createDefaultSettings,
} from '../lib/settings.js'
import { getCurrentBusiness } from '../lib/business.js'
import { supabase } from '../lib/supabase.js'
import './SettingsPage.css'
function Switch({ checked, onChange, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      className={checked ? 'settings-switch settings-switch--on' : 'settings-switch'}
      onClick={onChange}
    >
      <span className="settings-switch__thumb" />
    </button>
  )
}
function SectionHeader({ icon: Icon, title, hint, accent = 'violet' }) {
  return (
    <header className="settings__head">
      <span
        className={`settings__head-icon settings__head-icon--${accent}`}
        aria-hidden="true"
      >
        <Icon size={15} strokeWidth={1.9} />
      </span>
      <div className="settings__head-copy">
        <h2 className="settings__title">{title}</h2>
        {hint ? <p className="settings__hint">{hint}</p> : null}
      </div>
    </header>
  )
}
function Field({ label, value, onChange, type = 'text', span = false, min }) {
  return (
    <label
      className={span ? 'settings__field settings__field--span' : 'settings__field'}
    >
      <span className="settings__label">{label}</span>
      <input
        type={type}
        className="settings__input"
        value={value}
        min={min}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  )
}
function SettingsPage() {
  const [settings, setSettings] = useState(null)
  const [isTelegramConnected, setIsTelegramConnected] = useState(false)
  const [savedState, setSavedState] = useState(null)
  const [business, setBusiness] = useState(null)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [saveError, setSaveError] = useState('')
  const [saving, setSaving] = useState(false)
  const [reloadKey, setReloadKey] = useState(0)
  const [flash, setFlash] = useState(false)
  const [clearState, setClearState] = useState('idle')

  useEffect(() => {
    let active = true

    async function loadSettings() {
      setLoading(true)
      setLoadError('')

      try {
        const currentBusiness = await getCurrentBusiness()
        const { data: businessSettings, error } = await supabase
          .from('business_settings')
          .select(
            'business_id, telegram_connected, telegram_username, notifications, followup_enabled, followup_delay_minutes, followup_max_attempts',
          )
          .eq('business_id', currentBusiness.id)
          .single()

        if (error) {
          throw error
        }

        const defaults = createDefaultSettings()
        const loadedSettings = {
          company: {
            name: currentBusiness.name ?? '',
            city: currentBusiness.city ?? '',
            phone: currentBusiness.phone ?? '',
            telegram: currentBusiness.telegram_username ?? '',
            hours: currentBusiness.working_hours ?? '',
          },
          telegramUsername:
            businessSettings.telegram_username ??
            currentBusiness.telegram_username ??
            '',
          notifications: {
            ...defaults.notifications,
            ...(businessSettings.notifications ?? {}),
          },
          followUp: {
            enabled: businessSettings.followup_enabled,
            minutes: businessSettings.followup_delay_minutes,
            attempts: businessSettings.followup_max_attempts,
          },
        }
        const loadedTelegramConnected = businessSettings.telegram_connected

        if (active) {
          setBusiness(currentBusiness)
          setSettings(loadedSettings)
          setIsTelegramConnected(loadedTelegramConnected)
          setSavedState({
            settings: loadedSettings,
            isTelegramConnected: loadedTelegramConnected,
          })
        }
      } catch (error) {
        if (active) {
          setLoadError(error.message || 'Не удалось загрузить настройки.')
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
  }, [reloadKey])

  useEffect(() => {
    if (!flash) {
      return undefined
    }
    const timer = window.setTimeout(() => setFlash(false), 2800)
    return () => window.clearTimeout(timer)
  }, [flash])
  const setCompany = (key, value) =>
    setSettings((prev) => ({
      ...prev,
      company: { ...prev.company, [key]: value },
    }))
  const toggleNotification = (id) =>
    setSettings((prev) => ({
      ...prev,
      notifications: { ...prev.notifications, [id]: !prev.notifications[id] },
    }))
  const setFollowUp = (patch) =>
    setSettings((prev) => ({
      ...prev,
      followUp: { ...prev.followUp, ...patch },
    }))

  const handleCancel = () => {
    if (!savedState) {
      return
    }

    setSettings(savedState.settings)
    setIsTelegramConnected(savedState.isTelegramConnected)
    setSaveError('')
    setClearState('idle')
    setFlash(false)
  }

  const handleSave = async (event) => {
    event.preventDefault()
    if (!business || !settings) {
      return
    }

    setSaving(true)
    setSaveError('')
    setFlash(false)

    let companySaved = false

    try {
      const { data: updatedBusiness, error: businessError } = await supabase
        .from('businesses')
        .update({
          name: settings.company.name,
          city: settings.company.city,
          phone: settings.company.phone,
          telegram_username: settings.company.telegram,
          working_hours: settings.company.hours,
        })
        .eq('id', business.id)
        .select('id')
        .maybeSingle()

      if (businessError) {
        throw businessError
      }

      if (!updatedBusiness) {
        throw new Error('Нет доступа к обновлению данных компании.')
      }

      companySaved = true

      const { data: updatedSettings, error: settingsError } = await supabase
        .from('business_settings')
        .update({
          telegram_connected: isTelegramConnected,
          telegram_username: settings.company.telegram,
          notifications: settings.notifications,
          followup_enabled: settings.followUp.enabled,
          followup_delay_minutes: Number(settings.followUp.minutes),
          followup_max_attempts: Number(settings.followUp.attempts),
        })
        .eq('business_id', business.id)
        .select('business_id')
        .maybeSingle()

      if (settingsError) {
        throw settingsError
      }

      if (!updatedSettings) {
        throw new Error('Нет доступа к обновлению настроек бизнеса.')
      }

      const savedSettings = {
        ...settings,
        telegramUsername: settings.company.telegram,
      }

      setSettings(savedSettings)
      setSavedState({
        settings: savedSettings,
        isTelegramConnected,
      })
      setFlash(true)
    } catch (error) {
      const message = error.message || 'Не удалось сохранить настройки.'
      setSaveError(
        companySaved
          ? `Данные компании сохранены, но настройки не сохранены: ${message}`
          : message,
      )
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="settings__state" role="status">
        <span className="settings__spinner" aria-hidden="true" />
        Загружаем настройки компании…
      </div>
    )
  }

  if (loadError || !settings) {
    return (
      <div className="settings__state settings__state--error" role="alert">
        <p>{loadError || 'Настройки компании недоступны.'}</p>
        <button
          type="button"
          className="settings__btn"
          onClick={() => setReloadKey((key) => key + 1)}
        >
          Повторить загрузку
        </button>
      </div>
    )
  }

  const integrationsCount = isTelegramConnected ? 1 : 0

  return (
    <form className="settings" onSubmit={handleSave}>
      {saveError ? (
        <p className="settings__error" role="alert">
          {saveError}
        </p>
      ) : null}
      {flash ? (
        <p className="settings__toast" role="status">
          <Check size={15} strokeWidth={2.2} aria-hidden="true" />
          Настройки сохранены
        </p>
      ) : null}
      <div className="settings__grid">
        <div className="settings__main">
          <Card className="settings__card">
            <SectionHeader
              icon={Building2}
              title="Компания"
              hint="Данные компании используются в диалогах и профиле."
            />
            <div className="settings__fields">
              {COMPANY_FIELDS.map((field) => (
                <Field
                  key={field.key}
                  label={field.label}
                  type={field.type || 'text'}
                  span={field.span || false}
                  value={settings.company[field.key]}
                  onChange={(value) => setCompany(field.key, value)}
                />
              ))}
            </div>
          </Card>
          {/*__MORE_MAIN__*/}
          <Card className="settings__card">
            <SectionHeader
              icon={Bell}
              title="Уведомления"
              hint="Какие события требуют вашего внимания."
            />
            <div className="settings__rows">
              {NOTIFICATION_ITEMS.map((item) => (
                <div className="settings__row" key={item.id}>
                  <span className="settings__row-label">{item.label}</span>
                  <Switch
                    checked={settings.notifications[item.id] === true}
                    label={item.label}
                    onChange={() => toggleNotification(item.id)}
                  />
                </div>
              ))}
            </div>
          </Card>
          <Card className="settings__card">
            <SectionHeader
              icon={Clock}
              title="Follow-up"
              hint="AI возвращает диалог, когда клиент перестал отвечать."
            />
            <div className="settings__row">
              <span className="settings__row-label">
                Автоматический follow-up включён
              </span>
              <Switch
                checked={settings.followUp.enabled === true}
                label="Автоматический follow-up включён"
                onChange={() =>
                  setFollowUp({ enabled: !settings.followUp.enabled })
                }
              />
            </div>
            <div className="settings__followup-fields">
              <Field
                label="Через сколько минут писать повторно"
                type="number"
                min="0"
                value={settings.followUp.minutes}
                onChange={(value) => setFollowUp({ minutes: value })}
              />
              <Field
                label="Максимум попыток"
                type="number"
                min="1"
                value={settings.followUp.attempts}
                onChange={(value) => setFollowUp({ attempts: value })}
              />
            </div>
            <div className="settings__preview">
              <Quote size={14} strokeWidth={1.9} aria-hidden="true" />
              <div className="settings__preview-copy">
                <span className="settings__preview-label">
                  Пример follow-up сообщения
                </span>
                <p className="settings__preview-text">{FOLLOWUP_PREVIEW}</p>
              </div>
            </div>
          </Card>
        </div>
        <div className="settings__aside">
          <Card className="settings__card">
            <SectionHeader
              icon={Bot}
              title="Telegram"
              hint="Канал, через который AI отвечает клиентам."
              accent="cyan"
            />
            <div className="settings__tg">
              <span className="settings__tg-icon" aria-hidden="true">
                <Send size={17} strokeWidth={1.9} />
              </span>
              <div className="settings__tg-copy">
                <span className="settings__tg-name">
                  {settings.telegramUsername || 'Telegram не указан'}
                </span>
                <span
                  className={
                    isTelegramConnected
                      ? 'settings__status settings__status--on'
                      : 'settings__status settings__status--off'
                  }
                >
                  <span className="settings__status-dot" aria-hidden="true" />
                  {isTelegramConnected ? 'Подключено' : 'Отключено'}
                </span>
              </div>
            </div>
            <div className="settings__tg-actions">
              <button
                type="button"
                className="settings__btn"
                disabled={!isTelegramConnected}
                onClick={() => setIsTelegramConnected(false)}
              >
                <Unplug size={15} strokeWidth={1.9} aria-hidden="true" />
                Отключить
              </button>
              <button
                type="button"
                className="settings__btn"
                onClick={() => setIsTelegramConnected(true)}
              >
                <RefreshCw size={15} strokeWidth={1.9} aria-hidden="true" />
                Переподключить
              </button>
            </div>
          </Card>
          <Card className="settings__card">
            <SectionHeader
              icon={ShieldCheck}
              title="Данные и безопасность"
              hint="Прозрачность хранения и контроль demo-данных."
            />
            <ul className="settings__data">
              <li className="settings__data-row">
                <span className="settings__data-key">
                  <History size={14} strokeWidth={1.9} aria-hidden="true" />
                  История сообщений
                </span>
                <span className="settings__data-value">хранится</span>
              </li>
              <li className="settings__data-row">
                <span className="settings__data-key">
                  <Database size={14} strokeWidth={1.9} aria-hidden="true" />
                  AI-логи
                </span>
                <span className="settings__data-value">включены</span>
              </li>
              <li className="settings__data-row">
                <span className="settings__data-key">
                  <Clock size={14} strokeWidth={1.9} aria-hidden="true" />
                  Последняя синхронизация
                </span>
                <span className="settings__data-value">сегодня</span>
              </li>
              <li className="settings__data-row">
                <span className="settings__data-key">
                  <Link2 size={14} strokeWidth={1.9} aria-hidden="true" />
                  Активных интеграций
                </span>
                <span className="settings__data-value">{integrationsCount}</span>
              </li>
            </ul>
            {clearState === 'idle' ? (
              <button
                type="button"
                className="settings__danger"
                onClick={() => setClearState('confirm')}
              >
                <Trash2 size={15} strokeWidth={1.9} aria-hidden="true" />
                Очистить demo-данные
              </button>
            ) : null}
            {clearState === 'confirm' ? (
              <div className="settings__confirm">
                <p className="settings__confirm-text">
                  Удалить demo-данные проекта? Это действие нельзя отменить.
                </p>
                <div className="settings__confirm-actions">
                  <button
                    type="button"
                    className="settings__danger"
                    onClick={() => setClearState('done')}
                  >
                    Очистить
                  </button>
                  <button
                    type="button"
                    className="settings__btn"
                    onClick={() => setClearState('idle')}
                  >
                    Отмена
                  </button>
                </div>
              </div>
            ) : null}
            {clearState === 'done' ? (
              <p className="settings__done" role="status">
                <Check size={15} strokeWidth={2.2} aria-hidden="true" />
                Demo-данные очищены
              </p>
            ) : null}
          </Card>
        </div>
      </div>
      <div className="settings__actions">
        <button
          type="button"
          className="settings__reset"
          onClick={handleCancel}
        >
          <RotateCcw size={15} strokeWidth={1.9} aria-hidden="true" />
          Отменить изменения
        </button>
        <button type="submit" className="settings__save" disabled={saving}>
          <Save size={15} strokeWidth={1.9} aria-hidden="true" />
          {saving ? 'Сохраняем…' : 'Сохранить настройки'}
        </button>
      </div>
    </form>
  )
}

export default SettingsPage
