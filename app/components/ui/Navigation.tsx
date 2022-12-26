import { Link } from "@remix-run/react";

const Navigation = () => {
    return (
        <nav className="bg-white flex justify-between items-center px-8 py-2 mb-8 rounded-lg shadow-md shadow-black/25">
            <Link to=".." className="flex items-center justify-center gap-x-2">
                <h2 className="text-primary text-3xl">Memories</h2>
                <img className="w-8 h-8" src="/images/memories.png" alt="Memories Logo" />
            </Link>
            <Link to="/auth" className="w-28 bg-primary py-2 text-white text-center uppercase rounded-md">
                Sign In
            </Link>
        </nav>
    );
};

export default Navigation;
