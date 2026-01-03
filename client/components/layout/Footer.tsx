export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-background/50 backdrop-blur-sm mt-auto">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              TalentSphere
            </span>
            <p className="mt-4 text-sm text-muted-foreground max-w-xs">
              Connecting top talent with the world's best companies.
              Find your next opportunity or hire your dream team today.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold tracking-wider text-foreground uppercase">
              Platform
            </h3>
            <ul className="mt-4 space-y-4">
              <li>
                <a href="#" className="text-base text-muted-foreground hover:text-primary">
                  Browse Jobs
                </a>
              </li>
              <li>
                <a href="#" className="text-base text-muted-foreground hover:text-primary">
                  For Developers
                </a>
              </li>
              <li>
                <a href="#" className="text-base text-muted-foreground hover:text-primary">
                  For Clients
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold tracking-wider text-foreground uppercase">
              Support
            </h3>
            <ul className="mt-4 space-y-4">
              <li>
                <a href="#" className="text-base text-muted-foreground hover:text-primary">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="text-base text-muted-foreground hover:text-primary">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="text-base text-muted-foreground hover:text-primary">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-border/40 pt-8 flex justify-between items-center">
          <p className="text-base text-muted-foreground">
            &copy; {new Date().getFullYear()} TalentSphere. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
