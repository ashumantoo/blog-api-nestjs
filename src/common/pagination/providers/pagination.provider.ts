import { Injectable } from '@nestjs/common';
import { PaginationQueryDto } from '../dto/pagination.query.dto';
import { ObjectLiteral, Repository } from 'typeorm';
import { IPagination } from '../interfaces/pagination.interface';

@Injectable()
export class PaginationProvider {
  public async paginateQuery<T extends ObjectLiteral>(
    paginationQuery: PaginationQueryDto,
    repository: Repository<T>
  ): Promise<IPagination<T>> {
    const results = await repository.find({
      skip: (paginationQuery.page - 1) * paginationQuery.limit,
      take: paginationQuery.limit
    });

    const totalItems = await repository.count();
    const totalPages = Math.ceil(totalItems / paginationQuery.limit);
    const nextPage = paginationQuery.page === totalPages ? paginationQuery.page : paginationQuery.page + 1;
    const previousPage = paginationQuery.page === 1 ? paginationQuery.page : paginationQuery.page - 1;

    const finalResponse: IPagination<T> = {
      data: results,
      meta: {
        totalItems,
        totalPages,
        itemsPerPage: paginationQuery.limit,
        currentPage: paginationQuery.page,
      }
    }
    return finalResponse;
  }
}
