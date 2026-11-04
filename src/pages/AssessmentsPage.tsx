import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, ChevronRight, Info } from 'lucide-react';
import { useAssessments } from '@/hooks/use-api';
import { EmptyState, ErrorState, FilterSelect, LoadingBlock, PageHeader, Panel, RefreshButton, SearchField, Status } from '@/components/portal';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { date, number } from '@/lib/format';

const nowrapColumns = [3, 4];

export function AssessmentsPage() {
  const {t,i18n}=useTranslation(), query=useAssessments();
  const [search,setSearch]=useState(''),[status,setStatus]=useState('all'),[page,setPage]=useState<number | null>(null);
  const filtered=query.data?.filter(a=>(status==='all'||a.status===status)&&a.course.toLowerCase().includes(search.toLowerCase()))||[];
  const pageCount=Math.max(1,Math.ceil(filtered.length/15)), currentPage=Math.min(page ?? pageCount,pageCount);
  const rows=filtered.slice((currentPage-1)*15,currentPage*15);
  const statuses=[...new Set(query.data?.map(a=>a.status)||[])];
  return <div className="page-stack"><PageHeader title={t('assessments.title')} description={t('ui.assessmentsHint')} action={<RefreshButton onClick={()=>query.refetch()} busy={query.isFetching}/>}/>
    <Panel title={t('ui.assessmentRecord')}><div className="toolbar"><SearchField value={search} onChange={v=>{setSearch(v);setPage(null);}} placeholder={t('ui.assessmentSearch')}/><FilterSelect label={t('assessments.status')} value={status} onChange={v=>{setStatus(v);setPage(null);}} options={[{value:'all',label:t('ui.allStatuses')},...statuses.map(value=>({value,label:t('assessments.'+value.toLowerCase(),{defaultValue:value})}))]}/></div>
      {query.isLoading?<LoadingBlock rows={5}/>:query.error?<ErrorState retry={()=>query.refetch()}/>:!rows.length?<EmptyState title={t('ui.noMatches')}/>:<Table className="assessments-table" nowrapColumns={nowrapColumns}><TableHeader><TableRow><TableHead>{t('assessments.course')}</TableHead><TableHead>{t('assessments.startTime')}</TableHead><TableHead>{t('assessments.endTime')}</TableHead><TableHead>{t('assessments.status')}</TableHead><TableHead>{t('assessments.score')}</TableHead></TableRow></TableHeader><TableBody>{rows.map((a,i)=><TableRow key={i}><TableCell className="min-w-[220px]"><p className="font-medium">{a.course}</p>{a.alert&&<p className="mt-1 flex items-center gap-1 text-[10px] text-amber-700 dark:text-amber-300"><Info size={11}/>{a.alert}</p>}</TableCell><TableCell className="whitespace-nowrap text-xs"><bdi dir="ltr">{date(a.startTime,i18n.language,true)}</bdi></TableCell><TableCell className="whitespace-nowrap text-xs"><bdi dir="ltr">{date(a.endTime,i18n.language,true)}</bdi></TableCell><TableCell><Status value={a.status}/></TableCell><TableCell className="font-semibold tabular-nums">{number(a.score,2)}</TableCell></TableRow>)}</TableBody></Table>}
      <div className="table-note items-center"><span>{t('ui.showing',{count:filtered.length,total:query.data?.length||0})}</span><div className="flex items-center gap-3"><Button variant="ghost" size="icon" className="h-7 w-7" aria-label={t('ui.previous')} disabled={currentPage===1} onClick={()=>setPage(currentPage-1)}><ChevronRight size={16} className="ltr:rotate-180"/></Button><span>{t('ui.pageOf',{page:currentPage,total:pageCount})}</span><Button variant="ghost" size="icon" className="h-7 w-7" aria-label={t('ui.next')} disabled={currentPage===pageCount} onClick={()=>setPage(currentPage+1)}><ChevronLeft size={16} className="ltr:rotate-180"/></Button></div></div>
    </Panel>
  </div>;
}
