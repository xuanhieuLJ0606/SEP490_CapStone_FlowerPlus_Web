// UploadImage.tsx
import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Loader2, Upload, X, ImageIcon } from 'lucide-react';
import axios from 'axios';

type UploadItem = {
  id: string;
  file?: File;
  url?: string;
  preview?: string;
  progress?: number;
  status: 'idle' | 'uploading' | 'done' | 'error';
  error?: string;
};

type Props = {
  multiple?: boolean;
  endpoint?: string;
  onChange?: (value: string | string[]) => void;
  accept?: string;
  defaultValue?: string | string[];
  maxFiles?: number;
};

export default function UploadImage({
  multiple = false,
  endpoint = 'https://upload.autopass.blog/upload',
  onChange,
  accept = 'image/*',
  defaultValue,
  maxFiles
}: Props) {
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const [items, setItems] = React.useState<UploadItem[]>(() => {
    if (!defaultValue) return [];
    const urls = Array.isArray(defaultValue) ? defaultValue : [defaultValue];
    return urls.map((u) => ({
      id: crypto.randomUUID(),
      url: u,
      preview: u,
      status: 'done',
      progress: 100
    }));
  });
  const [busy, setBusy] = React.useState(false);

  const currentUrls = React.useMemo(
    () => items.filter((i) => i.url).map((i) => i.url!),
    [items]
  );

  const prevUrlsRef = React.useRef<string[]>([]);

  React.useEffect(() => {
    if (!onChange) return;

    const urlsString = JSON.stringify(currentUrls);
    const prevUrlsString = JSON.stringify(prevUrlsRef.current);

    if (urlsString !== prevUrlsString) {
      prevUrlsRef.current = currentUrls;
      if (multiple) {
        onChange(currentUrls);
      } else {
        onChange(currentUrls[0] ?? '');
      }
    }
  }, [currentUrls, multiple, onChange]);

  const openFilePicker = () => inputRef.current?.click();

  const handleFiles = async (filesList: FileList | null) => {
    if (!filesList || filesList.length === 0) return;
    let files = Array.from(filesList);

    if (maxFiles) {
      const canTake = maxFiles - items.length;
      if (canTake <= 0) return;
      files = files.slice(0, canTake);
    }

    const newItems: UploadItem[] = files.map((file) => ({
      id: crypto.randomUUID(),
      file,
      preview: URL.createObjectURL(file),
      progress: 0,
      status: 'idle'
    }));
    setItems((prev) => (multiple ? [...prev, ...newItems] : newItems));

    setBusy(true);
    try {
      for (const it of newItems) {
        await uploadOne(it);
      }
    } finally {
      setBusy(false);
    }
  };

  const uploadOne = async (item: UploadItem) => {
    setItems((prev) =>
      prev.map((i) =>
        i.id === item.id ? { ...i, status: 'uploading', progress: 10 } : i
      )
    );

    const form = new FormData();
    if (item.file) form.append('file', item.file);

    try {
      const res = await axios.post(endpoint, form, {
        method: 'POST',
        data: form
      });

      // Handle new API response format
      let imageUrl = '';
      if (res.data) {
        if (typeof res.data === 'string') {
          // Old format - direct URL
          imageUrl = res.data;
        } else if (res.data.downloadUrl) {
          // New format - extract downloadUrl from object
          imageUrl = res.data.downloadUrl;
        }
      }

      if (imageUrl) {
        setItems((prev) =>
          prev.map((i) =>
            i.id === item.id
              ? { ...i, url: imageUrl, status: 'done', progress: 100 }
              : i
          )
        );
      }
    } catch (err: any) {
      console.error('Upload error:', err);
      setItems((prev) =>
        prev.map((i) =>
          i.id === item.id
            ? { ...i, status: 'error', error: 'Upload failed' }
            : i
        )
      );
    }
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  return (
    <div className="space-y-3">
      <Input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      <div
        role="button"
        onClick={openFilePicker}
        className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed p-6 text-center hover:bg-muted/50"
      >
        <Upload className="h-6 w-6" />
        <div className="text-xs text-muted-foreground">
          {multiple ? 'Có thể chọn nhiều ảnh' : 'Chỉ chọn 1 ảnh'}
        </div>
        <Button
          type="button"
          variant="secondary"
          disabled={busy}
          className="mt-2"
        >
          {busy ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Đang tải...
            </>
          ) : (
            'Chọn ảnh'
          )}
        </Button>
      </div>

      {/* Previews */}
      {items.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {items.map((it) => (
            <div
              key={it.id}
              className="relative overflow-hidden rounded-md border bg-muted/20"
            >
              {it.preview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={it.preview}
                  alt="preview"
                  className="h-36 w-full object-cover"
                />
              ) : (
                <div className="flex h-36 w-full items-center justify-center">
                  <ImageIcon className="h-6 w-6 text-muted-foreground" />
                </div>
              )}

              <button
                type="button"
                onClick={() => removeItem(it.id)}
                className="absolute right-1 top-1 inline-flex h-7 w-7 items-center justify-center rounded-full border bg-background/80 backdrop-blur hover:bg-background"
                aria-label="Remove"
              >
                <X className="h-4 w-4" />
              </button>

              {it.status === 'uploading' && (
                <div className="absolute bottom-0 left-0 right-0 bg-background/80 p-2">
                  <Progress value={it.progress ?? 30} />
                </div>
              )}
              {it.status === 'error' && (
                <div className="absolute inset-x-0 bottom-0 bg-destructive p-2 text-xs text-destructive-foreground">
                  {it.error || 'Upload lỗi'}
                </div>
              )}
              {it.status === 'done' && it.url && (
                <a
                  href={it.url}
                  target="_blank"
                  rel="noreferrer"
                  className="absolute bottom-0 left-0 right-0 truncate bg-background/80 px-2 py-1 text-xs underline"
                  title={it.url}
                >
                  {it.url}
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
