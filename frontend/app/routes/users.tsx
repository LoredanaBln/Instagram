import {PostIndex} from "~/pages/posts/post_index";
import {PostsService} from "~/services/post_service";
import type {Post} from "~/entities/post";
import {FutureLoader} from "~/components/future_loader";
import {useNavigate} from "react-router";
import type {User} from "~/entities/user";
import {UserService} from "~/services/user_service";
import {UserManagementPage} from "~/pages/users/user_management_page";

const loadUsers = async (navigate: (path: string) => void) => {
    try {
        const role = sessionStorage.getItem("role");
        if (role != "MODERATOR") throw Error("Not allowed role");
        return await new UserService().get();
    } catch (error) {
        navigate("/login");
    }
};

export default function Users() {
    const navigate = useNavigate();

    return (
        // @ts-ignore
        <FutureLoader<User[]> future={() => loadUsers(navigate)} >
            {(users) => <UserManagementPage users={users} />}
        </FutureLoader>
    );
}