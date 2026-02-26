import { MemberRole, type ProjectMember } from "@/api/types";
import { useUpdateProjectMember } from "@/hooks/useProjectMembers";
import { UserCog, UserPen, UserSearch } from "lucide-react";

interface ProjectMemberRoleEditProps {
  member: ProjectMember;
  projectMembersOfUser?: ProjectMember;
}
function ProjectMemberRoleEdit({
  member,
  projectMembersOfUser,
}: ProjectMemberRoleEditProps) {
  const { mutate: updateProjectMember } = useUpdateProjectMember(
    member.projectId,
    member.userId,
  );
  const onRoleChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newRole = e.target.value as MemberRole;
    console.log("Changing role to:", newRole);
    if (newRole !== member.role) {
      updateProjectMember({ role: newRole });
    }
    e.currentTarget.blur(); // Remove focus from the radio button after changing role to prevent accidental changes with keyboard navigation
  };

  return (
    <>
      <div
        className="tooltip tooltip-left tooltip-info"
        data-tip={member.role
          .toLowerCase()
          .replace(/^\w/, (c) => c.toUpperCase())}
      >
        <button
          className="btn btn-xs btn-ghost"
          popoverTarget={"popover-member" + member.id}
          style={{
            anchorName: "--anchor-member-" + member.id,
          }}
          disabled={
            member.role === "OWNER" || projectMembersOfUser?.role === "VIEWER"
          }
        >
          {member.role === "OWNER" ? (
            <UserCog className="size-4" />
          ) : member.role === "CONTRIBUTOR" ? (
            <UserPen className="size-4" />
          ) : (
            <UserSearch className="size-4" />
          )}
        </button>
      </div>

      <ul
        className="dropdown menu w-52 rounded-box bg-base-100 shadow-sm"
        popover="auto"
        id={"popover-member" + member.id}
        style={
          {
            positionAnchor: "--anchor-member-" + member.id,
          } /* as React.CSSProperties */
        }
      >
        {Object.values(MemberRole)
          .filter((role) => role !== "OWNER")
          .map((role) => (
            <li key={role}>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="radio-4"
                  className="radio radio-primary"
                  checked={member.role === role}
                  disabled={
                    member.role === "OWNER" ||
                    projectMembersOfUser?.role === "VIEWER"
                  }
                  value={role}
                  onChange={onRoleChanged}
                />
                {role === "CONTRIBUTOR" ? (
                  <UserPen className="size-4" />
                ) : (
                  <UserSearch className="size-4" />
                )}
                {role.toLowerCase()}
              </label>
            </li>
          ))}
      </ul>
    </>
  );
}

export default ProjectMemberRoleEdit;
