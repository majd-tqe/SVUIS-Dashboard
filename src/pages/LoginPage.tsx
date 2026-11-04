import { useState, type FormEvent } from 'react';
import { Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, BookOpen, CalendarDays, ChartNoAxesCombined, ChevronDown, Eye, EyeOff, GraduationCap, Loader2, LockKeyhole } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { UnauthorizedError } from '@/api/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Preferences } from '@/components/layout/Preferences';

export function LoginPage() {
  const { t } = useTranslation();
  const { login, isAuthenticated } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  if (isAuthenticated) return <Navigate to="/" replace />;
  const submit = async (event: FormEvent) => {
    event.preventDefault(); setError(''); setLoading(true);
    try { await login(username.trim(), password, otp || undefined); }
    catch (err) {
      const message=err instanceof Error?err.message:'';
      if (/OTP/i.test(message)) { setShowOtp(true); setError(t('ui.otpRequired')); }
      else setError(err instanceof UnauthorizedError || /Invalid username or password/i.test(message) ? t('auth.error') : message || t('common.error'));
    }
    finally { setLoading(false); }
  };
  return <div className="login-shell">
    <header className="login-top"><div className="brand"><span className="brand-symbol"><GraduationCap size={24} strokeWidth={1.6} /></span><span><strong dir="ltr">SVU<span className="text-primary">.</span></strong><small>{t('app.subtitle')}</small></span></div><Preferences /></header>
    <main className="login-main">
      <section className="login-intro"><span className="status-pill info">{t('ui.studentWorkspace')}</span><h1>{t('ui.loginHeading')}</h1><p>{t('ui.loginIntro')}</p><div className="mt-8 max-w-sm">{[{icon:ChartNoAxesCombined,title:'nav.grades',text:'ui.loginGrades'},{icon:CalendarDays,title:'nav.classes',text:'ui.loginClasses'},{icon:BookOpen,title:'nav.exams',text:'ui.loginExams'}].map(item=><div className="login-feature" key={item.title}><span><item.icon size={18} strokeWidth={1.6} /></span><div><strong>{t(item.title)}</strong><p>{t(item.text)}</p></div></div>)}</div></section>
      <section className="login-form"><h2>{t('ui.loginWelcome')}</h2><p>{t('ui.loginHint')}</p><form onSubmit={submit}>
        <div className="space-y-2"><Label htmlFor="username">{t('auth.username')}</Label><Input id="username" name="username" dir="ltr" value={username} onChange={e=>setUsername(e.target.value)} autoComplete="username" placeholder="student_123456" required disabled={loading} /></div>
        <div className="space-y-2"><Label htmlFor="password">{t('auth.password')}</Label><div className="relative"><Input id="password" name="password" dir="ltr" className="password-field" type={showPassword?'text':'password'} value={password} onChange={e=>setPassword(e.target.value)} autoComplete="current-password" required disabled={loading} /><Button type="button" variant="ghost" size="icon" className="absolute end-1 top-0.5" onClick={()=>setShowPassword(v=>!v)} aria-label={t(showPassword?'ui.hidePassword':'ui.showPassword')} aria-pressed={showPassword}>{showPassword?<EyeOff size={17}/>:<Eye size={17}/>}</Button></div></div>
        <div><button type="button" className="flex items-center gap-2 text-xs text-muted-foreground" aria-expanded={showOtp} aria-controls="otp-field" onClick={()=>setShowOtp(v=>!v)}><ChevronDown size={14} className={showOtp?'rotate-180':''}/>{t('ui.useOtp')}</button>{showOtp&&<div id="otp-field" className="mt-3 space-y-2"><Label htmlFor="otp">{t('auth.otp')}</Label><Input id="otp" dir="ltr" value={otp} onChange={e=>setOtp(e.target.value)} autoComplete="one-time-code" inputMode="numeric" disabled={loading}/></div>}</div>
        {error&&<div role="alert" className="rounded-md border border-destructive/20 bg-destructive/5 p-3 text-xs leading-6 text-destructive">{error}</div>}
        <Button type="submit" className="h-11 w-full" disabled={loading}>{loading?<Loader2 size={17} className="animate-spin"/>:null}{t(loading?'auth.loggingIn':'auth.login')}{!loading&&<ArrowLeft size={16} className="ms-auto ltr:rotate-180"/>}</Button>
      </form><div className="login-notice"><LockKeyhole size={14}/><p>{t('ui.loginPrivacy')}</p></div><p className="mt-7 border-t pt-5 text-center text-[11px] text-muted-foreground">{t('ui.unofficial')}</p></section>
    </main><footer className="px-6 py-5 text-center text-xs text-muted-foreground">{t('ui.footer')}</footer>
  </div>;
}
