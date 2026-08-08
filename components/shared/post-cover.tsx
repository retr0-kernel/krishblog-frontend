import Image from "next/image";
import { resolveImageUrl } from "@/lib/images-repo";
import { cn } from "@/lib/utils";
import { PostCoverPlaceholder } from "@/components/shared/post-cover-placeholder";

interface PostCoverProps {
  src?: string;
  alt: string;
  title?: string;
  aspect?: string;
  className?: string;
  imageClassName?: string;
  priority?: boolean;
  sizes?: string;
  showPlaceholder?: boolean;
}

export function PostCover({
  src,
  alt,
  title,
  aspect = "aspect-[16/10]",
  className,
  imageClassName,
  priority,
  sizes,
  showPlaceholder = true,
}: PostCoverProps) {
  const resolved = src ? resolveImageUrl(src) : "";

  if (!resolved) {
    if (!showPlaceholder) return null;
    return <PostCoverPlaceholder title={title ?? alt} className={cn(aspect, className)} />;
  }

  return (
    <div className={cn("relative overflow-hidden", aspect, className)}>
      <Image
        src={resolved}
        alt={alt}
        fill
        className={cn("object-cover", imageClassName)}
        priority={priority}
        sizes={sizes}
        unoptimized={resolved.includes("raw.githubusercontent.com")}
      />
    </div>
  );
}
