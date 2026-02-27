const TopNavbar = ({ title, children }) => (
  <header className="mb-6 flex flex-wrap items-center justify-between gap-4">
    <h1 className="text-2xl font-bold">{title}</h1>
    <div className="flex items-center gap-3">
      <input placeholder="Search..." className="input w-56" />
      {children}
      <div className="grid h-10 w-10 place-content-center rounded-full bg-slate-200 font-semibold dark:bg-slate-800">U</div>
    </div>
  </header>
)

export default TopNavbar
