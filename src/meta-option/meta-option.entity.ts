import { Post } from "src/posts/post.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class MetaOption {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'json',
    nullable: false
  })
  metaValue: string;

  @CreateDateColumn()
  createDate: string;

  @UpdateDateColumn()
  updateDate: string;

  /** Bi-directional relationship between meta-option and post, by using  CASCADE
   * The meta-option will be deleted automatically whenever we delte the post since we have used join column on this table
  */
  @OneToOne(() => Post, (post) => post.metaOption, {
    onDelete: "CASCADE"
  })
  @JoinColumn()
  post: Post
}