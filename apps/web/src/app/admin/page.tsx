"use client";

import GalleryView from "@/modules/media/components/gallery-view";
import { Button } from "@repo/ui/components/button";
import { useState } from "react";

type Props = {};

export default function ManageOwnedHotel({}: Props) {
  const [showGallery, setShowGallery] = useState(false);

  return (
    <div>
      Admin Homepage
      {showGallery && (
        <GalleryView
          modal={true}
          activeTab="library"
          onUseSelected={(selectedFiles) => {
            console.log("Selected files:", selectedFiles);
            setShowGallery(false);
          }}
          modalOpen={showGallery}
          setModalOpen={setShowGallery}
        />
      )}
      <Button onClick={() => setShowGallery(true)}>Open Gallery</Button>
    </div>
  );
}
