#Take the image from 
#FROM debian:bullseye-slim

#Use a slimmer base image
FROM python:3.11.2-slim-bullseye


#Author
LABEL authors="Bohair Baloch"

RUN apt-get update \ 
&& apt-get upgrade -y \
	#Install required packages
	&& apt-get install -y python3 pip virtualenv python3-venv cron nano curl tzdata \ 
	&& useradd --create-home scrapyUser
	

#Switch to non-privilged user
USER scrapyUser 

#Work Directory
WORKDIR /home/scrapyUser/venv

#Create Virtual Env Directory
RUN cd ~ \
	&& mkdir -p ./venv \
	&& cd /home/scrapyUser/venv
	
#Set Environment path
ENV VIRTUAL_ENV=/home/scrapyUser/venv

#Create Virtual Environmnet
RUN python3 -m venv $VIRTUAL_ENV

ENV PATH="$VIRTUAL_ENV/bin:$PATH"
ENV TZ=Australia/Melbourne

#Copy requirements and scrapyd configuration file from host to container. This file must be present in current working directory on host. 
COPY ./requirements.txt scrapyd.conf $VIRTUAL_ENV

#Install requirements
RUN pip install pymongo \
		#Install requirements
		&& pip install --upgrade pip \
		&& pip install -r $VIRTUAL_ENV/requirements.txt 
	
# Expose the application port
EXPOSE 6800

# Start scrapyd when container is started

CMD ["scrapyd"]