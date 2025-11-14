// import { NextRequest, NextResponse } from "next/server";
// import { WebPDFLoader } from "@langchain/community/document_loaders/web/pdf";
// import { inngest } from "@/inngest/client";
// import axios from "axios";

// export async function POST(req: NextRequest) {
//   const FormData = await req.formData();
//   const resumeFile: any = FormData.get("resumeFile");
//   const recordId = FormData.get("recordId");

//   const loader = new WebPDFLoader(resumeFile);
//   const docs = await loader.load();
//   console.log(docs[0]); //Raw Pdf Text

//   const arrayBuffer = await resumeFile.arrayBuffer();
//   const base64 = Buffer.from(arrayBuffer).toString("base64");

//   const resultIds = await inngest.send({
//     name: "AiResumeAgent",
//     data: {
//       recordId: recordId,
//       base64ResumeFile: base64,
//       pdfText: docs[0]?.pageContent,
//     },
//   });
//   const runId = resultIds?.ids[0];

//   let runStatus;
//   while (true) {
//     runStatus = await getRuns(runId);
//     if (runStatus?.data[0]?.status === "Completed") break;
//     await new Promise((resolve) => setTimeout(resolve, 500));
//   }

//   return NextResponse.json(runStatus.data?.[0].output?.output[0]);
// }

// export async function getRuns(runId: string) {
//   const result = await axios.get(
//     `${process.env.INNGEST_SERVER_HOST}/v1/events/${runId}/runs`,
//     {
//       headers: {
//         Authorization: `Bearer ${process.env.INNGEST_SIGNING_KEY}`,
//       },
//     }
//   );

//   return result.data;
// }






import { NextRequest, NextResponse } from "next/server";
import { WebPDFLoader } from "@langchain/community/document_loaders/web/pdf";
import { inngest } from "@/inngest/client";
import axios from "axios";
import { currentUser } from "@clerk/nextjs/server";

// Increase timeout for this route (if on Vercel Pro)
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    // Parse FormData
    const formData = await req.formData();
    const resumeFile: any = formData.get("file"); // Changed from "resumeFile"
    const recordId = formData.get("recordId");
    const user = await currentUser()

    // Validate file exists
    if (!resumeFile) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    // Validate file type
    if (resumeFile.type !== "application/pdf") {
      return NextResponse.json(
        { error: "Only PDF files are allowed" },
        { status: 400 }
      );
    }

    // Convert File to Blob for WebPDFLoader
    const arrayBuffer = await resumeFile.arrayBuffer();
    const blob = new Blob([arrayBuffer], { type: "application/pdf" });
    
    // Load PDF with WebPDFLoader
    const loader = new WebPDFLoader(blob);
    const docs = await loader.load();
    console.log("PDF loaded:", docs[0]?.pageContent?.substring(0, 100));

    // Convert to base64
    const base64 = Buffer.from(arrayBuffer).toString("base64");

    // Send to Inngest
    const resultIds = await inngest.send({
      name: "AiResumeAgent",
      data: {
        recordId: recordId,
        base64ResumeFile: base64,
        pdfText: docs[0]?.pageContent,
        aiAgentType:'/ai-tools/ai-resume-analyzer',
        userEmail:user?.primaryEmailAddress?.emailAddress
      },
    });

    const runId = resultIds?.ids[0];
    
    if (!runId) {
      throw new Error("Failed to get Inngest run ID");
    }

    // Poll for completion with timeout
    let runStatus;
    let attempts = 0;
    const maxAttempts = 100; // 50 seconds max (500ms * 100)

    while (attempts < maxAttempts) {
      runStatus = await getRuns(runId);
      
      const status = runStatus?.data?.[0]?.status;
      
      if (status === "Completed") {
        break;
      }
      
      if (status === "Failed") {
        throw new Error("Inngest job failed: " + runStatus?.data?.[0]?.error);
      }
      
      await new Promise((resolve) => setTimeout(resolve, 500));
      attempts++;
    }

    if (attempts >= maxAttempts) {
      return NextResponse.json(
        { 
          error: "Processing timeout - job is still running",
          runId: runId,
          message: "Check status later"
        },
        { status: 408 }
      );
    }

    return NextResponse.json({
      success: true,
      data: runStatus?.data?.[0]?.output?.output?.[0]
    });

  } catch (error: any) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: error.message || "Processing failed" },
      { status: 500 }
    );
  }
}

async function getRuns(runId: string) {
  try {
    const result = await axios.get(
      `${process.env.INNGEST_SERVER_HOST}/v1/events/${runId}/runs`,
      {
        headers: {
          Authorization: `Bearer ${process.env.INNGEST_SIGNING_KEY}`,
        },
      }
    );
    return result.data;
  } catch (error: any) {
    console.error("Inngest API error:", error);
    throw new Error("Failed to get run status from Inngest");
  }
}
