FROM node:alpine

WORKDIR /app

RUN apk update && apk upgrade --no-cache --no-progress && \
	apk add --no-cache --no-progress wget && \
	wget -qO /tmp/app.zip https://github.com/noeoliveira/backend-cursos/archive/1.0.zip && \
	unzip /tmp/app.zip -d . && \
	mv backend-cursos-1.0/* . && \
	rm /tmp/app.zip && \
	rm -R backend-cursos-1.0 && \
	apk del wget && \
	yarn install --production

EXPOSE 3333
CMD [ "yarn", "start" ]