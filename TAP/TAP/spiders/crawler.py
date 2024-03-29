import scrapy
import re
from itemloaders import processors
from scrapy.linkextractors import LinkExtractor
from scrapy.spiders import CrawlSpider, Rule
from scrapy.loader import ItemLoader
from itemloaders.processors import TakeFirst
from itemloaders.processors import MapCompose
from scrapy.http import Request

# from TAP.TAP.items import TapItem
from ..items import TacticItem
from ..items import SoftwareTapItem
from ..items import TechniqueTapItem


###########################Marwan#################
from ..items import mitigationsItem
from ..items import groupsItem
##########################END#####################

class Crawler1Spider(CrawlSpider):
    name = "crawler"
    allowed_domains = ["attack.mitre.org"]
    start_urls = ["https://attack.mitre.org/"]

    #Alex Branch Rules
    # rules = (Rule(LinkExtractor(allow=r"tactics/"), callback="parse_tactic_items", follow=True),)
    rules = (
    Rule(LinkExtractor(allow=[r'techniques/'], deny=([r'tactic/', 'software/', 'versions/'])), callback="parse_items", follow=True),)

    # rules = (Rule(LinkExtractor(allow=r"tactics/"), callback="parse_items", follow=True),)
    
    #Test Branch Rules
    #rules = (
            #Rule(LinkExtractor(allow=[r'tactics/', 'software/', 'mitigations/', 'groups/'],
                               #deny=(r'versions/')), callback="parse_items", follow=True),
             #)


    def parse_items(self, response):
        if 'tactics/' in response.url:
            tactic_id = response.xpath(
                "//div//*[@class='h5 card-title' and contains(text(), 'ID:')]//parent::div/text()").get()
            if tactic_id is not None:

                loader = ItemLoader(item=TacticItem(), response=response)
                loader.add_xpath('tactic_id',
                                 "//div//*[@class='h5 card-title' and contains(text(), 'ID:')]//parent::div/text()")
                loader.add_xpath('name', "//h1//text()")
                loader.add_xpath('date_created', "//div//*[contains(text(), 'Created:')]//parent::div/text()")
                loader.add_xpath('tactic_desc', "//div[@class='description-body']//p//text()")
                loader.add_xpath('date_modified', "//div//*[contains(text(), 'Last Modified:')]//parent::div/text()")

                # Parse Technique Data
                technique_rows = response.xpath("//h2[@id='techniques']/following::table/tbody/tr")
                if len(technique_rows) >= 1:
                    # for index, row in enumerate(technique_rows):
                    loader.add_xpath('technique_id', "//h2[@id='techniques']/following::tbody//tr//td[1]//a//text()")
                else:
                    loader.add_value('technique_id', 'NA')
                    #loader.add_xpath('technique_id', "//h2[@id='techniques']/following::tbody//tr//td[1]//a//text()")
                    #loader.add_xpath('technique_name', "//h2[@id='techniques']/following::tbody//tr//td[2]//a//text()")

                yield loader.load_item()

        elif 'software/' in response.url:
            software_id = response.xpath(
                "//div//*[@class='h5 card-title' and contains(text(), 'ID:')]//parent::div/text()[2]").get()
            if software_id is not None:
                soft_loader = ItemLoader(item=SoftwareTapItem(), response=response)
                soft_loader.add_xpath('software_id',
                                      "//div//*[@class='h5 card-title' and contains(text(), 'ID:')]//parent::div/text()[2]")
                soft_loader.add_xpath('software_name', "//h1//text()")
                soft_loader.add_xpath('date_created',
                                      "normalize-space(//div//*[contains(text(), 'Created:')]//parent::div/text()[2])")
                soft_loader.add_xpath('date_modified',
                                      "normalize-space(//div//*[contains(text(), 'Last Modified:')]//parent::div/text()[2])")
                soft_loader.add_xpath('software_desc', "string(//div[@class='description-body']//p)")
                soft_loader.add_xpath('software_desc', "substring-before(//div[@class='description-body']//p, //sup)")

                # Parse Technique Data
                technique_rows = response.xpath("//h2[@id='techniques']/following::tbody[1]/tr")
                # for index, row in enumerate(technique_rows):
                if len(technique_rows) >= 1:
                    soft_loader.add_xpath('technique_id',
                                          "//h2[@id='techniques']/following::tbody[1]//tr//td[2]//a//text()")
                else:
                    soft_loader.add_value('technique_id', 'NA')

                # Parse Group data
                # group_id: str = item.field(default="NA")
                group_rows = response.xpath("//h2[@id='groups']/following::table/tbody/tr")
                if len(group_rows) >= 1:
                    soft_loader.add_xpath('group_id', "//h2[@id='groups']/following::tbody[1]//tr//td[1]//a//text()")
                else:
                    soft_loader.add_value('group_id', 'NA')
                    #soft_loader.replace_value("group_id", 'Default')

                # for index, row in enumerate(group_rows):
                # loader.add_xpath('group_id', "//h2[@id='groups']/following::tbody//tr//td[1]//a//text()")
                yield soft_loader.load_item()


        elif 'techniques/' in response.url:
            techniquerow_id = response.xpath("//div//*[@class='h5 card-title' and contains(text(), 'ID:')]//parent::div/text()[2]").get()
            # techniquerow_id = response.xpath("//*[@id='card-id']/div[2]").get()
            # response.xpath("//div/table[@class='table-techniques' and contains(text(), '')]").get()
            # response.xpath("(//table[@class='table-techniques'])/tbody/tr//td/a/text()").get()
            if techniquerow_id is not None:

                tech_loader = ItemLoader(item=TechniqueTapItem(), response=response)
                tech_loader.add_xpath('technique_id',
                                      "//div//*[@class='h5 card-title' and contains(text(), 'ID:')]//parent::div/text()")
                tech_loader.add_xpath('technique_name', "//h1//text()")
                tech_loader.add_xpath('date_created', "normalize-space(//div//*[contains(text(), 'Created:')]//parent::div/text()[2])")
                tech_loader.add_xpath('technique_desc', "//div[@class='description-body']//p//text()")
                tech_loader.add_xpath('date_modified', "normalize-space(//div//*[contains(text(), 'Last Modified:')]//parent::div/text()[2])")

                # Parse Sub-Techniques Data
                subtechnique_rows = response.xpath("//h5[@id='sub-techniques']/following::table[1]/tbody/tr")
                #subtechnique_rows = response.xpath("//div//*[@id='subtechnique-parent-name']/following::table/tbody/tr//td[1]")
                # subtechnique_rows = response.xpath("// div //*[@id='subtechniques-card-header']/following::table/tbody/tr//td[1]")
                if len(subtechnique_rows) >= 1:
                    tech_loader.add_xpath('subtechnique_id',"//h5[@id='sub-techniques']/following::tbody[1]//tr//td[1]//a//text()")
                else:
                    tech_loader.add_value('subtechnique_id', 'NA')

                # Parse Mitigation Data
                mitigation_rows = response.xpath("//h2[@id='mitigations']/following::table[1]/tbody/tr")
                #mitigation_rows = response.xpath("//h2[@id='mitigations']/following::table/tbody/tr")
                if len(mitigation_rows) >= 1:
                    tech_loader.add_xpath('mitigation_id', "//h2[@id='mitigations']/following::tbody[1]//tr//td[1]//a//text()")
                else:
                    tech_loader.add_value('mitigation_id', 'NA')

                # Parse Detection
                detection_rows = response.xpath("//h2[@id='detection']/following::table[1]/tbody/tr")
                if len(detection_rows) >= 1:
                    tech_loader.add_xpath('detection_id', "//h2[@id='detection']/following::tbody[1]//tr//td[1]//a//text()")
                else:
                    tech_loader.add_value('detection_id', 'NA')
                yield tech_loader.load_item()

###########################Marwan#################
        # Parse mitigations page
        elif 'mitigations/' in response.url:
            mitigation_id = response.xpath(
                "//div//*[@class='h5 card-title' and contains(text(), 'ID:')]//parent::div/text()").get()
            if mitigation_id is not None:

                mitig_loader = ItemLoader(item=mitigationsItem(), response=response)
                mitig_loader.add_xpath('mitigation_id',
                                 "//div//*[@class='h5 card-title' and contains(text(), 'ID:')]//parent::div/text()")
                mitig_loader.add_xpath('mitigation_name', "//h1//text()")
                mitig_loader.add_xpath('date_created', "//div//*[contains(text(), 'Created:')]//parent::div/text()")
                mitig_loader.add_xpath('mitigation_desc', "//div[@class='description-body']//p//text()")
                mitig_loader.add_xpath('date_modified',
                                 "//div//*[contains(text(), 'Last Modified:')]//parent::div/text()")

                # Parse Techniques Addressed by Mitigation
                technique_rows = response.xpath("//h2[@id='techniques']/following::table/tbody/tr")
                if len(technique_rows) >= 1:
                    # for index, row in enumerate(technique_rows):
                    mitig_loader.add_xpath('technique_id',
                                     "//h2[@id='techniques']/following::tbody//tr//td[2]//a//text()")
                else:
                    mitig_loader.add_value('technique_id', 'NA')

                yield mitig_loader.load_item()

        # Parse groups pages
        elif 'groups/' in response.url:
            group_id = response.xpath(
                "//div//*[@class='h5 card-title' and contains(text(), 'ID:')]//parent::div/text()[2]").get()
            if group_id is not None:
                group_loader = ItemLoader(item=groupsItem(), response=response)
                group_loader.add_xpath('group_id',
                                      "//div//*[@class='h5 card-title' and contains(text(), 'ID:')]//parent::div/text()[2]")
                group_loader.add_xpath('group_name', "//h1//text()")
                group_loader.add_xpath('date_created',
                                      "normalize-space(//div//*[contains(text(), 'Created:')]//parent::div/text()[2])")
                group_loader.add_xpath('date_modified',
                                      "normalize-space(//div//*[contains(text(), 'Last Modified:')]//parent::div/text()[2])")
                group_loader.add_xpath('group_desc',
                                      "substring-before(//div[@class='description-body']//p, //sup)")

                # Parse Technique
                technique_rows = response.xpath("//h2[@id='techniques']/following::tbody[1]/tr")
                # for index, row in enumerate(technique_rows):
                if len(technique_rows) >= 1:
                    group_loader.add_xpath('technique_id',
                                          "//h2[@id='techniques']/following::tbody[1]//tr//td[2]//a//text()")
                else:
                    group_loader.add_value('technique_id', 'NA')

                # Parse Group data
                # group_id: str = item.field(default="NA")
                group_rows = response.xpath("//h2[@id='groups']/following::table/tbody/tr")
                if len(group_rows) >= 1:
                    group_loader.add_xpath('group_id',
                                          "//h2[@id='groups']/following::tbody[2]//tr//td[1]//a//text()")
                else:
                    group_loader.add_value('group_id', 'NA')

                yield group_loader.load_item()

##########################END#####################

        #Placeholder for Sub-Techniques
        #elif re.search('\/techniques\/T.{4}\.*\/.*\/', response.url):
         #   print("Sub-technique URL:", response.url)