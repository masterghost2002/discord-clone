import * as z from "zod";
const ChatInputFormSchema = z.object({
    content:z.string().min(1),
});
export default ChatInputFormSchema;