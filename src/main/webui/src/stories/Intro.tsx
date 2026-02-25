import { motion } from "framer-motion";

interface IntroProps {
  duration?: number;
  children?: React.ReactNode;
}
function Intro({ duration = 0.6, children }: IntroProps) {
  return (
    <motion.div className="absolute top-0 left-0 size-full -z-10">
      <div className="relative size-full overflow-clip flex flex-col items-center justify-center">
        {/* run at the same time */}
        <motion.div // background part 1
          className="bg-accent absolute size-svw"
          variants={{
            hidden: { y: "100%", x: 0, rotate: 45 },
            visible: { y: 0, x: 0, rotate: 45 },
            exit: {
              y: "100%",
              x: 0,
              rotate: 45,
              transition: { duration, ease: "easeInOut" },
            },
          }}
          transition={{ duration, ease: "easeInOut" }}
        ></motion.div>
        <motion.div // background part 1
          className="bg-accent absolute size-full"
          variants={{
            hidden: { y: "100%", x: 0 },
            visible: { y: 0, x: 0 },
            exit: {
              y: "100%",
              x: 0,
              transition: { duration: duration / 1.5, ease: "easeInOut" },
            },
          }}
          transition={{ duration, ease: "easeInOut", delay: 0.1 }}
        ></motion.div>

        <motion.div // background part 2
          className="bg-primary absolute size-svw"
          variants={{
            hidden: { y: "100%", x: 0, rotate: -45 },
            visible: { y: 0, x: 0, rotate: -45 },
            exit: {
              y: "100%",
              x: 0,
              rotate: -45,
              transition: { duration: duration / 2, ease: "easeInOut" },
            },
          }}
          transition={{ duration, ease: "easeInOut", delay: 0.05 }}
        ></motion.div>
        <motion.div // background part 2
          className="bg-primary absolute size-full"
          variants={{
            hidden: { y: "100%", x: 0 },
            visible: { y: 0, x: 0 },
            exit: {
              y: "100%",
              x: 0,
              transition: { duration: duration / 2, ease: "easeInOut" },
            },
          }}
          transition={{ duration, ease: "easeInOut", delay: 0.15 }}
        ></motion.div>
        <div className="absolute size-full">{children}</div>
      </div>
    </motion.div>
  );
}

export default Intro;
