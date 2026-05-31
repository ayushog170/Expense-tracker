import { motion } from "framer-motion";
import { FaEnvelope, FaUserCircle } from "react-icons/fa";
import PageShell from "../components/PageShell";

const contacts = [
  {
    name: "Himanshu Rawat",
    email: "hemurawat7693@gmail.com",
  },
  {
    name: "Ayush Bhatt",
    email: "ayushbhatt979@gmail.com",
  },
  {
    name: "Prakhar Raj Chauhan",
    email: "prakharrajchauhan90@gmail.com",
  },
];

function ContactUs() {
  return (
    <PageShell>
      <section className="mb-6 grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass rounded-3xl p-6"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-600 dark:text-sky-300">
            Contact Us
          </p>
          <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-950 dark:text-white sm:text-5xl">
            Let us know how we can help.
          </h1>
          <p className="mt-4 text-sm leading-6 text-slate-600 dark:text-slate-300">
            Reach the project contributors directly for questions about backend logic, authentication, frontend design, or project coordination.
          </p>
        </motion.div>

        <div className="grid gap-4">
          {contacts.map((contact, index) => (
            <motion.article
              key={contact.email}
              initial={{ opacity: 0, x: 18 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.08 }}
              whileHover={{ y: -5, scale: 1.01 }}
              className="glass group rounded-3xl p-5 transition hover:shadow-2xl hover:shadow-sky-500/20"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  <span className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-sky-600 to-cyan-400 text-2xl text-white shadow-lg shadow-sky-500/25 transition group-hover:scale-105">
                    <FaUserCircle />
                  </span>
                  <div>
                    <h2 className="text-lg font-black text-slate-950 dark:text-white">{contact.name}</h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Expense Tracker Team</p>
                  </div>
                </div>
                <div className="grid gap-2 text-sm">
                  <a
                    href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
                      contact.email
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 rounded-xl bg-sky-500/10 px-3 py-2 font-medium text-sky-700 transition hover:bg-sky-600 hover:text-white dark:text-sky-200"
                  >
                    <FaEnvelope />
                    {contact.email}
                  </a>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </section>
    </PageShell>
  );
}

export default ContactUs;
