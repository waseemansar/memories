import type { ZodError, ZodSchema } from "zod";

type ActionErrors<T> = Partial<Record<keyof T, string>>;

export async function validateAction<ActionInput>({ request, schema }: { request: Request; schema: ZodSchema }) {
    const formData = await request.formData();
    const body = Object.fromEntries(formData);

    try {
        const formData = schema.parse(body) as ActionInput;
        return { formData, errors: null };
    } catch (error) {
        const errors = error as ZodError<ActionInput>;
        const formatedErrors = errors.issues.reduce((acc: ActionErrors<ActionInput>, cur) => {
            const key = cur.path[0] as keyof ActionInput;
            acc[key] = cur.message;
            return acc;
        }, {});

        return { formData: body, errors: formatedErrors };
    }
}
