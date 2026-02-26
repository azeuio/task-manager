import { type Project } from "@/api/types";
import { useAlert } from "@/hooks/useAlert";
import {
  useCreateProjectMember,
  useProjectMember,
  useProjectMembers,
} from "@/hooks/useProjectMembers";
import { useEffect, useState } from "react";
import ProjectMemberPP from "./ProjectMemberPP";
import ProjectMemberItem from "./ProjectMember/ProjectMemberItem";

interface ProjectAssigneesProps {
  projectId: Project["id"];
}
function ProjectMembers({ projectId }: ProjectAssigneesProps) {
  const { showAlert } = useAlert();
  const { data: members } = useProjectMembers(projectId);
  const { data: projectMembersOfUser } = useProjectMember(projectId, "me");
  const { mutate: createProjectMember, isError: isCreateError } =
    useCreateProjectMember(projectId);
  // const [projectMembers, setProjectMembers] = useState<User[]>([]);
  const [isErrorHandled, setIsErrorHandled] = useState(false);

  useEffect(() => {
    if (!isCreateError) return;
    if (isErrorHandled) return;

    console.error("Error creating project member");
    showAlert(
      "Failed to add member to the project. Please try again.",
      "error",
    );
    return () => {
      setIsErrorHandled(true);
    };
  }, [isCreateError, isErrorHandled, showAlert]);

  const onAddMember = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const username = formData.get("username") as string;
    if (username) {
      console.log("Adding member:", username);
      setIsErrorHandled(false);
      createProjectMember({ username, role: "CONTRIBUTOR" });
    }
    e.currentTarget.reset(); // Clear the input field after submission
    const dropdown = document.getElementById("project-members-dropdown");
    if (dropdown) {
      dropdown.removeAttribute("open"); // Close the dropdown after adding a member
    }
  };

  return (
    <details id="project-members-dropdown" className="dropdown dropdown-end">
      <summary className="btn btn-ghost">
        {/* Where you can see people that have access to this project */}
        {(members?.length ?? 0) > 0 && (
          <div className="flex -space-x-2">
            {members?.map((member, index) => {
              if (index >= 2) return null; // Show max 3 avatars, add a "+X" for the rest if needed
              return (
                <ProjectMemberPP key={member.id} userId={member.userId} big />
              );
            })}
            {(members?.length ?? 0) > 3 && (
              <div
                className="rounded-full border-2 border-white bg-gray-400 text-white text-xs flex items-center justify-center"
                style={{ width: 32, height: 32 }}
              >
                +{(members?.length ?? 0) - 3}
              </div>
            )}
          </div>
        )}
      </summary>
      <div className="dropdown-content menu p-2 shadow bg-base-100 border border-base-content/20 rounded-box w-52">
        {members?.length === 0 ? (
          <div className="p-2">No members have access to this project.</div>
        ) : (
          members?.map((member) => (
            <ProjectMemberItem
              key={member.id}
              member={member}
              projectMembersOfUser={projectMembersOfUser}
            />
          ))
        )}
        <form onSubmit={onAddMember} className="flex flex-col gap-2 p-2">
          <input
            name="username"
            type="text"
            placeholder="Add member by username"
            className="input input-bordered w-full mt-2"
          />
          <button type="submit" className="btn btn-primary btn-sm w-full mt-2">
            Add Member
          </button>
        </form>
      </div>
    </details>
  );
}

export default ProjectMembers;
