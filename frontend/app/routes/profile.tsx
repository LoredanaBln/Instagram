import { Profile as ProfilePage } from "~/pages/profile/profile";
import { FutureLoader } from "~/components/future_loader";
import { useNavigate } from "react-router";
import type { User } from "~/entities/user";
import { UserService } from "~/services/user_service";

const loadProfileData = async (navigate: (path: string) => void) => {
  try {
    const username = sessionStorage.getItem("username");
    if (!username) {
      navigate("/login");
      return null;
    }

    const userService = new UserService();
    const userData = await userService.getByUsername(username);

    return { user: userData };
  } catch (error) {
    navigate("/login");
    return null;
  }
};

export default function Profile() {
  const navigate = useNavigate();

  return (
    <FutureLoader<{ user: User } | null>
      future={() => loadProfileData(navigate)}
    >
      {(data) => {
        if (!data) {
          return null;
        }
        return <ProfilePage user={data.user} />;
      }}
    </FutureLoader>
  );
}