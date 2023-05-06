# Define here the models for your scraped items
#
# See documentation in:
# https://docs.scrapy.org/en/latest/topics/items.html
import struct

import scrapy
from scrapy.loader import ItemLoader
from itemloaders.processors import MapCompose, TakeFirst
from datetime import datetime

def sanitize_item(text):
    #strip spaces
    text = text.strip()
    return text

def strip_char(text):
    text =text.strip('\n')
    return text

def convert_date(text):
    #convert string date to Python date
    #text = text.strip()
    text = datetime.strptime(text, '%d %B %Y').strftime('%d-%m-%Y')
    return text


class TacticItem(scrapy.Item):
    # define the fields for your item here like:
    # name = scrapy.Field()
    tactic_id = scrapy.Field(
        input_processor=MapCompose(str.strip),
        output_processor=TakeFirst()
    )

    name = scrapy.Field(
        input_processor=MapCompose(str.strip),
        output_processor=TakeFirst()
    )

    date_created = scrapy.Field(
        input_processor=MapCompose(convert_date),
        output_processor=TakeFirst()
    )

    tactic_desc = scrapy.Field(

        input_processor=MapCompose(sanitize_item),
        output_processor=TakeFirst()
    )
    technique_id = scrapy.Field()

    date_modified = scrapy.Field(
        input_processor=MapCompose(convert_date),
        output_processor=TakeFirst()
    )


class SoftwareTapItem(scrapy.Item):
    # define the fields for your item here like:
    # name = scrapy.Field()
    software_id = scrapy.Field(
        input_processor=MapCompose(sanitize_item),
        output_processor=TakeFirst()
    )  # tactic id
    software_name = scrapy.Field(
        input_processor=MapCompose(sanitize_item),
        output_processor=TakeFirst()
    )
    date_created = scrapy.Field(
        input_processor=MapCompose(convert_date),
        output_processor=TakeFirst()
    )
    date_modified = scrapy.Field(
        input_processor=MapCompose(convert_date),
        output_processor=TakeFirst()
    )
    software_desc = scrapy.Field(
        input_processor=MapCompose(sanitize_item),
        output_processor=TakeFirst()
    )
    technique_id = scrapy.Field()
    #
    group_id = scrapy.Field()

class TechniqueTapItem(scrapy.Item):
    # define the fields for your item here like:
    # name = scrapy.Field()
    technique_id = scrapy.Field(
        input_processor=MapCompose(sanitize_item),
        output_processor=TakeFirst()
    )  # tactic id
    technique_name = scrapy.Field(
        input_processor=MapCompose(sanitize_item),
        output_processor=TakeFirst()
    )
    date_created = scrapy.Field(
        input_processor=MapCompose(convert_date),
        output_processor=TakeFirst()
    )
    date_modified = scrapy.Field(
        input_processor=MapCompose(convert_date),
        output_processor=TakeFirst()
    )
    technique_desc = scrapy.Field(
        input_processor=MapCompose(sanitize_item),
        output_processor=TakeFirst()
    )
    mitigation_id = scrapy.Field()
    #
    detection_id = scrapy.Field()