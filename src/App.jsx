import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HubPage from './pages/HubPage'
import CompanySitePage from './pages/CompanySitePage'
import { schedule } from './data/schedule'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HubPage />} />
        {schedule.map((company) => (
          <Route
            key={company.slug}
            path={`/${company.slug}`}
            element={<CompanySitePage slug={company.slug} />}
          />
        ))}
      </Routes>
    </BrowserRouter>
  )
}
