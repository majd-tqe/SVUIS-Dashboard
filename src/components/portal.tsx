import { useId, type ReactNode, type CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowUpRight, ChevronDown, Inbox, RefreshCw, Search, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Skeleton } from './ui/skeleton';
import { cn } from '@/lib/utils';

export function PageHeader({ title, description, action }: { title: string; description?: string; action?: ReactNode }) {
  return <div className="page-heading"><div><h1>{title}</h1>{description && <p>{description}</p>}</div>{action}</div>;
}
export function RefreshButton({ onClick, busy }: { onClick: () => void; busy?: boolean }) {
  const { t } = useTranslation();
  return <Button variant="outline" size="sm" onClick={onClick} disabled={busy}><RefreshCw size={15} className={busy ? 'animate-spin' : ''} /><span>{t('ui.refresh')}</span></Button>;
}
export function Panel({ title, description, action, children, className }: { title?: string; description?: string; action?: ReactNode; children: ReactNode; className?: string }) {
  return <section className={cn('panel', className)}>{(title || action) && <div className="panel-heading"><div><h2>{title}</h2>{description && <p>{description}</p>}</div>{action}</div>}{children}</section>;
}
export function TextLink({ to, children }: { to: string; children: ReactNode }) {
  return <Link to={to} className="text-link">{children}<ArrowUpRight size={15} className="rtl:-scale-x-100" /></Link>;
}
export function EmptyState({ title, description }: { title?: string; description?: string }) {
  const { t } = useTranslation();
  return <div className="empty-state"><span className="state-icon"><Inbox size={22} /></span><h3>{title || t('common.noData')}</h3>{description && <p>{description}</p>}</div>;
}
export function ErrorState({ retry }: { retry?: () => void }) {
  const { t } = useTranslation();
  return <div role="alert" className="empty-state"><span className="state-icon text-destructive"><AlertCircle size={22} /></span><h3>{t('ui.loadError')}</h3><p>{t('ui.loadErrorHint')}</p>{retry && <Button variant="outline" size="sm" onClick={retry}><RefreshCw size={14} />{t('common.retry')}</Button>}</div>;
}
export function LoadingBlock({ rows = 4 }: { rows?: number }) {
  const { t } = useTranslation();
  return <div className="space-y-4 p-6" role="status" aria-label={t('common.loading')}>{Array.from({ length: rows }, (_, i) => <div className="flex items-center gap-4" key={i}><Skeleton className="h-9 w-9 shrink-0" /><div className="flex-1 space-y-2"><Skeleton className="h-3 w-2/3" /><Skeleton className="h-2 w-1/3" /></div><Skeleton className="h-5 w-12" /></div>)}</div>;
}
export function SearchField({ value, onChange, placeholder }: { value: string; onChange: (value: string) => void; placeholder: string }) {
  return <div className="search-field"><Search size={17} aria-hidden="true" /><input type="search" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} aria-label={placeholder} /></div>;
}
export function FilterSelect({ label, value, onChange, options, disabled, placeholder }: { label: string; value: string; onChange: (value: string) => void; options: { value: string; label: string }[]; disabled?: boolean; placeholder?: string }) {
  const id = useId();
  return <div className="filter-select"><label htmlFor={id}>{label}</label><div><select id={id} value={value} onChange={e => onChange(e.target.value)} disabled={disabled}>{placeholder && <option value="">{placeholder}</option>}{options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}</select><ChevronDown size={15} aria-hidden="true" /></div></div>;
}
export function Metrics({ items }: { items: { label: string; value: ReactNode; note?: ReactNode }[] }) {
  return <div className="metrics" style={{ '--metric-count': items.length } as CSSProperties}>{items.map((item, i) => <div className="metric" key={i}><span className="metric-label">{item.label}</span><div className="metric-value">{item.value}</div>{item.note && <span className="metric-note"><bdi>{item.note}</bdi></span>}</div>)}</div>;
}
export function Status({ value }: { value: string }) {
  const { t } = useTranslation();
  const normalized = value.toLowerCase();
  const map: Record<string, [string, string]> = {
    p: ['success', 'grades.passed'], f: ['danger', 'grades.failed'], r: ['neutral', 'grades.enrolled'],
    e: ['info', 'ui.exempt'], i: ['neutral', 'ui.incomplete'], d: ['neutral', 'ui.dropped'], w: ['neutral', 'ui.withdrawn'],
    paid: ['success', 'payments.paid'], completed: ['success', 'payments.paid'], pending: ['warning', 'payments.pending'],
    failed: ['danger', 'payments.failed'], cancelled: ['neutral', 'ui.cancelled'],
    archive: ['neutral', 'assessments.archive'], done: ['success', 'assessments.done'], checking: ['warning', 'assessments.checking'],
  };
  const item = map[normalized];
  return <span className={'status-pill ' + (item?.[0] || 'neutral')}><span aria-hidden="true" />{item ? t(item[1]) : value || '—'}</span>;
}
