import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ExternalLink } from 'lucide-react';
import { usePayments } from '@/hooks/use-api';
import { EmptyState, ErrorState, FilterSelect, LoadingBlock, Metrics, PageHeader, Panel, RefreshButton, SearchField, Status } from '@/components/portal';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { number, date } from '@/lib/format';

export function PaymentsPage() {
  const {t,i18n}=useTranslation(), query=usePayments();
  const [search,setSearch]=useState(''),[status,setStatus]=useState('all'),[currency,setCurrency]=useState('all');
  const currencies=[...new Set(query.data?.map(p=>p.currency)||[])];
  const statuses=[...new Set(query.data?.map(p=>p.status)||[])];
  const filtered=query.data?.filter(p=>(status==='all'||p.status===status)&&(currency==='all'||p.currency===currency)&&(p.id+' '+p.description+' '+p.term).toLowerCase().includes(search.toLowerCase()))||[];
  const totals=filtered.reduce<Record<string,number>>((sum,p)=>({...sum,[p.currency]:(sum[p.currency]||0)+p.amount}),{});
  return <div className="page-stack"><PageHeader title={t('payments.title')} description={t('ui.paymentsHint')} action={<RefreshButton busy={query.isFetching} onClick={()=>query.refetch()}/>}/>
    <Metrics items={[{label:t('ui.paymentRecords'),value:query.data?number(query.data.length):'—',note:t('ui.allRecords')},{label:t('payments.paid'),value:query.data?number(query.data.filter(p=>['paid','completed'].includes(p.status.toLowerCase())).length):'—',note:t('ui.paymentCount')},{label:t('payments.pending'),value:query.data?number(query.data.filter(p=>p.status.toLowerCase()==='pending').length):'—',note:t('ui.paymentCount')}]}/>
    <Panel title={t('ui.transactions')}><div className="toolbar"><SearchField value={search} onChange={setSearch} placeholder={t('ui.paymentSearch')}/><FilterSelect label={t('payments.status')} value={status} onChange={setStatus} options={[{value:'all',label:t('ui.allStatuses')},...statuses.map(value=>({value,label:t('payments.'+value,{defaultValue:value})}))]}/><FilterSelect label={t('payments.currency')} value={currency} onChange={setCurrency} options={[{value:'all',label:t('ui.allCurrencies')},...currencies.map(value=>({value,label:value}))]}/></div>
      {query.isLoading?<LoadingBlock/>:query.error?<ErrorState retry={()=>query.refetch()}/>:!filtered.length?<EmptyState title={t('ui.noMatches')}/>:<Table><TableHeader><TableRow><TableHead>{t('payments.description')}</TableHead><TableHead>{t('payments.term')}</TableHead><TableHead>{t('payments.date')}</TableHead><TableHead>{t('payments.amount')}</TableHead><TableHead>{t('payments.status')}</TableHead><TableHead><span className="sr-only">{t('payments.billDetails')}</span></TableHead></TableRow></TableHeader><TableBody>{filtered.map(p=><TableRow key={p.id}><TableCell className="min-w-[180px]"><span className="block font-medium">{p.description}</span><span className="mt-1 block text-[10px] text-muted-foreground" dir="ltr">#{p.id}</span></TableCell><TableCell><bdi>{p.term}</bdi></TableCell><TableCell className="whitespace-nowrap">{date(p.date,i18n.language)}</TableCell><TableCell className="whitespace-nowrap font-semibold"><bdi>{number(p.amount)} <span className="text-[10px] font-normal text-muted-foreground">{p.currency}</span></bdi></TableCell><TableCell><Status value={p.status}/></TableCell><TableCell>{p.link&&/^https?:\/\//.test(p.link)&&<a href={p.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 whitespace-nowrap text-xs text-primary">{t('payments.billDetails')}<ExternalLink size={12}/></a>}</TableCell></TableRow>)}</TableBody></Table>}
      <div className="table-note"><span>{t('ui.showing',{count:filtered.length,total:query.data?.length||0})}</span><div className="flex flex-wrap gap-4">{Object.entries(totals).map(([code,total])=><span key={code}>{t('ui.recordedTotal')}: <bdi className="font-semibold text-foreground">{number(total)} {code}</bdi></span>)}</div></div>
    </Panel>
  </div>;
}
