export function urlToDataUri(url) {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');

  return new Promise(resolve => {
    const image = new Image();
    image.crossOrigin = 'Anonymous';
    image.onload = () => {
      canvas.width = this.naturalWidth; // or 'width' if you want a special/scaled size
      canvas.height = this.naturalHeight; // or 'height' if you want a special/scaled size
      context.drawImage(this, 0, 0);

      resolve(canvas.toDataURL('image/png'));
    };

    image.onerror = () => {
      resolve();
    };

    // Trigger onload event for cached images
    if (image[0] && image[0].complete) {
      image.load();
    }

    image.src = url;
  });
}
