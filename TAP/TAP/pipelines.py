# Define your item pipelines here
import sqlite3

#
# Don't forget to add your pipeline to the ITEM_PIPELINES setting
# See: https://docs.scrapy.org/en/latest/topics/item-pipeline.html


# useful for handling different item types with a single interface
from itemadapter import ItemAdapter


class TapPipeline:
    def __init__(self):

        ##Connect to database
        self.conn = sqlite3.connect('SIT.db')

        ##Create cursor for executing commands
        self.curr = self.conn.cursor()
        self.create_table()

    def create_table(self):
        ##Create table if none exists
        self.curr.execute("""CREATE TABLE IF NOT EXISTS tbl_tactics(
        id TEXT PRIMARY KEY,
        name TEXT,
        url TEXT,
        descr TEXT        
        )""")


    def process_item(self, item, spider):
        self.store_db(item)
        print("Pipline:", item)
        return item

    def store_db(self, item):
        ##Insert data statement
        self.curr.execute("""INSERT OR IGNORE INTO tbl_tactics (id, name, url,descr) VALUES (?,?,?,?)""",(
            (item['t_id'],item['t_name'],item['t_link'],item['t_desc'])))

        self.conn.commit()

