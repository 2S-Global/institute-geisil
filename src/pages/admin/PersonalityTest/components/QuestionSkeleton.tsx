import { Skeleton } from "@/components/ui/skeleton";

export function QuestionSkeleton() {
  return (
    <tr className="hover:bg-gray-50/50 transition">
      {/* Question Text Skeleton */}
      <td className="py-4 px-4 sm:px-6 font-medium">
        <Skeleton className="h-5 w-3/4 max-w-md rounded-md" />
      </td>
      {/* Actions (Pencil & Trash buttons) Skeleton */}
      <td className="py-4 px-4 sm:px-6 text-right whitespace-nowrap">
        <div className="inline-flex items-center space-x-1 sm:space-x-2">
          {/* Edit button skeleton */}
          <Skeleton className="h-8 w-8 rounded-lg shrink-0" />
          {/* Delete button skeleton */}
          <Skeleton className="h-8 w-8 rounded-lg shrink-0" />
        </div>
      </td>
    </tr>
  );
}
