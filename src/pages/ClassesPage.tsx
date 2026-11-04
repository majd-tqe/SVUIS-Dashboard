import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useClasses } from '@/hooks/use-api';
import { PageHeader, RefreshButton, SearchField, EmptyState, ErrorState, LoadingBlock, FilterSelect, Panel } from '@/components/portal';
import { session } from '@/lib/format';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export function ClassesPage() {
  const { t, i18n }=useTranslation();
  const query=useClasses();
  const [search,setSearch]=useState(''),[day,setDay]=useState('all');
  const days=[...new Set(query.data?.map(c=>c.sessionTime?.split('_')[0]).filter((v):v is string=>!!v)||[])];
  const classes=query.data?.filter(c=>(day==='all'||c.sessionTime?.startsWith(day+'_'))&&(c.course+' '+c.class+' '+c.tutor).toLowerCase().includes(search.toLowerCase()))||[];
  return <div className="page-stack"><PageHeader title={t('classes.title')} description={t('ui.classesHint')} action={<RefreshButton busy={query.isFetching} onClick={()=>query.refetch()}/>}/>
    <Panel><div className="toolbar border-b-0"><SearchField value={search} onChange={setSearch} placeholder={t('ui.classSearch')}/><FilterSelect value={day} onChange={setDay} label={t('ui.day')} options={[{value:'all',label:t('ui.allDays')},...days.map(value=>({value,label:session(value,i18n.language).day}))]}/><span className="ms-auto self-center text-xs text-muted-foreground">{t('ui.courseCount',{count:classes.length})}</span></div></Panel>
    <Panel>
      {query.isLoading ? <LoadingBlock rows={5}/> : query.error ? <ErrorState retry={()=>query.refetch()}/> : !classes.length ? <EmptyState title={t('ui.noMatches')} description={t('ui.changeFilters')}/> : (
        <Table>
          <TableHeader><TableRow>
            <TableHead>{t('classes.course')}</TableHead>
            <TableHead>{t('classes.term')}</TableHead>
            <TableHead>{t('classes.class')}</TableHead>
            <TableHead>{t('classes.tutor')}</TableHead>
            <TableHead>{t('classes.email')}</TableHead>
            <TableHead>{t('ui.day')}</TableHead>
            <TableHead>{t('ui.time')}</TableHead>
          </TableRow></TableHeader>
          <TableBody>{classes.map((item,i)=>{
            const time=session(item.sessionTime,i18n.language);
            return <TableRow key={item.class+i}>
              <TableCell className="min-w-[190px] font-medium">{item.course}</TableCell>
              <TableCell><bdi>{item.term||'—'}</bdi></TableCell>
              <TableCell className="whitespace-nowrap text-xs"><bdi>{item.class}</bdi></TableCell>
              <TableCell className="whitespace-nowrap">{item.tutor}</TableCell>
              <TableCell className="text-xs"><bdi>{item.email||'—'}</bdi></TableCell>
              <TableCell className="whitespace-nowrap">{time.day}</TableCell>
              <TableCell className="whitespace-nowrap"><bdi>{time.time}</bdi></TableCell>
            </TableRow>;
          })}</TableBody>
        </Table>
      )}
    </Panel>
    <p className="text-xs text-muted-foreground">{t('ui.weeklyHint')}</p>
  </div>;
}
