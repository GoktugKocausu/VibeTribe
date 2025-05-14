# Build Stage
FROM maven:3.9.6-eclipse-temurin-17 AS builder
ENV APP_HOME=/app
WORKDIR $APP_HOME

COPY pom.xml ./
COPY src ./src

RUN mvn clean package -DskipTests


# Dev IMAGE
FROM eclipse-temurin:17-jre-alpine AS dev
LABEL author="VibeTribe DevOps"
LABEL description="Dev image for local and test environments"

ENV APP_HOME=/app
WORKDIR $APP_HOME

COPY --from=builder $APP_HOME/target/*.jar vibetribe.jar

ENTRYPOINT ["java", "-jar", "./vibetribe.jar"]


# Prod IMAGE
FROM eclipse-temurin:17-jre-alpine AS prod
LABEL author="VibeTribe DevOps"
LABEL description="Prod image for deployment"

ENV APP_HOME=/app
WORKDIR $APP_HOME

COPY --from=builder $APP_HOME/target/*.jar vibetribe.jar

ENTRYPOINT ["java", "-jar", "./vibetribe.jar"]
    