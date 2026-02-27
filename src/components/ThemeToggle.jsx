const ThemeToggle = ({ darkMode, onToggle }) => (
  <button onClick={onToggle} className="btn-secondary text-sm">
    {darkMode ? 'Light Mode' : 'Dark Mode'}
  </button>
)

export default ThemeToggle
