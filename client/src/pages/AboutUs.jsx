import { motion } from "framer-motion";
import PageShell from "../components/PageShell";

const members = [
  {
    name: "Himanshu Rawat",
    role: "Team Lead",
    image: "/himanshu.jpg",
    description:
      "Responsible for the core idea of the project and backend JavaScript development. Managed project planning, backend architecture, and feature coordination.",
  },
  {
    name: "Ayush Bhatt",
    role: "Backend & Authentication Developer",
    image: "/ayush.jpg",
    description:
      "Worked on backend integration, Python logic, authentication systems, API handling, and secure user management.",
  },
  {
    name: "Prakhar Raj Chauhan",
    role: "Frontend & Styling Developer",
    image: "/prakhar.jpg",
    description:
      "Designed the frontend interface, animations, layouts, responsive styling, and overall user experience of the project.",
  },
];

function AboutUs() {
  return (
    <PageShell>
      <section className="mb-6 text-center">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-600 dark:text-sky-300"
        >
          About Us
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="mt-2 text-3xl font-black tracking-tight text-slate-950 dark:text-white sm:text-5xl"
        >
          The team behind Expense Tracker
        </motion.h1>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300">
          A focused full-stack team building a clean, secure, and responsive personal finance experience.
        </p>
      </section>

      <section className="grid gap-5 lg:grid-cols-3">
        {members.map((member, index) => {
          return (
            <motion.article
              key={member.name}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
              whileHover={{ y: -8, scale: 1.01 }}
              className="glass group flex min-h-[360px] flex-col rounded-3xl p-6 text-center transition hover:shadow-2xl hover:shadow-sky-500/20"
            >
              <div className="mx-auto h-28 w-28 overflow-hidden rounded-full bg-gradient-to-br from-sky-600 to-cyan-400 p-1 shadow-xl shadow-sky-500/25 ring-8 ring-sky-100/70 transition group-hover:scale-105 dark:ring-sky-900/30">
                <img
                  src={member.image}
                  alt={member.name}
                  className="h-full w-full rounded-full object-cover"
                />
              </div>
              <h2 className="mt-6 text-xl font-black text-slate-950 dark:text-white">{member.name}</h2>
              <p className="mt-2 min-h-10 text-sm font-semibold text-sky-700 dark:text-sky-200">
                {member.role}
              </p>
              <p className="mt-4 flex-1 text-sm leading-6 text-slate-600 dark:text-slate-300">
                {member.description}
              </p>
            </motion.article>
          );
        })}
      </section>
    </PageShell>
  );
}

export default AboutUs;
