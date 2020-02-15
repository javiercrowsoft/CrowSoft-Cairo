FROM ifinavet/playframework:2.2.0

WORKDIR /play-2.2.0/framework/sbt

COPY sbt.boot.properties ./

WORKDIR /cairo

COPY web/cairo/project project

COPY web/cairo/build.sbt ./

RUN play -Dhttps.protocols=TLSv1.2 help

COPY web/cairo ./

EXPOSE 9000

CMD play -Dhttps.protocols=TLSv1.2 -Dconfig.file=conf/dev.conf run
