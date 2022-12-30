/// <reference types="@remix-run/dev" />
/// <reference types="@remix-run/node" />

export {};

declare global {
    interface Window {
        ENV: {
            GOOGLE_CLIENT_ID: string;
        };
    }
}
