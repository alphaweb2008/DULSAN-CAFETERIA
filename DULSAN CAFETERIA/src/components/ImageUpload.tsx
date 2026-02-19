import { useRef, useState } from 'react';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { compressImage } from '../utils/imageCompressor';

interface ImageUploadProps {
  value: string;
  onChange: (dataUrl: string) => void;
  label: string;
  className?: string;
  aspectRatio?: string;
  rounded?: boolean;
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  skipCompression?: boolean;
}

export default function ImageUpload({
  value, onChange, label, className = '',
  aspectRatio = 'aspect-video', rounded = false,
  maxWidth = 400, maxHeight = 400, quality = 0.45,
  skipCompression = false
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [compressing, setCompressing] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Selecciona una imagen válida');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Máximo 5MB');
      return;
    }

    setCompressing(true);
    try {
      const compressed = await compressImage(file, maxWidth, maxHeight, quality, skipCompression);
      onChange(compressed);
    } catch (err) {
      console.error('Error:', err);
      const reader = new FileReader();
      reader.onloadend = () => onChange(reader.result as string);
      reader.readAsDataURL(file);
    }
    setCompressing(false);
    if (inputRef.current) inputRef.current.value = '';
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className={className}>
      <label className="block text-xs font-semibold text-stone-500 mb-2">{label}</label>
      <div
        onClick={() => !compressing && inputRef.current?.click()}
        className={`relative group cursor-pointer overflow-hidden border-2 border-dashed transition-all duration-300 ${
          compressing
            ? 'border-[#c9959b] bg-[#faf5f6]'
            : value
            ? 'border-[#f0e0e3] bg-[#faf5f6]/30 hover:border-[#c9959b]'
            : 'border-[#daeef3] bg-[#eef6f8]/30 hover:border-[#7fb3bf] hover:bg-[#eef6f8]/50'
        } ${rounded ? 'rounded-full' : 'rounded-2xl'} ${aspectRatio}`}
      >
        {compressing ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
            <Loader2 className="w-6 h-6 text-[#a87880] animate-spin" />
            <p className="text-xs text-stone-400 font-medium">Comprimiendo...</p>
          </div>
        ) : value ? (
          <>
            <img src={value} alt={label} className={`w-full h-full object-cover ${rounded ? 'rounded-full' : ''}`} />
            <div className={`absolute inset-0 bg-stone-900/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center ${rounded ? 'rounded-full' : ''}`}>
              <div className="flex flex-col items-center gap-1">
                <Upload className="w-5 h-5 text-white" />
                <span className="text-white text-xs font-medium">Cambiar</span>
              </div>
            </div>
            <button onClick={handleRemove}
              className="absolute top-2 right-2 w-7 h-7 bg-red-500/90 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 shadow-lg z-10">
              <X className="w-3.5 h-3.5" />
            </button>
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-stone-400 group-hover:text-[#5a949f] transition-colors">
            <div className="w-12 h-12 rounded-xl bg-[#eef6f8] flex items-center justify-center group-hover:bg-[#daeef3] transition-colors">
              <ImageIcon className="w-6 h-6 text-[#7fb3bf] group-hover:text-[#5a949f] transition-colors" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium">Click para subir</p>
              <p className="text-xs text-stone-400 mt-0.5">JPG, PNG o WebP</p>
            </div>
          </div>
        )}
      </div>
      <input ref={inputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
    </div>
  );
}
