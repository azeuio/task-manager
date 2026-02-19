import type { Project, User } from "@/api/types";
import { fetchUser, fetchUserProfilePicture } from "@/api/user";
import { useAlert } from "@/hooks/useAlert";
import {
  useCreateProjectMember,
  useProjectMembers,
} from "@/hooks/useProjectMembers";
import { useEffect, useState } from "react";

interface ProjectAssigneesProps {
  projectId: Project["id"];
}
function ProjectMembers({ projectId }: ProjectAssigneesProps) {
  const { showAlert } = useAlert();
  const { data: members } = useProjectMembers(projectId);
  const { mutate: createProjectMember, isError: isCreateError } =
    useCreateProjectMember(projectId);
  const [projectMembers, setProjectMembers] = useState<User[]>([]);
  const [isErrorHandled, setIsErrorHandled] = useState(false);

  useEffect(() => {
    const fetchMembers = async () => {
      if (members) {
        try {
          const memberData = await Promise.all(
            members.map((member) => fetchUser(member.userId)),
          );
          const users = memberData.map((res) => res.data);
          setProjectMembers(users);
        } catch (error) {
          console.error("Error fetching project members:", error);
        }
      }
    };

    fetchMembers();
  }, [members]);

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
      <summary className="btn btn-ghost rounded-full">
        {/* Where you can see people that have access to this project */}
        {(projectMembers?.length ?? 0) > 0 && (
          <div className="flex -space-x-2">
            {projectMembers?.map((member, index) => {
              if (index >= 2) return null; // Show max 3 avatars, add a "+X" for the rest if needed
              return (
                <img
                  key={index}
                  src={fetchUserProfilePicture(member.username)}
                  alt={`${member.username}'s avatar`}
                  className="rounded-full border-2 border-white"
                />
              );
            })}
            {(projectMembers?.length ?? 0) > 3 && (
              <div
                className="rounded-full border-2 border-white bg-gray-400 text-white text-xs flex items-center justify-center"
                style={{ width: 32, height: 32 }}
              >
                +{(projectMembers?.length ?? 0) - 3}
              </div>
            )}
          </div>
        )}
      </summary>
      <div className="dropdown-content menu p-2 shadow bg-base-100 border border-base-content/20 rounded-box w-52">
        {projectMembers?.length === 0 ? (
          <div className="p-2">No members have access to this project.</div>
        ) : (
          projectMembers?.map((member) => (
            <div key={member.id} className="flex items-center gap-2 p-2">
              <img
                src={fetchUserProfilePicture(member.username)}
                alt={`${member.username}'s avatar`}
                className="rounded-full w-6 h-6"
              />
              <span>{member.username}</span>
            </div>
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
