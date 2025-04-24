import { Controller, Post, Get, Body, Param, Res, HttpStatus } from '@nestjs/common';
import { UrlService } from './url.service';
import { Response } from 'express';

@Controller('url')
export class UrlController {
  constructor(private readonly urlService: UrlService) {}

  @Post('shorten')
  async shorten(@Body('longUrl') longUrl: string) {
    const url = await this.urlService.shortenUrl(longUrl);
    return { shortUrl: `http://localhost:3000/url/${url.shortCode}` };
  }

  @Get(':shortCode')
  async redirect(@Param('shortCode') shortCode: string, @Res() res: Response) {
    const longUrl = await this.urlService.getLongUrl(shortCode);
    return res.redirect(HttpStatus.FOUND, longUrl);
  }
}
