import { useTranslation } from 'react-i18next';
import { useProfile } from '@/hooks/use-api';
import { ErrorState, EmptyState, LoadingBlock, PageHeader, Panel, RefreshButton } from '@/components/portal';
import { number } from '@/lib/format';

function Fields({items}:{items:[string,string|number|undefined][]}) {
  return <dl className="profile-fields">{items.map(([label,value])=><div key={label}><dt>{label}</dt><dd><bdi>{value==null||value===''?'—':value}</bdi></dd></div>)}</dl>;
}
export function ProfilePage() {
  const {t,i18n}=useTranslation(), query=useProfile(), p=query.data;
  const name=(i18n.resolvedLanguage==='ar'?p?.names.fullAr:p?.names.fullEn)||p?.names.fullEn||'';
  return <div className="page-stack"><PageHeader title={t('profile.title')} description={t('ui.profileHint')} action={<RefreshButton busy={query.isFetching} onClick={()=>query.refetch()}/>}/>
    {query.isLoading?<Panel><LoadingBlock rows={6}/></Panel>:query.error?<Panel><ErrorState retry={()=>query.refetch()}/></Panel>:!p?<EmptyState/>:<>
      <div className="profile-identity"><span className="avatar">{name.charAt(0)}</span><div className="min-w-0"><h2>{name}</h2><p><bdi>{p.username}</bdi><span className="mx-2">·</span>{t('ui.studentId')} <bdi>{p.id}</bdi></p></div></div>
      <div className="profile-grid"><Panel title={t('profile.personalInfo')}><Fields items={[[t('fields.nameAr'),p.names.fullAr],[t('fields.nameEn'),p.names.fullEn],[t('fields.birthDate'),p.birth.date],[t('fields.birthPlace'),p.birth.place],[t('fields.nationality'),p.nationality],[t('fields.gender'),p.gender]]}/></Panel>
      <Panel title={t('profile.contact')}><Fields items={[[t('fields.email'),p.contact.email],[t('fields.mobile'),p.contact.mobile],[t('fields.phone'),p.contact.phone],[t('fields.country'),p.contact.country],[t('fields.city'),p.contact.city],[t('fields.address'),p.contact.address]]}/></Panel>
      <Panel title={t('profile.registration')}><Fields items={[[t('ui.registrationTerm'),p.registration.term],[t('fields.registrationDate'),p.registration.date],[t('fields.registrationStatus'),p.registration.status]]}/>{p.programs.length>0&&<div className="border-t px-6 py-5"><p className="mb-3 text-xs text-muted-foreground">{t('fields.programs')}</p><ul className="space-y-3">{p.programs.map((program,i)=><li key={i} className="text-xs leading-6">{program}</li>)}</ul></div>}</Panel>
      <Panel title={t('profile.account')}><Fields items={[[t('ui.studentId'),p.id],[t('auth.username'),p.username],[t('fields.balance'),number(p.account.balance,2)+' '+p.account.currency],[t('fields.accountStatus'),p.account.status]]}/></Panel></div>
    </>}
  </div>;
}
