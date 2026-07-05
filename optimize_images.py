import os
from PIL import Image

def optimize_images():
    assets_dir = r"c:\adamp\Documents\Dry Eye App\assets"
    
    images_to_optimize = [
        "dr_marano.png",
        "meibography_scan.png",
        "tear_film_aqueous.png",
        "tear_film_dry.png",
        "tear_film_full.png",
        "tear_film_lipid.png",
        "tear_film_mucin.png"
    ]
    
    print("Starting image optimization...")
    total_original_size = 0
    total_new_size = 0
    
    for filename in images_to_optimize:
        png_path = os.path.join(assets_dir, filename)
        webp_filename = filename.replace(".png", ".webp")
        webp_path = os.path.join(assets_dir, webp_filename)
        
        if os.path.exists(png_path):
            orig_size = os.path.getsize(png_path)
            total_original_size += orig_size
            
            print(f"Optimizing {filename} ({orig_size / 1024:.1f} KB) -> {webp_filename}")
            
            with Image.open(png_path) as img:
                # Convert to RGB if necessary (though WebP supports RGBA, so keep format/mode)
                img.save(webp_path, "WEBP", quality=82, method=6)
                
            new_size = os.path.getsize(webp_path)
            total_new_size += new_size
            reduction = (1 - (new_size / orig_size)) * 100
            print(f"  Saved to WebP: {new_size / 1024:.1f} KB (Reduced by {reduction:.1f}%)")
        else:
            print(f"File not found: {png_path}")
            
    if total_original_size > 0:
        overall_reduction = (1 - (total_new_size / total_original_size)) * 100
        print(f"\nOptimization Complete!")
        print(f"Original size: {total_original_size / 1024 / 1024:.2f} MB")
        print(f"Optimized WebP size: {total_new_size / 1024 / 1024:.2f} MB")
        print(f"Overall reduction: {overall_reduction:.1f}%")

if __name__ == "__main__":
    optimize_images()
