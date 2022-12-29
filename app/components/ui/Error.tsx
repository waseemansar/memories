import { FaExclamationCircle } from "react-icons/fa";

type ErrorProps = {
    title: String;
    children: React.ReactNode;
};

function Error({ title, children }: ErrorProps) {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="bg-white shadow-md rounded-md p-8 text-center">
                <div className="flex items-center justify-center">
                    <FaExclamationCircle size={50} className="text-primary" />
                </div>
                <h2 className="text-xl font-bold">{title}</h2>
                {children}
            </div>
        </div>
    );
}

export default Error;
