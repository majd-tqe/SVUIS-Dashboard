import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useCurrentAverage } from '@/hooks/use-api';
import { ErrorState, EmptyState, LoadingBlock, Metrics, PageHeader, Panel, RefreshButton, SearchField, Status, TextLink } from '@/components/portal';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { number } from '@/lib/format';

export function AveragePage() {
  const {t}=useTranslation(), query=useCurrentAverage(), a=query.data;
  const [search,setSearch]=useState('');
  const courses=a?.courses.filter(c=>c.courseCode.toLowerCase().includes(search.toLowerCase()))||[];
  return <div className="page-stack"><PageHeader title={t('ui.academicDetails')} description={t('ui.averageHint')} action={<RefreshButton busy={query.isFetching} onClick={()=>query.refetch()}/>}/>
    {query.isLoading?<Panel><LoadingBlock rows={5}/></Panel>:query.error?<Panel><ErrorState retry={()=>query.refetch()}/></Panel>:!a?<EmptyState/>:<>
    <Metrics items={[{label:t('average.average'),value:number(a.average,2),note:t('ui.officialAverage')},{label:t('average.gpa'),value:number(a.gpa,2),note:t('ui.outOfFour')},{label:t('ui.passedCredits'),value:number(a.completedPass),note:t('grades.passed')},{label:t('ui.exemptCredits'),value:number(a.completedExempt),note:t('ui.exempt')}]}/>
    <Panel><div className="flex flex-wrap gap-x-10 gap-y-5 p-6">{[[t('average.program'),a.program],[t('average.specialization'),a.specialization],[t('average.studentTerm'),a.studentTerm],[t('average.literalGrade'),a.literalGrade]].map(([label,value])=><div key={label}><p className="text-[11px] text-muted-foreground">{label}</p><p className="mt-1 text-sm font-medium"><bdi>{value||'—'}</bdi></p></div>)}</div></Panel>
    <Panel title={t('average.courses')} action={<TextLink to="/grades">{t('ui.allGrades')}</TextLink>}><div className="toolbar"><SearchField value={search} onChange={setSearch} placeholder={t('ui.codeSearch')}/></div>
    {!courses.length?<EmptyState title={t('ui.noMatches')}/>:<Table><TableHeader><TableRow><TableHead>{t('average.courseCode')}</TableHead><TableHead>{t('average.status')}</TableHead><TableHead>{t('grades.chr')}</TableHead><TableHead>{t('average.mark')}</TableHead><TableHead>{t('average.term')}</TableHead><TableHead>{t('average.gpaScale')}</TableHead><TableHead>{t('average.letterGrade')}</TableHead></TableRow></TableHeader><TableBody>{courses.map((c,i)=><TableRow key={c.courseCode+c.term+i}><TableCell className="font-medium"><bdi>{c.courseCode}</bdi></TableCell><TableCell><Status value={c.status}/></TableCell><TableCell>{number(c.chr)}</TableCell><TableCell className="font-semibold">{number(c.mark,2)}</TableCell><TableCell><bdi>{c.term}</bdi></TableCell><TableCell>{number(c.gpaValue,2)}</TableCell><TableCell><bdi>{c.letterGrade||'—'}</bdi></TableCell></TableRow>)}</TableBody></Table>}
    <div className="table-note"><span>{t('ui.showing',{count:courses.length,total:a.courses.length})}</span><span>{t('ui.averageSourceNote')}</span></div></Panel></>}
  </div>;
}
