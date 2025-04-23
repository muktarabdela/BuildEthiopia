'use client';
import { Inbox } from '@novu/nextjs';

export function NotificationInbox() {
    return (
        <Inbox
            applicationIdentifier="03ArFmLKJbla"
            subscriberId="67d9883b072182b22ad6324c"
            appearance={{
                variables: {
                    colorPrimary: "#DD2450",
                    colorForeground: "#0E121B"
                }
            }}
        />
    );
}