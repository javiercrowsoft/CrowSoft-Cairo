FROM ifinavet/playframework:2.2.0

WORKDIR /cairo

COPY web/cairo/project project

COPY web/cairo/build.sbt ./

RUN play help

COPY web/cairo ./

EXPOSE 9000

CMD play -Dconfig.file=conf/dev.conf run

