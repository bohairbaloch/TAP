import scrapy
from itemloaders import processors
from scrapy.linkextractors import LinkExtractor
from scrapy.spiders import CrawlSpider, Rule
from scrapy.loader import ItemLoader
from itemloaders.processors import TakeFirst
from itemloaders.processors import MapCompose
from scrapy.http import Request

#from TAP.TAP.items import TapItem
from ..items import TacticItem
from ..items import SoftwareTapItem
from ..items import TechniqueTapItem
class Crawler1Spider(CrawlSpider):
    name = "crawler"
    allowed_domains = ["attack.mitre.org"]
    start_urls = ["https://attack.mitre.org/tactics/mobile/"]

    #rules = (Rule(LinkExtractor(allow=r"tactics/"), callback="parse_tactic_items", follow=True),)
    rules = (Rule(LinkExtractor(allow=[r'tactics/', 'software/', 'techniques/']), callback="parse_items", follow=True),)
    #rules = (Rule(LinkExtractor(allow=r"tactics/"), callback="parse_items", follow=True),)

    def parse_items(self, response):
        if 'tactics/' in response.url:
            tactic_id = response.xpath("//div//*[@class='h5 card-title' and contains(text(), 'ID:')]//parent::div/text()").get()
            if tactic_id is not None:

                loader = ItemLoader(item=TacticItem(), response=response)
                loader.add_xpath('tactic_id', "//div//*[@class='h5 card-title' and contains(text(), 'ID:')]//parent::div/text()")
                loader.add_xpath('name', "//h1//text()")
                loader.add_xpath('date_created', "//div//*[contains(text(), 'Created:')]//parent::div/text()")
                loader.add_xpath('tactic_desc', "//div[@class='description-body']//p//text()")
                loader.add_xpath('date_modified', "//div//*[contains(text(), 'Last Modified:')]//parent::div/text()")

                #Parse Technique Data
                technique_rows = response.xpath("//h2[@id='techniques']/following::table/tbody/tr")
                if len(technique_rows) >= 1:
                #for index, row in enumerate(technique_rows):
                    loader.add_xpath('technique_id', "//h2[@id='techniques']/following::tbody//tr//td[1]//a//text()")
                else:
                    loader.add_value('technique_id', 'Null')
                    #loader.add_xpath('technique_id', "//h2[@id='techniques']/following::tbody//tr//td[1]//a//text()")
                    #loader.add_xpath('technique_name', "//h2[@id='techniques']/following::tbody//tr//td[2]//a//text()")
                yield loader.load_item()

        #elif 'software/' in response.url:
         #   software_id = response.xpath("//div//*[@class='h5 card-title' and contains(text(), 'ID:')]//parent::div/text()[2]").get()
          #  if software_id is not None:
           #     soft_loader = ItemLoader(item=SoftwareTapItem(), response=response)
            #    soft_loader.add_xpath('software_id', "//div//*[@class='h5 card-title' and contains(text(), 'ID:')]//parent::div/text()[2]")
             #   soft_loader.add_xpath('software_name', "//h1//text()")
              #  soft_loader.add_xpath('date_created', "normalize-space(//div//*[contains(text(), 'Created:')]//parent::div/text()[2])")
               # soft_loader.add_xpath('date_modified', "normalize-space(//div//*[contains(text(), 'Last Modified:')]//parent::div/text()[2])")
                #soft_loader.add_xpath('software_desc', "string(//div[@class='description-body']//p)")
                #soft_loader.add_xpath('software_desc', "substring-before(//div[@class='description-body']//p, //sup)")

                # Parse Technique Data
                #technique_rows = response.xpath("//h2[@id='techniques']/following::tbody[1]/tr")
                # for index, row in enumerate(technique_rows):
                #if len(technique_rows) >= 1:
                #    soft_loader.add_xpath('technique_id', "//h2[@id='techniques']/following::tbody[1]//tr//td[2]//a//text()")
                #else:
                 #   soft_loader.add_value('technique_id', 'Null')

                #Parse Group data
                #group_id: str = item.field(default="NA")
                #group_rows = response.xpath("//h2[@id='groups']/following::table/tbody/tr")
                #if len(group_rows) >= 1:
                #    soft_loader.add_xpath('group_id', "//h2[@id='groups']/following::tbody[1]//tr//td[1]//a//text()")
                #else:
                 #   soft_loader.add_value('group_id', 'Null')
                    #soft_loader.replace_value("group_id", 'Default')

                # for index, row in enumerate(group_rows):
                # loader.add_xpath('group_id', "//h2[@id='groups']/following::tbody//tr//td[1]//a//text()")
                #yield soft_loader.load_item()

        elif 'techniques/' in response.url:
            technique_id = response.xpath("//div//*[@class='h5 card-title' and contains(text(), 'ID:')]//parent::div/text()").get()
            #response.xpath("//div/table[@class='table-techniques' and contains(text(), '')]").get()
            #response.xpath("(//table[@class='table-techniques'])/tbody/tr//td/a/text()").get()
            if technique_id is not None:

                tech_loader = ItemLoader(item=TechniqueTapItem(), response=response)
                tech_loader.add_xpath('technique_id', "//div//*[@class='h5 card-title' and contains(text(), 'ID:')]//parent::div/text()")
                tech_loader.add_xpath('name', "//h1//text()")
                tech_loader.add_xpath('date_created', "//div//*[contains(text(), 'Created:')]//parent::div/text()")
                tech_loader.add_xpath('tactic_desc', "//div[@class='description-body']//p//text()")
                tech_loader.add_xpath('date_modified', "//div//*[contains(text(), 'Last Modified:')]//parent::div/text()")

                # Parse Sub-Techniques Data
                subtechnique_rows = response.xpath("//h5[@id='sub-techniques']/following::table/tbody/tr")
                if len(subtechnique_rows) >= 1:
                    # for index, row in enumerate(mitigation_rows):
                    tech_loader.add_xpath('subtechnique_id',"//h5[@id='sub-techniques']/following::tbody//tr//td[1]//a//text()")
                else:
                    tech_loader.add_value('mitigation_id', 'Null')

                #Parse Mitigation Data
                mitigation_rows = response.xpath("//h2[@id='mitigations']/following::table/tbody/tr")
                if len(mitigation_rows) >= 1:
                #for index, row in enumerate(mitigation_rows):
                    tech_loader.add_xpath('mitigation_id', "//h2[@id='mitigations']/following::tbody//tr//td[1]//a//text()")
                else:
                    tech_loader.add_value('mitigation_id', 'Null')
                    #loader.add_xpath('technique_id', "//h2[@id='techniques']/following::tbody//tr//td[1]//a//text()")
                    #loader.add_xpath('technique_name', "//h2[@id='techniques']/following::tbody//tr//td[2]//a//text()")

                # Parse Detection
                detection_rows = response.xpath("//h2[@id='detection']/following::table/tbody/tr")
                if len(detection_rows) >= 1:
                 tech_loader.add_xpath('detection_id',"//h2[@id='detection']/following::tbody[1]//tr//td[1]//a//text()")
                else:
                    tech_loader.add_value('detection_id', 'Null')
                yield tech_loader.load_item()

