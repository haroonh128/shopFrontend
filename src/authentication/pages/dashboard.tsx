type Course = {
  id: string;
  title: string;
  imageUrl: string;
  badge: "FREE" | "PAID";
  rating: number;
  duration: string;
  teacher: string;
  students: string;
  showBuyNow?: boolean;
};

const courses: Course[] = [
  {
    id: "1",
    title: "Bootstrap 5 Beginner Course",
    imageUrl: "https://picsum.photos/seed/bootstrap/640/360",
    badge: "FREE",
    rating: 4.8,
    duration: "10 Months",
    teacher: "Jimmy Morris",
    students: "+120",
  },
  {
    id: "2",
    title: "WordPress Development Course",
    imageUrl: "https://picsum.photos/seed/wordpress/640/360",
    badge: "FREE",
    rating: 4.6,
    duration: "8 Months",
    teacher: "Sarah Chen",
    students: "+86",
  },
  {
    id: "3",
    title: "Complete UI / UX Bootcamp",
    imageUrl: "https://picsum.photos/seed/uiux/640/360",
    badge: "FREE",
    rating: 4.9,
    duration: "6 Months",
    teacher: "Alex Rivera",
    students: "+200",
    showBuyNow: true,
  },
];

function CourseCard({ course }: { course: Course }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-lg bg-theme-cardbg shadow-[0_1px_20px_0_rgba(69,90,100,0.08)] dark:bg-themedark-cardbg dark:shadow-none">
      <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden">
        <img
          src={course.imageUrl}
          alt=""
          className="size-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          loading="lazy"
        />
        <span className="absolute right-3 top-3 rounded-full bg-black/65 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-white">
          {course.badge}
        </span>
        {course.showBuyNow ? (
          <div className="absolute inset-x-0 bottom-0 flex justify-center pb-4 pt-8 bg-gradient-to-t from-black/50 to-transparent">
            <button
              type="button"
              className="flex items-center gap-2 rounded-md bg-[#12332e] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_8px_24px_rgba(20,150,127,0.4)] transition hover:bg-[#1c463f] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#14967f]"
            >
              <i className="pi pi-shopping-cart text-[0.9rem]" aria-hidden />
              Buy Now
            </button>
          </div>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h2 className="text-base font-bold leading-snug text-[#333333] dark:text-themedark-headings">
          {course.title}
        </h2>

        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-1 text-sm text-[#666666] dark:text-themedark-secondarytextcolor">
            <i className="pi pi-star-fill text-[#FFD700]" aria-hidden />
            <span>{course.rating.toFixed(1)}</span>
          </div>
          <button
            type="button"
            className="inline-flex rounded p-1 text-[#999999] transition hover:bg-theme-bodybg hover:text-[#333333] dark:hover:bg-themedark-cardbg dark:hover:text-themedark-headings focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
            aria-label="Edit course"
          >
            <i className="pi pi-pencil" aria-hidden />
          </button>
        </div>

        <dl className="mt-4 space-y-0 divide-y divide-[#EEEEEE] dark:divide-themedark-border text-sm">
          <div className="flex justify-between gap-4 py-2.5">
            <dt className="text-[#999999] dark:text-themedark-sidebarcaption">
              Duration
            </dt>
            <dd className="font-medium text-[#555555] dark:text-themedark-bodycolor">
              {course.duration}
            </dd>
          </div>
          <div className="flex justify-between gap-4 py-2.5">
            <dt className="text-[#999999] dark:text-themedark-sidebarcaption">
              Teacher
            </dt>
            <dd className="font-medium text-[#555555] dark:text-themedark-bodycolor">
              {course.teacher}
            </dd>
          </div>
          <div className="flex justify-between gap-4 py-2.5">
            <dt className="text-[#999999] dark:text-themedark-sidebarcaption">
              Students
            </dt>
            <dd className="font-medium text-[#555555] dark:text-themedark-bodycolor">
              {course.students}
            </dd>
          </div>
        </dl>

        <div className="mt-auto pt-5">
          <button
            type="button"
            className="rounded border border-[#14967f] bg-transparent px-4 py-2 text-sm font-medium text-[#14967f] transition hover:bg-[#14967f]/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#14967f]"
          >
            Read More
          </button>
        </div>
      </div>
    </article>
  );
}

export default function Dashboard() {
  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-xl font-bold text-[#333333] dark:text-themedark-headings">
          Course
        </h1>
        <button
          type="button"
          className="inline-flex w-full items-center justify-center rounded-md bg-[#14967f] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:brightness-105 active:brightness-95 sm:w-auto focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#14967f]"
        >
          Add Student
        </button>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {courses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </div>
  );
}
