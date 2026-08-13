import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ValhallaHub from './components/mosaic/ValhallaHub'
import CompanySitePage from './pages/CompanySitePage'
import PressPage from './pages/PressPage'
import FlowPage from './pages/FlowPage'
import AdminPage from './pages/AdminPage'
import {
  ContactPage,
  ConsumersPage,
  InvestorsPage,
  PartnersPage,
  RoadmapIndexPage,
} from './pages/AudiencePages'
import { GRID_ORDER } from './lib/companies'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ValhallaHub />} />
        <Route path="/press" element={<PressPage />} />
        <Route path="/flow" element={<FlowPage />} />
        <Route path="/investors" element={<InvestorsPage />} />
        <Route path="/consumers" element={<ConsumersPage />} />
        <Route path="/partners" element={<PartnersPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/roadmap" element={<RoadmapIndexPage />} />
        <Route path="/admin" element={<AdminPage />} />
        {GRID_ORDER.map((id) => (
          <Route key={id} path={`/${id}`} element={<CompanySitePage slug={id} />} />
        ))}
      </Routes>
    </BrowserRouter>
  )
}
