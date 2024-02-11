import { Module } from '@nestjs/common';
import { BookmarkController } from './bookmark.controller';
import { Bookmark } from './bookmark';
import { BookmarkService } from './bookmark.service';

@Module({
  controllers: [BookmarkController],
  providers: [Bookmark, BookmarkService]
})
export class BookmarkModule {}
