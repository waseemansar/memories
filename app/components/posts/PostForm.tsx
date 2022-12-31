import { Form, useActionData, useMatches, useTransition as useNavigation } from "@remix-run/react";
import type { action } from "~/routes/__index/index";
import { TagsInput } from "react-tag-input-component";
import { useState } from "react";

import ErrorMessage from "../ui/ErrorMessage";

const PostForm = () => {
    const [tags, setTags] = useState<string[]>([]);
    const data = useActionData<typeof action>();
    const navigation = useNavigation();
    const matches = useMatches();
    const user = matches.find((match) => match.id === "routes/__index")?.data;
    const isSubmiting = Boolean(navigation.submission);

    return (
        <div className="bg-white shadow-md rounded-md p-4">
            {user ? (
                <>
                    <h2 className="text-center text-lg font-semibold mb-4">Creating a Memory</h2>
                    {data?.errors?.error && (
                        <div className="flex justify-center mb-4">
                            <ErrorMessage message={data?.errors?.error} />
                        </div>
                    )}
                    <Form method="post" encType="multipart/form-data">
                        <div className="mb-4">
                            <input
                                className="border w-full px-2 py-3 rounded-md focus:outline-primary"
                                type="text"
                                name="title"
                                placeholder="Title *"
                            />
                            <ErrorMessage message={data?.errors?.title} />
                        </div>
                        <div className="mb-4">
                            <textarea
                                className="border w-full px-2 py-3 rounded-md focus:outline-primary resize-none"
                                name="message"
                                placeholder="Message *"
                                rows={3}
                            ></textarea>
                            <ErrorMessage message={data?.errors?.message} />
                        </div>
                        <div className="mb-4">
                            <TagsInput
                                classNames={{ input: "py-1", tag: "bg-primary text-white" }}
                                value={tags}
                                onChange={setTags}
                                beforeAddValidate={(tag) => tag.trim() !== ""}
                                placeHolder="Tags * (Type and Press Enter)"
                            />
                            <input type="hidden" value={tags} name="tags" />
                            <ErrorMessage message={data?.errors?.tags} />
                        </div>
                        <div className="mb-4">
                            <input type="file" name="selectedFile" id="selectedFile" />
                            <ErrorMessage message={data?.errors?.selectedFile} />
                        </div>
                        <div className="flex flex-col gap-2">
                            <button
                                disabled={isSubmiting}
                                type="submit"
                                className="bg-primary text-white py-2 rounded-md uppercase font-semibold disabled:cursor-not-allowed disabled:bg-gray-400"
                            >
                                Submit
                            </button>
                            <button type="button" className="bg-rose-500 text-white py-2 rounded-md uppercase font-semibold">
                                Clear
                            </button>
                        </div>
                    </Form>
                </>
            ) : (
                <p>Please sign in to create your own memories and like other's memories.</p>
            )}
        </div>
    );
};

export default PostForm;
