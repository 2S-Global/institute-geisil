// import React, { useState, useEffect } from "react";
// import ProfileModal from "./ProfileModal";
//   import { Pencil } from "lucide-react";
// const ProfileMain = ({ setReload, list = [], setError, setSuccess }) => {
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [item, setItem] = useState([]);

//   const openModal = (Edit_item) => {
//     if (Edit_item) {
//       setItem(Edit_item);
//       console.log("Selected Item:", item);
//     } else {
//       setItem([]);
//     }
//     setIsModalOpen(true);
//     document.body.style.overflow = "hidden"; // Disable background scrolling
//   };
//   const closeModal = () => {
//     setIsModalOpen(false);
//     document.body.style.overflow = "auto"; // Re-enable background scrolling
//   };
//   return (


// <>
//   <div className="pt-4">
//     <div className="flex items-start justify-between">
//       <div>
//         <h5 className="text-lg font-semibold">Presentation</h5>
//         <p className="mt-1 text-sm text-muted-foreground">
//           Add links to your online presentations (e.g. SlideShare, etc.)
//         </p>
//       </div>

//       <button
//         onClick={() => openModal()}
//         className="rounded-md p-2 hover:bg-muted transition-colors"
//       >
//         <Pencil className="h-4 w-4" />
//       </button>
//     </div>

//     {Array.isArray(list) &&
//       list.length > 0 &&
//       list.map((item) => (
//         <div key={item._id} className="mt-5 border-b pb-4 last:border-b-0">
//           <div className="flex items-center gap-4">
//             <h6 className="font-semibold text-gray-900">
//               {item.title}
//             </h6>

//             <button
//               onClick={() => openModal(item)}
//               className="rounded-md p-1 hover:bg-muted transition-colors"
//             >
//               <Pencil className="h-4 w-4" />
//             </button>
//           </div>

//           <a
//             href={item.url}
//             target="_blank"
//             rel="noopener noreferrer"
//             className="mt-1 block break-all text-sm text-blue-600 hover:underline"
//           >
//             {item.url}
//           </a>

//           <div
//             className="mt-2"
//             dangerouslySetInnerHTML={{
//               __html: item.description,
//             }}
//           />
//         </div>
//       ))}
//   </div>

//   {isModalOpen && (
//     <ProfileModal
//       show={isModalOpen}
//       onClose={closeModal}
//       setItem={setItem}
//       item={item}
//       setReload={setReload}
//       setError={setError}
//       setSuccess={setSuccess}
//     />
//   )}
// </>
//   );
// };

// export default ProfileMain;
import React, { useState } from "react";
import ProfileModal from "./ProfileModal";
import { Pencil, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const ProfileMain = ({ setReload, list = [], setError, setSuccess }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [item, setItem] = useState([]);

  const openModal = (Edit_item) => {
    setItem(Edit_item || []);
    setIsModalOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = "auto";
  };

  return (
    <div className="pt-4 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h5 className="text-lg font-semibold">Presentation</h5>
          <p className="text-sm text-muted-foreground">
            Add links to your online presentations (e.g. SlideShare, etc.)
          </p>
        </div>

        {/* Show 'Add' button only if list is empty */}
        {(!Array.isArray(list) || list.length === 0) && (
          <Button size="sm" onClick={() => openModal()} >
            <Plus className="mr-2 h-4 w-4" /> Add Presentation
          </Button>
        )}
      </div>

      {Array.isArray(list) &&
        list.map((item) => (
          <Card key={item._id}>
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
              <CardTitle className="text-base">{item.title}</CardTitle>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => openModal(item)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:underline break-all"
              >
                {item.url}
              </a>
              <div
                className="mt-2 text-sm text-muted-foreground"
                dangerouslySetInnerHTML={{ __html: item.description }}
              />
            </CardContent>
          </Card>
        ))}

      {isModalOpen && (
        <ProfileModal
          show={isModalOpen}
          onClose={closeModal}
          setItem={setItem}
          item={item}
          setReload={setReload}
          setError={setError}
          setSuccess={setSuccess}
        />
      )}
    </div>
  );
};

export default ProfileMain;