"use client";

import { useState } from "react";
import { Upload, Image as ImageIcon, Video, File, Plus } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ContentManagement() {
  const [activeTab, setActiveTab] = useState("images");

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Content Management</h1>
          <p className="text-muted-foreground">
            Upload and manage your content
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Upload Content
        </Button>
      </div>

      <Tabs defaultValue="images" className="w-full">
        <TabsList>
          <TabsTrigger value="images">
            <ImageIcon className="h-4 w-4 mr-2" />
            Images
          </TabsTrigger>
          <TabsTrigger value="videos">
            <Video className="h-4 w-4 mr-2" />
            Videos
          </TabsTrigger>
          <TabsTrigger value="files">
            <File className="h-4 w-4 mr-2" />
            Files
          </TabsTrigger>
        </TabsList>

        <TabsContent value="images" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Image grid would go here */}
          </div>
        </TabsContent>

        <TabsContent value="videos" className="mt-6">
          {/* Video content would go here */}
        </TabsContent>

        <TabsContent value="files" className="mt-6">
          {/* Files list would go here */}
        </TabsContent>
      </Tabs>
    </div>
  );
}
