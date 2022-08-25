import { Injectable } from '@nestjs/common';
import { ProductRepository } from './repositories/product.repository';
import { ICRUDService } from 'artifacts/rds/core/common/interfaces/interface.crud.service';
import { ProductDTO } from './dto/product.dto';
import { ProductSearchDTO } from './dto/product-search.dto';
import { Op } from 'sequelize';
import { ResponseDTO } from 'src/common/dto/response.dto';

@Injectable()
export class ProductService implements ICRUDService<ProductDTO, void> {
  constructor(private readonly productRepository: ProductRepository) {}
  async create(productDTO: ProductDTO): Promise<ProductDTO> {
    const product = await this.productRepository.insert(productDTO);
    return new ProductDTO(product);
  }

  async read(id: string): Promise<ProductDTO> {
    const product = await this.productRepository
      .where({ id: id }, 'id')
      .findOne();
    return new ProductDTO(product);
  }

  async searchProduct(
    productSearchDTO: ProductSearchDTO,
  ): Promise<ResponseDTO<ProductDTO[]>> {
    this.productRepository.page(productSearchDTO.page, productSearchDTO.limit);

    if (productSearchDTO.query) {
      this.productRepository.where({
        name: { [Op.iLike]: `%${productSearchDTO.query}%` },
      });
    }
    if (productSearchDTO.status && productSearchDTO.status !== 'all') {
      this.productRepository.where({
        status: productSearchDTO.status,
      });
    }

    if (productSearchDTO.orderBy) {
      if (productSearchDTO.orderType === 'asc') {
        this.productRepository.order(productSearchDTO.orderBy, 'ASC');
      } else {
        this.productRepository.order(productSearchDTO.orderBy, 'DESC');
      }
    }
    if (productSearchDTO.between && productSearchDTO.betweenDate) {
      const betweenCondition = {};
      betweenCondition[productSearchDTO.between] = {
        [Op.between]: [
          new Date(productSearchDTO.getStartDate()).toUTCString(),
          new Date(productSearchDTO.getEndDate()).toUTCString(),
        ],
      };
      this.productRepository.where(betweenCondition);
    }

    const productDTOs: ProductDTO[] = [];
    const responseDTO = new ResponseDTO<ProductDTO[]>();

    if (productSearchDTO.count) {
      const { count, rows } = await this.productRepository.findAndCountAll({
        distinct: true,
      });
      responseDTO.totalItems = count;
      responseDTO.data = Object.assign(productDTOs, rows);
    } else {
      responseDTO.data = Object.assign(
        productDTOs,
        await this.productRepository.findAll({
          attributes: [
            'id',
            'name',
            'description',
            'sku',
            'status',
            'image_urls',
          ],
        }),
      );
    }
    return responseDTO;
  }

  async update(updateDTO: ProductDTO): Promise<ProductDTO> {
    updateDTO.updated_at = new Date();

    const productUpdated = await this.productRepository.update(updateDTO, {
      where: { id: updateDTO.id },
      returning: true,
    });

    return new ProductDTO(productUpdated[1][0]);
  }

  async delete(id: string): Promise<any> {
    return {
      deleteCount: await this.productRepository.where({ id: id }).delete(),
    };
  }
}
