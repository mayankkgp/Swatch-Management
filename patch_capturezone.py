import re

with open('./src/features/logging/CaptureZone.jsx', 'r') as f:
    content = f.read()

content = content.replace(
    'ref={fileInputRef}\n            onChange={handleImageUpload}\n          />',
    'ref={fileInputRef}\n            onChange={handleImageUpload}\n          />\n          <input \n            type="file" \n            accept="image/*" \n            multiple\n            className="hidden" \n            ref={desktopFileInputRef}\n            onChange={handleDesktopImageUpload}\n          />'
)

content = content.replace(
    'onClick={() => fileInputRef.current?.click()}\n            className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white border border-transparent shadow-xs items-center justify-center gap-2 rounded-lg font-bold text-sm tracking-wide hidden md:flex"',
    'onClick={() => desktopFileInputRef.current?.click()}\n            className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white border border-transparent shadow-xs items-center justify-center gap-2 rounded-lg font-bold text-sm tracking-wide hidden md:flex"'
)

content = content.replace(
    'const fileInputRef = useRef(null);',
    'const fileInputRef = useRef(null);\n  const desktopFileInputRef = useRef(null);'
)

content = content.replace(
    'export default function CaptureZone({ \n  activeImage, \n  setActiveImage, \n  rotation, \n  setRotation',
    'export default function CaptureZone({ \n  activeImage, \n  setActiveImage, \n  rotation, \n  setRotation,\n  onImagesQueued'
)

new_func = """const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        const dataUrl = evt.target?.result;
        if (typeof dataUrl === 'string') {
          setActiveImage(dataUrl);
          setRotation(0);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDesktopImageUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      const promises = files.map(file => {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (evt) => {
            const dataUrl = evt.target?.result;
            if (typeof dataUrl === 'string') {
              resolve(dataUrl);
            } else {
              resolve(null);
            }
          };
          reader.readAsDataURL(file);
        });
      });

      Promise.all(promises).then(dataUrls => {
        const validUrls = dataUrls.filter(url => url !== null);
        if (validUrls.length > 0) {
          if (onImagesQueued) {
            onImagesQueued(validUrls);
          } else {
            setActiveImage(validUrls[0]);
            setRotation(0);
          }
        }
      });
    }
    if (desktopFileInputRef.current) {
      desktopFileInputRef.current.value = '';
    }
  };"""

content = content.replace(
    """const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        const dataUrl = evt.target?.result;
        if (typeof dataUrl === 'string') {
          setActiveImage(dataUrl);
          setRotation(0);
        }
      };
      reader.readAsDataURL(file);
    }
  };""",
    new_func
)

with open('./src/features/logging/CaptureZone.jsx', 'w') as f:
    f.write(content)

