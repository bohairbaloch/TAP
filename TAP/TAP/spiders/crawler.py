import scrapy
from ..items import TapItem
#from scrapy.linkextractors import LinkExtractor

class Crawler4Spider(scrapy.Spider):
    name = "crawler"
    allowed_domains = ["attack.mitre.org"]
    start_urls = ["http://attack.mitre.org/tactics/mobile/"]



    def _parse(self, response):
        rows = response.xpath("(//table[@class='table table-bordered table-alternate mt-2'])/tbody/tr")

        base_url = "https://attack.mitre.org/mobile"

        for index, row in enumerate(rows):
            item = TapItem()

            item['t_id'] = row.xpath(".//td//a/text()").get().strip()
            item['t_link'] = base_url + row.xpath(".//td//a/@href").get()
            item['t_name'] = row.xpath(".//td[2]//a/text()").get()
            item['t_desc'] = row.xpath(".//td[3]//text()").get().strip()

            yield item


