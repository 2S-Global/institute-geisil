
// import React, { useState, useEffect } from "react";
// import * as LucideIcons from "lucide-react";
// import { Loader2, Search, Sparkles, RotateCcw } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { Label } from "@/components/ui/label";
// import { Badge } from "@/components/ui/badge";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { DynamicIcon } from "./DynamicIcon";
// import { VerificationItem } from "./VerificationCard";

// export interface FormDataState {
//   title: string;
//   description: string;
//   icon: string;
//   backgroundColor: string;
//   iconColor: string;
// }

// export const EXACT_SVG_PAYLOAD = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l7 4v6c0 5-3.5 9.5-7 10-3.5-.5-7-5-7-10V6l7-4zm-1 10l-2-2-1.5 1.5L11 15l6-6-1.5-1.5L11 12z"/></svg>`;

// // Pure dynamic defaults (No hardcoded static green)
// export const BLANK_FORM_STATE: FormDataState = {
//   title: "",
//   description: "",
//   icon: EXACT_SVG_PAYLOAD,
//   backgroundColor: "#f1f5f9",
//   iconColor: "#000000",
// };

// const ALL_LUCIDE_ICON_NAMES = Object.keys(LucideIcons).filter((key) => {
//   const item = (LucideIcons as Record<string, unknown>)[key];
//   return (
//     typeof item === "object" ||
//     (typeof item === "function" && key !== "createLucideIcon")
//   );
// });

// interface VerificationFormDialogProps {
//   open: boolean;
//   onOpenChange: (open: boolean) => void;
//   editingItem: VerificationItem | null;
//   submitting: boolean;
//   onSubmit: (formData: FormDataState) => Promise<void>;
// }

// export const VerificationFormDialog: React.FC<VerificationFormDialogProps> = ({
//   open,
//   onOpenChange,
//   editingItem,
//   submitting,
//   onSubmit,
// }) => {
//   const [formData, setFormData] = useState<FormDataState>(BLANK_FORM_STATE);
//   const [isIconPickerOpen, setIsIconPickerOpen] = useState(false);
//   const [iconSearch, setIconSearch] = useState("");

//   useEffect(() => {
//     if (open) {
//       if (editingItem) {
//         setFormData({
//           title: editingItem.title || "",
//           description: editingItem.description || "",
//           icon: editingItem.icon || EXACT_SVG_PAYLOAD,
//           backgroundColor: editingItem.backgroundColor || "#f1f5f9",
//           iconColor: editingItem.iconColor || "#000000",
//         });
//       } else {
//         setFormData(BLANK_FORM_STATE);
//       }
//       setIconSearch("");
//     }
//   }, [editingItem, open]);

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     onSubmit(formData);
//   };

//   const filteredIconNames = ALL_LUCIDE_ICON_NAMES.filter((name) =>
//     name.toLowerCase().includes(iconSearch.toLowerCase()),
//   ).slice(0, 80);

//   return (
//     <>
//       <Dialog open={open} onOpenChange={onOpenChange}>
//         <DialogContent className="sm:max-w-[700px] max-h-[92vh] overflow-y-auto p-0 rounded-3xl border-slate-200 shadow-2xl">
//           {/* Header */}
//           <div className="bg-slate-50/80 backdrop-blur border-b border-slate-100 p-6 pb-5">
//             <div className="flex items-center gap-2 mb-1">
//               <Badge
//                 variant="outline"
//                 className="bg-slate-100 text-slate-700 border-slate-200 text-[11px] font-medium px-2 py-0.5"
//               >
//                 {editingItem ? "CMS Management" : "New Service"}
//               </Badge>
//             </div>
//             <DialogTitle className="text-xl font-bold text-slate-900 tracking-tight">
//               {editingItem ? "Edit Verification Card" : "Add Verification Card"}
//             </DialogTitle>
//             <DialogDescription className="text-slate-500 text-xs mt-1">
//               Customize the text, brand colors, and iconography for the landing page card.
//             </DialogDescription>
//           </div>

//           <form onSubmit={handleSubmit} className="p-6 space-y-6">
//             <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
//               {/* Left Column: Form Controls */}
//               <div className="md:col-span-7 space-y-5">
//                 {/* Title */}
//                 <div className="space-y-1.5">
//                   <Label htmlFor="title" className="text-xs font-semibold text-slate-700">
//                     Card Title <span className="text-red-500">*</span>
//                   </Label>
//                   <Input
//                     id="title"
//                     placeholder="e.g. Verified Identity"
//                     value={formData.title}
//                     onChange={(e) =>
//                       setFormData({ ...formData, title: e.target.value })
//                     }
//                     className="h-10 rounded-xl border-slate-200 focus-visible:ring-slate-900 text-sm"
//                     required
//                   />
//                 </div>

//                 {/* Icon Selection Row */}
//                 <div className="space-y-1.5">
//                   <Label className="text-xs font-semibold text-slate-700">
//                     Icon / Graphic Symbol <span className="text-red-500">*</span>
//                   </Label>
//                   <div className="flex items-center gap-2">
//                     <button
//                       type="button"
//                       onClick={() => setIsIconPickerOpen(true)}
//                       className="flex-1 flex items-center justify-between h-10 px-3 border border-slate-200 rounded-xl hover:border-slate-300 hover:bg-slate-50 transition-all text-left bg-white shadow-sm"
//                     >
//                       <div className="flex items-center gap-2.5 truncate">
//                         <DynamicIcon
//                           icon={formData.icon}
//                           color={formData.iconColor}
//                           className="h-5 w-5 shrink-0"
//                         />
//                         <span className="text-xs font-medium text-slate-700 truncate">
//                           {formData.icon.startsWith("<svg")
//                             ? "Custom Shield SVG"
//                             : formData.icon}
//                         </span>
//                       </div>
//                       <span className="text-[11px] text-slate-600 font-semibold bg-slate-100 px-2 py-0.5 rounded-md shrink-0">
//                         Browse
//                       </span>
//                     </button>

//                     <Button
//                       type="button"
//                       variant="ghost"
//                       size="icon"
//                       className="h-10 w-10 shrink-0 border border-slate-200 rounded-xl hover:bg-slate-100 text-slate-500"
//                       title="Reset to Default Shield SVG"
//                       onClick={() =>
//                         setFormData({ ...formData, icon: EXACT_SVG_PAYLOAD })
//                       }
//                     >
//                       <RotateCcw className="h-4 w-4" />
//                     </Button>
//                   </div>
//                 </div>

//                 {/* Color Palette Controls */}
//                 <div className="grid grid-cols-2 gap-3 pt-1">
//                   {/* Dynamic Icon Color */}
//                   <div className="space-y-1.5">
//                     <Label htmlFor="iconColor" className="text-xs font-semibold text-slate-700">
//                       Icon Color
//                     </Label>
//                     <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl p-1.5">
//                       <input
//                         type="color"
//                         id="iconColor"
//                         value={formData.iconColor}
//                         onChange={(e) =>
//                           setFormData({ ...formData, iconColor: e.target.value })
//                         }
//                         className="h-7 w-8 rounded-lg cursor-pointer border-0 bg-transparent p-0"
//                       />
//                       <Input
//                         type="text"
//                         value={formData.iconColor}
//                         onChange={(e) =>
//                           setFormData({ ...formData, iconColor: e.target.value })
//                         }
//                         className="h-7 border-0 bg-transparent font-mono text-xs uppercase p-0 focus-visible:ring-0 shadow-none text-slate-700 font-medium"
//                       />
//                     </div>
//                   </div>

//                   {/* Dynamic Background Badge Fill Color */}
//                   <div className="space-y-1.5">
//                     <Label htmlFor="backgroundColor" className="text-xs font-semibold text-slate-700">
//                       Badge Fill
//                     </Label>
//                     <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl p-1.5">
//                       <input
//                         type="color"
//                         id="backgroundColor"
//                         value={formData.backgroundColor}
//                         onChange={(e) =>
//                           setFormData({ ...formData, backgroundColor: e.target.value })
//                         }
//                         className="h-7 w-8 rounded-lg cursor-pointer border-0 bg-transparent p-0"
//                       />
//                       <Input
//                         type="text"
//                         value={formData.backgroundColor}
//                         onChange={(e) =>
//                           setFormData({ ...formData, backgroundColor: e.target.value })
//                         }
//                         className="h-7 border-0 bg-transparent font-mono text-xs uppercase p-0 focus-visible:ring-0 shadow-none text-slate-700 font-medium"
//                       />
//                     </div>
//                   </div>
//                 </div>

//                 {/* Description */}
//                 <div className="space-y-1.5">
//                   <Label htmlFor="description" className="text-xs font-semibold text-slate-700">
//                     Description <span className="text-red-500">*</span>
//                   </Label>
//                   <Textarea
//                     id="description"
//                     placeholder="Briefly explain what this verification badge offers..."
//                     rows={3}
//                     value={formData.description}
//                     onChange={(e) =>
//                       setFormData({ ...formData, description: e.target.value })
//                     }
//                     className="rounded-xl border-slate-200 focus-visible:ring-slate-900 text-sm leading-relaxed resize-none"
//                     required
//                   />
//                 </div>
//               </div>

//               {/* Right Column: Dynamic Live Preview */}
//               <div className="md:col-span-5 flex flex-col space-y-2">
//                 <div className="flex items-center justify-between">
//                   <Label className="text-[11px] uppercase tracking-wider text-slate-400 font-bold flex items-center gap-1.5">
//                     <Sparkles className="h-3 w-3 text-amber-500" />
//                     Live Component
//                   </Label>
//                   <span className="text-[10px] text-slate-400 font-mono">1:1 Scale</span>
//                 </div>

//                 <div className="flex-1 border border-slate-200/80 rounded-2xl p-4 bg-gradient-to-b from-slate-50/50 to-slate-100/30 flex flex-col justify-center items-center">
//                   <Card className="w-full rounded-2xl border border-slate-100 shadow-sm bg-white p-5 transition-all">
//                     <CardHeader className="p-0 pb-3">
//                       {/* Dynamic Background Color */}
//                       <div
//                         className="h-12 w-12 rounded-xl flex items-center justify-center mb-3 shadow-inner transition-colors duration-300"
//                         style={{ backgroundColor: formData.backgroundColor }}
//                       >
//                         {/* Dynamic Icon Color */}
//                         <DynamicIcon
//                           icon={formData.icon}
//                           color={formData.iconColor}
//                           className="h-6 w-6"
//                         />
//                       </div>
//                       <CardTitle className="text-lg font-bold text-slate-900 tracking-tight leading-snug min-h-[1.5rem]">
//                         {formData.title || <span className="text-slate-300 italic">Untitled Card</span>}
//                       </CardTitle>
//                     </CardHeader>
//                     <CardContent className="p-0">
//                       <CardDescription className="text-slate-500 text-xs leading-relaxed min-h-[2rem] break-words whitespace-pre-wrap">
//                         {formData.description || (
//                           <span className="text-slate-300 italic">
//                             Card description preview will appear here in real-time...
//                           </span>
//                         )}
//                       </CardDescription>
//                     </CardContent>
//                   </Card>
//                 </div>
//               </div>
//             </div>

//             {/* Footer */}
//             <DialogFooter className="border-t border-slate-100 pt-4 flex items-center justify-between gap-3">
//               <Button
//                 type="button"
//                 variant="ghost"
//                 onClick={() => onOpenChange(false)}
//                 disabled={submitting}
                
//               >
//                 Cancel
//               </Button>
//               <Button
//                 type="submit"
//                 disabled={submitting}
               
//               >
//                 {submitting ? (
//                   <>
//                     <Loader2 className="h-4 w-4 animate-spin" />
//                     Saving Changes...
//                   </>
//                 ) : editingItem ? (
//                   "Update Card"
//                 ) : (
//                   "Publish Card"
//                 )}
//               </Button>
//             </DialogFooter>
//           </form>
//         </DialogContent>
//       </Dialog>

//       {/* Modern Icon Picker Overlay */}
//       <Dialog open={isIconPickerOpen} onOpenChange={setIsIconPickerOpen}>
//         <DialogContent className="sm:max-w-[480px] p-0 rounded-2xl border-slate-200">
//           <div className="p-4 border-b border-slate-100 bg-slate-50/50">
//             <DialogTitle className="text-base font-bold text-slate-900">Icon Library</DialogTitle>
//             <DialogDescription className="text-xs text-slate-500">
//               Select a visual vector icon to represent this service card.
//             </DialogDescription>
//           </div>

//           <div className="p-4 space-y-3">
//             <div className="relative">
//               <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
//               <Input
//                 placeholder="Search by keyword (e.g. Shield, Check, Lock)..."
//                 value={iconSearch}
//                 onChange={(e) => setIconSearch(e.target.value)}
//                 className="pl-9 h-9 text-xs rounded-xl border-slate-200 focus-visible:ring-slate-900"
//               />
//             </div>

//             <div className="grid grid-cols-5 gap-2 max-h-[260px] overflow-y-auto p-1 border rounded-xl bg-slate-50/30">
//               {filteredIconNames.map((name) => {
//                 const isSelected = formData.icon === name;
//                 return (
//                   <button
//                     key={name}
//                     type="button"
//                     onClick={() => {
//                       setFormData({ ...formData, icon: name });
//                       setIsIconPickerOpen(false);
//                     }}
//                     className={`flex flex-col items-center justify-center p-2 rounded-xl border transition-all ${
//                       isSelected
//                         ? "border-slate-800 bg-slate-200 shadow-sm"
//                         : "border-slate-200/80 bg-slate-100/80 hover:bg-slate-200/60"
//                     }`}
//                   >
//                     <DynamicIcon
//                       icon={name}
//                       color={formData.iconColor}
//                       className="h-5 w-5 mb-1"
//                     />
//                     <span className="text-[9px] truncate w-full text-center font-medium text-slate-700">
//                       {name}
//                     </span>
//                   </button>
//                 );
//               })}
//             </div>
//           </div>
//         </DialogContent>
//       </Dialog>
//     </>
//   );
// };

import React, { useState, useEffect } from "react";
import * as LucideIcons from "lucide-react";
import { Loader2, Search, Sparkles, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DynamicIcon } from "./DynamicIcon";
import { VerificationItem } from "./VerificationCard";

export interface FormDataState {
  title: string;
  description: string;
  icon: string;
  backgroundColor: string;
  iconColor: string;
}

export const EXACT_SVG_PAYLOAD = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l7 4v6c0 5-3.5 9.5-7 10-3.5-.5-7-5-7-10V6l7-4zm-1 10l-2-2-1.5 1.5L11 15l6-6-1.5-1.5L11 12z"/></svg>`;

// Pure dynamic defaults (No hardcoded static green)
export const BLANK_FORM_STATE: FormDataState = {
  title: "",
  description: "",
  icon: EXACT_SVG_PAYLOAD,
  backgroundColor: "#f1f5f9",
  iconColor: "#000000",
};

const ALL_LUCIDE_ICON_NAMES = Object.keys(LucideIcons).filter((key) => {
  const item = (LucideIcons as Record<string, unknown>)[key];
  return (
    typeof item === "object" ||
    (typeof item === "function" && key !== "createLucideIcon")
  );
});

interface VerificationFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingItem: VerificationItem | null;
  submitting: boolean;
  onSubmit: (formData: FormDataState) => Promise<void>;
}

export const VerificationFormDialog: React.FC<VerificationFormDialogProps> = ({
  open,
  onOpenChange,
  editingItem,
  submitting,
  onSubmit,
}) => {
  const [formData, setFormData] = useState<FormDataState>(BLANK_FORM_STATE);
  const [isIconPickerOpen, setIsIconPickerOpen] = useState(false);
  const [iconSearch, setIconSearch] = useState("");

  useEffect(() => {
    if (open) {
      if (editingItem) {
        setFormData({
          title: editingItem.title || "",
          description: editingItem.description || "",
          icon: editingItem.icon || EXACT_SVG_PAYLOAD,
          backgroundColor: editingItem.backgroundColor || "#f1f5f9",
          iconColor: editingItem.iconColor || "#000000",
        });
      } else {
        setFormData(BLANK_FORM_STATE);
      }
      setIconSearch("");
    }
  }, [editingItem, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const filteredIconNames = ALL_LUCIDE_ICON_NAMES.filter((name) =>
    name.toLowerCase().includes(iconSearch.toLowerCase()),
  ).slice(0, 80);

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[700px] max-h-[92vh] overflow-y-auto p-0 rounded-3xl border-slate-200 shadow-2xl">
          {/* Header */}
          <div className="bg-slate-50/80 backdrop-blur border-b border-slate-100 p-6 pb-5">
            <div className="flex items-center gap-2 mb-1">
              <Badge
                variant="outline"
                className="bg-slate-100 text-slate-700 border-slate-200 text-[11px] font-medium px-2 py-0.5"
              >
                {editingItem ? "CMS Management" : "New Service"}
              </Badge>
            </div>
            <DialogTitle className="text-xl font-bold text-slate-900 tracking-tight">
              {editingItem ? "Edit Verification Card" : "Add Verification Card"}
            </DialogTitle>
            <DialogDescription className="text-slate-500 text-xs mt-1">
              Customize the text, brand colors, and iconography for the landing page card.
            </DialogDescription>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Left Column: Form Controls */}
              <div className="md:col-span-7 space-y-5">
                {/* Title */}
                <div className="space-y-1.5">
                  <Label htmlFor="title" className="text-xs font-semibold text-slate-700">
                    Card Title <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="title"
                    placeholder="e.g. Verified Identity"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="h-10 rounded-xl border-slate-200 focus-visible:ring-slate-900 text-sm"
                    required
                  />
                </div>

                {/* Icon Selection Row */}
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-700">
                    Icon / Graphic Symbol <span className="text-red-500">*</span>
                  </Label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsIconPickerOpen(true)}
                      className="flex-1 flex items-center justify-between h-10 px-3 border border-slate-200 rounded-xl hover:border-slate-300 hover:bg-slate-50 transition-all text-left bg-white shadow-sm"
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <DynamicIcon
                          icon={formData.icon}
                          color={formData.iconColor}
                          className="h-5 w-5 shrink-0"
                        />
                        <span className="text-xs font-medium text-slate-700 truncate">
                          {formData.icon.startsWith("<svg")
                            ? "Custom Shield SVG"
                            : formData.icon}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-600 font-semibold bg-slate-100 px-2 py-0.5 rounded-md shrink-0">
                        Browse
                      </span>
                    </button>

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10 shrink-0 border border-slate-200 rounded-xl hover:bg-slate-100 text-slate-500"
                      title="Reset to Default Shield SVG"
                      onClick={() =>
                        setFormData({ ...formData, icon: EXACT_SVG_PAYLOAD })
                      }
                    >
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Color Palette Controls */}
                <div className="grid grid-cols-2 gap-3 pt-1">
                  {/* Dynamic Icon Color */}
                  <div className="space-y-1.5">
                    <Label htmlFor="iconColor" className="text-xs font-semibold text-slate-700">
                      Icon Color
                    </Label>
                    <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl p-1.5">
                      <input
                        type="color"
                        id="iconColor"
                        value={formData.iconColor}
                        onChange={(e) =>
                          setFormData({ ...formData, iconColor: e.target.value })
                        }
                        className="h-7 w-8 rounded-lg cursor-pointer border-0 bg-transparent p-0"
                      />
                      <Input
                        type="text"
                        value={formData.iconColor}
                        onChange={(e) =>
                          setFormData({ ...formData, iconColor: e.target.value })
                        }
                        className="h-7 border-0 bg-transparent font-mono text-xs uppercase p-0 focus-visible:ring-0 shadow-none text-slate-700 font-medium"
                      />
                    </div>
                  </div>

                  {/* Dynamic Background Badge Fill Color */}
                  <div className="space-y-1.5">
                    <Label htmlFor="backgroundColor" className="text-xs font-semibold text-slate-700">
                      Badge Fill
                    </Label>
                    <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl p-1.5">
                      <input
                        type="color"
                        id="backgroundColor"
                        value={formData.backgroundColor}
                        onChange={(e) =>
                          setFormData({ ...formData, backgroundColor: e.target.value })
                        }
                        className="h-7 w-8 rounded-lg cursor-pointer border-0 bg-transparent p-0"
                      />
                      <Input
                        type="text"
                        value={formData.backgroundColor}
                        onChange={(e) =>
                          setFormData({ ...formData, backgroundColor: e.target.value })
                        }
                        className="h-7 border-0 bg-transparent font-mono text-xs uppercase p-0 focus-visible:ring-0 shadow-none text-slate-700 font-medium"
                      />
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                  <Label htmlFor="description" className="text-xs font-semibold text-slate-700">
                    Description <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Briefly explain what this verification badge offers..."
                    rows={3}
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="rounded-xl border-slate-200 focus-visible:ring-slate-900 text-sm leading-relaxed resize-none"
                    required
                  />
                </div>
              </div>

              {/* Right Column: Dynamic Live Preview */}
              <div className="md:col-span-5 flex flex-col space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-[11px] uppercase tracking-wider text-slate-400 font-bold flex items-center gap-1.5">
                    <Sparkles className="h-3 w-3 text-amber-500" />
                    Live Component
                  </Label>
                  <span className="text-[10px] text-slate-400 font-mono">1:1 Scale</span>
                </div>

                <div className="flex-1 border border-slate-200/80 rounded-2xl p-4 bg-gradient-to-b from-slate-50/50 to-slate-100/30 flex flex-col justify-center items-center">
                  <Card className="w-full rounded-2xl border border-slate-100 shadow-sm bg-white p-5 transition-all">
                    <CardHeader className="p-0 pb-3">
                      {/* Dynamic Background Color */}
                      <div
                        className="h-12 w-12 rounded-xl flex items-center justify-center mb-3 shadow-inner transition-colors duration-300"
                        style={{ backgroundColor: formData.backgroundColor || "#f1f5f9" }}
                      >
                        {/* Dynamic Icon Color */}
                        <DynamicIcon
                          icon={formData.icon}
                          color={formData.iconColor}
                          className="h-6 w-6"
                        />
                      </div>
                      <CardTitle className="text-lg font-bold text-slate-900 tracking-tight leading-snug min-h-[1.5rem]">
                        {formData.title || <span className="text-slate-300 italic">Untitled Card</span>}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <CardDescription className="text-slate-500 text-xs leading-relaxed min-h-[2rem] break-words whitespace-pre-wrap">
                        {formData.description || (
                          <span className="text-slate-300 italic">
                            Card description preview will appear here in real-time...
                          </span>
                        )}
                      </CardDescription>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>

            {/* Footer */}
            <DialogFooter className="border-t border-slate-100 pt-4 flex items-center justify-between gap-3">
              <Button
                type="button"
                variant="ghost"
                onClick={() => onOpenChange(false)}
                disabled={submitting}
                className="rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={submitting}
                className="gap-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl px-5 text-xs font-semibold shadow-md"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving Changes...
                  </>
                ) : editingItem ? (
                  "Update Card"
                ) : (
                  "Publish Card"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modern Icon Picker Overlay */}
      <Dialog open={isIconPickerOpen} onOpenChange={setIsIconPickerOpen}>
        <DialogContent className="sm:max-w-[480px] p-0 rounded-2xl border-slate-200">
          <div className="p-4 border-b border-slate-100 bg-slate-50/50">
            <DialogTitle className="text-base font-bold text-slate-900">Icon Library</DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Select a visual vector icon to represent this service card.
            </DialogDescription>
          </div>

          <div className="p-4 space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search by keyword (e.g. Shield, Check, Lock)..."
                value={iconSearch}
                onChange={(e) => setIconSearch(e.target.value)}
                className="pl-9 h-9 text-xs rounded-xl border-slate-200 focus-visible:ring-slate-900"
              />
            </div>

            <div className="grid grid-cols-5 gap-2 max-h-[260px] overflow-y-auto p-1 border rounded-xl bg-slate-50/30">
              {filteredIconNames.map((name) => {
                const isSelected = formData.icon === name;
                return (
                  <button
                    key={name}
                    type="button"
                    onClick={() => {
                      setFormData({ ...formData, icon: name });
                      setIsIconPickerOpen(false);
                    }}
                    // style={{ color: formData.iconColor }}
                    style={{ color: "#334155" }}
                    className={`flex flex-col items-center justify-center p-2 rounded-xl border transition-all ${
                      isSelected
                        ? "border-slate-800 bg-slate-200 shadow-sm"
                        : "border-slate-200/80 bg-slate-100/80 hover:bg-slate-200/60"
                    }`}
                  >
                    <DynamicIcon
                      icon={name}
                     color="#334155"
                      className="h-5 w-5 mb-1"
                    />
                    <span className="text-[9px] truncate w-full text-center font-medium text-slate-700">
                      {name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};