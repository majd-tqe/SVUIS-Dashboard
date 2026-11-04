import { useEffect, useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LayoutDashboard, UserRound, ChartNoAxesCombined, GraduationCap, CalendarDays, Wallet, ClipboardList, BookOpen, LogOut, X, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import { apiUrl } from '@/api/client';

export const navigation = [
  { title: 'ui.studySpace', items: [
    { to: '/', key: 'nav.dashboard', icon: LayoutDashboard },
    { to: '/grades', key: 'nav.grades', icon: ChartNoAxesCombined },
    { to: '/classes', key: 'nav.classes', icon: BookOpen },
    { to: '/exams', key: 'nav.exams', icon: CalendarDays },
    { to: '/assessments', key: 'nav.assessments', icon: ClipboardList },
  ] },
  { title: 'ui.other', items: [
    { to: '/payments', key: 'nav.payments', icon: Wallet },
    { to: '/tutors', key: 'nav.tutors', icon: GraduationCap },
    { to: '/profile', key: 'nav.profile', icon: UserRound },
  ] },
];
export function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t, i18n } = useTranslation();
  const { user, logout } = useAuth();
  const [failedPhotoId, setFailedPhotoId] = useState<number | null>(null);
  const aside = useRef<HTMLElement>(null);
  const close = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    close.current?.focus();
    const key = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
      if (event.key === 'Tab') {
        const nodes = aside.current?.querySelectorAll<HTMLElement>('a[href],button:not(:disabled)');
        if (!nodes?.length) return;
        const first = nodes[0], last = nodes[nodes.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener('keydown', key);
    return () => { document.removeEventListener('keydown', key); previous?.focus(); };
  }, [open, onClose]);
  const names = user?.names;
  const arabicName = [names?.firstAr, names?.fatherAr, names?.surnameAr].filter(Boolean).join(' ');
  const englishName = [names?.firstEn, names?.fatherEn, names?.surnameEn].filter(Boolean).join(' ');
  const name = (i18n.resolvedLanguage === 'ar' ? arabicName : englishName) || englishName || names?.fullEn || user?.username || '';
  return <>
    {open && <div className="sidebar-backdrop" onClick={onClose} />}
    <aside id="main-navigation" ref={aside} className={'sidebar ' + (open ? 'is-open' : '')} aria-label={t('ui.navigation')}>
      <div className="sidebar-brand"><NavLink to="/" onClick={onClose} className="brand"><span className="brand-symbol"><GraduationCap size={23} strokeWidth={1.6} /></span><span><strong dir="ltr">SVU<span className="text-primary">.</span></strong><small>{t('app.subtitle')}</small></span></NavLink><Button ref={close} variant="ghost" size="icon" className="lg:hidden" onClick={onClose} aria-label={t('ui.closeMenu')}><X size={19} /></Button></div>
      <div className="sidebar-workspace"><span className="workspace-dot" /><span>{t('ui.studentWorkspace')}</span></div>
      <nav className="sidebar-nav">{navigation.map(group => <div className="nav-group" key={group.title}><p>{t(group.title)}</p>{group.items.map(item => <NavLink key={item.to} to={item.to} end={item.to === '/'} onClick={onClose} className={({ isActive }) => 'nav-item ' + (isActive ? 'active' : '')}><item.icon size={18} strokeWidth={1.65} /><span>{t(item.key)}</span><span className="nav-active-dot" /></NavLink>)}</div>)}</nav>
      <div className="sidebar-bottom"><a href="https://svuis.svuonline.org/SVUIS/" target="_blank" rel="noopener noreferrer" className="official-link"><ExternalLink size={16} />{t('ui.officialPortal')}</a><div className="sidebar-user"><span className="avatar">{user?.id && failedPhotoId !== user.id ? <img src={apiUrl('/student/photo?std='+encodeURIComponent(user.id))} crossOrigin="use-credentials" alt="" onError={()=>setFailedPhotoId(user.id)}/> : name.charAt(0) || 'S'}</span><div className="min-w-0 flex-1"><strong className="block truncate">{name}</strong><small dir="ltr">{user?.username}</small></div><Button variant="ghost" size="icon" onClick={logout} aria-label={t('nav.logout')} title={t('nav.logout')}><LogOut size={17} className="rtl:-scale-x-100" /></Button></div></div>
    </aside>
  </>;
}
