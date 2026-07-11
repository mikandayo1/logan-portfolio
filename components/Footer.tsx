export default function Footer() {
  return (
    <footer className="py-7 px-6 border-t border-white/[0.05]">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        <p className="text-gray-700 text-[10px] tracking-[0.2em] uppercase">
          © {new Date().getFullYear()} Yujie &ldquo;Logan&rdquo; Luo
        </p>
        <div className="flex items-center gap-4">
          <a
            href="https://www.imdb.com/name/nm17182686/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-800 hover:text-gray-600 text-[10px] tracking-wider uppercase transition-colors duration-300"
          >
            IMDb ↗
          </a>
          <span className="w-px h-3 bg-white/[0.06]" />
          <p className="text-gray-800 text-[10px] tracking-wider uppercase">
            Editor & Cinematographer · Los Angeles
          </p>
        </div>
      </div>
    </footer>
  )
}
