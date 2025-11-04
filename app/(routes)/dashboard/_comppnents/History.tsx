"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import React, { useState } from "react";

function History() {
  const [userHistory, setUserHistory] = useState([]);
  return (
    <div className="mt-5 p-5 border rounded-xl">
      <h2 className="font-bold text-lg">Previous History</h2>
      <p>What Your previously work on, You can find here.</p>

      {userHistory?.length == 0 && (
        <div className="flex items-center justify-center flex-col mt-6">
          <Image src={"/idea.png"} alt="bulb" width={100} height={100} />
          <h2>You do Not Have any history</h2>
          <Button className="mt-5">Explore AI Tools</Button>
        </div>
      )}
    </div>
  );
}

export default History;
