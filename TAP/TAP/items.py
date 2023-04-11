# Define here the models for your scraped items
#
# See documentation in:
# https://docs.scrapy.org/en/latest/topics/items.html

import scrapy


class TapItem(scrapy.Item):
    # define the fields for your item here like:
    # name = scrapy.Field(
    t_id = scrapy.Field()
    t_name = scrapy.Field()
    t_link = scrapy.Field()
    t_desc = scrapy.Field()
    pass


