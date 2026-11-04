import { Languages, Moon, Sun } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/hooks/use-theme';
import { Button } from '@/components/ui/button';

export function Preferences() {
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const arabic = i18n.resolvedLanguage === 'ar';
  return <div className="flex items-center gap-1"><Button variant="ghost" size="sm" onClick={() => i18n.changeLanguage(arabic ? 'en' : 'ar')} aria-label={t('common.language')}><Languages size={16} /><span>{arabic ? 'English' : 'العربية'}</span></Button><Button variant="ghost" size="icon" onClick={toggleTheme} aria-label={theme === 'dark' ? t('common.light') : t('common.dark')} title={theme === 'dark' ? t('common.light') : t('common.dark')}>{theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}</Button></div>;
}
