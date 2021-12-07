FROM node:16
COPY . /app
WORKDIR /app
EXPOSE 3000
RUN npm install \
	&& npm run build
CMD npm run start
