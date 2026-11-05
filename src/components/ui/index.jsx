'use client';
import { forwardRef, useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Eye, EyeOff, Inbox } from 'lucide-react';
import { cn } from '@/lib/utils';

const variants = { primary: 'btn-primary', secondary: 'btn-white', danger: 'btn-danger', ghost: 'btn-ghost', 'ghost-danger': 'btn-ghost-danger' };
const sizes = { md: '', sm: 'btn-sm', icon: 'btn-sm btn-icon' };

export function Button({ variant = 'primary', size = 'md', loading, className, children, disabled, type = 'button', ...props }) {
  return (
    <button type={type} disabled={disabled || loading}
      className={cn('btn d-inline-flex align-items-center justify-content-center gap-2', variants[variant], sizes[size], className)} {...props}>
      {loading && <span className="spinner-border spinner-border-sm" aria-hidden="true" />}
      {children}
    </button>
  );
}

function Field({ label, error, children }) {
  return (
    <label className="d-block w-100">
      {label && <span className="form-label d-block">{label}</span>}
      {children}
      {error && <span className="invalid-feedback d-block">{error}</span>}
    </label>
  );
}

export const Input = forwardRef(function Input({ label, error, className, ...props }, ref) {
  return <Field label={label} error={error}><input ref={ref} className={cn('form-control', error && 'is-invalid', className)} {...props} /></Field>;
});

export const PasswordInput = forwardRef(function PasswordInput({ label, error, className, ...props }, ref) {
  const [show, setShow] = useState(false);
  return (
    <Field label={label} error={error}>
      <div className="input-group">
        <input ref={ref} type={show ? 'text' : 'password'} className={cn('form-control', error && 'is-invalid', className)} {...props} />
        <button type="button" className="btn btn-white" tabIndex={-1} onClick={() => setShow((s) => !s)} aria-label={show ? 'Hide password' : 'Show password'}>
          {show ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
    </Field>
  );
});

export const Textarea = forwardRef(function Textarea({ label, error, className, ...props }, ref) {
  return <Field label={label} error={error}><textarea ref={ref} rows={3} className={cn('form-control', error && 'is-invalid', className)} {...props} /></Field>;
});

export const Select = forwardRef(function Select({ label, error, className, children, ...props }, ref) {
  return <Field label={label} error={error}><select ref={ref} className={cn('form-select', error && 'is-invalid', className)} {...props}>{children}</select></Field>;
});

export const Card = ({ className, children }) => <div className={cn('card shadow-sm', className)}>{children}</div>;

const tones = { indigo: 'bg-primary-subtle text-primary-emphasis', teal: 'bg-success-subtle text-success-emphasis' };
export const Badge = ({ children, tone = 'indigo', className }) => (
  <span className={cn('badge rounded-pill', tones[tone], className)}>{children}</span>
);

export const Spinner = ({ size = 20, className }) => (
  <div className={cn('spinner-border text-primary', className)} style={{ width: size, height: size }} role="status"><span className="visually-hidden">Loading…</span></div>
);

export const Skeleton = ({ height = 16, className }) => (
  <div className="placeholder-glow"><span className={cn('placeholder d-block w-100 rounded-3', className)} style={{ height }} /></div>
);

export function TableSkeleton({ rows = 6, cols = 5 }) {
  return (
    <div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="d-flex gap-4 px-4 py-3 border-bottom">
          {Array.from({ length: cols }).map((__, j) => <div key={j} className="flex-fill"><Skeleton height={14} /></div>)}
        </div>
      ))}
    </div>
  );
}

export function EmptyState({ title = 'Nothing here yet', description, action }) {
  return (
    <div className="d-flex flex-column align-items-center text-center px-3 py-5">
      <div className="rounded-circle bg-light p-3 mb-3"><Inbox size={24} className="text-secondary" /></div>
      <p className="fw-semibold small mb-1">{title}</p>
      {description && <p className="text-secondary small mb-0" style={{ maxWidth: 320 }}>{description}</p>}
      {action && <div className="mt-3">{action}</div>}
    </div>
  );
}

export function Modal({ open, onClose, title, children, size = 'md' }) {
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <>
      <div className="modal-backdrop fade show" />
      <div className="modal fade show d-block" tabIndex={-1} role="dialog" aria-modal="true"
        onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
        <div className={cn('modal-dialog modal-dialog-centered modal-dialog-scrollable', size === 'lg' && 'modal-lg')}>
          <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '1rem' }}>
            <div className="modal-header px-4">
              <h5 className="modal-title fs-6 fw-semibold">{title}</h5>
              <button type="button" className="btn-close" aria-label="Close" onClick={onClose} />
            </div>
            <div className="modal-body p-4">{children}</div>
          </div>
        </div>
      </div>
    </>
  );
}

export function ConfirmDialog({ open, onClose, onConfirm, loading, title, message, confirmLabel = 'Delete' }) {
  return (
    <Modal open={open} onClose={onClose} title={title}>
      <p className="text-secondary small mb-0">{message}</p>
      <div className="d-flex justify-content-end gap-2 mt-4">
        <Button variant="secondary" onClick={onClose}>Cancel</Button>
        <Button variant="danger" loading={loading} onClick={onConfirm}>{confirmLabel}</Button>
      </div>
    </Modal>
  );
}

export function Pagination({ meta, onPage }) {
  if (!meta || meta.total === 0) return null;
  const { page, limit, total, totalPages } = meta;
  const from = (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);
  const start = Math.max(1, Math.min(page - 2, totalPages - 4));
  const pages = [];
  for (let i = start; i <= Math.min(totalPages, start + 4); i += 1) pages.push(i);

  return (
    <div className="d-flex flex-column flex-sm-row align-items-center justify-content-between gap-2 border-top px-4 py-3">
      <small className="text-secondary">Showing <b>{from}–{to}</b> of <b>{total}</b></small>
      <ul className="pagination pagination-sm mb-0">
        <li className={cn('page-item', !meta.hasPrev && 'disabled')}>
          <button type="button" className="page-link" onClick={() => onPage(page - 1)} aria-label="Previous page"><ChevronLeft size={14} /></button>
        </li>
        {pages.map((p) => (
          <li key={p} className={cn('page-item', p === page && 'active')}>
            <button type="button" className="page-link" onClick={() => onPage(p)}>{p}</button>
          </li>
        ))}
        <li className={cn('page-item', !meta.hasNext && 'disabled')}>
          <button type="button" className="page-link" onClick={() => onPage(page + 1)} aria-label="Next page"><ChevronRight size={14} /></button>
        </li>
      </ul>
    </div>
  );
}
