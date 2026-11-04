import { useEffect, useRef, useState, type FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { CalendarDays, Search } from 'lucide-react';
import { useClasses, useCurrentAverage, useExamOptions, useExams } from '@/hooks/use-api';
import { Button } from '@/components/ui/button';
import { EmptyState, ErrorState, FilterSelect, LoadingBlock, PageHeader, Panel, Status } from '@/components/portal';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { numericDate } from '@/lib/format';

export function ExamsPage() {
  const {t}=useTranslation(), options=useExamOptions(), average=useCurrentAverage(), classes=useClasses();
  const [program,setProgram]=useState(''),[term,setTerm]=useState(''),[selected,setSelected]=useState<{program:string;term:string}|null>(null);
  const touched=useRef(false);
  const query=useExams(selected?.program,selected?.term);
  useEffect(()=>{
    if(touched.current||!options.data||!average.data||!classes.data)return;
    const normalize=(value:string)=>value.trim().replace(/\s+/g,' ').toLocaleLowerCase();
    const ownProgram=options.data.programs.find(p=>p.value!=='0'&&normalize(p.label)===normalize(average.data.program));
    const termCounts=new Map<string,number>();
    classes.data.forEach(c=>{const value=normalize(c.term||'');if(value)termCounts.set(value,(termCounts.get(value)||0)+1);});
    const maxCount=Math.max(0,...termCounts.values());
    const mostFrequent=[...termCounts].filter(([,count])=>count===maxCount).map(([value])=>value);
    const ownTerms=mostFrequent.length===1 ? options.data.terms.filter(option=>normalize(option.label)===mostFrequent[0]||normalize(option.value)===mostFrequent[0]) : [];
    if(ownProgram)setProgram(ownProgram.value);
    if(ownTerms.length===1)setTerm(ownTerms[0].value);
    if(ownProgram&&ownTerms.length===1){touched.current=true;setSelected({program:ownProgram.value,term:ownTerms[0].value});}
  },[options.data,average.data,classes.data]);
  const submit=(event:FormEvent)=>{event.preventDefault();if(!program||!term)return;if(selected?.program===program&&selected?.term===term)query.refetch();else setSelected({program,term});};
  return <div className="page-stack"><PageHeader title={t('exams.title')} description={t('ui.examsHint')}/>
    <Panel><form className="toolbar border-b-0 p-6" onSubmit={submit}><div className="grid w-full flex-1 grid-cols-1 gap-4 sm:grid-cols-2"><FilterSelect label={t('exams.program')} value={program} onChange={v=>{touched.current=true;setProgram(v);}} options={options.data?.programs||[]} disabled={options.isLoading} placeholder={t('exams.selectProgram')}/><FilterSelect label={t('exams.term')} value={term} onChange={v=>{touched.current=true;setTerm(v);}} options={options.data?.terms||[]} disabled={options.isLoading} placeholder={t('exams.selectTerm')}/></div><Button type="submit" disabled={!program||!term||query.isFetching||!!options.error}><Search size={16}/>{t('ui.showSchedule')}</Button></form>{options.error&&<ErrorState retry={()=>options.refetch()}/>}</Panel>
    {!selected?<Panel><EmptyState title={t('ui.readyForExams')} description={t('exams.emptyHint')}/></Panel>:<Panel title={(options.data?.programs.find(p=>p.value===selected.program)?.label||selected.program)+' · '+(options.data?.terms.find(p=>p.value===selected.term)?.label||selected.term)} action={query.data?<span className="text-xs text-muted-foreground">{t('ui.examCount',{count:query.data.exams.length})}</span>:undefined}>
      {query.isFetching?<LoadingBlock/>:query.error?<ErrorState retry={()=>query.refetch()}/>:!query.data?.exams.length?<EmptyState title={t('ui.noExams')} description={t('ui.noExamsHint')}/>:<Table><TableHeader><TableRow><TableHead>{t('exams.course')}</TableHead><TableHead>{t('exams.date')}</TableHead><TableHead>{t('ui.time')}</TableHead><TableHead>{t('exams.duration')}</TableHead><TableHead>{t('exams.telecenter')}</TableHead></TableRow></TableHeader><TableBody>{query.data.exams.map((exam,i)=><TableRow key={i}><TableCell className="min-w-[180px]"><p className="font-medium">{exam.course}</p><p className="mt-1 text-[10px] text-muted-foreground"><bdi>{exam.class}</bdi></p></TableCell><TableCell className="whitespace-nowrap"><bdi dir="ltr">{numericDate(exam.date)}</bdi></TableCell><TableCell className="whitespace-nowrap"><bdi>{exam.startTime} – {exam.endTime}</bdi></TableCell><TableCell><bdi dir="auto">{exam.duration}</bdi></TableCell><TableCell>{exam.telecenter}</TableCell></TableRow>)}</TableBody></Table>}
    </Panel>}
  </div>;
}
