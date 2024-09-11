import { Post } from "src/posts/post.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Tag {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: "varchar",
    length: 256,
    nullable: false,
    unique: true
  })
  name: string;

  @Column({
    type: 'varchar',
    length: 256,
    nullable: false,
    unique: true
  })
  slug: string;

  @Column({
    type: 'text',
    nullable: true
  })
  description?: string;

  @Column({
    type: 'text',
    nullable: true
  })
  schema?: string;

  @Column({
    type: 'text',
    nullable: true
  })
  featuredImageUrl: string;

  //Bi-directional relationship by defining two functions inside the @ManyToMany() decorator
  //if there is only one function inside the @ManyToMany(), then it will be a uni-directional realtionship
  //like this @ManyToMany(()=>Post)
  @ManyToMany(() => Post, (post) => post.tags, {
    onDelete: "CASCADE"
  })
  posts: Post[];

  @CreateDateColumn()
  createDate: Date;

  @UpdateDateColumn()
  updateDate: Date;

  @DeleteDateColumn()
  deleteDate: Date;
}