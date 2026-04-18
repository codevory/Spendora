import { ProfileCircleIcon } from "./icons/LocalIcons";

interface ProfileProps {
  isLoggedin: boolean;
  imgSrc: string;
  user: string;
}
const ProfileComponent = ({ isLoggedin, imgSrc, user }: ProfileProps) => {
  if (!isLoggedin) return <ProfileCircleIcon size={25} />;
  return (
    <div className="flex items-center justify-center relative">
      <img
        className="rounded-full"
        src={imgSrc}
        alt={user}
        width={35}
        height={35}
        aria-label={user}
      />
      <span
        className={`w-2 h-2 rounded-full ${isLoggedin ? "bg-emerald-400" : "bg-gray-700"} absolute top-0 left-1`}
      ></span>
    </div>
  );
};

export default ProfileComponent;
