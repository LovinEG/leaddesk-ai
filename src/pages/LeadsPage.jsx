import { useMemo, useState } from 'react'

import LeadsTable from '../components/leads/LeadsTable.jsx'
import LeadsToolbar from '../components/leads/LeadsToolbar.jsx'
import {
  FILTER_ALL,
  LEAD_SOURCES,
  LEAD_STATUSES,
  MOCK_LEADS,
  filterLeads,
} from '../lib/leads.js'
import './LeadsPage.css'

const INITIAL_FILTERS = { query: '', status: FILTER_ALL, source: FILTER_ALL }

function LeadsPage() {
  const [filters, setFilters] = useState(INITIAL_FILTERS)

  const leads = useMemo(() => filterLeads(MOCK_LEADS, filters), [filters])

  const handleFilterChange = (field, value) =>
    setFilters((prev) => ({ ...prev, [field]: value }))

  const handleReset = () => setFilters(INITIAL_FILTERS)

  return (
    <div className="leads-page">
      <LeadsToolbar
        filters={filters}
        onChange={handleFilterChange}
        onReset={handleReset}
        statuses={LEAD_STATUSES}
        sources={LEAD_SOURCES}
        total={MOCK_LEADS.length}
        shown={leads.length}
      />

      <LeadsTable leads={leads} />
    </div>
  )
}

export default LeadsPage
