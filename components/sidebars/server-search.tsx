"use client"
import { ServerSearchProps } from "@/types"
import { SearchIcon } from "lucide-react"
import { useState, useEffect } from "react"
import { 
    CommandDialog, CommandInput, CommandList, CommandEmpty ,
    CommandGroup, CommandItem
} from "@/components/ui/command";
import { useParams, useRouter } from "next/navigation";
export default function ServerSearch({
    data
}:ServerSearchProps) {
    const [open, setOpen] = useState<boolean>(false);
    const router = useRouter();
    const params = useParams();

    const onSelect = ({id, type}:{id:string, type:'channel' | 'member'})=>{
        setOpen(false);
        if(type === 'member')
            return router.push(`/servers/${params?.serverId}/conversations/${id}`);
        if(type === 'channel')
            return router.push(`/servers/${params?.serverId}/channels/${id}`);
        
    }

    // adding event listener to open or close search box using ctrl or cmd + k
    useEffect(()=>{
        const down = (e:KeyboardEvent)=>{
            if(e.key === 'k' && (e.metaKey || e.ctrlKey)){
                e.preventDefault();
                setOpen(prevState=>!prevState);
            }
        }
        document.addEventListener("keydown", down);
        return ()=>{
            document.removeEventListener("keydown",down);
        }
    }, []);
    
  return (
   <>
    <button
        onClick={()=>setOpen(true)}
        className="group px-2 py-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition"
    >
        <SearchIcon
            className="w-4 h-4 text-zinc-500 dark:text-zinc-400"
        />
        <p
            className="font-semibold text-sm text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition"
        >
            Search
        </p>
        {/* The <kbd> tag is used to define keyboard input. The content inside is displayed in the browser's default monospace font. */}
        <kbd
            className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground ml-auto"
        >
            <span
                className="text-xs"
            >
                CTRL
            </span>K
        </kbd>
    </button>
    <CommandDialog
        open={open}
        onOpenChange={setOpen}
    >
        <CommandInput
            placeholder="Search all channels and members"
        />
        <CommandList>
            <CommandEmpty>
                No result found
            </CommandEmpty>
            {
                data.map(({label, type, data})=>{
                    if(!data?.length) return null;
                    
                    return (
                        <CommandGroup key={label} heading={label}>
                            {
                                data?.map(({id, icon, name})=>{
                                    return (
                                        <CommandItem
                                            key={id}
                                            onSelect={()=>onSelect({id, type})}
                                        >   
                                            {icon}
                                            <span>{name}</span>
                                        </CommandItem>
                                    )
                                })
                            }
                        </CommandGroup>
                       
                    )
                })
            }
        </CommandList>
    </CommandDialog>
   </>
  )
}
