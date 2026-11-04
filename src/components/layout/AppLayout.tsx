import { useCallback, useEffect, useRef, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

export function AppLayout() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);
  const location = useLocation();
  const main = useRef<HTMLElement>(null);
  useEffect(() => { main.current?.scrollTo(0, 0); }, [location.pathname]);
  return <div className="app-shell"><a href="#main-content" className="skip-link">{t('ui.skip')}</a><Sidebar open={open} onClose={close} /><div className="app-body"><Header onMenuToggle={() => setOpen(v => !v)} menuOpen={open} /><main id="main-content" ref={main} className="app-main" tabIndex={-1}><div className="page-container"><Outlet /></div><footer className="app-footer"><span>{t('ui.footer')}</span><span>SVU Student Portal</span></footer></main></div></div>;
}
