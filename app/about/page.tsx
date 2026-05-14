import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { MatrixRain } from '@/components/matrix-rain'
import { Github, Twitter, Mail, ExternalLink } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col relative">
      <Header />
      
      <main className="flex-1 relative z-10 container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto">
          <div className="mb-12">
            <div className="font-mono text-sm text-primary mb-2">
              {'>'} cat ./about.txt
            </div>
            <h1 className="text-3xl md:text-4xl font-bold">About</h1>
          </div>

          <div className="space-y-8">
            {/* Bio Section */}
            <section className="border border-border rounded-lg p-6 bg-card/50">
              <h2 className="text-xl font-semibold mb-4 font-mono text-primary">
                # whoami
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Security researcher focused on reverse engineering and malware analysis. 
                I spend my time dissecting binaries, analyzing malicious code, and exploring 
                the depths of low-level systems.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                This blog serves as my personal notes and research documentation. 
                Here you&apos;ll find write-ups on CTF challenges, malware analysis reports, 
                and various security research topics.
              </p>
            </section>

            {/* Focus Areas */}
            <section className="border border-border rounded-lg p-6 bg-card/50">
              <h2 className="text-xl font-semibold mb-4 font-mono text-primary">
                # focus_areas
              </h2>
              <ul className="space-y-2 font-mono text-sm">
                <li className="flex items-center gap-2">
                  <span className="text-primary">→</span>
                  <span>Reverse Engineering (x86/x64, ARM)</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-primary">→</span>
                  <span>Malware Analysis & Unpacking</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-primary">→</span>
                  <span>Exploit Development</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-primary">→</span>
                  <span>Binary Analysis & Fuzzing</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-primary">→</span>
                  <span>CTF Competitions</span>
                </li>
              </ul>
            </section>

            {/* Tools */}
            <section className="border border-border rounded-lg p-6 bg-card/50">
              <h2 className="text-xl font-semibold mb-4 font-mono text-primary">
                # toolbox
              </h2>
              <div className="flex flex-wrap gap-2">
                {['IDA Pro', 'Ghidra', 'x64dbg', 'WinDbg', 'Radare2', 'Binary Ninja', 
                  'GDB', 'YARA', 'Volatility', 'Wireshark', 'Procmon', 'PE-bear'].map((tool) => (
                  <span 
                    key={tool}
                    className="px-3 py-1 bg-secondary text-secondary-foreground rounded text-sm font-mono"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </section>

            {/* Contact */}
            <section className="border border-border rounded-lg p-6 bg-card/50">
              <h2 className="text-xl font-semibold mb-4 font-mono text-primary">
                # contact
              </h2>
              <div className="flex flex-wrap gap-4">
                <a 
                  href="https://github.com/prathampopatiya" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-secondary hover:bg-secondary/80 rounded transition-colors"
                >
                  <Github className="h-4 w-4" />
                  <span className="font-mono text-sm">GitHub</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
                <a 
                  href="https://twitter.com/prathampopatiya" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-secondary hover:bg-secondary/80 rounded transition-colors"
                >
                  <Twitter className="h-4 w-4" />
                  <span className="font-mono text-sm">Twitter</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
                <a 
                  href="mailto:prathampopatiya17@gmail.com"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-secondary hover:bg-secondary/80 rounded transition-colors"
                >
                  <Mail className="h-4 w-4" />
                  <span className="font-mono text-sm">Email</span>
                </a>
              </div>
            </section>

            {/* PGP Key (Optional) */}
            <section className="border border-border rounded-lg p-6 bg-card/50">
              <h2 className="text-xl font-semibold mb-4 font-mono text-primary">
                # pgp_key
              </h2>
              <pre className="text-xs text-muted-foreground font-mono overflow-x-auto">
{`Fingerprint: XXXX XXXX XXXX XXXX XXXX  XXXX XXXX XXXX XXXX XXXX
Key ID: 0xXXXXXXXX`}
              </pre>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}