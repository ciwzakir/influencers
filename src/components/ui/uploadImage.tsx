import { Upload, Image } from "antd";
import { useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";

const ImageUploaderPage = ({
  name,
  defaultImageUrl,
}: {
  name: string;
  defaultImageUrl?: string;
}) => {
  const { control } = useFormContext();
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    defaultImageUrl || null
  );

  useEffect(() => {
    if (defaultImageUrl) {
      setPreviewUrl(defaultImageUrl);
    }
  }, [defaultImageUrl]);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <>
          {previewUrl && (
            <Image
              src={previewUrl}
              alt="Uploaded Preview"
              width={200}
              style={{ marginBottom: 8, borderRadius: 4 }}
            />
          )}
          <Upload
            beforeUpload={(file) => {
              const preview = URL.createObjectURL(file);
              setPreviewUrl(preview);
              field.onChange(file); // Set file to form
              return false; // Prevent auto upload
            }}
            showUploadList={false}
          >
            <div
              style={{
                padding: "8px 12px",
                border: "1px dashed #d9d9d9",
                borderRadius: "6px",
                cursor: "pointer",
                textAlign: "center",
              }}
            >
              Click or Drag to Upload
            </div>
          </Upload>
        </>
      )}
    />
  );
};

export default ImageUploaderPage;
