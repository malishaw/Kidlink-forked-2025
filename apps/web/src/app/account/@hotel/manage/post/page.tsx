import GetPostsList from "@/features/post/components/get-post";
import NurseryPostSystem from "@/features/post/components/post";
// import UpdatePostForm from "@/features/post/components/update-post";

export default function Page() {
  return (
    <div className="space-y-6">
      <NurseryPostSystem />
      <GetPostsList />
      {/* <UpdatePostForm /> */}
    </div>
  );
}
