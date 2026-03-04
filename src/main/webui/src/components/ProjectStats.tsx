import { useEffect, useRef, useState } from "react";
import {
  useProjectsStats,
  useMostNewTasks,
  useMostNewMembers,
  useMostCompleted,
} from "@/hooks/useProjectsStats";
import Intro from "@/stories/Intro";
import {
  AnimatePresence,
  animate,
  motion,
  stagger,
  type Transition,
  useMotionValue,
  useMotionValueEvent,
} from "framer-motion";

interface ProjectsStatsProps {
  toggle: () => void;
}

function StatCard({
  projectName,
  color,
  count,
  label,
  onDone,
}: {
  projectName: string | undefined;
  color: string | undefined;
  count: number | undefined;
  label: string;
  onDone: () => void;
}) {
  const arrivedRef = useRef(false);
  const [hasArrived, setHasArrived] = useState(false);
  const motionCount = useMotionValue(0);
  const [displayCount, setDisplayCount] = useState(0);

  useMotionValueEvent(motionCount, "change", (v) =>
    setDisplayCount(Math.round(v)),
  );

  useEffect(() => {
    if (!hasArrived) return;
    const target = count ?? 0;
    const animControls = animate(motionCount, target, {
      duration: 1.5,
      ease: "easeOut",
    });
    const timer = setTimeout(onDone, 2000);
    return () => {
      animControls.stop();
      clearTimeout(timer);
    };
  }, [hasArrived, count, motionCount, onDone]);

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center"
      initial={{ y: "110%" }}
      animate={{ y: "0%" }}
      exit={{ y: "-110%", transition: { duration: 0.6, ease: "easeInOut" } }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
      onAnimationComplete={() => {
        if (!arrivedRef.current) {
          arrivedRef.current = true;
          setHasArrived(true);
        }
      }}
    >
      <div className="bg-white rounded-3xl shadow-2xl p-10 flex flex-col items-center gap-6 min-w-80">
        <motion.div
          className="text-7xl select-none"
          animate={{ y: [4, -14, 4] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
        >
          ↑
        </motion.div>
        <div className="flex items-center gap-3">
          <div
            className="w-7 h-7 rounded-md shrink-0"
            style={{ backgroundColor: color ?? "#888" }}
          />
          <span className="text-2xl font-bold text-gray-800">
            {projectName ?? "…"}
          </span>
        </div>
        <motion.div
          className="text-7xl font-extrabold text-gray-900 tabular-nums"
          initial={{ y: 24, opacity: 0 }}
          animate={hasArrived ? { y: 0, opacity: 1 } : { y: 24, opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          {displayCount}
        </motion.div>
        <p className="text-lg text-gray-500 font-medium">{label}</p>
      </div>
    </motion.div>
  );
}

type Phase = "tasks" | "members" | "completed" | "main";

export default function ProjectsStats({ toggle }: ProjectsStatsProps) {
  const { data: projectsStats } = useProjectsStats();
  const { data: mostNewTasks } = useMostNewTasks();
  const { data: mostNewMembers } = useMostNewMembers();
  const { data: mostCompleted } = useMostCompleted();
  const [phase, setPhase] = useState<Phase>("tasks");

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
      <Intro>
        <div className="relative size-full">
          <AnimatePresence mode="wait">
            {phase === "tasks" && (
              <StatCard
                key="tasks"
                projectName={mostNewTasks?.projectName}
                color={mostNewTasks?.color}
                count={mostNewTasks?.taskCount}
                label="new tasks this month"
                onDone={() => setPhase("members")}
              />
            )}
            {phase === "members" && (
              <StatCard
                key="members"
                projectName={mostNewMembers?.projectName}
                color={mostNewMembers?.color}
                count={mostNewMembers?.memberCount}
                label="new members this month"
                onDone={() => setPhase("completed")}
              />
            )}
            {phase === "completed" && (
              <StatCard
                key="completed"
                projectName={mostCompleted?.projectName}
                color={mostCompleted?.color}
                count={mostCompleted?.completedCount}
                label="tasks completed this month"
                onDone={() => setPhase("main")}
              />
            )}
            {phase === "main" && (
              <motion.div
                key="main"
                className="flex-1 flex flex-col h-full justify-between"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <button
                  className="absolute bottom-4 right-4 btn btn-primary"
                  onClick={toggle}
                >
                  Close
                </button>
                <motion.div
                  initial={{ opacity: 0, y: 0 }}
                  animate={{ opacity: 1, y: 20 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className="text-7xl font-bold text-center text-primary-content"
                >
                  Most active projects
                </motion.div>
                <div className="size-full flex flex-row items-end justify-center gap-8 p-12">
                  <div className="invisible" />
                  {[2, 3, 1].map((size) => {
                    const importance = 3 - size;
                    const projectStats = projectsStats?.at(importance);
                    return (
                      <div
                        className="flex flex-col-reverse gap-4 items-center justify-between h-full"
                        key={size}
                      >
                        <motion.div
                          initial={{ opacity: 0, y: 20, height: 0 }}
                          animate={{ opacity: 1, y: 0, height: size * 75 }}
                          transition={{
                            duration: 0.5,
                            ease: "easeInOut",
                            delay: size * 0.5,
                          }}
                          className="bg-primary-content rounded-lg flex items-end justify-center text-primary font-bold text-2xl"
                          style={{ width: "100px" }}
                        >
                          {importance + 1}
                        </motion.div>
                        <div
                          hidden={!projectStats}
                          className="flex-1 flex flex-col gap-2 *:first:text-center *:first:underline *:first:bg-primary-content *:first:text-primary *:even:bg-primary-content *:even:text-primary *:odd:text-center *:odd:not-first:text-primary-content *:font-bold *:text-xl *:rounded-lg *:px-4"
                        >
                          {[
                            projectStats?.projectName,
                            "Total tasks:",
                            projectStats?.totalTasks,
                            "Tasks created:",
                            projectStats?.tasksCreated,
                            "Completed tasks:",
                            projectStats?.completedTasks,
                            "Overdue tasks:",
                            projectStats?.overdueTasks,
                            "Total members:",
                            projectStats?.totalMembers,
                            "Members joined:",
                            projectStats?.membersJoined,
                          ].map((val, i) => (
                            <motion.div
                              key={i}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{
                                ...itemTransition,
                                delay: 0.3 + i * 0.08,
                              }}
                            >
                              {val}
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Intro>
    </motion.div>
  );
}
