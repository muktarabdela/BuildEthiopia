import Link from "next/link";

export const Sidebar = () => {
    return (
        <aside className="fixed inset-y-0 left-0 w-64 bg-white border-r">
            <div className="px-6 py-4">
                <h2 className="text-lg font-semibold">Admin Dashboard</h2>
            </div>
            <nav className="mt-6">
                <ul className="space-y-1">
                    <li>
                        <Link href="/admin" className="flex items-center px-6 py-2 text-gray-700 hover:bg-gray-100">
                            Dashboard
                        </Link>
                    </li>
                    <li>
                        <Link href="/admin/projects" className="flex items-center px-6 py-2 text-gray-700 hover:bg-gray-100">
                            Projects
                        </Link>
                    </li>
                    <li>
                        <Link href="/admin/developers" className="flex items-center px-6 py-2 text-gray-700 hover:bg-gray-100">
                            Developers
                        </Link>
                    </li>
                </ul>
            </nav>
        </aside>
    );
}; 