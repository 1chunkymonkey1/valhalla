import { useMemo } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import ValhallaHub from './components/mosaic/ValhallaHub'
import CompanySitePage from './pages/CompanySitePage'
import ProductDetailPage from './pages/ProductDetailPage'
import PressPage from './pages/PressPage'
import FlowPage from './pages/FlowPage'
import AdminPage from './pages/AdminPage'
import PageEditorPage from './pages/PageEditorPage'
import TeamLoginPage from './pages/TeamLoginPage'
import TeamJoinPage from './pages/TeamJoinPage'
import TeamWorkspacePage from './pages/TeamWorkspacePage'
import {
  ContactPage,
  ConsumersPage,
  InvestorsPage,
  PartnersPage,
  RoadmapIndexPage,
} from './pages/AudiencePages'
import { GRID_ORDER } from './lib/companies'
import { resolveProductHost } from './lib/productHost'

function HostProductGate({ children }) {
  const hostProduct = useMemo(
    () => resolveProductHost(typeof window !== 'undefined' ? window.location.hostname : ''),
    [],
  )

  if (hostProduct) {
    return (
      <ProductDetailPage
        companyId={hostProduct.companyId}
        productSlug={hostProduct.slug}
      />
    )
  }

  return children
}

export default function App() {
  return (
    <BrowserRouter>
      <HostProductGate>
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
          <Route path="/admin/editor" element={<Navigate to="/admin/editor/hub" replace />} />
          <Route path="/admin/editor/:pageId" element={<PageEditorPage />} />
          <Route path="/team" element={<TeamWorkspacePage />} />
          <Route path="/team/login" element={<TeamLoginPage />} />
          <Route path="/team/join" element={<TeamJoinPage />} />
          {GRID_ORDER.map((id) => (
            <Route key={id} path={`/${id}`} element={<CompanySitePage slug={id} />} />
          ))}
          {GRID_ORDER.map((id) => (
            <Route
              key={`${id}-product`}
              path={`/${id}/:productSlug`}
              element={<ProductDetailPage companyId={id} />}
            />
          ))}
        </Routes>
      </HostProductGate>
    </BrowserRouter>
  )
}
