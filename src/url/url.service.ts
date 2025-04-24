import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Url } from './url.entity';
import { createHash } from 'crypto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

function getHash(input: string): string {
  return createHash('sha256').update(input).digest('hex');
}

@Injectable()
export class UrlService {
  constructor(
    @InjectRepository(Url)
    private urlRepository: Repository<Url>,

    @Inject(CACHE_MANAGER)
    private cacheManager: any, // using `any` to avoid typing issues with `get`/`set`
  ) {}

  async shortenUrl(longUrl: string): Promise<Url> {
    const urlHash = getHash(longUrl);

    // 1. Check Redis cache by hash
    const cached = await this.cacheManager.get(urlHash);
    if (cached) return cached;

    // 2. Check DB by hash
    const existing = await this.urlRepository.findOneBy({ urlHash });
    if (existing) {
      await this.cacheManager.set(urlHash, existing);
      return existing;
    }

    // 3. Create new shortCode
    const { nanoid } = await import('nanoid');
    const shortCode = nanoid(7);
    const url = this.urlRepository.create({ shortCode, longUrl, urlHash });
    const saved = await this.urlRepository.save(url);

    // 4. Cache the result for reuse
    await this.cacheManager.set(urlHash, saved);

    return saved;
  }

  async getLongUrl(shortCode: string): Promise<string> {
    // Check Redis first
    const cached = await this.cacheManager.get(shortCode);
    if (cached) return cached;

    // Fallback to DB
    const url = await this.urlRepository.findOneBy({ shortCode });
    if (!url) throw new NotFoundException('Short URL not found');

    // Cache it
    await this.cacheManager.set(shortCode, url.longUrl, { ttl: 60 * 60 });

    return url.longUrl;
  }
}
