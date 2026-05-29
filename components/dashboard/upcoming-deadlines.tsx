// "use client";

// import { useState } from "react";
// import { motion } from "framer-motion";
// import {
//   Calculator,
//   Microscope,
//   FileText,
//   BookOpen,
//   Plus,
//   Pencil,
//   Trash2,
// } from "lucide-react";
// import {
//   useDeadlines,
//   getDaysLeft,
//   formatDeadlineDate,
// } from "@/store/deadlines-store";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { DeadlineFormDialog } from "@/components/dashboard/deadline-form-dialog";
// import { DeadlinesViewAll } from "@/components/dashboard/deadlines-view-all";
// import type { Planner } from "@/types";

// const iconMap = {
//   calculator: Calculator,
//   microscope: Microscope,
//   "file-text": FileText,
//   book: BookOpen,
// };

// const PREVIEW_COUNT = 3;

// export function UpcomingDeadlines() {
//   const { deadlines, addDeadline, updateDeadline, deleteDeadline } = useDeadlines();
//   const [addOpen, setAddOpen] = useState(false);
//   const [viewAllOpen, setViewAllOpen] = useState(false);
//   const [editing, setEditing] = useState<Planner | null>(null);

//   const preview = deadlines.slice(0, PREVIEW_COUNT);

//   const openEdit = (deadline: Planner) => {
//     setEditing(deadline);
//     setAddOpen(true);
//   };

//   const handleDelete = (deadline: Planner) => {
//     if (window.confirm(`Delete "${deadline.title}"?`)) {
//       deleteDeadline(deadline.id);
//     }
//   };

//   return (
//     <motion.section
//       initial={{ opacity: 0, y: 16 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ delay: 0.2 }}
//       className="glass rounded-2xl p-4 sm:p-5 md:p-6 shadow-sm border border-emerald-100/60 w-full min-w-0"
//     >
//       <h3 className="font-semibold text-emerald-900 text-base sm:text-lg mb-4">
//         Upcoming Deadlines
//       </h3>

//       <div className="space-y-2 sm:space-y-3">
//         {preview.length === 0 ? (
//           <p className="text-sm text-emerald-600/60 text-center py-6">
//             No deadlines yet. Add one below.
//           </p>
//         ) : (
//           preview.map((item, i) => {
//             const Icon =
//               iconMap[item.icon as keyof typeof iconMap] ?? FileText;
//             return (
//               <div
//                 key={item.id}
//                 className="group flex items-center gap-2 sm:gap-3 rounded-xl border border-emerald-50 bg-white/60 p-2.5 sm:p-3 hover:shadow-sm transition-all min-w-0"
//               >
//                 <div className="flex size-9 sm:size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
//                   <Icon className="size-4 sm:size-5" />
//                 </div>
//                 <div className="flex-1 min-w-0">
//                   <p className="font-medium text-emerald-900 text-sm sm:text-base truncate">
//                     {item.title}
//                   </p>
//                   <p className="text-[10px] sm:text-xs text-emerald-600/70 truncate">
//                     {formatDeadlineDate(item.dueDateIso)}
//                   </p>
//                 </div>
//                 <Badge
//                   variant="outline"
//                   className="shrink-0 border-emerald-200 text-emerald-700 bg-emerald-50 text-[10px] sm:text-xs px-1.5 sm:px-2 hidden min-[380px]:inline-flex"
//                 >
//                   {getDaysLeft(item.dueDateIso)}d
//                 </Badge>
//                 <div className="flex gap-0.5 shrink-0 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
//                   <Button
//                     type="button"
//                     variant="ghost"
//                     size="icon-xs"
//                     onClick={() => openEdit(item)}
//                     className="text-emerald-600 hover:bg-emerald-50 size-8"
//                     aria-label="Edit"
//                   >
//                     <Pencil className="size-3.5" />
//                   </Button>
//                   <Button
//                     type="button"
//                     variant="ghost"
//                     size="icon-xs"
//                     onClick={() => handleDelete(item)}
//                     className="text-red-500 hover:bg-red-50 size-8"
//                     aria-label="Delete"
//                   >
//                     <Trash2 className="size-3.5" />
//                   </Button>
//                 </div>
//               </div>
//             );
//           })
//         )}
//         {deadlines.length > PREVIEW_COUNT && (
//           <button
//             type="button"
//             onClick={() => setViewAllOpen(true)}
//             className="w-full text-center text-xs text-emerald-600 hover:text-emerald-700 py-2 touch-manipulation"
//           >
//             +{deadlines.length - PREVIEW_COUNT} more — View all
//           </button>
//         )}
//       </div>

//       <Button
//         type="button"
//         variant="outline"
//         onClick={() => {
//           setEditing(null);
//           setAddOpen(true);
//         }}
//         className="w-full mt-3 sm:mt-4 rounded-xl border-emerald-200 text-emerald-700 hover:bg-emerald-50 gap-2 min-h-[44px] h-11 sm:h-10 text-sm sm:text-base touch-manipulation"
//       >
//         <Plus className="size-4 shrink-0" />
//         <span>Add Planner</span>
//       </Button>

//       <DeadlineFormDialog
//         open={addOpen}
//         onOpenChange={(open) => {
//           setAddOpen(open);
//           if (!open) setEditing(null);
//         }}
//         deadline={editing}
//         onSave={(data) => {
//           if (editing) {
//             updateDeadline(editing.id, data);
//           } else {
//             addDeadline(data);
//           }
//         }}
//       />

//       <DeadlinesViewAll open={viewAllOpen} onOpenChange={setViewAllOpen} />
//     </motion.section>
//   );
// }
