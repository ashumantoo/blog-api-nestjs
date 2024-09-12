import { Inject, Injectable } from '@nestjs/common';
import { CreateTagDto } from '../dtos/create.tag.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Tag } from '../tag.entity';
import { In, Repository } from 'typeorm';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(Tag)
    private tagRepository: Repository<Tag>
  ) { }

  public async create(createTagDto: CreateTagDto) {
    try {
      const tag = this.tagRepository.create(createTagDto);
      return this.tagRepository.save(tag);
    } catch (error) {
      throw error;
    }
  }

  public async getMultipleTags(tags: number[]) {
    try {
      let results = await this.tagRepository.find({
        where: {
          id: In(tags)
        }
      });
      return results;
    } catch (error) {
      throw error;
    }
  }

  public async delete(id: number) {
    try {
      await this.tagRepository.delete(id);
      return {
        success: true,
        id
      }
    } catch (error) {
      throw error;
    }
  }

  //This will not remove the record from the db instead it will add a new column in the table called deletedAt(timestamp)
  public async softRemove(id: number) {
    try {
      await this.tagRepository.softDelete(id);
      return {
        success: true,
        id
      }
    } catch (error) {
      throw error;
    }
  }
}
