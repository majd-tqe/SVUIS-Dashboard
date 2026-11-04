export function number(value: number | null | undefined, decimals?: number): string {
  return value == null || !Number.isFinite(value) ? '—' : new Intl.NumberFormat('en-US', { maximumFractionDigits: decimals ?? 2, minimumFractionDigits: decimals ?? 0 }).format(value);
}
export function date(value: string | undefined, language: string, includeTime = false): string {
  if (!value) return '—';
  let normalized = value.trim();
  const legacy = normalized.match(/^(\d{2})[-/](\d{2})[-/](\d{4})(.*)$/);
  if (legacy) normalized = legacy[3] + '-' + legacy[2] + '-' + legacy[1] + legacy[4];
  const parsed = new Date(normalized.replace(' ', 'T'));
  if (Number.isNaN(parsed.getTime())) return value;
  if (includeTime) {
    const pad = (part: number) => String(part).padStart(2, '0');
    return `${parsed.getFullYear()}-${pad(parsed.getMonth() + 1)}-${pad(parsed.getDate())} ${pad(parsed.getHours())}:${pad(parsed.getMinutes())}:${pad(parsed.getSeconds())}`;
  }
  return new Intl.DateTimeFormat(language.startsWith('ar') ? 'ar-SY-u-nu-latn' : 'en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).format(parsed);
}
export function numericDate(value: string | undefined): string {
  if (!value) return '—';
  const input = value.trim();
  const iso = input.match(/^(\d{4})-(\d{2})-(\d{2})(?:$|[T\s])/);
  if (iso) return `${iso[1]}-${iso[2]}-${iso[3]}`;
  const legacy = input.match(/^(\d{2})[-/](\d{2})[-/](\d{4})(?:$|\s)/);
  if (legacy) return `${legacy[3]}-${legacy[2]}-${legacy[1]}`;
  const parsed = new Date(input);
  if (Number.isNaN(parsed.getTime())) return value;
  const pad = (part: number) => String(part).padStart(2, '0');
  return `${parsed.getFullYear()}-${pad(parsed.getMonth() + 1)}-${pad(parsed.getDate())}`;
}
export function session(value: string | undefined, language: string): { day: string; time: string } {
  if (!value) return { day: '—', time: '—' };
  const parts = value.split('_');
  const days: Record<string, string> = { Saturday: 'السبت', Sunday: 'الأحد', Monday: 'الاثنين', Tuesday: 'الثلاثاء', Wednesday: 'الأربعاء', Thursday: 'الخميس', Friday: 'الجمعة' };
  return { day: language.startsWith('ar') ? days[parts[0]] || parts[0] : parts[0], time: parts.length >= 3 ? parts[1] + ' – ' + parts[2] : value };
}
