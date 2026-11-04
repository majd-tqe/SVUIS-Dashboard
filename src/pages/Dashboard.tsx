import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowUpRight, CalendarDays, Wallet, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { useClasses, useCurrentAverage, useStudies } from '@/hooks/use-api';
import { PageHeader, Panel, TextLink, Metrics, Status, LoadingBlock, ErrorState, EmptyState, RefreshButton } from '@/components/portal';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { number, session } from '@/lib/format';

export function Dashboard() {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const average = useCurrentAverage(), studies = useStudies(), classes = useClasses();
  const firstName = (i18n.resolvedLanguage==='ar'?user?.names.firstAr:user?.names.firstEn)||user?.names.firstEn||'';
  const results = studies.data?.flatMap(term=>term.courses.map(course=>({...course,term:course.term||term.termCode||term.term+' '+term.year}))).filter(c=>['P','F'].includes(c.status)&&c.mark!==null).slice(0,5)||[];
  const refresh=()=>{average.refetch();studies.refetch();classes.refetch();};
  const stat=(value:string,loading:boolean)=>loading?<Skeleton className="my-1 h-7 w-16"/>:value;
  return <div className="page-stack">
    <PageHeader title={t('ui.hello',{name:firstName})} description={t('ui.overviewHint')} action={<RefreshButton onClick={refresh} busy={average.isFetching||studies.isFetching||classes.isFetching}/>}/>
    <Metrics items={[
      {label:t('dashboard.currentAverage'),value:<>{stat(number(average.data?.average,2),average.isLoading)}<small>/ 100</small></>,note:t('ui.officialAverage')},
      {label:t('dashboard.gpa'),value:<>{stat(number(average.data?.gpa,2),average.isLoading)}<small>/ 4.00</small></>,note:average.data?.literalGrade||t('ui.academicSummary')},
      {label:t('dashboard.completedCredits'),value:stat(average.data?number(average.data.completedPass+average.data.completedExempt):'—',average.isLoading),note:t('ui.creditsNote')},
      {label:t('ui.enrolledCourses'),value:stat(classes.data?number(classes.data.length):'—',classes.isLoading),note:classes.data?.[0]?.term||t('ui.currentClasses')},
    ]}/>
    {average.error&&<Panel><ErrorState retry={()=>average.refetch()}/></Panel>}
    <div className="dashboard-columns"><div className="space-y-6">
      <Panel title={t('ui.lectures')} description={t('ui.weeklyHint')} action={<TextLink to="/classes">{t('ui.viewAll')}</TextLink>}>
        {classes.isLoading?<LoadingBlock/>:classes.error?<ErrorState retry={()=>classes.refetch()}/>:!classes.data?.length?<EmptyState/>:<Table>
          <TableHeader><TableRow><TableHead>{t('classes.course')}</TableHead><TableHead>{t('classes.tutor')}</TableHead><TableHead>{t('ui.day')}</TableHead><TableHead>{t('ui.time')}</TableHead></TableRow></TableHeader>
          <TableBody>{classes.data.slice(0,4).map((item,index)=>{
            const time=session(item.sessionTime,i18n.language);
            return <TableRow key={item.class+index}><TableCell className="min-w-[170px] font-medium">{item.course}</TableCell><TableCell>{item.tutor}</TableCell><TableCell className="whitespace-nowrap">{time.day}</TableCell><TableCell className="whitespace-nowrap"><bdi>{time.time}</bdi></TableCell></TableRow>;
          })}</TableBody>
        </Table>}
      </Panel>
      <Panel title={t('ui.latestResults')} description={t('ui.resultsHint')} action={<TextLink to="/grades">{t('ui.allGrades')}</TextLink>}>
        {studies.isLoading?<LoadingBlock/>:studies.error?<ErrorState retry={()=>studies.refetch()}/>:!results.length?<EmptyState/>:<Table><TableHeader><TableRow><TableHead>{t('classes.course')}</TableHead><TableHead>{t('grades.mark')}</TableHead><TableHead>{t('grades.status')}</TableHead></TableRow></TableHeader><TableBody>{results.map((course,i)=><TableRow key={course.code+i}><TableCell><span className="block font-medium">{course.name||course.code}</span><span className="mt-1 block text-[10px] text-muted-foreground" dir="ltr">{course.code} · {course.term}</span></TableCell><TableCell className="font-semibold tabular-nums">{number(course.mark)}</TableCell><TableCell><Status value={course.status}/></TableCell></TableRow>)}</TableBody></Table>}
      </Panel>
    </div><div className="dashboard-side">
      <Link className="shortcut" to="/exams"><span className="shortcut-icon"><CalendarDays size={20} strokeWidth={1.6}/></span><div className="flex-1"><h3>{t('nav.exams')}</h3><p>{t('ui.examShortcut')}</p></div><ArrowLeft size={16} className="text-muted-foreground ltr:rotate-180"/></Link>
      <Link className="shortcut" to="/payments"><span className="shortcut-icon"><Wallet size={20} strokeWidth={1.6}/></span><div className="flex-1"><h3>{t('nav.payments')}</h3><p>{t('ui.paymentShortcut')}</p></div><ArrowLeft size={16} className="text-muted-foreground ltr:rotate-180"/></Link>
      <Panel><div className="student-summary"><div className="flex items-center justify-between"><h2 className="text-sm">{t('ui.yourStudy')}</h2><Link to="/profile" aria-label={t('nav.profile')} className="text-muted-foreground"><ArrowUpRight size={17} className="rtl:-scale-x-100"/></Link></div><dl><div><dt>{t('average.program')}</dt><dd>{average.data?.program||'—'}</dd></div><div><dt>{t('average.specialization')}</dt><dd>{average.data?.specialization||'—'}</dd></div><div><dt>{t('ui.registrationTerm')}</dt><dd dir="ltr">{user?.registration.term||'—'}</dd></div><div><dt>{t('ui.studentId')}</dt><dd dir="ltr">{user?.id}</dd></div></dl><div className="mt-6 border-t pt-4"><TextLink to="/studies">{t('ui.academicDetails')}</TextLink></div></div></Panel>
      <div className="px-1 text-xs leading-6 text-muted-foreground">{t('ui.sourceNote')}</div>
    </div></div>
  </div>;
}
