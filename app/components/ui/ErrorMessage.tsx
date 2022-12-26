type ErrorMessageProps = {
    message: string;
};

export default function ErrorMessage({ message }: ErrorMessageProps) {
    return message ? <p className="text-red-700 text-sm mt-1.5">{message}</p> : null;
}
