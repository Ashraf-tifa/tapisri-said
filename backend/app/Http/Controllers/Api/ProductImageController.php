<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\ProductImage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary;

class ProductImageController extends Controller
{
    public function store(Request $request, Product $product)
    {
        $request->validate([
            'images'   => 'required|array|min:1',
            'images.*' => 'image|mimes:jpeg,png,jpg,webp|max:4096',
        ]);

        $hasMain = $product->images()->where('is_main', true)->exists();
        $uploaded = [];

        foreach ($request->file('images') as $index => $file) {

            $cloudinaryImage = Cloudinary::upload($file->getRealPath(), [
                'folder'         => 'tapisri/products',
                'transformation' => [['quality' => 'auto', 'fetch_format' => 'auto']],
            ]);

            $url      = $cloudinaryImage->getSecurePath();
            $publicId = $cloudinaryImage->getPublicId();

            $isMain = !$hasMain && $index === 0;
            if ($isMain) $hasMain = true;

            $image = ProductImage::create([
                'product_id'           => $product->id,
                'path'                 => $url,
                'cloudinary_public_id' => $publicId,
                'alt'                  => $product->name,
                'is_main'              => $isMain,
                'sort_order'           => $product->images()->count(),
            ]);

            $uploaded[] = $image;
        }

        return response()->json($uploaded, 201);
    }

    public function setMain(Product $product, ProductImage $image)
    {
        $product->images()->update(['is_main' => false]);
        $image->update(['is_main' => true]);

        return response()->json($image);
    }

    public function destroy(Product $product, ProductImage $image)
    {
        // Delete from Cloudinary if we have the public_id
        if ($image->cloudinary_public_id) {
            try {
                Cloudinary::destroy($image->cloudinary_public_id);
            } catch (\Exception $e) {
                // Log but don't fail if Cloudinary delete fails
                \Log::warning('Cloudinary delete failed: ' . $e->getMessage());
            }
        } else {
            // Fallback: delete from local storage (legacy images)
            Storage::disk('public')->delete($image->path);
        }

        $image->delete();

        // If deleted image was main, promote the next one
        if ($image->is_main) {
            $next = $product->images()->first();
            if ($next) $next->update(['is_main' => true]);
        }

        return response()->json(null, 204);
    }
}
