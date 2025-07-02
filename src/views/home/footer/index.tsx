export default function Footer() {
  return (
    <footer className="footer footer-center bg-base-200/60 rounded-sm p-6">
      <nav className="tw:grid tw:grid-flow-col tw:gap-4 tw:text-base-content">
        <a href="#" className="link link-hover">About</a>
        <a href="#" className="link link-hover">Contact</a>
        <a href="#" className="link link-hover">Jobs</a>
        <a href="#" className="link link-hover">Policy</a>
      </nav>
      <nav>
        <div className="flex gap-4">
          <a href="#" className="link link-animated" aria-label="Facebook Link">
            <span className="icon-[tabler--brand-facebook] size-6"></span>
          </a>
          <a href="#" className="link link-animated" aria-label="X Link">
            <span className="icon-[tabler--brand-x] size-6"></span>
          </a>
          <a href="#" className="link link-animated" aria-label="Linkedin Link">
            <span className="icon-[tabler--brand-linkedin] size-6"></span>
          </a>
        </div>
      </nav>
      <aside>
        <p>Copyright © 2024 - All right reserved by FlyonUI</p>
      </aside>
    </footer>
  );
}