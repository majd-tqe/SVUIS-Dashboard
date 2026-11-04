import * as React from 'react';
import { cn } from '@/lib/utils';

interface TableProps extends React.HTMLAttributes<HTMLTableElement> {
  /** The course/name column receives all space left after sizing the other columns. */
  flexColumn?: number;
  /** Columns that must retain their unwrapped content width. */
  nowrapColumns?: number[];
}

const Table = React.forwardRef<HTMLTableElement, TableProps>(
  ({ className, children, style, flexColumn = 0, nowrapColumns, ...props }, ref) => {
    const tableRef = React.useRef<HTMLTableElement>(null);
    const containerRef = React.useRef<HTMLDivElement>(null);
    const [widths, setWidths] = React.useState<number[]>([]);
    React.useImperativeHandle(ref, () => tableRef.current!);

    React.useLayoutEffect(() => {
      const table = tableRef.current;
      const container = containerRef.current;
      if (!table || !container) return;
      let disposed = false;

      const measure = () => {
        const available = container.clientWidth;
        if (disposed || !available) return;

        // Measure the longest rendered value in each column without wrapping.
        // Exclude expanded detail rows: they span columns rather than size one.
        const natural = table.cloneNode(true) as HTMLTableElement;
        natural.querySelectorAll('colgroup').forEach(group => group.remove());
        Array.from(natural.rows).forEach(row => {
          if (Array.from(row.cells).some(cell => cell.colSpan > 1)) row.remove();
        });
        Object.assign(natural.style, {
          position: 'fixed', left: '-100000px', top: '0', visibility: 'hidden',
          width: 'max-content', maxWidth: 'none', tableLayout: 'auto', pointerEvents: 'none',
        });
        natural.setAttribute('aria-hidden', 'true');
        natural.setAttribute('inert', '');
        natural.querySelectorAll<HTMLElement>('*').forEach(element => {
          element.style.whiteSpace = 'nowrap';
          element.style.maxWidth = 'none';
        });
        natural.querySelectorAll<HTMLElement>('th,td').forEach(cell => {
          cell.style.width = 'auto';
          cell.style.minWidth = '0';
        });
        document.body.appendChild(natural);
        const cells = Array.from(natural.rows[0]?.cells || []);
        const preferred = cells.map(cell => cell.getBoundingClientRect().width);
        const minimum = cells.map((cell, index) => {
          const css = getComputedStyle(cell);
          return nowrapColumns?.includes(index) ? preferred[index] : Math.min(preferred[index], parseFloat(css.paddingLeft) + parseFloat(css.paddingRight) + parseFloat(css.fontSize) * 2);
        });
        natural.remove();
        if (!preferred.length) return;

        const flexible = Math.min(Math.max(0, flexColumn), preferred.length - 1);
        const otherTotal = preferred.reduce((sum, value, index) => sum + (index === flexible ? 0 : value), 0);
        const otherMinimum = minimum.reduce((sum, value, index) => sum + (index === flexible ? 0 : value), 0);
        const nameMinimum = Math.max(0, Math.min(240, available * .35, available - otherMinimum));
        // Keep natural widths whenever they fit. On narrow screens, shrink only
        // as needed so every column stays visible and the course name retains room.
        const ratio = otherTotal > otherMinimum
          ? Math.min(1, Math.max(0, (available - nameMinimum - otherMinimum) / (otherTotal - otherMinimum)))
          : 1;
        const next = preferred.map((value, index) => index === flexible ? 0 : minimum[index] + (value - minimum[index]) * ratio);
        next[flexible] = Math.max(0, available - next.reduce((sum, value) => sum + value, 0));
        setWidths(previous => previous.length === next.length && previous.every((value, index) => Math.abs(value - next[index]) < .5) ? previous : next);
      };

      measure();
      const observer = new ResizeObserver(measure);
      observer.observe(container);
      void document.fonts.ready.then(() => { if (!disposed) measure(); });
      return () => { disposed = true; observer.disconnect(); };
    }, [children, flexColumn, className, nowrapColumns]);

    return (
      <div ref={containerRef} className="relative w-full min-w-0">
        <table ref={tableRef} className={cn('data-table w-full caption-bottom text-sm', className)} style={{ ...style, tableLayout: widths.length ? 'fixed' : 'auto' }} {...props}>
          {widths.length > 0 && <colgroup>{widths.map((width, index) => <col key={index} style={{ width }}/> )}</colgroup>}
          {children}
        </table>
      </div>
    );
  },
);
Table.displayName = 'Table';

const TableHeader = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => (
    <thead ref={ref} className={cn('[&_tr]:border-b', className)} {...props} />
  ),
);
TableHeader.displayName = 'TableHeader';

const TableBody = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => (
    <tbody ref={ref} className={cn('[&_tr:last-child]:border-0', className)} {...props} />
  ),
);
TableBody.displayName = 'TableBody';

const TableFooter = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => (
    <tfoot ref={ref} className={cn('border-t bg-muted/50 font-medium [&>tr]:last:border-b-0', className)} {...props} />
  ),
);
TableFooter.displayName = 'TableFooter';

const TableRow = React.forwardRef<HTMLTableRowElement, React.HTMLAttributes<HTMLTableRowElement>>(
  ({ className, ...props }, ref) => (
    <tr
      ref={ref}
      className={cn('border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted', className)}
      {...props}
    />
  ),
);
TableRow.displayName = 'TableRow';

const TableHead = React.forwardRef<HTMLTableCellElement, React.ThHTMLAttributes<HTMLTableCellElement>>(
  ({ className, ...props }, ref) => (
    <th
      ref={ref}
      className={cn(
        'h-11 whitespace-nowrap bg-muted/35 px-5 text-start align-middle text-xs font-medium text-muted-foreground',
        className,
      )}
      {...props}
    />
  ),
);
TableHead.displayName = 'TableHead';

const TableCell = React.forwardRef<HTMLTableCellElement, React.TdHTMLAttributes<HTMLTableCellElement>>(
  ({ className, ...props }, ref) => (
    <td ref={ref} className={cn('px-5 py-4 text-start align-middle text-[13px]', className)} {...props} />
  ),
);
TableCell.displayName = 'TableCell';

const TableCaption = React.forwardRef<HTMLTableCaptionElement, React.HTMLAttributes<HTMLTableCaptionElement>>(
  ({ className, ...props }, ref) => (
    <caption ref={ref} className={cn('mt-4 text-sm text-muted-foreground', className)} {...props} />
  ),
);
TableCaption.displayName = 'TableCaption';

export { Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell, TableCaption };
