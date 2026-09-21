import { useState } from 'react';
import Dropzone from './home/Dropzone';
import StoreButton from './home/StoreButton';

export default function Home() {
  const [file, setFile] = useState<File | null>(null);

  return (
    <div className="max-w-2xl mx-auto py-12 space-y-6">
      <Dropzone file={file} onFile={setFile} />
      <div className="flex justify-center">
        <StoreButton file={file} />
      </div>
    </div>
  );
}
