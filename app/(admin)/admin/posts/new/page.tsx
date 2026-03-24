import { PostEditor } from "@/components/admin/post-editor";

export const metadata = { title: "New Post — Admin" };

export default function NewPostPage() {
    return (
        <div className="h-dvh flex flex-col">
            <PostEditor />
        </div>
    );
}
