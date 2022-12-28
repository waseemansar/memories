import { Form, useActionData, useTransition as useNavigation } from "@remix-run/react";
import type { action } from "~/routes/__index/index";
import ErrorMessage from "../ui/ErrorMessage";

const PostForm = () => {
    const data = useActionData<typeof action>();
    const navigation = useNavigation();
    const isSubmiting = Boolean(navigation.submission);

    return (
        <div className="bg-white shadow-md rounded-md p-4">
            <h2 className="text-center text-lg font-semibold mb-4">Creating a Memory</h2>
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
                    <input
                        className="border w-full px-2 py-3 rounded-md focus:outline-primary"
                        type="text"
                        name="tags"
                        placeholder="Tags (, seperated) *"
                    />
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
        </div>
    );
};

export default PostForm;
