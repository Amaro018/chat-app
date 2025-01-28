"use client"
import React, { useState, useEffect } from "react"
import { useMutation } from "@blitzjs/rpc"
import Pusher from "pusher-js"
import sendMessage from "../../mutations/sendMessage"

const ChatPage = () => {
  const [messages, setMessages] = useState<{ username: string; message: string }[]>([])
  const [username, setUsername] = useState("")
  const [message, setMessage] = useState("")

  // Use the sendMessage mutation
  const [sendMessageMutation] = useMutation(sendMessage)

  useEffect(() => {
    // Initialize Pusher client
    const pusher = new Pusher("e7062a818fd662e0b7c8", {
      cluster: "ap1",
    })

    const channel = pusher.subscribe("chat-channel")
    channel.bind("new-message", (data: { username: string; message: string }) => {
      setMessages((prevMessages) => [...prevMessages, data])
    })

    return () => {
      channel.unbind_all()
      channel.unsubscribe()
    }
  }, [])

  const sendMessageHandler = async () => {
    if (!username || !message) return

    try {
      await sendMessageMutation({ username, message })
      setMessage("") // Clear the input after sending
    } catch (error) {
      console.error("Error sending message:", error)
    }
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Blitz.js Pusher Chat</h1>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Your name"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="border p-2 rounded mr-2"
        />
        <input
          type="text"
          placeholder="Type a message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="border p-2 rounded mr-2"
        />
        <button onClick={sendMessageHandler} className="bg-blue-500 text-white px-4 py-2 rounded">
          Send
        </button>
      </div>
      <div className="border p-4 rounded">
        <h2 className="text-xl font-semibold mb-2">Messages:</h2>
        <ul>
          {messages.map((msg, index) => (
            <li key={index} className="mb-2">
              <strong>{msg.username}:</strong> {msg.message}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default ChatPage
