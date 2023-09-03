"use client"
import type { ChatMessagesProps } from "@/types"
import ChatWelcome from "@/components/chat/chat-welcome"
import { useChatQuery } from "@/hooks/use-chat-query"
import { Loader2, ServerCrash } from "lucide-react";
import { Fragment, useRef, ElementRef } from "react";
import type { MessageWithMemberWithProfile } from "@/types";
import ChatItem from "./chat-item";
import { format } from 'date-fns';
import { useChatSocket } from "@/hooks/use-chat-socket";
import { useChatScroll } from "@/hooks/use-chat-scroll";


const DATE_FORMAT = "d MMM yyyy, HH:mm"

export default function ChatMessages({
    name,
    member,
    socketUrl,
    socketQuery,
    chatId,
    apiUrl,
    paramKey,
    paramValue,
    type
}: ChatMessagesProps) {

    const chatRef = useRef<ElementRef<"div">>(null);
    const bottomRef = useRef<ElementRef<"div">>(null);

    const queryKey = `chat:${chatId}`;
    const addKey = `chat:${chatId}:messages`;
    const updateKey = `chat:${chatId}:messages:update`
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        status
    } = useChatQuery({
        queryKey,
        apiUrl,
        paramKey,
        paramValue
    });

    useChatSocket({
        queryKey,
        addKey,
        updateKey
    });

    useChatScroll({
        chatRef,
        bottomRef,
        loadMore:fetchNextPage,
        shouldLoadMore:!isFetchingNextPage && !!hasNextPage,
        count:data?.pages?.[0].items?.length??0,
        
    })
    if (status === "loading") {
        return (
            <div
                className="flex flex-col flex-1 justify-center items-center"
            >
                <Loader2
                    className="h-7 w-7 text-zinc-500 animate-spin my-4"
                />
                <p
                    className="text-xs text-zinc-500 dark:text-zinc-400"
                >
                    Loading messages...
                </p>
            </div>
        )
    }
    if (status === "error") {
        return (
            <div
                className="flex flex-col flex-1 justify-center items-center"
            >
                <ServerCrash
                    className="h-7 w-7 text-zinc-500 my-4"
                />
                <p
                    className="text-xs text-zinc-500 dark:text-zinc-400"
                >
                    Server Error
                </p>
            </div>
        )
    }
    return (
        <div
            ref={chatRef}
            className="flex-1 flex flex-col py-4 overflow-y-auto"
        >
            {!hasNextPage && <div
                className="flex-1"
            >
            </div>}

            {/* only display when we are at last page */}
           {!hasNextPage && <ChatWelcome
                type={type}
                name={name}
            />}
            {
                hasNextPage && (
                    <div
                        className="flex justify-center"
                    >{
                        isFetchingNextPage?(
                            <Loader2
                            className="h-6 w-6 text-zinc-500 animate-spin my-4"
                            />
                        )
                        :(
                            <button
                                onClick={()=>fetchNextPage()}
                                className="text-xs my-4 text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition"
                            >
                                Load Previous messages
                                
                            </button>
                        )
                    }
                    </div>
                )
            }
            <div
                className="flex flex-col-reverse mt-auto"
            >
                {
                    data?.pages?.map((group, i) => {
                        return (
                            <Fragment
                                key={i}
                            >
                                {group?.items.map((message: MessageWithMemberWithProfile) => {
                                    // there is typo in message schema it should be updated at instead of updateAt
                                    return (

                                        <ChatItem
                                            key={message.id}
                                            id={message.id}
                                            currentMember={member}
                                            content={message.content}
                                            fileUrl={message.fileUrl}
                                            deleted={message.deleted}
                                            timestamp={format(new Date(message.createdAt), DATE_FORMAT)}
                                            isUpdated={message.updatedAt !== message.createdAt}
                                            socketUrl={socketUrl}
                                            socketQuery={socketQuery}
                                            member={message.member}
                                        />
                                    )
                                }
                                )}
                            </Fragment>
                        )
                    })
                }
            </div>
            {/* to keep the last meesage visibile to user */}
            <div ref={bottomRef} />
        </div>
    )
}