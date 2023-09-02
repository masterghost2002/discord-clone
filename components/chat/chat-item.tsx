"use client"
import type { ChatItemsProps } from "@/types"
import UserAvatar from "../user-avatar"
import ActionTooltip from "../action.tooltip"
import { roleIconMap } from "@/util/iconMap"
export default function ChatItem({
    id,
    content,
    member,
    timestamp,
    fileUrl,
    deleted,
    currentMember,
    isUpdated,
    socketUrl,
    socketQuery
}: ChatItemsProps) {
    return (
        <div
            className="relative group flex items-center hover:bg-black/5 p-4 transtition w-full"
        >
            <div
                className="group flex gap-x-2 items-start w-full"
            >
                <div
                    className="cursor-pointer hover:drop-shadow-md transition"
                >
                    <UserAvatar
                        src={member.profile.imageUrl}
                    />
                </div>
                <div
                    className="flex flex-col w-full"
                >
                    <div
                        className="flex items-center gap-x-2"
                    >
                        <div
                            className="flex items-center"
                        >
                            <p
                                className="font-semi-bold text-sm hover:underline cursor-pointer"
                            >

                                {member.profile.name}
                            </p>
                            <ActionTooltip
                                label={member.role}
                            >
                                {roleIconMap[member.role]}
                            </ActionTooltip>
                        </div>
                        <span
                            className="text-xs text-zinc-500 dark:text-zinc-400"
                        >
                            {timestamp}
                        </span>
                    </div>
                    {content}
                </div>
            </div>
        </div>
    )
}