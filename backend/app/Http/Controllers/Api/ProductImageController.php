<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\ProductImage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Cloudinary\Cloudinary;

class ProductImageController extends Controller
{
    /**
     * Build a Cloudinary instance from CLOUDINARY_URL env variable.
     * Format: cloudinary://api_key:api_secret@cloud_name
     */
    private function cloudinary(): Cloudinary
    {
        $raw     = env('CLOUDINARY_URL', '');
        $parsed  = parse_url($raw);

        return new Cloudinary([
            'cloud' => [
                'cloud_name' => $parsed['host']  ?? '',
                'api_key'    => $parsed['user']  ?? '',
                'api_secret' => $parsed['pass']  ?? '',
            ],
            'url' => ['secure' => true],
        ]);
    }

    public function store(Request $request, Product $product)
    {
        $request->validate([
            'images'   => 'required|array|min:1',
            'images.*' => 'image|mimes:jpeg,png,jpg,webp|max:4096',
        ]);

        $hasMain  = $product->images()->where('is_main', true)->exists();
        $uploaded = [];
        $cl       = $this->cloudinary();

        foreach ($request->file('images') as $index => $file) {

            $result   = $cl->uploadApi()->upload($file->getRealPath(), [
                'folder'      => 'tapisri/products',
                'quality'     => 'auto',
                'fetch_format'=> 'auto',
            ]);

            $url      = $result['secure_url'];
            $publicId = $result['public_id'];

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
        if ($image->cloudinary_public_id) {
            try {
                $this->cloudinary()->uploadApi()->destroy($image->cloudinary_public_id);
            } catch (\Exception $e) {
                \Log::warning('Cloudinary delete failed: ' . $e->getMessage());
            }
        } else {
            Storage::disk('public')->delete($image->path);
        }

        $image->delete();

        if ($image->is_main) {
            $next = $product->images()->first();
            if ($next) $next->update(['is_main' => true]);
        }

        return response()->json(null, 204);
    }
}
