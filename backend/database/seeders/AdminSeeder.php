<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    public function run(): void
    {
        User::create([
            'name' => 'Admin Tapisri',
            'email' => 'admin@tapisri.ma',
            'password' => Hash::make('admin123'),
            'email_verified_at' => now(),
        ]);
    }
}
