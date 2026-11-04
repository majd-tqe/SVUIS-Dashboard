import { useLocation, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, Github, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Preferences } from './Preferences';
import { navigation } from './Sidebar';

export function Header({ onMenuToggle, menuOpen }: { onMenuToggle: () => void; menuOpen: boolean }) {
  const { t } = useTranslation();
  const location = useLocation();
  const page = navigation.flatMap(g => g.items).find(item => item.to === location.pathname);
  return <header className="app-header"><div className="flex min-w-0 items-center gap-3"><Button variant="ghost" size="icon" className="lg:hidden" onClick={onMenuToggle} aria-expanded={menuOpen} aria-controls="main-navigation" aria-label={t('ui.openMenu')}><Menu size={20} /></Button><Link to="/" className="hidden text-muted-foreground sm:inline">{t('app.subtitle')}</Link><ChevronLeft size={13} className="hidden text-muted-foreground ltr:rotate-180 sm:block" /><span className="truncate font-medium">{t(location.pathname === '/studies' ? 'nav.studies' : page?.key || 'nav.dashboard')}</span></div><div className="flex shrink-0 items-center gap-1"><Button asChild variant="ghost" size="icon"><a href="https://github.com/majd-tqe/SVUIS-Dashboard" target="_blank" rel="noopener noreferrer" aria-label={t('common.github')} title={t('common.github')}><Github size={18} /></a></Button><Preferences /></div></header>;
}
