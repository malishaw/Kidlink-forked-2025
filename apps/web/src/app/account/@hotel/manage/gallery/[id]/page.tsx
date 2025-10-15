// "use client";

// import { deleteGallery } from "@/features/gallery/actions/delete-gallery";
// import { useGetGalleryById } from "@/features/gallery/actions/get-gallery-by-id";
// import { Button } from "@repo/ui/components/button";
// import {
//   ArrowLeft,
//   Calendar,
//   Download,
//   Edit,
//   Share2,
//   Tag,
//   Trash2,
//   User,
// } from "lucide-react";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { useState } from "react";

// interface Props {
//   params: {
//     id: string;
//   };
// }

// export default function GalleryDetailPage({ params }: Props) {
//   const { id } = params;
//   const router = useRouter();
//   const { data: gallery, isLoading, error } = useGetGalleryById(id);
//   const [selectedImage, setSelectedImage] = useState<string | null>(null);
//   const [isDeleting, setIsDeleting] = useState(false);
//   const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

//   const handleDelete = async () => {
//     setIsDeleting(true);
//     try {
//       await deleteGallery(id);
//       // Navigate back to gallery list after successful deletion
//       router.push("/account/manage/gallery");
//       // Optional: Show success message
//       alert("Gallery deleted successfully!");
//     } catch (error) {
//       console.error("Error deleting gallery:", error);
//       alert("Failed to delete gallery. Please try again.");
//     } finally {
//       setIsDeleting(false);
//       setShowDeleteConfirm(false);
//     }
//   };

//   if (isLoading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
//           <p className="text-lg text-gray-600">Loading gallery...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="text-6xl text-red-400 mb-4">⚠️</div>
//           <h2 className="text-2xl font-bold text-gray-800 mb-2">
//             Error Loading Gallery
//           </h2>
//           <p className="text-gray-600 mb-4">{error.message}</p>
//           <Link href="/account/manage/gallery">
//             <Button variant="outline">
//               <ArrowLeft className="w-4 h-4 mr-2" />
//               Back to Galleries
//             </Button>
//           </Link>
//         </div>
//       </div>
//     );
//   }

//   if (!gallery) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="text-6xl text-gray-400 mb-4">📷</div>
//           <h2 className="text-2xl font-bold text-gray-800 mb-2">
//             Gallery Not Found
//           </h2>
//           <p className="text-gray-600 mb-4">
//             The gallery you're looking for doesn't exist.
//           </p>
//           <Link href="/account/manage/gallery">
//             <Button variant="outline">
//               <ArrowLeft className="w-4 h-4 mr-2" />
//               Back to Galleries
//             </Button>
//           </Link>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header */}
//       <div className="bg-white shadow-sm border-b">
//         <div className="max-w-7xl mx-auto px-6 py-4">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-4">
//               <Link href="/account/manage/gallery">
//                 <Button variant="outline" size="sm">
//                   <ArrowLeft className="w-4 h-4 mr-2" />
//                   Back to Galleries
//                 </Button>
//               </Link>
//               <div>
//                 <h1 className="text-3xl font-bold text-gray-900">
//                   {gallery.title}
//                 </h1>
//                 <p className="text-gray-600 mt-1">
//                   {gallery.images?.length || 0} photo
//                   {(gallery.images?.length || 0) !== 1 ? "s" : ""}
//                 </p>
//               </div>
//             </div>

//             <div className="flex items-center gap-2">
//               <Button variant="outline" size="sm">
//                 <Share2 className="w-4 h-4 mr-2" />
//                 Share
//               </Button>
//               <Button variant="outline" size="sm">
//                 <Download className="w-4 h-4 mr-2" />
//                 Download All
//               </Button>
//               <Button variant="outline" size="sm">
//                 <Edit className="w-4 h-4 mr-2" />
//                 Edit
//               </Button>
//               <Button
//                 variant="outline"
//                 size="sm"
//                 className="text-red-600 hover:bg-red-50 border-red-200"
//                 onClick={() => setShowDeleteConfirm(true)}
//                 disabled={isDeleting}
//               >
//                 <Trash2 className="w-4 h-4 mr-2" />
//                 {isDeleting ? "Deleting..." : "Delete"}
//               </Button>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="max-w-7xl mx-auto px-6 py-8">
//         {/* Gallery Info */}
//         <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
//           <div className="grid md:grid-cols-2 gap-6">
//             <div>
//               <h2 className="text-lg font-semibold text-gray-900 mb-4">
//                 Gallery Information
//               </h2>
//               <div className="space-y-3">
//                 <div className="flex items-center gap-3">
//                   <Tag className="w-5 h-5 text-gray-400" />
//                   <div>
//                     <span className="text-sm text-gray-500">Type:</span>
//                     <span className="ml-2 bg-purple-100 text-purple-700 px-2 py-1 rounded text-sm">
//                       {gallery.type}
//                     </span>
//                   </div>
//                 </div>

//                 <div className="flex items-center gap-3">
//                   <Calendar className="w-5 h-5 text-gray-400" />
//                   <div>
//                     <span className="text-sm text-gray-500">Created:</span>
//                     <span className="ml-2 text-gray-900">
//                       {new Date(gallery.createdAt).toLocaleDateString("en-US", {
//                         year: "numeric",
//                         month: "long",
//                         day: "numeric",
//                       })}
//                     </span>
//                   </div>
//                 </div>

//                 <div className="flex items-center gap-3">
//                   <User className="w-5 h-5 text-gray-400" />
//                   <div>
//                     <span className="text-sm text-gray-500">Created by:</span>
//                     <span className="ml-2 text-gray-900">
//                       {gallery.createdBy}
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div>
//               <h2 className="text-lg font-semibold text-gray-900 mb-4">
//                 Description
//               </h2>
//               <p className="text-gray-700 leading-relaxed">
//                 {gallery.description ||
//                   "No description provided for this gallery."}
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Photos Grid */}
//         {gallery.images && gallery.images.length > 0 ? (
//           <div className="bg-white rounded-lg shadow-sm p-6">
//             <h2 className="text-lg font-semibold text-gray-900 mb-6">Photos</h2>
//             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
//               {gallery.images.map((image, index) => (
//                 <div
//                   key={index}
//                   className="relative group cursor-pointer bg-gray-100 rounded-lg overflow-hidden aspect-square"
//                   onClick={() => setSelectedImage(image)}
//                 >
//                   <img
//                     src={image || "/placeholder.png"}
//                     alt={`Gallery image ${index + 1}`}
//                     className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
//                   />
//                   <div className="absolute inset-0 not-last:bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
//                     <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
//                       <div className="bg-white bg-opacity-90 rounded-full p-2">
//                         <svg
//                           className="w-6 h-6 text-gray-800"
//                           fill="none"
//                           stroke="currentColor"
//                           viewBox="0 0 24 24"
//                         >
//                           <path
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             strokeWidth={2}
//                             d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
//                           />
//                         </svg>
//                       </div>
//                     </div>
//                   </div>
//                   <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
//                     {index + 1}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         ) : (
//           <div className="bg-white rounded-lg shadow-sm p-12 text-center">
//             <div className="text-6xl text-gray-300 mb-4">📷</div>
//             <h3 className="text-xl font-semibold text-gray-600 mb-2">
//               No Photos Yet
//             </h3>
//             <p className="text-gray-500 mb-4">
//               This gallery doesn't contain any photos.
//             </p>
//             <Button className="bg-purple-600 hover:bg-purple-700 text-white">
//               Add Photos
//             </Button>
//           </div>
//         )}
//       </div>

//       {/* Image Modal */}
//       {selectedImage && (
//         <div
//           className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4"
//           onClick={() => setSelectedImage(null)}
//         >
//           <div className="relative max-w-4xl max-h-full">
//             <img
//               src={selectedImage}
//               alt="Selected gallery image"
//               className="max-w-full max-h-full object-contain rounded-lg"
//             />
//             <button
//               onClick={() => setSelectedImage(null)}
//               className="absolute top-4 right-4 bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded-full w-10 h-10 flex items-center justify-center text-2xl font-bold transition-all duration-200"
//             >
//               ×
//             </button>
//             <div className="absolute bottom-4 left-4 bg-black bg-opacity-70 text-white px-4 py-2 rounded-lg">
//               <p className="text-sm">
//                 Image {gallery.images?.indexOf(selectedImage) + 1} of{" "}
//                 {gallery.images?.length}
//               </p>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Delete Confirmation Modal */}
//       {showDeleteConfirm && (
//         <div className="fixed inset-0 z-50 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4">
//           <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-6">
//             <div className="text-center">
//               <div className="text-6xl text-red-500 mb-4">⚠️</div>
//               <h2 className="text-2xl font-bold text-gray-900 mb-2">
//                 Delete Gallery
//               </h2>
//               <p className="text-gray-600 mb-6">
//                 Are you sure you want to delete "{gallery.title}"? This action
//                 cannot be undone and will permanently remove all{" "}
//                 {gallery.images?.length || 0} photos.
//               </p>

//               <div className="flex gap-3 justify-center">
//                 <Button
//                   variant="outline"
//                   onClick={() => setShowDeleteConfirm(false)}
//                   disabled={isDeleting}
//                   className="px-6"
//                 >
//                   Cancel
//                 </Button>
//                 <Button
//                   onClick={handleDelete}
//                   disabled={isDeleting}
//                   className="px-6 bg-red-600 hover:bg-red-700 text-white"
//                 >
//                   {isDeleting ? (
//                     <>
//                       <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
//                       Deleting...
//                     </>
//                   ) : (
//                     <>
//                       <Trash2 className="w-4 h-4 mr-2" />
//                       Delete Gallery
//                     </>
//                   )}
//                 </Button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

"use client";

import { deleteGallery } from "@/features/gallery/actions/delete-gallery";
import { useGetGalleryById } from "@/features/gallery/actions/get-gallery-by-id";
import { updateGallery } from "@/features/gallery/actions/update-gallery";
import GalleryView from "@/modules/media/components/gallery-view";
import { Button } from "@repo/ui/components/button";
import { Input } from "@repo/ui/components/input";
import { Textarea } from "@repo/ui/components/textarea";
import {
  ArrowLeft,
  Calendar,
  Download,
  Edit,
  Share2,
  Tag,
  Trash2,
  User,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface Props {
  params: {
    id: string;
  };
}

export default function GalleryDetailPage({ params }: Props) {
  const { id } = params;
  const router = useRouter();
  const { data: gallery, isLoading, error, refetch } = useGetGalleryById(id);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isGalleryOpen, setGalleryOpen] = useState(false);

  // Edit form state
  const [editFormData, setEditFormData] = useState({
    type: "",
    title: "",
    description: "",
    images: [],
    childId: "",
    classId: "",
    eventId: "",
  });

  // Initialize edit form with current gallery data
  const handleEditClick = () => {
    if (gallery) {
      setEditFormData({
        type: gallery.type || "",
        title: gallery.title || "",
        description: gallery.description || "",
        images:
          gallery.images?.filter(
            (img) => img && img !== "null" && img.trim() !== ""
          ) || [],
        childId: gallery.childId || "",
        classId: gallery.classId || "",
        eventId: gallery.eventId || "",
      });
      setShowEditForm(true);
    }
  };

  const handleEditChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);

    try {
      const updateData = {
        ...editFormData,
        images: editFormData.images.filter((image) => image !== ""),
      };

      await updateGallery(id, updateData);
      await refetch(); // Refresh the gallery data
      setShowEditForm(false);
      alert("Gallery updated successfully!");
    } catch (error) {
      console.error("Error updating gallery:", error);
      alert("Failed to update gallery.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteGallery(id);
      router.push("/account/manage/gallery");
      alert("Gallery deleted successfully!");
    } catch (error) {
      console.error("Error deleting gallery:", error);
      alert("Failed to delete gallery. Please try again.");
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading gallery...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl text-red-400 mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Error Loading Gallery
          </h2>
          <p className="text-gray-600 mb-4">{error.message}</p>
          <Link href="/account/manage/gallery">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Galleries
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!gallery) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl text-gray-400 mb-4">📷</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Gallery Not Found
          </h2>
          <p className="text-gray-600 mb-4">
            The gallery you're looking for doesn't exist.
          </p>
          <Link href="/account/manage/gallery">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Galleries
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/account/manage/gallery">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Galleries
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {gallery.title}
                </h1>
                <p className="text-gray-600 mt-1">
                  {gallery.images?.length || 0} photo
                  {(gallery.images?.length || 0) !== 1 ? "s" : ""}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Download All
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleEditClick}
                disabled={isUpdating}
              >
                <Edit className="w-4 h-4 mr-2" />
                {isUpdating ? "Updating..." : "Edit"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-red-600 hover:bg-red-50 border-red-200"
                onClick={() => setShowDeleteConfirm(true)}
                disabled={isDeleting}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                {isDeleting ? "Deleting..." : "Delete"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Gallery Info */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Gallery Information
              </h2>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Tag className="w-5 h-5 text-gray-400" />
                  <div>
                    <span className="text-sm text-gray-500">Type:</span>
                    <span className="ml-2 bg-purple-100 text-purple-700 px-2 py-1 rounded text-sm">
                      {gallery.type}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <span className="text-sm text-gray-500">Created:</span>
                    <span className="ml-2 text-gray-900">
                      {new Date(gallery.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-gray-400" />
                  <div>
                    <span className="text-sm text-gray-500">Created by:</span>
                    <span className="ml-2 text-gray-900">
                      {gallery.createdBy}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Description
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {gallery.description ||
                  "No description provided for this gallery."}
              </p>
            </div>
          </div>
        </div>

        {/* Photos Grid */}
        {gallery.images && gallery.images.length > 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Photos</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {gallery.images.map((image, index) => (
                <div
                  key={index}
                  className="relative group cursor-pointer bg-gray-100 rounded-lg overflow-hidden aspect-square"
                  onClick={() => setSelectedImage(image)}
                >
                  <img
                    src={image || "/placeholder.png"}
                    alt={`Gallery image ${index + 1}`}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="bg-white bg-opacity-90 rounded-full p-2">
                        <svg
                          className="w-6 h-6 text-gray-800"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                    {index + 1}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="text-6xl text-gray-300 mb-4">📷</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No Photos Yet
            </h3>
            <p className="text-gray-500 mb-4">
              This gallery doesn't contain any photos.
            </p>
            <Button className="bg-purple-600 hover:bg-purple-700 text-white">
              Add Photos
            </Button>
          </div>
        )}
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl max-h-full">
            <img
              src={selectedImage}
              alt="Selected gallery image"
              className="max-w-full max-h-full object-contain rounded-lg"
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded-full w-10 h-10 flex items-center justify-center text-2xl font-bold transition-all duration-200"
            >
              ×
            </button>
            <div className="absolute bottom-4 left-4 bg-black bg-opacity-70 text-white px-4 py-2 rounded-lg">
              <p className="text-sm">
                Image {gallery.images?.indexOf(selectedImage) + 1} of{" "}
                {gallery.images?.length}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Edit Gallery Modal */}
      {showEditForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] m-4 flex flex-col">
            {/* Header - Fixed */}
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">Edit Gallery</h2>
              <button
                onClick={() => setShowEditForm(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
              >
                ×
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto">
              <form onSubmit={handleEditSubmit} className="p-6 space-y-6">
                <div>
                  <label
                    htmlFor="edit-type"
                    className="block text-sm font-medium mb-2 text-gray-700"
                  >
                    Type *
                  </label>
                  <Input
                    id="edit-type"
                    name="type"
                    type="text"
                    required
                    value={editFormData.type}
                    onChange={handleEditChange}
                    placeholder="Enter gallery type"
                    className="w-full"
                  />
                </div>

                <div>
                  <label
                    htmlFor="edit-title"
                    className="block text-sm font-medium mb-2 text-gray-700"
                  >
                    Title *
                  </label>
                  <Input
                    id="edit-title"
                    name="title"
                    type="text"
                    required
                    value={editFormData.title}
                    onChange={handleEditChange}
                    placeholder="Enter gallery title"
                    className="w-full"
                  />
                </div>

                <div>
                  <label
                    htmlFor="edit-description"
                    className="block text-sm font-medium mb-2 text-gray-700"
                  >
                    Description
                  </label>
                  <Textarea
                    id="edit-description"
                    name="description"
                    rows={4}
                    value={editFormData.description}
                    onChange={handleEditChange}
                    placeholder="Enter gallery description"
                    className="w-full resize-none"
                  />
                </div>

                <div>
                  <label
                    htmlFor="edit-images"
                    className="block text-sm font-medium mb-2 text-gray-700"
                  >
                    Images *
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setGalleryOpen(true)}
                      className="mb-4 w-full py-3 border-2 border-purple-300 text-purple-600 hover:bg-purple-50"
                    >
                      📷 Select Images from Gallery
                    </Button>

                    {editFormData.images.length > 0 && (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {editFormData.images.map((image, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={image}
                              alt={`Selected image ${index + 1}`}
                              className="w-full h-32 object-cover rounded-lg border-2 border-gray-200"
                            />
                            <button
                              type="button"
                              onClick={() =>
                                setEditFormData((prev) => ({
                                  ...prev,
                                  images: prev.images.filter(
                                    (_, i) => i !== index
                                  ),
                                }))
                              }
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm font-bold opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-red-600 shadow-lg"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {editFormData.images.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        <div className="text-4xl mb-2">📷</div>
                        <p>No images selected yet</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label
                      htmlFor="edit-childId"
                      className="block text-sm font-medium mb-2 text-gray-700"
                    >
                      Child ID
                    </label>
                    <Input
                      id="edit-childId"
                      name="childId"
                      type="text"
                      value={editFormData.childId}
                      onChange={handleEditChange}
                      placeholder="Child ID (optional)"
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="edit-classId"
                      className="block text-sm font-medium mb-2 text-gray-700"
                    >
                      Class ID
                    </label>
                    <Input
                      id="edit-classId"
                      name="classId"
                      type="text"
                      value={editFormData.classId}
                      onChange={handleEditChange}
                      placeholder="Class ID (optional)"
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="edit-eventId"
                      className="block text-sm font-medium mb-2 text-gray-700"
                    >
                      Event ID
                    </label>
                    <Input
                      id="edit-eventId"
                      name="eventId"
                      type="text"
                      value={editFormData.eventId}
                      onChange={handleEditChange}
                      placeholder="Event ID (optional)"
                      className="w-full"
                    />
                  </div>
                </div>
              </form>
            </div>

            {/* Footer - Fixed */}
            <div className="p-6 border-t border-gray-200 bg-gray-50 rounded-b-lg">
              <div className="flex gap-3 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowEditForm(false)}
                  className="px-6 py-2 border-2 border-gray-300 text-gray-700 hover:bg-gray-100"
                  disabled={isUpdating}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isUpdating}
                  onClick={handleEditSubmit}
                  className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUpdating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Updating...
                    </>
                  ) : (
                    "Update Gallery"
                  )}
                </Button>
              </div>
            </div>

            {/* Gallery View Modal for Edit */}
            <GalleryView
              modal={true}
              modalOpen={isGalleryOpen}
              setModalOpen={setGalleryOpen}
              activeTab="library"
              onUseSelected={(selectedImages) => {
                const imageUrls = selectedImages.map(
                  (image) => image.url || ""
                );
                setEditFormData((prev) => ({
                  ...prev,
                  images: [...prev.images, ...imageUrls],
                }));
                setGalleryOpen(false);
              }}
            />
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-6">
            <div className="text-center">
              <div className="text-6xl text-red-500 mb-4">⚠️</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Delete Gallery
              </h2>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete "{gallery.title}"? This action
                cannot be undone and will permanently remove all{" "}
                {gallery.images?.length || 0} photos.
              </p>

              <div className="flex gap-3 justify-center">
                <Button
                  variant="outline"
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={isDeleting}
                  className="px-6"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="px-6 bg-red-600 hover:bg-red-700 text-white"
                >
                  {isDeleting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Gallery
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
