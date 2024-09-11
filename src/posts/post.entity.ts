import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { PostType } from "./enums/posttypes.enum";
import { PostStatus } from "./enums/post.status.enum";
import { CreatePostMetaOptionsDto } from "src/meta-option/dtos/create.post.meta.option.dto";
import { MetaOption } from "src/meta-option/meta-option.entity";
import { User } from "src/users/user.entity";
import { Tag } from "src/tags/tag.entity";

/** cascade: If set to true, the related object will be inserted and updated in the database. 
  * For more details please check https://typeorm.io/relations#cascades
  * 
  * eager: true ---> this will be used to reslove the foreign key to join the table internally and send the requied data along with posts query
  * Bi-drectional relationship between metaoptions and posts
  * 
  * --> Post and User entity are in a relationship of one-to-many and many-to-one
  *  -  Post Entity with User Entity in ---> Many to One Relation (Means Many post can belong to one User)
  *     User Entity with Post Entity in ---> One to Many Relation (Means One User can have Many posts)
  *  
  *  -  This type of relation is always bi-directional, and we don't have to defined JoinColumn() decorator, it is automatically will handled by typeorm
  *  -  Foreign key always lies with the Many-to-one side - i.e, autherid will be stored in post table as FK
 */

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

  @OneToOne(() => MetaOption, (metaOption) => metaOption.post, {
    cascade: true,
    eager: true
  })
  metaOption?: MetaOption;

  //Bi-directional relationship
  @ManyToOne(() => User, (user) => user.posts)
  author: User;

  //Bi-directional relationship
  @ManyToMany(() => Tag, (tag) => tag.posts, {
    eager: true //it will populate the other table data using the Foreign key
  })
  @JoinTable()
  tags?: Tag[];
}