import { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { TagListView } from "@/module/tags/components/admin";

export const metadata: Metadata = {
  title: "Tags | Admin",
};

export default function TagsPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Tags</h1>
        <Link
          href="/admin/tags/new"
          className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Tag
        </Link>
      </div>
      <div className="bg-white rounded-lg shadow">
        <TagListView />
      </div>
    </div>
  );
}
