<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

class Book extends Model
{
    protected $fillable = [
        'title',
        'author',
        'cover_image',
        'price',
        'published_date',
        '_deleted',
    ];

    /**
     * The "booted" method of the model.
     *
     * @return void
     */
    protected static function booted()
    {
        // Global scope to only return non-deleted books
        static::addGlobalScope('active', function (Builder $builder) {
            $builder->where('_deleted', 0);
        });
    }
    
    /**
     * Perform the soft delete.
     */
    public function softDelete()
    {
        $this->_deleted = 1;
        $this->save();
    }
}
