import ProductImageUpload from "@/components/admin-view/ProductImageUpload";
import { Button } from "@/components/ui/button";
import {
  addFeatureImage,
  deleteFeatureImage,
  getFeatureImages,
} from "@/store/common-slice";
import { Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

function AdminFeatures() {
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [imageLoadingState, setImageLoadingState] = useState(false);
  const dispatch = useDispatch();
  const { featureImageList } = useSelector((state) => state.commonFeature);

  function handleUploadFeatureImage() {
    if (!uploadedImageUrl) {
      toast.error("Please upload an image first!");
      return;
    }

    dispatch(addFeatureImage(uploadedImageUrl)).then((data) => {
      if (data?.payload?.success) {
        dispatch(getFeatureImages());
        setImageFile(null);
        setUploadedImageUrl("");
        toast.success("Banner image uploaded successfully!");
      }
    });
  }

  function handleDeleteFeatureImage(id) {
    dispatch(deleteFeatureImage(id)).then((data) => {
      if (data?.payload?.success) {
        dispatch(getFeatureImages());
        toast.success("Banner image deleted successfully!");
      }
    });
  }

  useEffect(() => {
    dispatch(getFeatureImages());
  }, [dispatch]);

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Banner / Feature Images</h1>
      
      <div className="bg-card p-4 rounded-lg border shadow-sm space-y-4">
        <ProductImageUpload
          imageFile={imageFile}
          setImageFile={setImageFile}
          uploadedImageUrl={uploadedImageUrl}
          setUploadedImageUrl={setUploadedImageUrl}
          setImageLoadingState={setImageLoadingState}
          imageLoadingState={imageLoadingState}
          isCustomStyling={true}
        />
        <Button onClick={handleUploadFeatureImage} className="w-full" disabled={!uploadedImageUrl || imageLoadingState}>
          {imageLoadingState ? "Uploading..." : "Save Banner Image"}
        </Button>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Active Banners ({featureImageList?.length || 0})</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {featureImageList && featureImageList.length > 0
            ? featureImageList.map((featureImgItem) => (
                <div key={featureImgItem._id} className="relative group border rounded-lg overflow-hidden shadow-sm">
                  <img
                    src={featureImgItem.image}
                    alt="Banner"
                    className="w-full h-[220px] object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => handleDeleteFeatureImage(featureImgItem._id)}
                      title="Delete Banner"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))
            : <p className="text-muted-foreground">No banner images uploaded yet.</p>}
        </div>
      </div>
    </div>
  );
}

export default AdminFeatures;