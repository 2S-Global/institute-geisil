import { Link } from "react-router-dom";
export default function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="h-9 w-9 rounded-lg bg-primary-foreground text-primary flex items-center justify-center font-bold">
              G
            </div>
            <span className="font-bold">GEISIL</span>
          </div>
          <p className="text-sm opacity-80">
            Global Employability Information Services India Limited.
          </p>
        </div>
        <div>
          <h4 className="font-semibold mb-3">Company</h4>
          <ul className="space-y-2 text-sm opacity-80">
            <li>
              <a href="#about" className="hover:opacity-100">
                About
              </a>
            </li>
            <li>
              <Link to="/blog-list" className="hover:opacity-100">
                Blog
              </Link>
            </li>
            <li>
              <a href="#contact" className="hover:opacity-100">
                Contact
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-3">Product</h4>
          <ul className="space-y-2 text-sm opacity-80">
            <li>
              <a href="#services" className="hover:opacity-100">
                Services
              </a>
            </li>
            <li>
              <a href="#clients" className="hover:opacity-100">
                Clients
              </a>
            </li>
            <li>
              <a href="#testimonials" className="hover:opacity-100">
                Testimonials
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-3">Get started</h4>
          <ul className="space-y-2 text-sm opacity-80">
            <li>
              <Link to="/login" className="hover:opacity-100">
                Log in
              </Link>
            </li>
            <li>
              <Link to="/register" className="hover:opacity-100">
                Register
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-primary-foreground/15">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 text-xs opacity-70 text-center">
          © {new Date().getFullYear()} GEISIL. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
