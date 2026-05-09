export default function Footer() {
  return (
    <footer className="py-7 px-6 border-t border-white/[0.05]">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        <p className="text-gray-700 text-[10px] tracking-[0.2em] uppercase">
          © {new Date().getFullYear()} Yujie &ldquo;Logan&rdquo; Luo
        </p>
        <p className="text-gray-800 text-[10px] tracking-wider uppercase">
          Editor & Cinematographer · Los Angeles
        </p>
      </div>
    </footer>
  )
}
