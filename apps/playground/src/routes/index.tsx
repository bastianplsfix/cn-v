import { createFileRoute } from "@tanstack/react-router";
import { DocsContent } from "../components/docs-content";
import { GalleryPage } from "../components/gallery";

export const Route = createFileRoute("/")({
  component: DocsPage,
});

function DocsPage() {
  return (
    <GalleryPage
      title="cn-variants"
      description="Tiny utilities for Tailwind CSS class names. Combines clsx + tailwind-merge with a typed variants helper."
    >
      <DocsContent />
    </GalleryPage>
  );
}
