import { useEffect, useState, type FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { Search } from 'lucide-react';
import { useCurrentAverage, useTutorOptions, useTutorReport } from '@/hooks/use-api';
import { EmptyState, ErrorState, FilterSelect, LoadingBlock, PageHeader, Panel } from '@/components/portal';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';

export function TutorsPage() {
  const {t}=useTranslation(), average=useCurrentAverage();
  const [pid,setPid]=useState(''),[course,setCourse]=useState(''),[term,setTerm]=useState('');
  const [selected,setSelected]=useState<{pid:string;course:string;term:string}|null>(null);
  const options=useTutorOptions(pid||undefined), query=useTutorReport(selected?.pid,selected?.course,selected?.term);
  useEffect(()=>{if(!pid&&average.data&&options.data){const own=options.data.programs.find(p=>p.label===average.data?.program);if(own)setPid(own.value);}if(!term&&options.data?.terms[0])setTerm(options.data.terms[0].value);},[options.data,average.data,pid,term]);
  const submit=(event:FormEvent)=>{event.preventDefault();if(pid&&course&&term){if(selected?.pid===pid&&selected?.course===course&&selected?.term===term)query.refetch();else setSelected({pid,course,term});}};
  return <div className="page-stack"><PageHeader title={t('tutors.title')} description={t('ui.tutorsHint')}/>
    <Panel><form className="toolbar border-b-0 p-6" onSubmit={submit}><div className="grid w-full flex-1 grid-cols-1 gap-4 sm:grid-cols-3"><FilterSelect label={t('tutors.program')} value={pid} onChange={v=>{setPid(v);setCourse('');setSelected(null);}} options={options.data?.programs||[]} placeholder={t('tutors.selectProgram')} disabled={options.isLoading}/><FilterSelect label={t('tutors.course')} value={course} onChange={setCourse} options={options.data?.courses.filter(c=>c.label!=='[]')||[]} placeholder={t('tutors.selectCourse')} disabled={!pid||options.isLoading}/><FilterSelect label={t('tutors.term')} value={term} onChange={setTerm} options={options.data?.terms||[]} placeholder={t('tutors.selectTerm')} disabled={options.isLoading}/></div><Button type="submit" disabled={!pid||!course||!term||query.isFetching||!!options.error}><Search size={16}/>{t('ui.showTutors')}</Button></form>{options.error&&<ErrorState retry={()=>options.refetch()}/>}</Panel>
    {!selected?<Panel><EmptyState title={t('ui.findTutors')} description={t('tutors.emptyHint')}/></Panel>:query.isFetching?<Panel><LoadingBlock/></Panel>:query.error?<Panel><ErrorState retry={()=>query.refetch()}/></Panel>:!query.data?.length?<Panel><EmptyState title={t('common.noData')} description={t('ui.tutorEmptyHint')}/></Panel>:query.data.map((group,i)=><Panel key={i} title={group.group} description={options.data?.courses.find(c=>c.value===selected.course)?.label}><Table><TableHeader><TableRow><TableHead>{t('tutors.class')}</TableHead><TableHead>{t('tutors.tutor')}</TableHead><TableHead>{t('tutors.percent')}</TableHead><TableHead>{t('tutors.term')}</TableHead></TableRow></TableHeader><TableBody>{group.entries.map((entry,j)=><TableRow key={j}><TableCell className="min-w-[180px]"><bdi>{entry.class}</bdi></TableCell><TableCell className="font-medium">{entry.tutor}</TableCell><TableCell><bdi>{entry.percent}</bdi></TableCell><TableCell><bdi>{entry.term}</bdi></TableCell></TableRow>)}</TableBody></Table></Panel>)}
  </div>;
}
