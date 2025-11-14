import { serve } from "inngest/next";
import { inngest } from "../../../inngest/client";
import { AiCareerAgent, AiResumeAgent, helloWorld } from "@/inngest/functions";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    AiCareerAgent,
    AiResumeAgent // <-- This is where you'll always add all your functions
  ],
});