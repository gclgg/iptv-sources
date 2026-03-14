FROM yunnysunny/node

WORKDIR /app
COPY . /app

EXPOSE 8080

CMD [ "/bin/sh", "./start-iptv.sh" ]
