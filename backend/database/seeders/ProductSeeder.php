<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use App\Models\ProductImage;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $salon = Category::where('slug', 'salon-marocain')->first();
        $canape = Category::where('slug', 'canape')->first();
        $lit = Category::where('slug', 'lit')->first();

        $products = [
            [
                'category_id' => $salon->id,
                'name' => 'Salon Marocain Royal',
                'slug' => 'salon-marocain-royal',
                'description' => 'Salon marocain traditionnel avec broderies artisanales. Comprend 6 fauteuils et 1 table basse. Tissu velours de haute qualité.',
                'price' => 4500.00,
                'whatsapp_number' => '+212600000001',
                'is_featured' => true,
            ],
            [
                'category_id' => $salon->id,
                'name' => 'Salon Marocain Zouina',
                'slug' => 'salon-marocain-zouina',
                'description' => 'Salon marocain moderne avec des motifs géométriques. Tissu coton premium.',
                'price' => 3200.00,
                'whatsapp_number' => '+212600000001',
            ],
            [
                'category_id' => $canape->id,
                'name' => 'Canapé Équerre 3+2',
                'slug' => 'canape-equerre-3-2',
                'description' => 'Canapé d\'angle moderne en tissu microfibre. Confortable et résistant. Disponible en plusieurs coloris.',
                'price' => 2800.00,
                'whatsapp_number' => '+212600000001',
                'is_featured' => true,
            ],
            [
                'category_id' => $canape->id,
                'name' => 'Canapé Convertible',
                'slug' => 'canape-convertible',
                'description' => 'Canapé 3 places convertible en lit. Idéal pour les petits espaces.',
                'price' => 1900.00,
                'whatsapp_number' => '+212600000001',
            ],
            [
                'category_id' => $lit->id,
                'name' => 'Lit Chambre Orient',
                'slug' => 'lit-chambre-orient',
                'description' => 'Lit double avec tête de lit sculptée. Style oriental classique. Comprend les tables de chevet.',
                'price' => 5500.00,
                'whatsapp_number' => '+212600000001',
                'is_featured' => true,
            ],
            [
                'category_id' => $lit->id,
                'name' => 'Lit Simple Artisan',
                'slug' => 'lit-simple-artisan',
                'description' => 'Lit simple en bois de cèdre artisanal. Finition vernis naturel.',
                'price' => 2200.00,
                'whatsapp_number' => '+212600000001',
            ],
        ];

        foreach ($products as $index => $productData) {
            $product = Product::create(array_merge($productData, ['sort_order' => $index + 1]));

            // Create a placeholder main image for each product
            ProductImage::create([
                'product_id' => $product->id,
                'path' => 'images/products/placeholder.jpg',
                'alt' => $product->name,
                'is_main' => true,
                'sort_order' => 0,
            ]);
        }
    }
}
