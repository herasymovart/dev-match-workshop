import { NavLink, Outlet } from 'react-router-dom';

export function Layout() {
  return (
    <>
      <header className="nav">
        <NavLink to="/" className="brand">DevMatch</NavLink>
        <nav>
          <NavLink to="/">Catalog</NavLink>
          <NavLink to="/my/projects">My projects</NavLink>
          <NavLink to="/my/applications">My applications</NavLink>
          <NavLink to="/login">Sign in</NavLink>
        </nav>
      </header>
      <main className="page">
        <Outlet />
      </main>
    </>
  );
}
