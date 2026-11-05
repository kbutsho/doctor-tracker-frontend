export default function PageHeader({ title, subtitle, action }) {
  return (
    <div className="d-flex flex-column flex-sm-row align-items-sm-center justify-content-between gap-3 mb-4">
      <div>
        <h1 className="h3 fw-bold mb-1">{title}</h1>
        {subtitle && <p className="text-secondary small mb-0">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
