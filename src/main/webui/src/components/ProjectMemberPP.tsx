import { fetchUserProfilePicture } from "@/api/user";
import { useUser } from "@/hooks/useUser";

function ProjectMemberPP({
  userId,
  big = false,
}: {
  userId: number;
  big?: boolean;
}) {
  const { data: user } = useUser(userId);

  if (!user) {
    return (
      <div
        className={`w-8 h-8 rounded-full bg-gray-300 animate-pulse ${big ? "w-6 h-6" : ""}`}
      />
    );
  }

  const username = user.username;
  return (
    <div className="flex items-center">
      <img
        src={fetchUserProfilePicture(username)}
        alt={`${username}'s avatar`}
        className={`rounded-full border-2 border-white ${big ? "w-8 h-8" : "w-8 h-8"}`}
      />
      <span hidden={big}>{username}</span>
    </div>
  );
}

export default ProjectMemberPP;
