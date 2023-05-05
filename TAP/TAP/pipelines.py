# Define your item pipelines here
#
# Don't forget to add your pipeline to the ITEM_PIPELINES setting
# See: https://docs.scrapy.org/en/latest/topics/item-pipeline.html

import sqlite3
#To utilize pymongo client
import pymongo
import logging
#To resolve SSL certificate error for Atlas MongoDB
import certifi

from .items import TacticItem
from .items import SoftwareTapItem
from itemadapter import ItemAdapter


# useful for handling different item types with a single interface
from itemadapter import ItemAdapter


class SqlPipeline:
    def __init__(self):

        ##Connect to database
        self.conn = sqlite3.connect('SIT.db')

        ##Create cursor for executing commands
        self.curr = self.conn.cursor()
        self.create_tactic_table()
        self.create_software_table()
        self.create_technique_table()

    def create_tactic_table(self):
        ##Create table if none exists
        self.curr.execute("""CREATE TABLE IF NOT EXISTS tbl_tactics(
        tactic_id TEXT PRIMARY KEY,
        name TEXT,
        date_created TEXT,
        tactic_desc TEXT             
        )""")

    def create_software_table(self):
        ##Create table if none exists
        self.curr.execute("""CREATE TABLE IF NOT EXISTS tbl_software(
        software_id TEXT PRIMARY KEY,
        software_name TEXT,
        date_created TEXT,
        software_desc TEXT           
        )""")

    def create_technique_table(self):
        ##Create table if none exists
        self.curr.execute("""CREATE TABLE IF NOT EXISTS tbl_technique(
        technique_id TEXT PRIMARY KEY,
        technique_name TEXT,
        date_created TEXT,
        technique_desc TEXT           
        )""")
    def process_item(self, item, spider):
        if isinstance(item, TacticItem):
            #print("BeforeDBCall:", item)
            self.store_db(item)
            #print("afterTacticDBcall:", item)
            return item

        if isinstance(item, SoftwareTapItem):
            #print("SoftwareItem:", item)
            self.store_soft(item)
            return item

    def store_db(self, item):
        ##Insert data statement
        print("SQLTactic:", item)
        self.curr.execute(
            """INSERT OR IGNORE INTO tbl_tactics (tactic_id, name, date_created,tactic_desc) VALUES (?,?,?,?)""", (
                (item['tactic_id'], item['name'], item['date_created'], item['tactic_desc'])))
        self.conn.commit()
        return item

    def store_soft(self, item):
        ##Insert data statement
        print("SoftwareSQLDB:", item)
        self.curr.execute(
            """INSERT OR IGNORE INTO tbl_software (software_id, software_name, date_created, software_desc) VALUES (?,?,?,?)""", (
                (item['software_id'], item['software_name'], item['date_created'], item['software_desc'])))
        self.conn.commit()
        return item

    # store techniques
    def store_tech(self, item):
        ##Insert data statement
        print("TechniqueSQLDB:", item)
        self.curr.execute(
            """INSERT OR IGNORE INTO tbl_technique (technique_id, technique_name, date_created, technique_desc) VALUES (?,?,?,?)""", (
                (item['technique_id'], item['technique_name'], item['date_created'], item['technique_desc'])))
        self.conn.commit()
        return item


class SecondPipeline:
    def process_item(self, item, spider):
        return item


class MongoDBPipeLine:
    #MongoDB Pipeline

    def __init__(self, mongo_uri, mongo_db, mongo_coll, mongo_coll_soft, mongo_coll_tech):
        #Initiliaze the pipeline with MonogoDB details in settings.py
        self.mongo_uri = mongo_uri
        self.mongo_db = mongo_db
        self.mongo_coll = mongo_coll
        self.mongo_coll_soft = mongo_coll_soft
        self.mongo_coll_tech = mongo_coll_tech


    @classmethod
    def from_crawler(cls, crawler):
        #Get information from settings.py
        return cls(
            mongo_uri=crawler.settings.get('MONGO_URI'),
            mongo_db=crawler.settings.get('MONGO_DATABASE', 'scrapy'),
            mongo_coll=crawler.settings.get('MONGO_COLL_TACTICS', 'tactics'),
            mongo_coll_soft=crawler.settings.get('MONGO_COLL_SOFTWARE', 'software'),
            mongo_coll_tech=crawler.settings.get('MONGO_COLL_TECHNIQUE', 'technique')
        )

    def open_spider(self, spider):
        #Open db connection with initilizing spider
        #CloudDB lines to fix SSL error and complete connection
        ca = certifi.where()
        self.client = pymongo.MongoClient(self.mongo_uri, tlsCAFile=ca)

        #Only uncomment if using Local mongoDB and comment the CloudDB line above:
        #self.client = pymongo.MongoClient(self.mongo_uri)
        self.db = self.client[self.mongo_db]
        self.collecion = self.db[self.mongo_coll]
        self.collecion1= self.db[self.mongo_coll_soft]
        self.collecion2 = self.db[self.mongo_coll_tech]

    def close_spider(self, spider):
        #Clean after spider is closed
        self.client.close()

    def process_item(self, item, spider):
        #process tactics item
        print("Before ProcessMongo:", item)
        if isinstance(item, TacticItem):
            exists = self.db[self.mongo_coll].find_one_and_update(
                {"tactic_id": dict(item)["tactic_id"]},
                #logging.debug("Tactic Item already exists"),
                {"$set": dict(item)}
                #upsert=True
                #logging.debug("Item Updated")
            )
            if not exists:
                self.db[self.mongo_coll].insert_one(dict(item))
                logging.debug("Item added to MongoDB")
                print("MongoTactic Item:", item)


        #process software item
        if isinstance(item, SoftwareTapItem):
            exists = self.db[self.mongo_coll_soft].find_one_and_update(
                {"software_id": dict(item)["software_id"]},
                #logging.debug("Software Item already exists")
                {"$set": dict(item)},
                #upsert=True
            )
            if not exists:
                self.db[self.mongo_coll_soft].insert_one(dict(item))
                #self.db['MONGO_COLL_SOFTWARE'].insert_one(dict(item))
                #item_dict = ItemAdapter(TacticItem).asdict()
                #self.collecion.insert_one(item_dict)
                logging.debug("Item added to MongoDB")
                print("MongoSoftware Item :", item)

        # process technique item
        if isinstance(item, TechniqueTapItem):
            exists = self.db[self.mongo_coll_tech].find_one_and_update(
                {"technique_id": dict(item)["technique_id"]},
                # logging.debug("Technique Item already exists")
                {"$set": dict(item)},
                # upsert=True
            )
            if not exists:
                self.db[self.mongo_coll_tech].insert_one(dict(item))
                # self.db['MONGO_COLL_TECHNIQUE'].insert_one(dict(item))
                # item_dict = ItemAdapter(TechniqueItem).asdict()
                # self.collecion.insert_one(item_dict)
                logging.debug("Item added to MongoDB")
                print("MongoTechnique Item :", item)

