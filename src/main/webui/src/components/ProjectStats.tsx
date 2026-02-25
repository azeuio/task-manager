import { useProjectsStats } from "@/hooks/useProjectsStats";
import Intro from "@/stories/Intro";
import { motion, stagger, type Transition } from "framer-motion";

interface ProjectsStatsProps {
  toggle: () => void; // Call this to toggle the projects stats off after it's done
}
export default function ProjectsStats({ toggle }: ProjectsStatsProps) {
  const { data: projectsStats } = useProjectsStats();
  const itemTransition: Transition = {
    duration: 0.5,
    ease: "easeInOut",
  };

  return (
    <motion.div
      className="relative top-0 left-0 size-full z-10"
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={{
        initial: {
          clipPath:
            "polygon(0 100%, 30% 100%, 50% 75%, 60% 100%, 100% 100%, 100% 200%, 0% 200%)",
        },
        visible: {
          transition: { delayChildren: stagger(0.2) },
          clipPath:
            "polygon(0 0, 30% 0, 50% -15%, 60% 0, 100% 0, 100% 100%, 0% 100%)",
        },
        exit: {
          clipPath:
            "polygon(0 150%, 30% 150%, 50% 125%, 60% 150%, 100% 150%, 100% 200%, 0% 200%)",
        },
      }}
    >
      <button
        className="absolute bottom-4 right-4 btn btn-primary"
        onClick={toggle}
      >
        Close
      </button>
      <Intro>
        <div className="flex-1 flex flex-col h-full justify-between">
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 0 },
              visible: { opacity: 1, y: 20 },
            }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="text-7xl font-bold text-center text-primary-content"
          >
            Most active projects
          </motion.div>
          <div className="size-full flex flex-row items-end justify-center gap-8 p-12">
            <div className="invisible" style={{}} />
            {[2, 3, 1].map((size) => {
              const importance = 3 - size; // 0 for largest, 2 for smallest
              const projectStats = projectsStats?.at(importance);
              return (
                <motion.div
                  className="flex flex-col-reverse gap-4 items-center justify-between h-full"
                  key={size}
                  transition={{
                    delayChildren: stagger(10, { startDelay: size * 2 }),
                  }}
                >
                  <motion.div // podium bar
                    custom={size}
                    variants={{
                      hidden: { opacity: 0, y: 20, height: 0 },
                      visible: (i) => ({
                        opacity: 1,
                        y: 0,
                        height: size * 100,
                        transition: {
                          duration: 0.5,
                          ease: "easeInOut",
                          delay: i * 0.5,
                        },
                      }),
                    }}
                    className={`bg-primary-content rounded-lg flex items-end justify-center text-primary font-bold text-2xl`}
                    style={{ height: `${size * 100}px`, width: "100px" }}
                  >
                    {importance + 1}
                  </motion.div>
                  <motion.div // podium item
                    className="flex-1"
                    custom={size}
                    variants={{
                      visible: {
                        transition: {
                          duration: 0.5,
                          delayChildren: stagger(0.1),
                          ease: "easeInOut",
                        },
                      },
                      hidden: {
                        transition: {
                          duration: 0,
                          ease: "easeInOut",
                        },
                      },
                    }}
                  >
                    <div
                      hidden={!projectStats}
                      className={
                        "flex flex-col gap-4 *:first:text-center *:first:underline *:first:bg-primary-content *:first:text-primary  *:even:bg-primary-content *:even:text-primary *:odd:text-center *:odd:not-first:text-primary-content *:font-bold *:text-xl *:rounded-lg *:px-4  "
                      }
                    >
                      <motion.div
                        variants={{
                          hidden: { opacity: 0 },
                          visible: { opacity: 1 },
                        }}
                        transition={itemTransition}
                        className=""
                      >
                        {projectStats?.projectName}
                      </motion.div>
                      <motion.div
                        variants={{
                          hidden: { opacity: 0 },
                          visible: { opacity: 1 },
                        }}
                        transition={itemTransition}
                        className=""
                      >
                        Total tasks:
                      </motion.div>
                      <motion.div
                        variants={{
                          hidden: { opacity: 0 },
                          visible: { opacity: 1 },
                        }}
                        transition={itemTransition}
                      >
                        {projectStats?.totalTasks}
                      </motion.div>
                      <motion.div
                        variants={{
                          hidden: { opacity: 0 },
                          visible: { opacity: 1 },
                        }}
                        transition={itemTransition}
                        className=""
                      >
                        Tasks created:
                      </motion.div>
                      <motion.div
                        variants={{
                          hidden: { opacity: 0 },
                          visible: { opacity: 1 },
                        }}
                        transition={itemTransition}
                      >
                        {projectStats?.tasksCreated}
                      </motion.div>
                      <motion.div
                        variants={{
                          hidden: { opacity: 0 },
                          visible: { opacity: 1 },
                        }}
                        transition={itemTransition}
                        className=""
                      >
                        Completed tasks:
                      </motion.div>
                      <motion.div
                        variants={{
                          hidden: { opacity: 0 },
                          visible: { opacity: 1 },
                        }}
                        transition={itemTransition}
                      >
                        {" "}
                        {projectStats?.completedTasks}
                      </motion.div>
                      <motion.div
                        variants={{
                          hidden: { opacity: 0 },
                          visible: { opacity: 1 },
                        }}
                        transition={itemTransition}
                        className=""
                      >
                        Overdue tasks:
                      </motion.div>
                      <motion.div
                        variants={{
                          hidden: { opacity: 0 },
                          visible: { opacity: 1 },
                        }}
                        transition={itemTransition}
                      >
                        {projectStats?.overdueTasks}
                      </motion.div>
                      <motion.div
                        variants={{
                          hidden: { opacity: 0 },
                          visible: { opacity: 1 },
                        }}
                        transition={itemTransition}
                        className=""
                      >
                        Total members:
                      </motion.div>
                      <motion.div
                        variants={{
                          hidden: { opacity: 0 },
                          visible: { opacity: 1 },
                        }}
                        transition={itemTransition}
                      >
                        {projectStats?.totalMembers}
                      </motion.div>
                      <motion.div
                        variants={{
                          hidden: { opacity: 0 },
                          visible: { opacity: 1 },
                        }}
                        transition={itemTransition}
                        className=""
                      >
                        Members joined:
                      </motion.div>
                      <motion.div
                        variants={{
                          hidden: { opacity: 0 },
                          visible: { opacity: 1 },
                        }}
                        transition={{ duration: 0.5 }}
                      >
                        {projectStats?.membersJoined}
                      </motion.div>
                    </div>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </Intro>
    </motion.div>
  );
}
