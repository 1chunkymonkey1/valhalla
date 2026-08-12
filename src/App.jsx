import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ValhallaHub from './components/mosaic/ValhallaHub'
import CompanySitePage from './pages/CompanySitePage'
import { GRID_ORDER } from './lib/companies'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ValhallaHub />} />
        {GRID_ORDER.map((id) => (
          <Route
            key={id}
            path={`/${id}`}
            element={<CompanySitePage slug={id} />}
          />
        ))}
      </Routes>
    </BrowserRouter>
  )
}
