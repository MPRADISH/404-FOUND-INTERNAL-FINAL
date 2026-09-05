import React, { useState, useRef } from 'react';
import { UploadCloud, X, Camera, Zap, ShieldCheck, Scale, FileImage, AlertCircle } from 'lucide-react';
import { CustomerResults } from './CustomerResults';

export const CustomerPage: React.FC = () => {
  const [images, setImages] = useState<{file: File, url: string}[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [results, setResults] = useState<{ status: 'pass' | 'warning' | 'fail'; verdict: string; issues: string[] } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFileProcess = (files: FileList | null) => {
    if (!files) return;
    setErrorMessage(null);

    const newFiles = Array.from(files);

    if (images.length + newFiles.length > 4) {
      setErrorMessage("You can only upload up to 4 images.");
      return;
    }

    const newImages = newFiles.map(file => ({
      file,
      url: URL.createObjectURL(file)
    }));

    setImages(prev => [...prev, ...newImages]);
  };

  const removeImage = (index: number) => {
    setImages((prev) => {
      const newImages = [...prev];
      URL.revokeObjectURL(newImages[index].url); // cleanup
      newImages.splice(index, 1);
      return newImages;
    });
  };

  // Placeholder function simulating an API call
  const simulateGeminiAPI = (files: File[]): Promise<{ status: 'pass' | 'warning' | 'fail'; verdict: string; issues: string[] }> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const statuses: ('pass' | 'warning' | 'fail')[] = ['pass', 'warning', 'fail'];
        const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];

        if (randomStatus === 'pass') {
          resolve({
            status: 'pass',
            verdict: 'Looks Fine',
            issues: []
          });
        } else if (randomStatus === 'warning') {
          resolve({
            status: 'warning',
            verdict: 'Check Before Buying',
            issues: [
              'Missing clear price information',
              'Manufacturer address is incomplete'
            ]
          });
        } else {
          resolve({
            status: 'fail',
            verdict: 'Missing Important Info',
            issues: [
              'No expiry or manufacturing date found',
              'Missing net weight declaration',
              "Can't find customer care details"
            ]
          });
        }
      }, 2000);
    });
  };

  const handleCheckProduct = async () => {
    if (images.length === 0) {
      setErrorMessage("Please upload at least one image.");
      return;
    }
    setIsScanning(true);
    setErrorMessage(null);

    try {
      const actualFiles = images.map(img => img.file);
      const result = await simulateGeminiAPI(actualFiles);
      setResults(result);
    } catch (error) {
      setErrorMessage("Failed to check product. Please try again.");
    } finally {
      setIsScanning(false);
    }
  };

  const handleReset = () => {
    images.forEach(img => URL.revokeObjectURL(img.url)); // cleanup memory
    setImages([]);
    setResults(null);
    setErrorMessage(null);
  };

  if (results) {
    return <CustomerResults results={results} onReset={handleReset} />;
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-zinc-100 font-sans flex flex-col">
      <header className="h-16 border-b border-zinc-800 flex items-center px-6 bg-[#141414] shrink-0">
        <div className="flex items-center gap-2.5 text-amber-400">
          <div className="w-8 h-8 rounded-lg bg-amber-400/10 flex items-center justify-center border border-amber-400/20">
            <Scale className="w-4 h-4" />
          </div>
          <span className="font-playfair text-xl font-bold text-white">MāpDrishti</span>
        </div>
      </header>

      <main className="flex-1 p-6 flex flex-col items-center justify-center max-w-2xl mx-auto w-full">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-playfair font-bold text-white mb-4 italic">Scan a Product</h1>
          <p className="text-zinc-400 text-sm max-w-md mx-auto">
            Upload up to 4 photos of a product's packaging (front, back, sides) to check if it has all the required legal information before you buy.
          </p>
        </div>

        <div className="w-full rounded-3xl border border-zinc-800 bg-[#181818] p-6 sm:p-8 shadow-xl">
          {errorMessage && (
            <div className="flex items-center gap-2 rounded-xl bg-red-500/10 border border-red-500/30 p-3 text-xs text-red-400 mb-6">
              <AlertCircle size={16} />
              <span>{errorMessage}</span>
            </div>
          )}

          {images.length > 0 && (
            <div className="grid grid-cols-2 gap-4 mb-6">
              {images.map((img, idx) => (
                <div key={idx} className="relative rounded-2xl border border-zinc-800 bg-black overflow-hidden aspect-video flex items-center justify-center group">
                  <img src={img.url} alt={`Preview ${idx + 1}`} className="max-h-full max-w-full object-contain" />
                  <button
                    onClick={() => removeImage(idx)}
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-black/70 text-zinc-300 hover:text-white hover:bg-red-500/80 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {images.length < 4 && !isScanning && (
            <div
              className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-zinc-800 bg-black/40 p-8 text-center transition-all cursor-pointer hover:border-zinc-700 hover:bg-black/60 mb-6"
              onClick={() => fileInputRef.current?.click()}
            >
               <div className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-400/10 text-amber-400 border border-amber-400/20 mb-4">
                <UploadCloud size={28} />
              </div>
              <p className="text-sm font-bold text-white mb-1">Add Photos</p>
              <p className="text-xs text-zinc-500 mb-4">{4 - images.length} slots remaining</p>

              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                  className="px-4 py-2 bg-amber-400 text-black rounded-xl text-xs font-bold hover:bg-amber-300 transition-all uppercase tracking-widest shadow-lg shadow-amber-400/10 flex items-center gap-2"
                >
                  <FileImage size={15} />
                  <span>Browse</span>
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    cameraInputRef.current?.click();
                  }}
                  className="px-4 py-2 border border-zinc-700 bg-zinc-800 rounded-xl text-xs font-bold text-zinc-200 hover:bg-zinc-700 transition-colors uppercase tracking-widest flex items-center gap-2"
                >
                  <Camera size={15} />
                  <span>Camera</span>
                </button>
              </div>
            </div>
          )}

          <div className="pt-2 border-t border-zinc-800/80">
            <button
              onClick={handleCheckProduct}
              disabled={isScanning || images.length === 0}
              className="w-full px-6 py-4 bg-amber-400 text-black rounded-xl text-sm font-bold hover:bg-amber-300 transition-all uppercase tracking-widest shadow-lg shadow-amber-400/10 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isScanning ? (
                <>
                  <div className="flex justify-center items-center gap-1.5 mr-2">
                    <div className="h-2 w-2 rounded-full bg-black animate-ping" />
                    <div className="h-2 w-2 rounded-full bg-black animate-ping [animation-delay:0.2s]" />
                    <div className="h-2 w-2 rounded-full bg-black animate-ping [animation-delay:0.4s]" />
                  </div>
                  <span>Analyzing Images...</span>
                </>
              ) : (
                <>
                  <Zap size={18} />
                  <span>Check Product</span>
                </>
              )}
            </button>
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => handleFileProcess(e.target.files)}
        />
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={(e) => handleFileProcess(e.target.files)}
        />
      </main>
    </div>
  );
};
