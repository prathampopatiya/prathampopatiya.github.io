import { HexDecoration } from './hex-decoration'

export function Footer() {
  return (
    <footer className="border-t border-border mt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <p className="text-muted-foreground text-sm font-mono mb-2">
              <span className="text-primary">$</span> echo &quot;Built for security research&quot;
            </p>
            <p className="text-muted-foreground text-xs">
              Reverse Engineering • Malware Analysis • Exploit Development
            </p>
          </div>
          <div className="hidden md:block">
            <HexDecoration />
          </div>
        </div>
        <div className="mt-8 pt-4 border-t border-border/50 text-center">
          <p className="text-xs text-muted-foreground font-mono">
            © {new Date().getFullYear()} // All rights reserved // 
            <span className="text-primary ml-1">0x{Math.floor(Math.random() * 0xFFFFFF).toString(16).toUpperCase()}</span>
          </p>
        </div>
      </div>
    </footer>
  )
}
