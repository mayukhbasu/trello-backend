import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Url } from './url.entity';

@Injectable()
export class UrlService {

  constructor(@InjectRepository(Url) private urlRepository: Repository<Url>) {}

  async shortenUrl(longUrl: string): Promise<Url> {
    const { nanoid } = await import('nanoid');
    const shortCode = nanoid(7);
    const url = this.urlRepository.create({ shortCode, longUrl });
    return this.urlRepository.save(url);
  }

  async getLongUrl(shortCode: string): Promise<string> {
    const url = await this.urlRepository.findOneBy({ shortCode });
    if (!url) throw new NotFoundException('Short URL not found');
    return url.longUrl;
  }
}
