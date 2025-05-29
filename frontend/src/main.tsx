import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './pages/LoginForm.tsx';
import Menu from './pages/Menu.tsx';
import UserForm from './pages/UserForm.tsx';
import ProtectedRoute from './components/ProtectedRoute.tsx';
import InvoiceForm from './pages/invoices/InvoicesForm.tsx';
import HistoryPage from './pages/HistoryList.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/menu" element={
              <ProtectedRoute>
                <Menu />
              </ProtectedRoute>
            } />
            <Route path="/createuser" element={
                <UserForm />
            } />
            <Route path="/invoicesform" element={
              <ProtectedRoute>
                <InvoiceForm/>
              </ProtectedRoute>
            } />
            <Route path = "/history" element={
              <ProtectedRoute>
                <HistoryPage />
              </ProtectedRoute>
            } />
          </Routes>
        </BrowserRouter>
  </StrictMode>
);
