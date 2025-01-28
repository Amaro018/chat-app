import { resolver } from "@blitzjs/rpc"
import { z } from "zod"
import { pusher } from "../utils/pusher"

const SendMessage = z.object({
  username: z.string(),
  message: z.string(),
})

export default resolver.pipe(resolver.zod(SendMessage), async ({ username, message }) => {
  await pusher.trigger("chat-channel", "new-message", {
    username,
    message,
  })

  return { success: true }
})
