const fs = require('fs');
const file = './src/features/logging/CaptureZone.jsx';
let content = fs.readFileSync(file, 'utf8');

const regex = /<input\s+type="file"\s+accept="image\/\*"\s+className="hidden"\s+ref={fileInputRef}\s+onChange={handleImageUpload}\s+\/>/;

const replacement = `<input 
            type="file" 
            accept="image/*" 
            className="hidden" 
            ref={fileInputRef}
            onChange={handleImageUpload}
          />
          <input 
            type="file" 
            accept="image/*" 
            multiple
            className="hidden" 
            ref={desktopFileInputRef}
            onChange={handleDesktopImageUpload}
          />`;

content = content.replace(regex, replacement);

content = content.replace(
  `onClick={() => fileInputRef.current?.click()}
            className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white border border-transparent shadow-xs items-center justify-center gap-2 rounded-lg font-bold text-sm tracking-wide hidden md:flex"`,
  `onClick={() => desktopFileInputRef.current?.click()}
            className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white border border-transparent shadow-xs items-center justify-center gap-2 rounded-lg font-bold text-sm tracking-wide hidden md:flex"`
);

content = content.replace(
  `const fileInputRef = useRef(null);`,
  `const fileInputRef = useRef(null);
  const desktopFileInputRef = useRef(null);`
);

content = content.replace(
  `export default function CaptureZone({ 
  activeImage, 
  setActiveImage, 
  rotation, 
  setRotation`,
  `export default function CaptureZone({ 
  activeImage, 
  setActiveImage, 
  rotation, 
  setRotation,
  onImagesQueued`
);

content = content.replace(
  `const handleImageUpload = (e) => {
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
  };`,
  `const handleImageUpload = (e) => {
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
  };`
);

fs.writeFileSync(file, content);
console.log("Patched CaptureZone");
