import AdminBlogs from "../../components/admin/AdminBlog"
import { AdminSidebar } from "../../components/admin/AdminSidebar"
export default function AdminBlogPage() {
    return (
        <div className="flex h-screen bg-gray-100">
            <AdminSidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="bg-white shadow-sm border-b">
                    <div className="flex items-center justify-between px-6 py-4">
                        <h1 className="text-2xl font-bold text-[#ac3500]">Manage Blogs</h1>
                    </div>
                </header>
                <main className="flex-1 overflow-y-auto p-6">
                    <AdminBlogs />
                </main>
            </div>
        </div>
    )
}
