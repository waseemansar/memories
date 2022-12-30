import { Form, Link, useLoaderData } from "@remix-run/react";
import type { loader } from "~/routes/__index";
import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";

const Navigation = () => {
    const user = useLoaderData<typeof loader>();

    return (
        <nav className="bg-white flex justify-between items-center px-8 py-2 mb-8 rounded-lg shadow-md shadow-black/25">
            <Link to=".." className="flex items-center justify-center gap-x-2">
                <h2 className="text-primary text-2xl md:text-3xl">Memories</h2>
                <img className="w-6 h-6 md:w-8 md:h-8" src="/images/memories.png" alt="Memories Logo" />
            </Link>
            {user ? (
                <Menu as="div" className="relative">
                    <Menu.Button>
                        {user.picture ? (
                            <img src={user.picture} className="w-8 h-8 rounded-full" alt="Profile" />
                        ) : (
                            <div className="w-8 h-8 flex items-center justify-center bg-primary rounded-full text-white font-bold">
                                {user.name.charAt(0)}
                            </div>
                        )}
                    </Menu.Button>
                    <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                    >
                        <Menu.Items className="absolute right-0 mt-3 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                            <div className="px-1 py-1 ">
                                <Menu.Item disabled>
                                    <div className="px-2 py-2 text-black">
                                        <p className="text-sm font-bold">{user.name}</p>
                                        <p className="text-xs font-light text-gray-500 -mt-0.5">{user.email}</p>
                                    </div>
                                </Menu.Item>
                            </div>
                            <div className="px-1 py-1 ">
                                <Menu.Item>
                                    {({ active }) => (
                                        <Form method="post" action="/logout">
                                            <button
                                                type="submit"
                                                className={`${
                                                    active ? "bg-primary text-white" : "text-black"
                                                } flex w-full items-center rounded-md px-2 py-2 text-sm`}
                                            >
                                                Log Out
                                            </button>
                                        </Form>
                                    )}
                                </Menu.Item>
                            </div>
                        </Menu.Items>
                    </Transition>
                </Menu>
            ) : (
                <Link
                    to="/auth"
                    className="w-20 md:w-28 py-1 md:py-2 text-sm md:text-base bg-primary text-white text-center uppercase rounded-md"
                >
                    Sign In
                </Link>
            )}
        </nav>
    );
};

export default Navigation;
