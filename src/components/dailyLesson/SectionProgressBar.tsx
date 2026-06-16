interface SectionProgressBarProps {
  sections: { title: string; icon: string }[]
  completedSections: Record<number, number>
  currentSection: number
  onJumpToSection: (idx: number) => void
}

export default function SectionProgressBar({
  sections,
  completedSections,
  currentSection,
  onJumpToSection,
}: SectionProgressBarProps) {
  return (
    <div className="flex items-center gap-1.5">
      {sections.map((s, i) => {
        const done = completedSections[i] !== undefined
        const active = i === currentSection
        return (
          <button
            key={s.title}
            className="flex-1 text-left cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => onJumpToSection(i)}
          >
            <div
              className={`h-1.5 rounded-full transition-all ${done ? 'bg-green-500' : active ? 'bg-primary-500' : 'bg-gray-200'}`}
            />
            <p
              className={`text-[11px] mt-0.5 text-center font-medium ${active ? 'text-primary-700' : done ? 'text-green-600' : 'text-gray-400'}`}
            >
              {s.icon} <span className="hidden sm:inline">{s.title}</span>
            </p>
          </button>
        )
      })}
    </div>
  )
}
