import { Exclude } from "class-transformer";
import { Post } from "src/posts/post.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

/**
 * User entity
 */
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 96,
    nullable: false
  })
  firstName: string;

  @Column({
    type: 'varchar',
    length: 96,
    nullable: true
  })
  lastName: string;

  @Column({
    type: 'varchar',
    length: 96,
    nullable: false,
    unique: true
  })
  email: string;

  @Column({
    type: 'varchar',
    length: 96,
    nullable: true
  })
  //Whenever we use @Exclude() decorator with @UseInterceptors(ClassSerializerInterceptor) on any endpoint inside the 
  //controller this property will be exluded from the response payload of the api
  @Exclude()
  password?: string;

  @Column({
    type: 'varchar',
    nullable: true
  })
  @Exclude()
  googleId?: string;

  @OneToMany(() => Post, (post) => post.author)
  posts: Post[]
}