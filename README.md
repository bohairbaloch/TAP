# TAP
Technology Application Project

This project represents the successful completion of an automated parser designed to crawl https://attack.mitre.org/ website
download, cleanse, sort, and organize information into a unified repository. High level overview of the implementation is shown below:

![image](https://github.com/bohairbaloch/TAP/assets/128802494/04dfdaf4-b797-4ddd-bb33-b869faf6c16a)
 

Scrapy Framework (written in Python) was utilized for the purpose of crawling
the website, parsing the specified data, cleansing the data, and adding the scraped data to database (MongoDB) from
pipeline.

The following pages were scraped:
  groups
  mitigations
  software
  tactics
  techniques

A high-level overview of the database is shown below:
<img width="664" alt="image" src="https://github.com/bohairbaloch/TAP/assets/128802494/411df622-6c81-43d8-9aff-15afb2a09629">

Scrapyd was used to deploy the Scrapy code. Scrapyd was deployed on a docker container.

MongoDB Atlas was used to create and store the database. Local MongoDB hosted on a docker container was used for testing. 

PyCharm and Visual Studio were used as IDEs.


