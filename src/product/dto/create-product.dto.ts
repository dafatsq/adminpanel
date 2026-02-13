import {
    IsNotEmpty,
    IsOptional,
    IsString,
    IsNumber,
    Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductDto {
    @IsNotEmpty({ message: 'Nama produk wajib diisi' })
    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsNotEmpty({ message: 'Harga wajib diisi' })
    @Type(() => Number)
    @IsNumber({}, { message: 'Harga harus berupa angka' })
    @Min(0, { message: 'Harga tidak boleh negatif' })
    price: number;

    @IsNotEmpty({ message: 'Stok wajib diisi' })
    @Type(() => Number)
    @IsNumber({}, { message: 'Stok harus berupa angka' })
    @Min(0, { message: 'Stok tidak boleh negatif' })
    stock: number;

    @IsNotEmpty({ message: 'Kategori wajib dipilih' })
    @Type(() => Number)
    @IsNumber()
    categoryId: number;
}
