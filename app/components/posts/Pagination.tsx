import { Link, useLoaderData } from "@remix-run/react";
import type { loader } from "~/routes/__index/index";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";

export default function Pagination() {
    const data = useLoaderData<typeof loader>();

    const pageNumbers = [];
    for (let i = 1; i <= data.numberofPages; i++) {
        pageNumbers.push(i);
    }

    return (
        <div className="bg-white shadow-md rounded-md p-4 mb-3">
            <ul className="flex items-center justify-center gap-x-4">
                <li>
                    {data.currentPage === 1 ? (
                        <div className="w-8 h-8 flex items-center justify-center border rounded-full">
                            <FaAngleLeft />
                        </div>
                    ) : (
                        <Link
                            to={`/?page=${data.currentPage - 1}`}
                            className="w-8 h-8 flex items-center justify-center border rounded-full"
                        >
                            <FaAngleLeft />
                        </Link>
                    )}
                </li>
                {pageNumbers.map((number) => (
                    <li key={number}>
                        <Link
                            to={`/?page=${number}`}
                            className={`w-8 h-8 flex items-center justify-center border rounded-full ${
                                data.currentPage === number && "bg-primary text-white"
                            }`}
                        >
                            {number}
                        </Link>
                    </li>
                ))}
                <li className="w-8 h-8 flex items-center justify-center border rounded-full">
                    {data.currentPage === data.numberofPages ? (
                        <div className="w-8 h-8 flex items-center justify-center border rounded-full">
                            <FaAngleRight />
                        </div>
                    ) : (
                        <Link
                            to={`/?page=${data.currentPage + 1}`}
                            className="w-8 h-8 flex items-center justify-center border rounded-full"
                        >
                            <FaAngleRight />
                        </Link>
                    )}
                </li>
            </ul>
        </div>
    );
}
