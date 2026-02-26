import ProjectMemberPP from "../ProjectMemberPP";
import { type ProjectMember } from "@/api/types";
import { UserX } from "lucide-react";
import ProjectMemberRoleEdit from "./ProjectMemberRoleEdit";

interface ProjectMemberItemProps {
  member: ProjectMember;
  projectMembersOfUser?: ProjectMember; // The current user's membership in the project, used to determine permissions
}
function ProjectMemberItem({
  member,
  projectMembersOfUser,
}: ProjectMemberItemProps) {
  return (
    <div className="flex flex-row justify-between p-1 items-center">
      <ProjectMemberPP key={member.id} userId={member.userId} />
      <div>
        <ProjectMemberRoleEdit
          member={member}
          projectMembersOfUser={projectMembersOfUser}
        />
        <div // Delete member button, only enabled if the member is not an owner
          className={`tooltip tooltip-left ${member.role === "OWNER" ? "tooltip-info" : "tooltip-error"}`}
          data-tip={member.role === "OWNER" ? "Owner" : "Remove member"}
        >
          <button
            className="btn btn-xs btn-ghost btn-error"
            disabled={member.role === "OWNER"}
            aria-label="Remove member"
          >
            <UserX className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProjectMemberItem;
