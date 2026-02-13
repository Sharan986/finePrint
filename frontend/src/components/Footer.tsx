import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-black border-t border-zinc-800 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="inline-block mb-4">
              <span className="text-xl font-bold text-white">
                fine<span className="text-blue-400">Print</span>
              </span>
            </Link>
            <p className="text-white/50 text-sm max-w-md">
              Making ingredient labels understandable for everyone. Scan, learn, and make informed decisions about what you consume.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-medium mb-4">Product</h4>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-white/50 hover:text-white text-sm transition-colors">
                  How it works
                </Link>
              </li>
              <li>
                <Link href="#" className="text-white/50 hover:text-white text-sm transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link href="#" className="text-white/50 hover:text-white text-sm transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-medium mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-white/50 hover:text-white text-sm transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="text-white/50 hover:text-white text-sm transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="#" className="text-white/50 hover:text-white text-sm transition-colors">
                  Disclaimer
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-zinc-800 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/40 text-sm">
            © {new Date().getFullYear()} finePrint. All rights reserved.
          </p>
          <p className="text-white/40 text-xs text-center md:text-right">
            Educational information only. Not intended as medical advice.
          </p>
        </div>
      </div>
    </footer>
  );
}
