import KanbanBoard from "@/features/board/components/KanbanBoard";

export const metadata = {
  title: "Sprint Board | Enterprise Engine",
  description:
    "Interactive sprint board mapping multi-threaded team execution velocity.",
};

export default function SprintBoardPage() {
  return <KanbanBoard />;
}
