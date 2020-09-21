FROM ifinavet/playframework:2.2.0

USER root
ENV JAVA_HOME /usr/lib/jvm/java-7-openjdk-amd64
COPY typesafe_ldap.cer $JAVA_HOME/jre/lib/security
RUN \
    cd $JAVA_HOME/jre/lib/security \
    && keytool -keystore cacerts -storepass changeit -noprompt -trustcacerts -importcert -alias typesafe_ldapcert -file typesafe_ldap.cer

WORKDIR /play-2.2.0/framework/sbt

COPY sbt.boot.properties ./

WORKDIR /cairo

COPY web/cairo/project project

COPY web/cairo/build.sbt ./

RUN play -Dhttps.protocols=TLSv1.2 help

COPY web/cairo ./

EXPOSE 9000

CMD play -Dhttps.protocols=TLSv1.2 -Dconfig.file=conf/dev.conf run
