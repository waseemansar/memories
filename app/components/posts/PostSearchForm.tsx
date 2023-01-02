import { useEffect, useRef, useState } from "react";
import { Form, useTransition as useNavigation } from "@remix-run/react";
import { TagsInput } from "react-tag-input-component";

export default function PostSearchForm() {
    const [tags, setTags] = useState<string[]>([]);
    const formRef = useRef<HTMLFormElement>(null);
    const navigation = useNavigation();

    const isSearching = Boolean(navigation.submission);

    useEffect(() => {
        if (!isSearching) {
            formRef.current?.reset();
            setTags([]);
        }
    }, [isSearching]);

    return (
        <div className="bg-white shadow-md rounded-md p-4 mb-3">
            <Form ref={formRef}>
                <div className="mb-4">
                    <input
                        className="title border w-full px-2 py-3 rounded-md outline-none focus:border-primary"
                        type="text"
                        name="title"
                        placeholder="Search by Title"
                    />
                </div>
                <div className="mb-4">
                    <TagsInput
                        classNames={{ input: "py-1", tag: "bg-primary text-white" }}
                        value={tags}
                        onChange={setTags}
                        beforeAddValidate={(tag) => tag.trim() !== ""}
                        placeHolder="Search by Tags (Type and Press Enter)"
                    />
                    <input type="hidden" value={tags} name="tags" />
                </div>
                <button
                    type="submit"
                    disabled={isSearching}
                    className="w-full bg-primary text-white py-2 rounded-md uppercase font-semibold disabled:cursor-not-allowed disabled:bg-gray-400"
                >
                    Search
                </button>
            </Form>
        </div>
    );
}
