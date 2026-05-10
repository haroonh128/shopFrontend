export type Pill = {
  id: string;
  label: string;
  /** When set, choosing this pill navigates here */
  to?: string;
};

export type ModuleEntry = {
  id: string;
  title: string;
  icon: string;
  pills?: Pill[];
};

export type ModuleRowProps = {
  entry: ModuleEntry;
  isActive: boolean;
  activePillId: string | null;
  onActivate: () => void;
  onPill: (pill: Pill) => void;
};

export default function ModuleRow({
  entry,
  isActive,
  activePillId,
  onActivate,
  onPill,
}: ModuleRowProps) {
  const hasPills = Boolean(entry.pills?.length);

  return (
    <article
      className={[
        "rounded-lg bg-theme-cardbg p-3 shadow-[0_1px_20px_0_rgba(69,90,100,0.08)] transition-shadow dark:bg-themedark-cardbg dark:shadow-none sm:p-3.5",
        isActive
          ? "ring-2 ring-[#00AEEF] ring-offset-1 ring-offset-theme-bodybg dark:ring-offset-themedark-bodybg"
          : "hover:shadow-[0_4px_24px_rgba(69,90,100,0.1)] dark:hover:bg-themedark-cardbg",
      ].join(" ")}
      onMouseEnter={onActivate}
      onFocus={onActivate}
    >
      <div className="flex gap-3 sm:gap-3.5">
        <div
          className={[
            "flex size-10 shrink-0 items-center justify-center rounded-md sm:size-11",
            isActive
              ? "bg-[#00AEEF] text-white"
              : "bg-[#00AEEF]/12 text-[#00AEEF] dark:bg-[#00AEEF]/20",
          ].join(" ")}
        >
          <i className={`${entry.icon} text-[0.95rem] sm:text-base`} aria-hidden />
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="text-sm font-bold leading-snug text-[#333333] dark:text-themedark-headings sm:text-[0.9375rem]">
            {entry.title}
          </h2>
          {hasPills ? (
            <div
              className="mt-2 flex flex-wrap gap-1.5"
              role="group"
              aria-label={`${entry.title} actions`}
            >
              {entry.pills!.map((pill) => {
                const pillOn = isActive && activePillId === pill.id;
                return (
                  <button
                    key={pill.id}
                    type="button"
                    onClick={() => onPill(pill)}
                    className={[
                      "rounded-full px-2 py-0.5 text-[10px] font-medium leading-tight transition sm:text-[11px]",
                      "border focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00AEEF]",
                      pillOn
                        ? "border-[#00AEEF] bg-[#00AEEF] text-white"
                        : "border-theme-border bg-transparent text-theme-bodycolor hover:border-[#00AEEF]/50 hover:bg-[#00AEEF]/10 dark:border-themedark-border dark:text-themedark-bodycolor dark:hover:border-[#00AEEF]/50",
                    ].join(" ")}
                  >
                    {pill.label}
                  </button>
                );
              })}
            </div>
          ) : null}
        </div>
      </div>
    </article>
  );
}
