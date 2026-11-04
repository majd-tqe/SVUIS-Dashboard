import { Fragment, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronDown } from 'lucide-react';
import { useCurrentAverage, useStudies } from '@/hooks/use-api';
import { EmptyState, ErrorState, FilterSelect, LoadingBlock, Metrics, PageHeader, Panel, RefreshButton, SearchField, Status, TextLink } from '@/components/portal';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { number } from '@/lib/format';

export function GradesPage() {
  const { t } = useTranslation();
  const studies=useStudies(), average=useCurrentAverage();
  const [search,setSearch]=useState(''),[term,setTerm]=useState('all'),[status,setStatus]=useState('all'),[expanded,setExpanded]=useState<string|null>(null);
  const courses=studies.data?.flatMap(semester=>semester.courses.map((c,i)=>({...c,term:c.term||semester.termCode||semester.term+' '+semester.year,id:(semester.termCode||semester.term+semester.year)+c.code+i})))||[];
  const terms=[...new Set(courses.map(c=>c.term))];
  const filtered=courses.filter(c=>(term==='all'||c.term===term)&&(status==='all'||c.status===status)&&((c.name||'')+' '+c.code).toLowerCase().includes(search.toLowerCase()));
  return <div className="page-stack"><PageHeader title={t('nav.grades')} description={t('ui.gradesHint')} action={<RefreshButton busy={studies.isFetching||average.isFetching} onClick={()=>{studies.refetch();average.refetch();}}/>}/>
    <Metrics items={[{label:t('grades.average'),value:number(average.data?.average,2),note:t('ui.officialAverage')},{label:t('grades.gpa'),value:number(average.data?.gpa,2),note:t('ui.outOfFour')},{label:t('grades.literalGrade'),value:average.data?.literalGrade||'—',note:t('ui.academicSummary')},{label:t('grades.completedHours'),value:average.data?number(average.data.chr):'—',note:t('ui.creditsNote')}]}/>
    {average.error&&<Panel><ErrorState retry={()=>average.refetch()}/></Panel>}
    <Panel title={t('ui.academicRecord')} action={<TextLink to="/studies">{t('ui.academicDetails')}</TextLink>}>
      <div className="toolbar"><SearchField value={search} onChange={setSearch} placeholder={t('ui.courseSearch')}/><FilterSelect label={t('grades.term')} value={term} onChange={setTerm} options={[{value:'all',label:t('ui.allTerms')},...terms.map(value=>({value,label:value}))]}/><FilterSelect label={t('grades.status')} value={status} onChange={setStatus} options={[{value:'all',label:t('ui.allStatuses')},...['P','F','R','E'].map(value=>({value,label:t(({P:'grades.passed',F:'grades.failed',R:'grades.enrolled',E:'ui.exempt'} as Record<string,string>)[value])}))]}/></div>
      {studies.isLoading?<LoadingBlock rows={6}/>:studies.error?<ErrorState retry={()=>studies.refetch()}/>:!filtered.length?<EmptyState title={t('ui.noMatches')} description={t('ui.changeFilters')}/>:<Table><TableHeader><TableRow><TableHead>{t('classes.course')}</TableHead><TableHead>{t('grades.term')}</TableHead><TableHead>{t('grades.chr')}</TableHead><TableHead>{t('grades.mark')}</TableHead><TableHead>{t('grades.status')}</TableHead><TableHead><span className="sr-only">{t('ui.details')}</span></TableHead></TableRow></TableHeader><TableBody>{filtered.map(course=><Fragment key={course.id}><TableRow><TableCell className="min-w-[220px]"><span className="block font-medium">{course.name||course.code}</span><span className="mt-1 inline-flex items-center gap-2 text-[10px] text-muted-foreground"><bdi>{course.code}</bdi>{course.helped&&<span className="text-amber-700 dark:text-amber-300">{t('grades.helped')}</span>}</span></TableCell><TableCell><bdi>{course.term}</bdi></TableCell><TableCell className="tabular-nums">{number(course.chr)}</TableCell><TableCell className="font-semibold tabular-nums">{number(course.mark)}</TableCell><TableCell><Status value={course.status}/></TableCell><TableCell><Button size="icon" variant="ghost" className="h-8 w-8" aria-label={t('ui.courseDetails',{course:course.code})} aria-expanded={expanded===course.id} onClick={()=>setExpanded(expanded===course.id?null:course.id)}><ChevronDown size={16} className={expanded===course.id?'rotate-180':''}/></Button></TableCell></TableRow>{expanded===course.id&&<TableRow className="hover:bg-transparent"><TableCell colSpan={6} className="p-0"><div className="course-details"><p className="text-xs font-medium">{t('ui.scoreBreakdown')}</p>{course.weights&&course.scores?<div className="score-grid">{(['e1','e2','e3','midterm','oral','practical','finalExam','total'] as const).filter(key=>course.weights![key]>0).map(key=><div className="score-item" key={key}><span>{t('components.'+key)}</span><b>{number(course.scores![key],2)} / {number(course.weights![key])}</b></div>)}</div>:<p className="mt-2 text-xs text-muted-foreground">{t('common.noData')}</p>}<p className="mt-4 text-[11px] text-muted-foreground">{t('ui.derivedGrade')}: <bdi>{course.letterGrade||'—'}</bdi></p></div></TableCell></TableRow>}</Fragment>)}</TableBody></Table>}
      <div className="table-note"><span>{t('ui.showing',{count:filtered.length,total:courses.length})}</span><span>{t('ui.statusFromSource')}</span></div>
    </Panel>
  </div>;
}
