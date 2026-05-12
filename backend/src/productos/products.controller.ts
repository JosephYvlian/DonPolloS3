import { Controller, Get, Post, Put, Delete, Param, Body, UploadedFile, UseInterceptors, UseGuards } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdminGuard } from '../auth/admin.guard';
import { ProductsService } from './products.service';

@Controller('productos')
export class ProductsController {
    constructor(private readonly productsService: ProductsService) { }

    @Get()
    async findAllActivos() {
        return this.productsService.findAllActivos();
    }

    @Post()
    @UseGuards(JwtAuthGuard, AdminGuard)
    @UseInterceptors(FileInterceptor('imagen'))
    async create(
        @Body() productoData: any,
        @UploadedFile() file?: Express.Multer.File,
    ) {
        // Parse numerical fields that might come as strings in form-data
        const parsedData = {
            ...productoData,
            precio: productoData.precio ? parseInt(productoData.precio, 10) : undefined,
            stockDisponible: productoData.stockDisponible ? parseInt(productoData.stockDisponible, 10) : undefined,
        };
        return this.productsService.create(parsedData, file);
    }

    @Put(':id')
    @UseGuards(JwtAuthGuard, AdminGuard)
    @UseInterceptors(FileInterceptor('imagen'))
    async update(
        @Param('id') id: string,
        @Body() productoData: any,
        @UploadedFile() file?: Express.Multer.File,
    ) {
        const parsedData = {
            ...productoData,
            precio: productoData.precio ? parseInt(productoData.precio, 10) : undefined,
            stockDisponible: productoData.stockDisponible ? parseInt(productoData.stockDisponible, 10) : undefined,
        };
        return this.productsService.update(+id, parsedData, file);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard, AdminGuard)
    async remove(@Param('id') id: string) {
        return this.productsService.delete(+id);
    }
}
