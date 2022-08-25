import { Injectable } from '@nestjs/common';
import { DataTypes, Model, ModelCtor } from 'sequelize';
import { RDSService } from 'artifacts/rds/rds.service';
import { BaseRepository } from 'artifacts/rds/core/base.repository';

@Injectable()
export class ProductRepository extends BaseRepository {
    private productModel: ModelCtor<Model>;

    constructor(private readonly rdsService: RDSService) {
    super();
    }

    protected init() {
    this.productModel = this.rdsService
        .getRDSClient()
        .getModelBuilder()
        .define(
        'product',
        {
            name: {
                type: DataTypes.STRING,
            },
            sku: {
                type: DataTypes.STRING,
            },
            description: {
                type: DataTypes.JSON,
            },
            image_urls: {
                type: DataTypes.TEXT,
            },
            status: {
                type: DataTypes.STRING,
            },
            created_at: {
                type: DataTypes.DATE,
                defaultValue: Date.now,
            },
            updated_at: {
                type: DataTypes.DATE,
                defaultValue: Date.now,
            },
            deleted_at: {
                type: DataTypes.DATE,
            },
        },
        'products',
        true,
        );
    return this.productModel;
    }
}
