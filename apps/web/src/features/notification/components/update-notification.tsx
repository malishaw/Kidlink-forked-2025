// "use client";

// import React, { useState } from "react";
// import { updateNotification } from "../actions/update-notification";

// interface UpdateNotificationFormProps {
//   id: string;
//   title: string;
//   message: string;
//   type: "info" | "success" | "warning" | "error";
//   onSuccess?: () => void;
// }

// const UpdateNotificationForm: React.FC<UpdateNotificationFormProps> = ({
//   id,
//   title: initialTitle,
//   message: initialMessage,
//   type: initialType,
//   onSuccess,
// }) => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [title, setTitle] = useState(initialTitle);
//   const [message, setMessage] = useState(initialMessage);
//   const [type, setType] = useState(initialType);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const openModal = () => setIsOpen(true);
//   const closeModal = () => setIsOpen(false);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setError(null);

//     try {
//       await updateNotification(id, { title, message, type });
//       if (onSuccess) onSuccess();
//       closeModal();
//     } catch (err: any) {
//       setError(err.message || "Failed to update notification");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div>
//       {/* Update button */}
//       <button
//         onClick={openModal}
//         className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded-md"
//       >
//         Update
//       </button>

//       {/* Modal */}
//       {isOpen && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
//           <div className="bg-white w-full max-w-md rounded-lg shadow-lg p-6 relative">
//             <button
//               onClick={closeModal}
//               className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
//             >
//               ✕
//             </button>

//             <h2 className="text-xl font-bold mb-4">Update Notification</h2>

//             {error && (
//               <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4">
//                 {error}
//               </div>
//             )}

//             <form onSubmit={handleSubmit} className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Title
//                 </label>
//                 <input
//                   type="text"
//                   value={title}
//                   onChange={(e) => setTitle(e.target.value)}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   required
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Message
//                 </label>
//                 <textarea
//                   value={message}
//                   onChange={(e) => setMessage(e.target.value)}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   rows={4}
//                   required
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Type
//                 </label>
//                 <select
//                   value={type}
//                   onChange={(e) =>
//                     setType(
//                       e.target.value as "info" | "success" | "warning" | "error"
//                     )
//                   }
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 >
//                   <option value="info">Info</option>
//                   <option value="success">Success</option>
//                   <option value="warning">Warning</option>
//                   <option value="error">Error</option>
//                 </select>
//               </div>

//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md disabled:opacity-50"
//               >
//                 {loading ? "Updating..." : "Update Notification"}
//               </button>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default UpdateNotificationForm;
