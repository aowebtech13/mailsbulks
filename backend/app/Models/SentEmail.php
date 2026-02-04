<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SentEmail extends Model
{
    protected $fillable = [
        'from_email',
        'recipient',
        'subject',
        'body',
        'status',
        'error',
    ];
}
