import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateBookmarkDto, EditBookmarkDto } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class BookmarkService {
  constructor(private prisma: PrismaService) {}

  //get ookmarks
  getBookmarks(userId: number) {
    return this.prisma.bookmark.findMany({
      where: {
        userId,
      },
    });
  }

  //get bookmark by id
  getBookmarksById(userId: number, bookmarkId: number) {
    return this.prisma.bookmark.findFirst({
      where: {
        id: bookmarkId,
        userId,
      },
    });
  }

  // Create bookmark
  async createBookmark(userId: number, dto: CreateBookmarkDto) {
    const bookmark = await this.prisma.bookmark.create({
      data: {
        userId,
        ...dto,
      },
    });
    return { message: 'Bookmark created successfully', data: bookmark };
  }

  // Edit bookmark
  async editBookmarksById(
    userId: number,
    bookmarkId: number,
    dto: EditBookmarkDto,
  ) {
    const bookmark = await this.prisma.bookmark.findUnique({
      where: { id: bookmarkId },
    });
    if (!bookmark || bookmark.userId !== userId) {
      throw new ForbiddenException('Access to resource denied');
    }
    const updatedBookmark = await this.prisma.bookmark.update({
      where: {
        id: bookmarkId,
      },
      data: {
        ...dto,
      },
    });
    return { message: 'Bookmark updated successfully', data: updatedBookmark };
  }

  // Delete bookmark
  async deleteBookmarksById(userId: number, bookmarkId: number) {
    //get the bookmark by id
    const bookmark = await this.prisma.bookmark.findUnique({
      where: { id: bookmarkId },
    });
    //check if user owns the id
    if (!bookmark || bookmark.userId !== userId) {
      throw new ForbiddenException('Access to resource denied');
    }
    await this.prisma.bookmark.delete({
      where: {
        id: bookmarkId,
      },
    });
    return { message: 'Bookmark deleted successfully' };
  }
}
