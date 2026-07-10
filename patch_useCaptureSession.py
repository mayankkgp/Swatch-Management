import re

with open('./src/features/logging/useCaptureSession.js', 'r') as f:
    content = f.read()

content = content.replace(
    'const [activeImage, setActiveImage] = useState(null);',
    'const [activeImage, setActiveImage] = useState(null);\n  const [imageQueue, setImageQueue] = useState([]);'
)

new_func = """const handleImagesQueued = useCallback((newImages) => {
    setImageQueue(prev => [...prev, ...newImages]);
  }, []);

  useEffect(() => {
    if (!activeImage && imageQueue.length > 0) {
      setActiveImage(imageQueue[0]);
      setImageQueue(prev => prev.slice(1));
      setRotation(0);
    }
  }, [activeImage, imageQueue]);
"""

content = content.replace(
    'const [isSavingBatch, setIsSavingBatch] = useState(false);',
    'const [isSavingBatch, setIsSavingBatch] = useState(false);\n\n  ' + new_func
)

content = content.replace(
    'handleFinalSaveBatch\n  };',
    'handleFinalSaveBatch,\n    handleImagesQueued\n  };'
)

with open('./src/features/logging/useCaptureSession.js', 'w') as f:
    f.write(content)
