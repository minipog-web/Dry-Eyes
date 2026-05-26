import os
from PIL import Image

image_path = r"C:\Users\adamp\.gemini\antigravity\brain\56c4bd34-2d0e-41e9-9998-b4bdc79b2bcb\media__1779809186886.jpg"
output_path = r"x:\adamp\Documents\Dry Eye App\assets\dr_marano.png"

if not os.path.exists(image_path):
    print(f"Error: Image not found at {image_path}")
    exit(1)

# Open image
img = Image.open(image_path)
width, height = img.size
print(f"Original dimensions: {width}x{height}")

# Dr. Marano is on the right side of the image.
# We will crop a square from the right side focusing on his upper body and head.
# Let's crop from x = width * 0.46 to x = width * 0.98, and from y = height * 0.15 to y = height * 0.95.
left = int(width * 0.50)
top = int(height * 0.12)
right = int(width * 0.98)
bottom = int(height * 0.92)

cropped_img = img.crop((left, top, right, bottom))
cropped_img.save(output_path, "PNG")
print(f"Cropped image saved to {output_path} with size {cropped_img.size}")
