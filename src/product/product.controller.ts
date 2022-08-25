import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
  BadRequestException,
} from '@nestjs/common';
import { ProductDTO } from './dto/product.dto';
import { ProductSearchDTO } from './dto/product-search.dto';
import { ProductService } from './product.service';
import { ResponseDTO } from 'src/common/dto/response.dto';
import { RequestDTO } from 'src/common/dto/request.dto';
import { ErrorInterceptor } from 'src/common/interceptor/error.interceptor';

@Controller('/v1/products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}
  @Get('')
  @UseInterceptors(new ErrorInterceptor())
  searchProduct(
    @Query() productSearchDTO: ProductSearchDTO,
  ): Promise<ResponseDTO<ProductDTO[]>> {
    return this.productService
      .searchProduct(productSearchDTO)
      .then((result) => {
        return result;
      })
      .catch((err) => {
        console.log(err);
        throw new BadRequestException(err.message);
      });
  }

  @Get('/:id')
  @UseInterceptors(new ErrorInterceptor())
  getProduct(@Param('id') id: string): Promise<ResponseDTO<ProductDTO>> {
    return this.productService.read(id).then((result) => {
      const response = new ResponseDTO<ProductDTO>();
      response.data = result;

      return response;
    });
  }

  @Post('')
  @UseInterceptors(new ErrorInterceptor())
  createProduct(
    @Body() ProductDTO: RequestDTO<ProductDTO>,
  ): Promise<ResponseDTO<ProductDTO>> {
    return this.productService.create(ProductDTO.data).then((result) => {
      const response = new ResponseDTO<ProductDTO>();
      response.data = result;

      return response;
    });
  }

  @Put('')
  @UseInterceptors(new ErrorInterceptor())
  UpdateProduct(
    @Body() ProductDTO: RequestDTO<ProductDTO>,
  ): Promise<ResponseDTO<ProductDTO>> {
    return this.productService.update(ProductDTO.data).then((result) => {
      const response = new ResponseDTO<ProductDTO>();
      response.data = result;
      return response;
    });
  }

  @Delete('/:id')
  @UseInterceptors(new ErrorInterceptor())
  deleteProduct(@Param('id') id: string): Promise<ResponseDTO<ProductDTO>> {
    return this.productService.delete(id).then((result) => {
      const response = new ResponseDTO<any>();
      response.data = result;

      return response;
    });
  }
}
