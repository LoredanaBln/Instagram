import {type RouteConfig, index, route} from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    route("ban", "routes/ban.tsx"),
    route("posts", "routes/posts.tsx"),
    route("posts/:postId", "routes/post_show.tsx"),
    route("posts/:postId/edit", "routes/post_update.tsx"),
    route("login", "routes/login.tsx"),
    route("register", "routes/register.tsx"),
    route("users", "routes/users.tsx"),
    route("profile", "routes/profile.tsx"),
] satisfies RouteConfig;
