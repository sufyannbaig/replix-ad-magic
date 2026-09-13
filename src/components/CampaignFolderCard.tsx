import folderGray from "@/assets/redesign/folder-gray.svg";
import folderPink from "@/assets/redesign/folder-pink.svg";
import folderTeal from "@/assets/redesign/folder-teal.svg";
import folderYellow from "@/assets/redesign/folder-yellow.svg";
import { cn } from "@/lib/utils";

const folders = [folderGray, folderYellow, folderPink, folderTeal];

export function CampaignFolderCard({
  title,
  count,
  images,
  index = 0,
  className,
}: {
  title: string;
  count: number;
  images: string[];
  index?: number;
  className?: string;
}) {
  const front = images[0];
  const back = images[1] ?? front;

  return (
    <article className={cn("relative aspect-[294/271] w-full", className)}>
      <img src={folders[index % folders.length]} alt="" className="absolute inset-0 h-full w-full" />
      {back ? (
        <div className="absolute top-[48%] left-[49.7%] h-[31.4%] w-[45.2%] overflow-hidden rounded-xl">
          <img src={back} alt="" className="h-full w-full object-cover" />
        </div>
      ) : null}
      {front ? (
        <div className="absolute top-[28.4%] left-[14.6%] h-[56.8%] w-[69.7%] overflow-hidden rounded-xl">
          <img src={front} alt="" className="h-full w-full object-cover" />
        </div>
      ) : null}
      <div className="absolute top-[71.2%] flex h-[28.8%] w-full flex-col justify-center rounded-b-xl bg-card px-4">
        <p className="truncate text-sm font-semibold text-navy">{title}</p>
        <p className="text-xs text-muted-foreground">{count} Creatives</p>
      </div>
    </article>
  );
}