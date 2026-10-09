import { useRef, useState } from "react";

interface Props {
  files: File[];
  onChange: (files: File[]) => void;
  max?: number;
  label?: string;
  helperText?: string;
}

export default function ImageUploader({ files, onChange, max = 4, label = "Reference images", helperText }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  function addFiles(list: FileList | null) {
    if (!list) return;
    const incoming = Array.from(list).filter((f) => f.type.startsWith("image/"));
    const merged = [...files, ...incoming].slice(0, max);
    onChange(merged);
  }

  function removeAt(idx: number) {
    onChange(files.filter((_, i) => i !== idx));
  }

  return (
    <div>
      <label className="field-label">{label}</label>
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          addFiles(e.dataTransfer.files);
        }}
        className={`rounded-xl border-2 border-dashed p-6 text-center cursor-pointer transition-colors ${
          dragOver ? "border-berry bg-blush-soft/60" : "border-berry-dark/20 hover:border-berry/50"
        }`}
      >
        <p className="text-[14px] text-ink-soft">
          <span className="font-semibold text-berry">Click to upload</span> or drag and drop
        </p>
        <p className="text-[12.5px] text-ink-soft/70 mt-1">{helperText || `Up to ${max} images, JPG/PNG/WEBP`}</p>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          hidden
          onChange={(e) => addFiles(e.target.files)}
        />
      </div>

      {files.length > 0 && (
        <div className="grid grid-cols-4 gap-3 mt-3">
          {files.map((file, i) => (
            <div key={i} className="relative group rounded-lg overflow-hidden aspect-square bg-blush-soft">
              <img src={URL.createObjectURL(file)} alt={`preview-${i}`} className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeAt(i);
                }}
                className="absolute top-1 right-1 bg-berry-dark/80 text-white w-5 h-5 rounded-full text-[11px] leading-5 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
