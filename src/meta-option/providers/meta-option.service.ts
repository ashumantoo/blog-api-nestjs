import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MetaOption } from '../meta-option.entity';
import { Repository } from 'typeorm';
import { CreatePostMetaOptionsDto } from '../dtos/create.post.meta.option.dto';

/** Meta options service */
@Injectable()
export class MetaOptionService {
  /**Injecting Metaoption  Repository*/
  constructor(
    @InjectRepository(MetaOption)
    private metaOptionReposity: Repository<MetaOption>
  ) { }

  public async create(createMetaOptionDto: CreatePostMetaOptionsDto) {
    try {
      let newMetaOption = this.metaOptionReposity.create(createMetaOptionDto);
      newMetaOption = await this.metaOptionReposity.save(newMetaOption);
      return newMetaOption;
    } catch (error) {
      throw error;
    }
  }
}
