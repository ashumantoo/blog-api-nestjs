import { Body, Controller, Post } from '@nestjs/common';
import { MetaOptionService } from './providers/meta-option.service';
import { CreatePostMetaOptionsDto } from './dtos/create.post.meta.option.dto';

@Controller('meta-options')
export class MetaOptionsController {
  constructor(
    private readonly metaOptionService: MetaOptionService
  ) { }

  @Post()
  public createMetaOption(@Body() createPostMetaOptionsDto: CreatePostMetaOptionsDto) {
    return this.metaOptionService.create(createPostMetaOptionsDto);
  }
}
