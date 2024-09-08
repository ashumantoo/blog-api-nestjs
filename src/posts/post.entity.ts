import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { PostType } from "./enums/posttypes.enum";
import { PostStatus } from "./enums/post.status.enum";
import { CreatePostMetaOptionsDto } from "src/meta-option/dtos/create.post.meta.option.dto";
import { MetaOption } from "src/meta-option/meta-option.entity";

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: "varchar",
    length: 512,
    nullable: false
  })
  title: string;

  @Column({
    type: "enum",
    enum: PostType,
    nullable: false,
    default: PostType.POST
  })
  postType: PostType;

  @Column({
    type: "varchar",
    length: 256,
    nullable: false
  })
  slug: string;

  @Column({
    type: "enum",
    enum: PostStatus,
    nullable: false,
    default: PostStatus.DRAFT
  })
  status: PostStatus

  @Column({
    type: 'text',
    nullable: true
  })
  content?: string;

  @Column({
    type: 'text',
    nullable: true
  })
  schema?: string;

  @Column({
    type: 'varchar',
    length: 1024,
    nullable: true
  })
  featuredImageUrl?: string;

  @Column({
    type: 'timestamp', //datetime in mysql
    nullable: true
  })
  publishOn?: Date;

  @OneToOne(() => MetaOption)
  @JoinColumn()
  metaOption?: MetaOption;

  //TODO: check this once we add relationship of database
  tags?: string[];
}