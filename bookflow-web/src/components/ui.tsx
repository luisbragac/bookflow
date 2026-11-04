import { createContext, useCallback, useContext, useEffect, useRef, useState, type ButtonHTMLAttributes, type ReactNode } from "react";
import { AlertTriangle, CheckCircle2, Loader2, XCircle } from "lucide-react";

export const card = "rounded-lg border border-line bg-white";
export const inputCls =
  "w-full rounded-md border border-line bg-white px-3 py-2 text-sm placeholder:text-muted/60 aria-[invalid=true]:border-danger";

type BtnProps = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "ghost" | "danger"; loading?: boolean };
const variants = {
  primary: "bg-spruce-700 text-white hover:bg-spruce-900",
  ghost: "border border-line bg-white text-ink hover:bg-spruce-100",
  danger: "bg-danger text-white hover:brightness-90",
};
export function Button({ variant = "primary", loading, children, disabled, className = "", ...p }: BtnProps) {
  return (
    <button
      {...p}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 rounded-md px-3.5 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${variants[variant]} ${className}`}
    >
      {loading && <Loader2 className="size-4 animate-spin" aria-hidden />}
      {children}
    </button>
  );
}

export function PageHeader({ title, subtitle, actions }: { title: string; subtitle?: string; actions?: ReactNode }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="font-display text-4xl font-semibold tracking-tight">{title}</h1>
        {subtitle && <p className="mt-1 max-w-prose text-muted">{subtitle}</p>}
      </div>
      <div className="flex gap-2">{actions}</div>
    </div>
  );
}

export function Badge({ ok }: { ok: boolean }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${ok ? "bg-spruce-100 text-spruce-700" : "bg-brass-soft text-[#7a5614]"}`}>
      <span className={`size-1.5 rounded-full ${ok ? "bg-spruce-700" : "bg-brass"}`} aria-hidden />
      {ok ? "Disponível" : "Indisponível"}
    </span>
  );
}

export function Loading({ label = "Carregando…" }: { label?: string }) {
  return (
    <div role="status" className="flex items-center justify-center gap-2 py-24 text-muted">
      <Loader2 className="size-5 animate-spin" aria-hidden /> {label}
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div role="alert" className={`${card} mx-auto max-w-md p-8 text-center`}>
      <AlertTriangle className="mx-auto mb-3 size-8 text-danger" aria-hidden />
      <h2 className="font-display text-xl font-semibold">Algo deu errado</h2>
      <p className="mt-1 text-sm text-muted">{message}</p>
      {onRetry && <Button className="mt-5" onClick={onRetry}>Tentar novamente</Button>}
    </div>
  );
}

export function EmptyState({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="mx-auto max-w-md px-4 py-16 text-center">
      <h2 className="font-display text-2xl font-semibold">{title}</h2>
      <div className="mt-2 text-sm text-muted">{children}</div>
    </div>
  );
}

export function Field({ id, label, error, hint, required, children }: { id: string; label: string; error?: string; hint?: string; required?: boolean; children: ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-sm font-medium">
        {label} {required && <span className="text-danger" aria-hidden>*</span>}
      </label>
      {children}
      {error ? <p id={`${id}-msg`} className="mt-1 text-sm text-danger">{error}</p> : hint && <p id={`${id}-msg`} className="mt-1 text-xs text-muted">{hint}</p>}
    </div>
  );
}

export function ConfirmDialog({ open, title, message, confirmLabel, busy, onConfirm, onCancel }: {
  open: boolean; title: string; message: string; confirmLabel: string; busy?: boolean; onConfirm: () => void; onCancel: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);
  return (
    <dialog
      ref={ref}
      onCancel={(e) => { e.preventDefault(); if (!busy) onCancel(); }}
      className="pop m-auto w-[min(26rem,92vw)] rounded-xl p-6 shadow-xl backdrop:bg-ink/40"
    >
      <h2 className="font-display text-xl font-semibold">{title}</h2>
      <p className="mt-2 text-sm text-muted">{message}</p>
      <div className="mt-6 flex justify-end gap-2">
        <Button variant="ghost" onClick={onCancel} disabled={busy}>Cancelar</Button>
        <Button variant="danger" onClick={onConfirm} loading={busy}>{confirmLabel}</Button>
      </div>
    </dialog>
  );
}

type Toast = { id: number; kind: "success" | "error"; text: string };
const ToastCtx = createContext<(kind: Toast["kind"], text: string) => void>(() => {});
export const useToast = () => ({ notify: useContext(ToastCtx) });

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Toast[]>([]);
  const notify = useCallback((kind: Toast["kind"], text: string) => {
    const id = Date.now() + Math.random();
    setItems((t) => [...t, { id, kind, text }]);
    setTimeout(() => setItems((t) => t.filter((x) => x.id !== id)), 4500);
  }, []);
  return (
    <ToastCtx.Provider value={notify}>
      {children}
      <div aria-live="polite" className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        {items.map((t) => (
          <div key={t.id} className="pop flex max-w-sm items-start gap-2 rounded-md bg-ink px-4 py-3 text-sm text-white shadow-lg">
            {t.kind === "success" ? <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-spruce-100" aria-hidden /> : <XCircle className="mt-0.5 size-4 shrink-0 text-brass-soft" aria-hidden />}
            {t.text}
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}
