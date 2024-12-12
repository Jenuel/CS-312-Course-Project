// Create ImageHandler as a global object
window.ImageHandler = {
    // Constants
    CONSTRAINTS: {
      MAX_FILE_SIZE: 5000000, // 5MB
      ACCEPTED_TYPES: ["image/jpeg", "image/png", "image/gif"],
      DEFAULT_PREVIEW_SIZE: 100,
      BASE64_PREFIX: "data:image/jpeg;base64,"
    },
  
    // Validate image file
    validateFile(file) {
      if (!file) throw new Error("No file provided");
  
      if (file.size > this.CONSTRAINTS.MAX_FILE_SIZE) {
        throw new Error("File is too large. Please choose an image under 5MB.");
      }
  
      if (!this.CONSTRAINTS.ACCEPTED_TYPES.includes(file.type)) {
        throw new Error("Invalid file type. Please use JPEG, PNG or GIF.");
      }
  
      return true;
    },
  
    // Handle file upload and preview
    handleUpload(file, previewElement) {
      return new Promise((resolve, reject) => {
        try {
          this.validateFile(file);
  
          const reader = new FileReader();
          reader.onload = (event) => {
            const base64String = event.target.result;
  
            if (previewElement) {
              this.updatePreview(previewElement, base64String);
            }
  
            resolve(base64String);
          };
  
          reader.onerror = () => reject(new Error("Failed to read file"));
          reader.readAsDataURL(file);
        } catch (error) {
          reject(error);
        }
      });
    },
  
    // Update preview element
    updatePreview(element, imageData) {
      if (!element) return;
  
      element.src = imageData;
      element.classList.remove("d-none");
      element.classList.add("d-block");
    },
  
    // Process image data from API response
    processFromAPI(imageData) {
      if (!imageData) return null;
  
      try {
        if (imageData.type === "Buffer" && Array.isArray(imageData.data)) {
          const bufferData = new Uint8Array(imageData.data);
          const base64String = btoa(String.fromCharCode.apply(null, bufferData));
          return this.addBase64Prefix(base64String);
        }
  
        // Handle string type data
        if (typeof imageData === "string") {
          return this.processBase64String(imageData);
        }
  
        return null;
      } catch (error) {
        console.error("Error processing image data:", error);
        return null;
      }
    },
  
    // Process base64 string
    processBase64String(base64String) {
      if (!base64String) return null;
  
      // If already has prefix, return as is
      if (base64String.startsWith("data:image/")) {
        return base64String;
      }
  
      // Clean and validate base64 string
      const cleanedBase64 = base64String.replace(/[\n\r\s]/g, "");
      if (!/^[A-Za-z0-9+/=]+$/.test(cleanedBase64)) {
        return null;
      }
  
      return this.addBase64Prefix(cleanedBase64);
    },
  
    // Prepare image for API submission
    prepareForUpload(imageData) {
      if (!imageData) return null;
  
      if (imageData.startsWith("data:image/")) {
        return imageData.split("base64,")[1].replace(/[\n\r\s]/g, "");
      }
  
      return imageData.replace(/[\n\r\s]/g, "");
    },
  
    // Add base64 prefix
    addBase64Prefix(base64String) {
      return `${this.CONSTRAINTS.BASE64_PREFIX}${base64String}`;
    },
  
    // Create image HTML element
    createImageElement(imageUrl, altText = "", containerClassName = "image-container") {
      if (!imageUrl) {
        return `<div class="${containerClassName}">No Image</div>`;
      }
  
      return `
        <div class="${containerClassName}">
          <img src="${imageUrl}" 
               alt="${altText}" 
               class="product-thumbnail"
               style="max-width: ${this.CONSTRAINTS.DEFAULT_PREVIEW_SIZE}px; height: auto; object-fit: contain;"
               onerror="(function(img) {
                 if (!img.src.startsWith('data:image')) {
                   img.src = 'data:image/jpeg;base64,' + img.src;
                 } else {
                   img.parentElement.innerHTML = 'Image Failed to Load';
                 }
               })(this)">
        </div>
      `;
    }
  };