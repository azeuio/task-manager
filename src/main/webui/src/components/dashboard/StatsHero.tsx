import { useProjectMemberOfUser } from "@/hooks/useProjectMembers";
import { useProjects } from "@/hooks/useProjects";
import { useMyTasks } from "@/hooks/useTasks";
import { useUserByUsername } from "@/hooks/useUser";
import { CircleCheck, FolderKanban, TriangleAlert } from "lucide-react";
import { useMemo } from "react";

function RisingIndicator({ value, prev }: { value: number; prev?: number }) {
  const isPositive = value > 0;
  const isNegative = value < 0;
  return (
    <span
      className={isPositive ? "text-success" : isNegative ? "text-error" : ""}
    >
      {isPositive ? "↗︎" : isNegative ? "↘︎" : "→"} {value}{" "}
      {prev !== undefined && <>({((value / (prev || 1)) * 100).toFixed(1)}%)</>}
    </span>
  );
}
interface StatsHeroProps {
  username: string;
}
function StatsHero({ username }: StatsHeroProps) {
  const { data: user } = useUserByUsername(username);
  const { data: projects } = useProjects();
  const { data: projectMembers } = useProjectMemberOfUser(user?.id ?? -1);
  const { data: tasks } = useMyTasks(user?.id ?? -1);
  const projectJoined = useMemo<number>(() => {
    return (
      projectMembers?.reduce((count, member) => {
        if (member.userId !== user?.id) {
          return count;
        }
        const joinedDate = new Date(member.joinedAt);
        const now = new Date();
        const isCurrentMonth =
          joinedDate.getFullYear() === now.getFullYear() &&
          joinedDate.getMonth() === now.getMonth();
        return isCurrentMonth ? count + 1 : count;
      }, 0) ?? 0
    );
  }, [projectMembers, user?.id]);
  const [thisMonthCompletedTasks, lastMonthCompletedTasks, totalTasks] =
    useMemo<[number, number, number]>(() => {
      return (
        tasks?.reduce(
          ([thisMonth, lastMonth, total], task) => {
            if (task.status !== 2) {
              return [thisMonth, lastMonth, total + 1];
            }
            const updatedDate = new Date(task.updatedAt);
            const now = new Date();
            const isLastMonth =
              updatedDate.getFullYear() === now.getFullYear() &&
              updatedDate.getMonth() === now.getMonth() - 1;
            const isCurrentMonth =
              updatedDate.getFullYear() === now.getFullYear() &&
              updatedDate.getMonth() === now.getMonth();
            return [
              thisMonth + Number(isCurrentMonth),
              lastMonth + Number(isLastMonth),
              total + 1,
            ];
          },
          [0, 0, 0],
        ) ?? [0, 0, 0]
      );
    }, [tasks]);
  const [overduThisMonth, overdueLastMonth, overdueTasks] = useMemo<
    [number, number, number]
  >(() => {
    return (
      tasks?.reduce(
        (count, task) => {
          if (task.status === 2) {
            return count;
          }
          const dueDate = task.dueDate ? new Date(task.dueDate) : null;
          const now = new Date();
          const isOverdue = dueDate !== null && dueDate < now;
          const isCurrentMonth =
            dueDate !== null &&
            dueDate.getFullYear() === now.getFullYear() &&
            dueDate.getMonth() === now.getMonth();
          const isLastMonth =
            dueDate !== null &&
            dueDate.getFullYear() === now.getFullYear() &&
            dueDate.getMonth() === now.getMonth() - 1;
          return [
            count[0] + Number(isCurrentMonth && isOverdue),
            count[1] + Number(isLastMonth && isOverdue),
            count[2] + Number(isOverdue),
          ];
        },
        [0, 0, 0],
      ) ?? [0, 0, 0]
    );
  }, [tasks]);

  return (
    <div className="bg-base-100 stats shadow divide-base-content/25 divide-x-2 divide-y-0 divide-dashed">
      <div className="stat">
        <div className="stat-figure text-secondary">
          <FolderKanban className="stroke-base-content" size={30} />
        </div>
        <div className="stat-title">Projects</div>
        <div className="stat-value">{projects?.length ?? 0}</div>
        <div className="stat-desc">Joined {projectJoined} this month</div>
      </div>

      <div className="stat">
        <div className="stat-figure text-secondary">
          <CircleCheck className="stroke-success" size={30} />
        </div>
        <div className="stat-title">Task completed</div>
        <div className="stat-value">
          {tasks?.length && (
            <>
              {((thisMonthCompletedTasks / (totalTasks || 1)) * 100).toFixed(1)}
              %
            </>
          )}
        </div>
        <div className="stat-desc">
          <RisingIndicator
            value={thisMonthCompletedTasks - lastMonthCompletedTasks}
            prev={lastMonthCompletedTasks}
          />
        </div>
      </div>

      <div className="stat">
        <div className="stat-figure text-secondary">
          <TriangleAlert className="stroke-error" size={30} />
        </div>
        <div className="stat-title">Overdue</div>
        <div className="stat-value">{overdueTasks}</div>
        <div className="stat-desc">
          <RisingIndicator
            value={overduThisMonth - overdueLastMonth}
            prev={overdueLastMonth}
          />
        </div>
      </div>
    </div>
  );
}

export default StatsHero;
