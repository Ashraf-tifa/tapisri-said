<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            [
                'name' => 'Salon Marocain',
                'slug' => 'salon-marocain',
                'description' => 'Salons marocains authentiques, fabriqués à la main avec des tissus de qualité supérieure.',
                'sort_order' => 1,
            ],
            [
                'name' => 'Canapé',
                'slug' => 'canape',
                'description' => 'Canapés modernes et confortables, disponibles en différentes tailles et couleurs.',
                'sort_order' => 2,
            ],
            [
                'name' => 'Lit',
                'slug' => 'lit',
                'description' => 'Lits et chambres à coucher élégants, alliant confort et style marocain.',
                'sort_order' => 3,
            ],
        ];

        foreach ($categories as $category) {
            Category::create($category);
        }
    }
}
