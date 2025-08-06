import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/classNames"

const CustomNav: QuartzComponent = ({ displayClass }: QuartzComponentProps) => {
  const navItems = [
    { text: "🏠 Acasă", link: "/" },
    { text: "📝 Articole", link: "/articole" },
    { text: "💭 Gânduri", link: "/ganduri" },
    { text: "📖 Blog", link: "/blog" },
    { text: "🚀 Proiectele", link: "/proiecte" },
    { text: "👤 Despre", link: "/despre" },
  ]

  return (
    <div id="custom-nav" className={classNames(displayClass, "custom-nav")}>
      <h3>Navigație</h3>
      <ul>
        {navItems.map((item, index) => (
          <li key={index}>
            <a href={item.link} data-for={item.link}>
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}

CustomNav.css = `
.custom-nav {
  background-color: var(--light);
  border: 1px solid var(--lightgray);
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
}

.custom-nav h3 {
  font-size: 1rem;
  margin: 0 0 0.75rem 0;
  color: var(--darkgray);
  font-weight: 600;
  border-bottom: 1px solid var(--lightgray);
  padding-bottom: 0.5rem;
}

.custom-nav ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

.custom-nav li {
  margin-bottom: 0.25rem;
}

.custom-nav a {
  display: block;
  padding: 0.5rem 0.75rem;
  color: var(--darkgray);
  text-decoration: none;
  border-radius: 4px;
  font-size: 0.9rem;
  transition: all 0.2s ease;
}

.custom-nav a:hover {
  background-color: var(--highlight);
  color: var(--secondary);
  transform: translateX(2px);
}

.custom-nav a:active,
.custom-nav a[aria-current="page"] {
  background-color: var(--secondary);
  color: var(--light);
}

/* Dark mode adjustments */
:root[saved-theme="dark"] .custom-nav {
  background-color: var(--darkgray);
  border-color: var(--gray);
}

:root[saved-theme="dark"] .custom-nav h3 {
  color: var(--light);
  border-bottom-color: var(--gray);
}

:root[saved-theme="dark"] .custom-nav a {
  color: var(--light);
}

:root[saved-theme="dark"] .custom-nav a:hover {
  background-color: var(--highlight);
  color: var(--tertiary);
}
`

export default (() => CustomNav) satisfies QuartzComponentConstructor