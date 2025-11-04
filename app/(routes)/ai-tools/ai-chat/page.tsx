"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import React, { useState } from "react";
import EmptyState from "./_components/EmptyState";

function AiChat() {
  const [userInput, setUserInput] = useState<string>();
  return (
    <div className="px-10 md:px-24 lg:px-36 xl:px-48">
      <div className="flex items-center justify-between gap-8">
        <div>
          <h2 className="font-bold text-lg">AI Career Q/A Chat</h2>
          <p>
            Smarter career decisions start here - get tailored advice, real-time
            market insights
          </p>
        </div>
        <Button>+ New Chat</Button>
      </div>

      <div className="flex flex-col h-[75vh]">
        <div className="mt-5">
          {/* Empty State Options */}
          <EmptyState
            selectedQuestion={(question: string) => setUserInput(question)}
          />
        </div>

        <div className="flex-1">{/* Message List */}</div>

        <div className="flex justify-between items-center gap-6">
          {/* Input Field */}
          <Input
            placeholder="Type here"
            value={userInput}
            onChange={(event) => setUserInput(event.target.value)}
          />
          <Button>
            {" "}
            <Send />{" "}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default AiChat;
