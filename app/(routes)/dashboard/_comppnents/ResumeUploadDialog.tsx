// import React, { useState } from "react";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { File, Sparkles } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { v4 as uuidv4 } from "uuid";
// import axios from "axios";

// function ResumeUploadDialog({ openResumeUpload, setOpenResumeUpload }: any) {
//   const [file, setFile] = useState<any>();
//   const onFileChange = (event: any) => {
//     const file = event.target.files?.[0];
//     if (file) {
//       console.log(file.name);
//       setFile(file);
//     }
//   };

//   const onUploadAndAnalyze = async () => {
//     const recordId = uuidv4();
//     const formData = new FormData();
//     formData.append("recordId", recordId);
//     formData.append("file", file);
//     // Send FormData to Backend Server
//     const result = await axios.post("/api/ai-resume-agent", formData);
//     console.log(result.data);
//   };

//   return (
//     <Dialog open={openResumeUpload} onOpenChange={setOpenResumeUpload}>
//       {/* <DialogTrigger>Open</DialogTrigger> */}
//       <DialogContent>
//         <DialogHeader>
//           <DialogTitle>Upload resume pdf file</DialogTitle>
//           <DialogDescription>
//             <div>
//               <label
//                 htmlFor="resumeUpload"
//                 className="flex items-center flex-col
//                 justify-center p-7 border border-dashed rounded-xl
//                 hover:bg-slate-100 cursor-pointer"
//               >
//                 <File className="h-10 w-10" />
//                 {file ? (
//                   <h2 className="mt-3 text-blue-600">{file?.name}</h2>
//                 ) : (
//                   <h2 className="mt-3">Upload here to Upload PDF file</h2>
//                 )}
//               </label>
//               <input
//                 type="file"
//                 id="resumeUpload"
//                 accept="application/pdf"
//                 className="hidden"
//                 onChange={onFileChange}
//               />
//             </div>
//           </DialogDescription>
//         </DialogHeader>
//         <DialogFooter>
//           <Button variant={"outline"}>Cancel</Button>
//           <Button disabled={!file} onClick={onUploadAndAnalyze}>
//             {" "}
//             <Sparkles /> Upload & Analyze
//           </Button>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// }

// export default ResumeUploadDialog;

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { File, Loader2Icon, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { useRouter } from "next/navigation";

function ResumeUploadDialog({ openResumeUpload, setOpenResumeUpload }: any) {
  const [file, setFile] = useState<any>();
  const [loading, setLoading] = useState(false);
  const router = useRouter()

  const onFileChange = (event: any) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log(file.name);
      setFile(file);
    }
  };

  const onUploadAndAnalyze = async () => {
    // try {
    //   setLoading(true);
    //   const recordId = uuidv4();
    //   const formData = new FormData();
    //   formData.append("recordId", recordId);
    //   formData.append("file", file); // Keep as "file"
    //   // formData.append("aiAgentType", "/ai-tools/ai-resume-analyzer");

    //   // Send FormData to Backend Server
    //   const result = await axios.post("/api/ai-resume-agent", formData, {
    //     headers: {
    //       "Content-Type": "multipart/form-data",
    //     },
    //   });

    //   console.log(result.data);
    //   setOpenResumeUpload(false);
    // } catch (error: any) {
    //   console.error("Upload failed:", error);
    //   alert(error.response?.data?.error || "Upload failed");
    // } finally {
    //   setLoading(false);
    //   router.push('/ai-tools/ai-resume-analyzer'+recordId)
    // }
    
      setLoading(true);
      const recordId = uuidv4();
      const formData = new FormData();
      formData.append("recordId", recordId);
      formData.append("file", file); // Keep as "file"
      // formData.append("aiAgentType", "/ai-tools/ai-resume-analyzer");

      // Send FormData to Backend Server
      const result = await axios.post("/api/ai-resume-agent", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log(result.data);
      setLoading(false);
      router.push('/ai-tools/ai-resume-analyzer/'+recordId)
      setOpenResumeUpload(false);
  };

  return (
    <Dialog open={openResumeUpload} onOpenChange={setOpenResumeUpload}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload resume pdf file</DialogTitle>
          <DialogDescription>
            <div>
              <label
                htmlFor="resumeUpload"
                className="flex items-center flex-col 
                justify-center p-7 border border-dashed rounded-xl 
                hover:bg-slate-100 cursor-pointer"
              >
                <File className="h-10 w-10" />
                {file ? (
                  <h2 className="mt-3 text-blue-600">{file?.name}</h2>
                ) : (
                  <h2 className="mt-3">Upload here to Upload PDF file</h2>
                )}
              </label>
              <input
                type="file"
                id="resumeUpload"
                accept="application/pdf"
                className="hidden"
                onChange={onFileChange}
              />
            </div>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant={"outline"}
            onClick={() => setOpenResumeUpload(false)}
          >
            Cancel
          </Button>
          <Button disabled={!file || loading} onClick={onUploadAndAnalyze}>
            {loading ? <Loader2Icon className="animate-spin" /> : <Sparkles />}{" "}
            Upload & Analyze
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default ResumeUploadDialog;
