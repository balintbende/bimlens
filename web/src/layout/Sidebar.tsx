import { NavLink } from 'react-router-dom';

const items = [
  { to: '/', label: 'Dashboard', end: true },
  { to: '/models', label: 'Models', end: false },
];

export default function Sidebar() {
  return (
    <nav className="border-b border-white/10 md:border-b-0 md:border-r md:w-56 shrink-0">
      <ul className="flex gap-1 p-2 md:flex-col md:p-3">
        {items.map((item) => (
          <li key={item.to}>
            <NavLink
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `block rounded-md px-3 py-2 text-sm transition-colors ${
                  isActive
                    ? 'bg-white/10 text-secondary font-medium'
                    : 'text-light hover:bg-white/5 hover:text-secondary'
                }`
              }
            >
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
