"use client";

import { useState, useCallback, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import Cropper, { Area } from "react-easy-crop";
import { X, RotateCw, ZoomIn, ZoomOut, Check, Crop as CropIcon } from "lucide-react";
import { getCroppedImg } from "@/lib/cropImage";

interface ImageCropModalProps {
  imageSrc: string;
  originalFileName?: string;
  defaultAspect?: number;
  onCropDone: (croppedFile: File, previewUrl: string) => void;
  onCancel: () => void;
}

const emptySubscribe = () => () => {};

const ASPECT_OPTIONS = [
  { label: "4:5 (IG)", value: 4 / 5 },
  { label: "1:1", value: 1 },
  { label: "4:3", value: 4 / 3 },
  { label: "16:9", value: 16 / 9 },
  { label: "Bebas", value: undefined },
];

export default function ImageCropModal({
  imageSrc,
  originalFileName = "image.jpg",
  defaultAspect = 4 / 3,
  onCropDone,
  onCancel,
}: ImageCropModalProps) {
  const isClient = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
  const [crop, setCrop] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [aspect, setAspect] = useState<number | undefined>(defaultAspect);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [processing, setProcessing] = useState(false);

  const onCropCompleteHandler = useCallback(
    (_croppedArea: Area, currentCroppedAreaPixels: Area) => {
      setCroppedAreaPixels(currentCroppedAreaPixels);
    },
    []
  );

  const handleApply = async (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (!croppedAreaPixels) {
      alert("Area crop belum siap. Silakan geser atau tunggu foto termuat.");
      return;
    }
    setProcessing(true);
    try {
      const safeName = (originalFileName || "image.jpg").replace(/\.[^/.]+$/, "") + "-cropped.jpg";
      const croppedFile = await getCroppedImg(
        imageSrc,
        croppedAreaPixels,
        rotation,
        safeName,
        "image/jpeg"
      );
      const previewUrl = URL.createObjectURL(croppedFile);
      onCropDone(croppedFile, previewUrl);
    } catch (err) {
      console.error("Gagal melakukan crop gambar:", err);
      alert("Gagal memotong gambar. Silakan coba lagi.");
    } finally {
      setProcessing(false);
    }
  };

  const handleRotate90 = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setRotation((prev) => (prev + 90) % 360);
  };

  const modalContent = (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 p-3 sm:p-5 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      onClick={(e) => {
        // Mencegah klik di background merembet ke modal luar
        e.stopPropagation();
      }}
    >
      <div
        className="relative flex w-full max-w-2xl flex-col overflow-hidden rounded-[12px] border border-line bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-line px-5 py-3.5 bg-surface">
          <div className="flex items-center gap-2">
            <CropIcon size={18} className="text-primary" />
            <h3 className="font-display text-lg uppercase tracking-wide text-ink">
              Sesuaikan & Potong Foto
            </h3>
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onCancel();
            }}
            className="grid size-8 place-items-center rounded-[6px] text-muted hover:bg-black/5 hover:text-ink transition-colors"
            aria-label="Tutup pemotong"
          >
            <X size={18} />
          </button>
        </div>

        {/* Cropper Area */}
        <div className="relative h-[320px] sm:h-[400px] w-full bg-[#11162B]">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            rotation={rotation}
            aspect={aspect}
            onCropChange={setCrop}
            onCropComplete={onCropCompleteHandler}
            onZoomChange={setZoom}
            onRotationChange={setRotation}
            showGrid={true}
          />
        </div>

        {/* Adjustments toolbar */}
        <div className="space-y-4 border-t border-line bg-white p-4 sm:p-5">
          {/* Aspect ratio selector */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
            <span className="font-semibold uppercase tracking-wider text-muted">
              Rasio Foto
            </span>
            <div className="flex items-center gap-1.5 rounded-[6px] border border-line bg-surface p-1">
              {ASPECT_OPTIONS.map((opt) => {
                const isActive = aspect === opt.value;
                return (
                  <button
                    key={opt.label}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setAspect(opt.value);
                    }}
                    className={`rounded-[4px] px-2.5 py-1 text-xs font-semibold transition-colors ${
                      isActive
                        ? "bg-primary text-white shadow-sm"
                        : "text-muted hover:text-ink"
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sliders for Zoom & Rotation */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Zoom slider */}
            <div className="flex items-center gap-2.5">
              <ZoomOut size={16} className="text-muted shrink-0" />
              <input
                type="range"
                value={zoom}
                min={1}
                max={3}
                step={0.05}
                aria-label="Zoom"
                onChange={(e) => setZoom(Number(e.target.value))}
                className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-surface accent-primary"
              />
              <ZoomIn size={16} className="text-muted shrink-0" />
            </div>

            {/* Rotate control */}
            <div className="flex items-center justify-between sm:justify-end gap-3">
              <span className="text-xs text-muted sm:hidden">Rotasi:</span>
              <button
                type="button"
                onClick={handleRotate90}
                className="flex items-center gap-1.5 rounded-[6px] border border-line bg-surface px-3 py-1.5 text-xs font-semibold text-ink hover:bg-line/40 transition-colors"
              >
                <RotateCw size={14} />
                Putar 90° ({rotation}°)
              </button>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center justify-end gap-3 border-t border-line bg-surface px-5 py-3.5">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onCancel();
            }}
            disabled={processing}
            className="flex h-10 items-center rounded-[6px] border border-line bg-white px-4 text-xs font-semibold text-ink transition-colors hover:bg-surface disabled:opacity-50"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleApply}
            disabled={processing || !croppedAreaPixels}
            className="flex h-10 items-center gap-2 rounded-[6px] bg-primary px-5 text-xs font-semibold text-white transition-colors hover:bg-primary-bright disabled:opacity-50"
          >
            <Check size={15} />
            {processing ? "Memproses..." : "Terapkan & Gunakan"}
          </button>
        </div>
      </div>
    </div>
  );

  if (!isClient) return null;
  return createPortal(modalContent, document.body);
}
