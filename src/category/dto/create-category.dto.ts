import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCategoryDto {
    @IsNotEmpty({ message: 'Nama kategori wajib diisi' })
    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    description?: string;
}
